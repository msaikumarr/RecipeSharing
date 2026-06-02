import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { loginUser } = useAuth();
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await loginUser(credentials.email, credentials.password);
    } catch (error) {
      console.error("Login error:", error);
      setError(error.message || "Invalid email or password");
    }
  };

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value })
  }

  return (
    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center" style={{
      background: "url('https://img.freepik.com/premium-photo/ingredients-cooking-black-stone-kitchen-table-herbs-spices-vegetables-top-view-with-space-design_1040174-1582.jpg')",
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}>
      <div className="p-4 rounded" style={{
        background: "rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(10px)",
        border: "2px solid white",
        width: "400px",
      }}>
        <h2 className="mb-4 text-center text-white">Login</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email" className="text-white">Email address</label>
            <input type="email" className="form-control" id="email" name='email' aria-describedby="emailHelp" onChange={onChange} value={credentials.email} style={{
              background: "transparent",
              color: "white",
              border: "2px solid white",
            }} />
          </div>
          <div className="form-group mt-4">
            <label htmlFor="password" className="text-white">Password</label>
            <input type="password" className="form-control" id="password" name='password' onChange={onChange} value={credentials.password} style={{
              background: "transparent",
              color: "white",
              border: "2px solid white",
            }} />
          </div>
          <button type="submit" className="btn btn-outline-light w-100" style={{
            transition: "0.3s",
            border: "2px solid white", marginTop: "45px"
          }}>Login</button>
        </form>
      </div>
    </div>
  )
}

export default Login;
