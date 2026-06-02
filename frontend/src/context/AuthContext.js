import { createContext, useState, useEffect, useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null); // Token state
  const navigate = useNavigate();

  const logoutUser = useCallback(() => {
    localStorage.removeItem("token");
    setToken(null); // Clear the token state
    setUser(null);
    navigate("/login");
  }, [navigate]);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken); // Set the token state
      fetch("https://recipesharing-mzt5.onrender.com/api/users/me", {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
        .then((res) => res.json())
        .then((data) => setUser(data))
        .catch(() => logoutUser());
    }
    setLoading(false);
  }, [logoutUser]);

  const loginUser = async (email, password) => {
    try {
      const response = await fetch("https://recipesharing-mzt5.onrender.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Login failed");

      localStorage.setItem("token", data.authtoken);
      setToken(data.authtoken); // Set the token state
      setUser(data.user);
      navigate("/");
      return data;
    } catch (error) {
      console.error(error.message);
      throw error; // Rethrow so callers (e.g., Login page) can display the message
    }
  };

  const signupUser = async (name, email, password) => {
    try {
      const response = await fetch("https://recipesharing-mzt5.onrender.com/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Signup failed");

      localStorage.setItem("token", data.authtoken);
      setToken(data.authtoken); // Set the token state
      setUser(data.user);
      navigate("/");  // Redirect to Home after signup
      return data;
    } catch (error) {
      console.error(error.message);
      throw error; // Rethrow so callers can display server message
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loginUser, signupUser, logoutUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for AuthContext
export const useAuth = () => useContext(AuthContext);
