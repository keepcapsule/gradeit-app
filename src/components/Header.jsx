import React from "react";
import { useNavigate } from "react-router-dom";

function Header({ user, onLogout }) {
  const navigate = useNavigate();

  return (
    <header className="main-header">
      <div className="nav-left">
        <button className="nav-button" onClick={() => navigate("/search")}>
          Search Card
        </button>
        <button className="nav-button" onClick={() => navigate("/dashboard")}>
          Your Cards
        </button>
      </div>
      <div className="logo-center">
        <span className="logo-text">
          Grade<span className="highlight">It?</span>
        </span>
      </div>
      <div className="nav-right">
        {user && (
          <button className="logout-button" onClick={onLogout}>
            Logout ({user.displayName})
          </button>
        )}
      </div>
    </header>
  );
}

export default Header;
