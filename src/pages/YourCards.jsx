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
  updateDoc,
} from "firebase/firestore";

function YourCards({ user }) {
  const [cards, setCards] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    if (!user?.uid) return;
    const q = query(collection(db, "cards"), where("uid", "==", user.uid));
    const unsub = onSnapshot(q, (snapshot) => {
      const cardData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCards(cardData);
    });
    return () => unsub();
  }, [user]);

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "cards", id));
  };

  const startEdit = (card) => {
    setEditingId(card.id);
    setEditForm({
      name: card.name,
      raw: card.raw,
      grading: card.grading,
      psa9: card.psa9,
      psa10: card.psa10,
    });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const saveEdit = async (id) => {
    const raw = parseFloat(editForm.raw);
    const grading = parseFloat(editForm.grading);
    const psa9 = parseFloat(editForm.psa9);
    const psa10 = parseFloat(editForm.psa10);
    const pl9 = psa9 - raw - grading;
    const pl10 = psa10 - raw - grading;
    const diff = pl10 - pl9;

    let decision = "No";
    let explanation = "❌ No profit at grade 10";
    if (pl10 <= 0) {
      decision = "No";
    } else if (pl9 <= -30) {
      decision = "No";
      explanation = "❌ Too much risk if graded a 9";
    } else if (pl9 >= 0 && pl10 >= 50) {
      decision = "Hell yeah";
      explanation = "🏆 Win-win: profit either way";
    } else if (pl10 >= 80 && pl9 > -30) {
      decision = "Hell yeah";
      explanation = "🔥 Big 10 upside, tolerable grade 9 risk.";
    } else if (pl10 >= 30 && pl9 > -20) {
      decision = "Yes";
      explanation = "🟠 Small 9 risk, decent 10 upside";
    } else if (pl9 < 0 && pl10 < 30) {
      decision = "No";
      explanation = "❌ Too much risk or no upside";
    }

    await updateDoc(doc(db, "cards", id), {
      ...editForm,
      pl9,
      pl10,
      diff,
      decision,
      explanation,
    });

    setEditingId(null);
    setEditForm({});
  };

  return (
    <div className="card-list">
      <h2>Your Cards</h2>
      {cards.length === 0 ? (
        <p>No saved cards yet.</p>
      ) : (
        cards.map((card) => (
          <div key={card.id} className="card-item">
            {editingId === card.id ? (
              <div className="card-edit-form">
                Card Name
                <input
                  name="name"
                  placeholder="Card Name"
                  value={editForm.name}
                  onChange={handleEditChange}
                />
                Raw Value
                <input
                  name="raw"
                  placeholder="Raw Value"
                  value={editForm.raw}
                  onChange={handleEditChange}
                />
                Grading Cost
                <input
                  name="grading"
                  placeholder="Grading Cost"
                  value={editForm.grading}
                  onChange={handleEditChange}
                />
                PSA 9 Price
                <input
                  name="psa9"
                  placeholder="PSA 9 Price"
                  value={editForm.psa9}
                  onChange={handleEditChange}
                />
                PSA 10 Price
                <input
                  name="psa10"
                  placeholder="PSA 10 Price"
                  value={editForm.psa10}
                  onChange={handleEditChange}
                />
                <button onClick={() => saveEdit(card.id)}>Save</button>
                <button onClick={() => setEditingId(null)}>Cancel</button>
              </div>
            ) : (
              <>
                <h3>{card.name}</h3>
                <p>Raw Value: £{card.raw}</p>
                <p>Grading Cost: £{card.grading}</p>
                <p>Profit for 9: £{card.pl9}</p>
                <p>Profit for 10: £{card.pl10}</p>
                <p>Decision: {card.decision}</p>
                <p>Explanation: {card.explanation}</p>
                <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem" }}>
                  <button onClick={() => startEdit(card)}>Edit</button>
                  <button onClick={() => handleDelete(card.id)}>Delete</button>
                </div>
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default YourCards;
