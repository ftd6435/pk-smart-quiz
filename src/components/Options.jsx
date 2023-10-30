// import { useState } from "react";

function Options({ answers, onDispatch, answer, correct }) {
  const hasAnswered = answer !== null;

  return (
    <div className="options">
      {answers &&
        answers.map((opt, i) => (
          <button
            className={`${correct && correct === opt ? "correct" : ""} ${
              answer && answer === opt ? "answer" : ""
            } `}
            key={opt}
            disabled={hasAnswered}
            onClick={() => onDispatch({ type: "newAnwer", payload: opt })}
          >
            {i + 1} - {opt}
          </button>
        ))}
    </div>
  );
}

export default Options;
