import he from 'he';
import { useQuiz } from '../contexts/QuizContext';


function Options({ answers }) {
  const {answer, correct, onDispatch} = useQuiz();
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
            {i + 1} - {he.decode(opt)}
          </button>
        ))}
    </div>
  );
}

export default Options;
