// src/pages/YourCards.jsx
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";

function YourCards({ user }) {
  const [cards, setCards] = useState([]);
  const [openCardId, setOpenCardId] = useState(null);

  useEffect(() => {
    const q = query(collection(db, "cards"), where("uid", "==", user.uid));

    const unsub = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Sort manually (descending) if timestamp exists
      docs.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

      setCards(docs);
    });

    return () => unsub();
  }, [user]);

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "cards", id));
  };

  const toggleCard = (id) => {
    setOpenCardId((prev) => (prev === id ? null : id));
  };

  const getBadgeClass = (decision) => {
    if (decision === "Hell yeah") return "badge green";
    if (decision === "Yes") return "badge lime";
    if (decision === "Caution") return "badge orange";
    return "badge red";
  };

  const getFullWidthBadgeClass = (decision) => {
    if (decision === "Hell yeah") return "full-badge green";
    if (decision === "Yes") return "full-badge lime";
    if (decision === "Caution") return "full-badge orange";
    return "full-badge red";
  };

  return (
    <div className="card-list">
      <h2>Your Cards</h2>
      <div className="card-list-header">
        <div className="header-left">
          <strong>Card</strong>
        </div>
        <div className="header-center">
          <strong>GradeIt?</strong>
        </div>
        <div className="header-right">
          <strong>Actions</strong>
        </div>
      </div>
      <div className="cards-container">
        {cards.map((card) => (
          <div
            key={card.id}
            className="card-item"
            onClick={() => toggleCard(card.id)}
          >
            <div className="card-header">
              <div className="card-title-left">
                <strong>{card.name}</strong>
              </div>

              <div className="card-title-center">
                <span className={getBadgeClass(card.decision)}>
                  {card.decision}
                </span>
              </div>

              <div className="header-right">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(card.id);
                  }}
                  className="icon-button"
                >
                  🗑️
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleCard(card.id);
                  }}
                  className="toggle-btn"
                >
                  {openCardId === card.id ? "▲" : "▼"}
                </button>
              </div>
            </div>
            {openCardId === card.id && (
              <div className="card-body">
                <p>Raw Value: £{card.raw}</p>
                <p>Grading Cost: £{card.grading}</p>
                <p>Profit for 9: £{card.pl9}</p>
                <p>Profit for 10: £{card.pl10}</p>
                <p>
                  <em>Should I Grade it?</em>
                </p>

                <div className={getFullWidthBadgeClass(card.decision)}>
                  {card.decision}
                </div>
                <p>
                  <strong>Decision:</strong> {card.decision}
                </p>
                <p>
                  <strong>Explanation:</strong> {card.explanation}
                </p>
                <div className="button-row">
                  <button className="edit-btn">Edit</button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(card.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default YourCards;
