import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";

function YourCards({ user }) {
  const [cards, setCards] = useState([]);
  const [openCardId, setOpenCardId] = useState(null);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    const q = query(collection(db, "cards"), where("uid", "==", user.uid));
    const unsub = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
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
    setEditData(null);
  };

  const handleEditClick = (e, card) => {
    e.stopPropagation();
    setEditData({
      ...card,
      raw: card.raw?.toString() || "",
      grading: card.grading?.toString() || "",
      psa9: card.psa9?.toString() || "",
      psa10: card.psa10?.toString() || "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const calculateAndUpdate = async () => {
    const { name, raw, grading, psa9, psa10, id } = editData;
    const rawNum = parseFloat(raw);
    const gradingNum = parseFloat(grading);
    const psa9Num = parseFloat(psa9);
    const psa10Num = parseFloat(psa10);

    const pl9 = psa9Num - rawNum - gradingNum;
    const pl10 = psa10Num - rawNum - gradingNum;

    let decision = "No";
    let explanation = "No profit at grade 10";

    if (pl10 > 0) {
      if (pl9 > 0) {
        decision = "Hell yeah";
        explanation = "Strong profit at both grades";
      } else if (pl9 > -5) {
        decision = "Yes";
        explanation = "Low risk, high grade profit";
      } else {
        decision = "Caution";
        explanation = "Small loss and low 10 profit";
      }
    }

    await updateDoc(doc(db, "cards", id), {
      name,
      raw: rawNum,
      grading: gradingNum,
      psa9: psa9Num,
      psa10: psa10Num,
      pl9,
      pl10,
      decision,
      explanation,
    });

    setEditData(null);
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
                {editData?.id === card.id ? (
                  <div className="card-edit-form">
                    <label className="card-edit-label">Card Name</label>
                    <input
                      name="name"
                      value={editData.name}
                      onChange={handleInputChange}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <label className="card-edit-label">Raw Value</label>
                    <input
                      name="raw"
                      value={editData.raw}
                      onChange={handleInputChange}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <label className="card-edit-label">Grading Cost</label>
                    <input
                      name="grading"
                      value={editData.grading}
                      onChange={handleInputChange}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <label className="card-edit-label">PSA 9 Price</label>
                    <input
                      name="psa9"
                      value={editData.psa9}
                      onChange={handleInputChange}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <label className="card-edit-label">PSA 10 Price</label>
                    <input
                      name="psa10"
                      value={editData.psa10}
                      onChange={handleInputChange}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div className="button-row">
                      <button className="edit-btn" onClick={calculateAndUpdate}>
                        Save
                      </button>
                      <button
                        className="delete-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditData(null);
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
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
                      <button
                        className="edit-btn"
                        onClick={(e) => handleEditClick(e, card)}
                      >
                        Edit
                      </button>
                      <button
                        className="delete-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(card.id);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default YourCards;
