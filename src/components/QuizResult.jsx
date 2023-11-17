import { useQuiz } from "../contexts/QuizContext";
import Button from "./Button";

function QuizResult() {

  const {score, numberQuestions, takenQuizResult, result} = useQuiz();
  
  const possibleScore = 10 * numberQuestions;
  const percentage = (score / possibleScore) * 100;

  return (
    <div className="resultSection">
      <h4>
        You scored {score} over {possibleScore} points ({percentage}%)
      </h4>

      <div className="quizHeader">
        <Button type={`${result === 'show' ? 'hideResult' : 'showResult'}`}>
          {result === "show" ? "Hide Result" : "Show Result"}
        </Button>
        <Button type="start">
          Restart Quiz
        </Button>
      </div>

      {result === "show" && (
        <ul className="showResult">
          {takenQuizResult &&
            takenQuizResult.map((quiz, i) => (
              <li key={i}>
                <h4>{quiz.question}</h4>
                <p>
                  Your Answer: {quiz.answer}{" "}
                  {quiz.answer === quiz.correctAnswer ? "✅" : "❌"}
                </p>
                <p>Correct Answer: {quiz.correctAnswer} ✅</p>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}

export default QuizResult;
