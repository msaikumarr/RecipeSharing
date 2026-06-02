import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

const Signup = () => {
  const { signupUser } = useAuth();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Client-side password strength validation
    const pwd = formData.password || "";
    const checks = [
      { test: pwd.length >= 8, message: "Password must be at least 8 characters" },
      { test: /[A-Z]/.test(pwd), message: "Password must include an uppercase letter" },
      { test: /[a-z]/.test(pwd), message: "Password must include a lowercase letter" },
      { test: /[0-9]/.test(pwd), message: "Password must include a number" },
    ];
    const failed = checks.find(c => !c.test);
    if (failed) {
      setError(failed.message);
      return;
    }

    try {
      await signupUser(formData.name, formData.email, formData.password);
    } catch (err) {
      setError(err.message || "Signup failed! Try again.");
    }
  };

  return (
    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center" style={{
      background: "url('https://img.freepik.com/premium-photo/ingredients-cooking-black-stone-kitchen-table-herbs-spices-vegetables-top-view-with-space-design_1040174-1582.jpg')",
      backgroundSize: "cover",
      backgroundPosition: "center"
    }}>
      <div className="p-4 rounded" style={{
        background: "rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(10px)",
        border: "2px solid white",
        width: "400px",
      }}>
        <h2 className="mb-4 text-center text-white">Sign Up</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="text-white">Name</label>
            <input 
              type="text" 
              name="name" 
              className="form-control"
              value={formData.name} 
              onChange={handleChange} 
              required 
              style={{
                background: "transparent",
                color: "white",
                border: "2px solid white",
              }}
            />
          </div>
          <div className="form-group mt-2">
            <label className="text-white">Email</label>
            <input 
              type="email" 
              name="email" 
              className="form-control"
              value={formData.email} 
              onChange={handleChange} 
              required 
              style={{
                background: "transparent",
                color: "white",
                border: "2px solid white",
              }}
            />
          </div>
          <div className="form-group mt-2">
            <label className="text-white">Password</label>
            <input 
              type="password" 
              name="password" 
              className="form-control"
              value={formData.password} 
              onChange={handleChange} 
              required 
              style={{
                background: "transparent",
                color: "white",
                border: "2px solid white",
              }}
            />
          </div>
          <button type="submit" className="btn btn-outline-light w-100" style={{
            transition: "0.3s",
            border: "2px solid white", marginTop: "45px"
          }}>Sign Up</button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
