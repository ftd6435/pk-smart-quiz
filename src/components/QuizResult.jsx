import Button from "./Button";

function QuizResult({
  score,
  numberQuestions,
  takenQuizResult,
  onDispatch,
  showResult,
}) {
  const possibleScore = 10 * numberQuestions;
  const percentage = Math.floor((score / possibleScore)) * 100;

  return (
    <div className="resultSection">
      <h4>
        You scored {score} points over {possibleScore} points ({percentage}%)
      </h4>

      <div className="quizHeader">
      <Button type="showResult" onDispatch={onDispatch}>
        Show Result
      </Button>
      <Button type="start" onDispatch={onDispatch}>
        Restart Quiz
      </Button>
      </div>

      {showResult === "show" && (
        <ul className="showResult">
          {takenQuizResult &&
            takenQuizResult.map((quiz, i) => (
              <li key={i}>
                <h4>{quiz.question}</h4>
                <p>
                  Answer: {quiz.answer}{" "}
                  {quiz.answer === quiz.correctAnswer ? "✅" : "❌"}
                </p>
                <p>Correct: {quiz.correctAnswer} ✅</p>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}

export default QuizResult;
