import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { auth, provider } from "./firebase";
import { signInWithPopup, onAuthStateChanged, signOut } from "firebase/auth";
import SearchCard from "./pages/SearchCard";
import YourCards from "./pages/YourCards";
import Header from "./components/Header";

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
    return <div className="auth-screen">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="auth-screen">
        <div className="logo-center">
          <span className="logo-text">
            Grade<span className="highlight">It?</span> 🔍
          </span>
        </div>
        <button onClick={handleLogin} className="logout-button">
          Login with Google
        </button>
      </div>
    );
  }

  return (
    <div className="page-container">
    <div className="app-container">
      <Header user={user} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<SearchCard user={user} />} />
        <Route path="/search" element={<SearchCard user={user} />} />
        <Route path="/dashboard" element={<YourCards user={user} />} />
      </Routes>
    </div>
    </div>
  );
}

export default App;
