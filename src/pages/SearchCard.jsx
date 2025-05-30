import React, { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

function SearchCard({ user }) {
  const [form, setForm] = useState({
    name: "",
    raw: "",
    grading: "",
    psa9: "",
    psa10: ""
  });
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const gradeCard = async () => {
    const raw = parseFloat(form.raw);
    const grading = parseFloat(form.grading);
    const psa9 = parseFloat(form.psa9);
    const psa10 = parseFloat(form.psa10);
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
  
    const result = {
      ...form,
      pl9,
      pl10,
      diff,
      decision,
      explanation,
      uid: user.uid,
      timestamp: Date.now()
    };
  
    setResult(result);
  
    try {
      await addDoc(collection(db, "cards"), result);
      console.log("✅ Card saved to Firestore!");
    } catch (err) {
      console.error("❌ Error saving card:", err);
    }
  };

  return (
    <div className="card-form">
      <h2>Grade Your Card</h2>
      <input name="name" placeholder="Card Name" onChange={handleChange} />
      <input name="raw" placeholder="Raw Value" onChange={handleChange} />
      <input name="grading" placeholder="Grading Cost" onChange={handleChange} />
      <input name="psa9" placeholder="PSA 9 Price" onChange={handleChange} />
      <input name="psa10" placeholder="PSA 10 Price" onChange={handleChange} />
      <button onClick={gradeCard}>Grade It</button>

      {result && (
        <div className="result-card">
          <h3>Result for {result.name}</h3>
          <p><b>Profit/Loss @ 9:</b> £{result.pl9}</p>
          <p><b>Profit/Loss @ 10:</b> £{result.pl10}</p>
          <p><b>Difference:</b> £{result.diff}</p>
          <p><b>GradeIt Decision:</b> {result.decision}</p>
          <p><b>Explanation:</b> {result.explanation}</p>
        </div>
      )}
    </div>
  );
}

export default SearchCard;