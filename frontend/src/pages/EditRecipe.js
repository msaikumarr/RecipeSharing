import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const EditRecipe = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { token } = useAuth();

  const [recipe, setRecipe] = useState({
    title: "",
    description: "",
    image: "",
    video: "",
    ingredients: "",
    steps: "",
    category: "",
    state: "",
    benefits: "",
    recommendedHotels: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await fetch(`https://recipesharing.onrender.com/api/recipes/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to load recipe");

        setRecipe({
          title: data.title || "",
          description: data.description || "",
          image: data.image || "",
          video: data.video || "",
          ingredients: Array.isArray(data.ingredients) ? data.ingredients.join(",") : (data.ingredients || ""),
          steps: Array.isArray(data.steps) ? data.steps.join(",") : (data.steps || ""),
          category: data.category || "",
          state: data.state || "",
          benefits: data.benefits || "",
          recommendedHotels: Array.isArray(data.recommendedHotels)
            ? data.recommendedHotels.map(h => `${h.name},${h.location},${h.rating}`).join("\n")
            : (data.recommendedHotels || ""),
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecipe(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      alert("You must be logged in to edit a recipe!");
      return;
    }

    try {
      // Use FormData to support file uploads
      const formData = new FormData();
      formData.append('title', recipe.title);
      formData.append('description', recipe.description);
      if (imageFile) formData.append('image', imageFile);
      else formData.append('image', recipe.image || '');
      if (videoFile) formData.append('video', videoFile);
      else formData.append('video', recipe.video || '');
      formData.append('ingredients', recipe.ingredients);
      formData.append('steps', recipe.steps);
      formData.append('category', recipe.category);
      formData.append('state', recipe.state);
      formData.append('benefits', recipe.benefits);
      formData.append('recommendedHotels', recipe.recommendedHotels);

      const response = await fetch(`http://localhost:5000/api/recipes/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to update recipe');

      alert('Recipe updated successfully!');
      navigate('/profile');
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mt-4">
      <h2>Edit Recipe</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit} className="edit-form">
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input type="text" name="title" className="form-control" value={recipe.title} onChange={handleChange} />
        </div>

        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea name="description" className="form-control" value={recipe.description} onChange={handleChange} />
        </div>

        <div className="mb-3">
          <label className="form-label">Image URL</label>
          <input type="text" name="image" className="form-control" value={recipe.image} onChange={handleChange} placeholder="Or choose file below" />
          <input type="file" accept="image/*" className="form-control mt-2" onChange={(e) => setImageFile(e.target.files[0] || null)} />
        </div>

        <div className="mb-3">
          <label className="form-label">Video URL (optional)</label>
          <input type="text" name="video" className="form-control" value={recipe.video} onChange={handleChange} placeholder="https://youtube.com/..." />
          <input type="file" accept="video/*" className="form-control mt-2" onChange={(e) => setVideoFile(e.target.files[0] || null)} />
        </div>

        <div className="mb-3">
          <label className="form-label">Ingredients (comma separated)</label>
          <textarea name="ingredients" className="form-control" value={recipe.ingredients} onChange={handleChange} />
        </div>

        <div className="mb-3">
          <label className="form-label">Steps (comma separated)</label>
          <textarea name="steps" className="form-control" value={recipe.steps} onChange={handleChange} />
        </div>

        <div className="mb-3">
          <label className="form-label">Category</label>
          <input type="text" name="category" className="form-control" value={recipe.category} onChange={handleChange} />
        </div>

        <div className="mb-3">
          <label className="form-label">State</label>
          <input type="text" name="state" className="form-control" value={recipe.state} onChange={handleChange} />
        </div>

        <div className="mb-3">
          <label className="form-label">Benefits</label>
          <textarea name="benefits" className="form-control" value={recipe.benefits} onChange={handleChange} />
        </div>

        <div className="mb-3">
          <label className="form-label">Recommended Hotels (Each line: Name,Location,Rating)</label>
          <textarea name="recommendedHotels" className="form-control" value={recipe.recommendedHotels} onChange={handleChange} />
        </div>

        <button type="submit" className="btn btn-primary">Save Changes</button>
      </form>
    </div>
  );
};

export default EditRecipe;
