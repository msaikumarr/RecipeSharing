import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user, token } = useAuth();
  const nav = useNavigate();
  const [profileUser, setProfileUser] = useState(null);
  const [profileRecipes, setProfileRecipes] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", email: "", profileImage: "" });
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const fetchProfileData = useCallback(async () => {
    if (!token) {
      setProfileUser(null);
      setProfileRecipes([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const [userResponse, recipesResponse] = await Promise.all([
        fetch("https://recipesharing-mzt5.onrender.com/api/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        fetch("https://recipesharing-mzt5.onrender.com/api/recipes/my-recipes", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

      const userData = await userResponse.json();
      const recipesData = await recipesResponse.json();

      if (!userResponse.ok) {
        throw new Error(userData.message || "Failed to load profile user");
      }

      if (!recipesResponse.ok) {
        throw new Error(recipesData.message || "Failed to load your recipes");
      }

      setProfileUser(userData || user || null);
      setProfileRecipes(Array.isArray(recipesData) ? recipesData : []);
    } catch (error) {
      console.error("Error loading profile data:", error);
      setProfileUser(user || null);
      setProfileRecipes([]);
    } finally {
      setLoading(false);
    }
  }, [token, user]);

  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const viewRecipe = (id) => {
    nav(`/recipe/${id}`);
  };

  const deleteRecipe = async (id) => {
    try {
      const response = await fetch(`https://recipesharing-mzt5.onrender.com/api/recipes/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete recipe");
      }

      setProfileRecipes((prevRecipes) => prevRecipes.filter((recipe) => recipe._id !== id));
    } catch (error) {
      console.error("Error deleting recipe:", error);
    }
  };

  const truncateDescription = (description, maxLength) => {
    const safeDescription = description || "";
    return safeDescription.length > maxLength ? `${safeDescription.substring(0, maxLength)}...` : safeDescription;
  };

  return (
    <div className="container mt-5">
      <div className="card p-4 shadow-lg mb-4">
        <div className="d-flex align-items-center">
          <img
            src={profileUser?.profileImage || "https://static.vecteezy.com/system/resources/previews/013/042/571/large_2x/default-avatar-profile-icon-social-media-user-photo-in-flat-style-vector.jpg"}
            alt="User Profile"
            className="rounded-circle me-3 profile-avatar"
          />
          <div>
            <h4 className="mb-1">{profileUser?.name || "User"}</h4>
            <p className="text-muted">{profileUser?.email || "No email available"}</p>
            <div className="mt-2">
              {!editMode ? (
                <button className="btn btn-outline-primary btn-sm" onClick={() => {
                  setEditForm({ name: profileUser?.name || "", email: profileUser?.email || "", profileImage: profileUser?.profileImage || "" });
                  setEditMode(true);
                }}>
                  Edit Profile
                </button>
              ) : (
                <>
                  <button className="btn btn-success btn-sm me-2" onClick={async () => {
                    // Save profile changes (supports file upload)
                    try {
                      const formData = new FormData();
                      formData.append('name', editForm.name);
                      formData.append('email', editForm.email);
                      if (selectedFile) {
                        formData.append('profileImage', selectedFile);
                      } else if (editForm.profileImage) {
                        formData.append('profileImage', editForm.profileImage);
                      }

                      const res = await fetch("https://recipesharing-mzt5.onrender.com/api/users/profile", {
                        method: "PUT",
                        headers: {
                          Authorization: `Bearer ${token}`,
                        },
                        body: formData,
                      });

                      const data = await res.json();
                      if (!res.ok) throw new Error(data.message || "Failed to update profile");
                      setProfileUser(data);
                      setSelectedFile(null);
                      setEditMode(false);
                    } catch (err) {
                      console.error("Error updating profile:", err);
                      alert(err.message || "Failed to update profile");
                    }
                  }}>Save</button>
                  <button className="btn btn-secondary btn-sm" onClick={() => { setEditMode(false); setSelectedFile(null); }}>Cancel</button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {editMode && (
        <div className="card p-3 mb-4">
          <h5>Edit Profile</h5>
          <div className="mb-2">
            <label className="form-label">Name</label>
            <input className="form-control" value={editForm.name} onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))} />
          </div>
          <div className="mb-2">
            <label className="form-label">Email</label>
            <input className="form-control" value={editForm.email} onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))} />
          </div>
          <div className="mb-2">
            <label className="form-label">Profile Image (upload from device)</label>
            <input className="form-control" type="file" accept="image/*" onChange={(e) => setSelectedFile(e.target.files[0] || null)} />
            <small className="text-muted d-block mt-1">Or paste an image URL below (optional)</small>
            <input className="form-control mt-2" value={editForm.profileImage} onChange={(e) => setEditForm(prev => ({ ...prev, profileImage: e.target.value }))} placeholder="https://..." />
            {selectedFile && (
              <div className="mt-2">
                <img src={URL.createObjectURL(selectedFile)} alt="preview" style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: '50%' }} />
              </div>
            )}
          </div>
        </div>
      )}

      <h3 className="mb-3">Your Recipes</h3>
      <div className="row recipe-grid">
        {profileRecipes.length === 0 ? (
          <p>No recipes uploaded yet.</p>
        ) : (
          profileRecipes.map((recipe, index) => (
            <div className="col-md-4 mb-4" key={recipe._id || index}>
              <div className="card shadow-sm">
                <img
                  width={100}
                  height={250}
                  src={recipe.image || "https://via.placeholder.com/600x400?text=Recipe"}
                  className="card-img-top"
                  alt={recipe.title || "Recipe image"}
                />
                <div className="card-body recipe-card-body">
                  <div className="d-flex justify-content-between">
                    <h5 className="card-title">{recipe.title || "Untitled Recipe"}</h5>
                    <div>
                      <i
                        className="fa-solid fa-pen"
                        onClick={() => nav(`/edit/${recipe._id}`)}
                        style={{ cursor: "pointer", marginRight: "12px" }}
                        title="Edit"
                      ></i>
                      <i className="fa-solid fa-trash" onClick={() => deleteRecipe(recipe._id)} style={{ cursor: "pointer" }} title="Delete"></i>
                    </div>
                  </div>
                  <p className="card-text text-muted">{truncateDescription(recipe.description, 20)}</p>
                  <button className="btn btn-primary w-100" onClick={() => viewRecipe(recipe._id)}>
                    View Recipe
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Profile;
