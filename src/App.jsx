// App.jsx
import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { auth, provider } from "./firebase";
import { signInWithPopup, onAuthStateChanged, signOut } from "firebase/auth";
import SearchCard from "./pages/SearchCard";
import YourCards from "./pages/YourCards";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      if (!currentUser) navigate("/");
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    await signInWithPopup(auth, provider);
  };

  const handleLogout = () => {
    signOut(auth);
  };

  if (loading) {
    return (
      <div style={{ color: "white", textAlign: "center", marginTop: "4rem" }}>
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="auth-screen">
        <h1>GradeIt 🔍</h1>
        <button onClick={handleLogin}>Login with Google</button>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header className="main-header">
        <div className="nav-left">
          <a href="/search" className="nav-btn">
            Search Card
          </a>
          <a href="/dashboard" className="nav-btn">
            Your Cards
          </a>
        </div>
        <h1 className="logo">
          Grade<span className="logo-highlight">It</span>
          <span className="logo-question">?</span>
        </h1>

        <div className="nav-right">
          <button onClick={handleLogout} className="logout-btn">
            Logout ({user.displayName})
          </button>
        </div>
      </header>
      <Routes>
        <Route path="/" element={<SearchCard user={user} />} />
        <Route path="/search" element={<SearchCard user={user} />} />
        <Route path="/dashboard" element={<YourCards user={user} />} />
      </Routes>
    </div>
  );
}

export default App;
