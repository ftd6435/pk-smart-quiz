import { useQuiz } from "../contexts/QuizContext";
import Button from "./Button";
import Options from "./Options";
import ProgressBar from "./ProgressBar";
import useTimer from "./TimeCalculator";

import he from "he";

function Questions() {
  const {
    questions,
    onDispatch,
    index,
    numberQuestions,
    nextQuestion,
    secondsNecessary,
  } = useQuiz();

  const currentQuestion = questions[index];
  const { min, sec } = useTimer(secondsNecessary, onDispatch);

  return (
    <div
      className={`${
        currentQuestion.type === "multiple" ? "multipleChoice" : "booleanChoice"
      }`}
    >
      <ProgressBar />

      {currentQuestion && (
        <>
          <div className="quizHeader">
            <h1>Question: {index + 1}</h1>
            <span className="timer">
              {min < 10 ? "0" : ""}
              {min}:{sec < 10 ? "0" : ""}
              {sec}
            </span>
          </div>
          <h2>{he.decode(currentQuestion.question)}</h2>
          <Options answers={currentQuestion.answers} />
        </>
      )}
      {nextQuestion && (
        <div className="btn-sec">
          {index < numberQuestions - 1 ? (
            <Button type="next">Next</Button>
          ) : (
            <Button type="result">See Result</Button>
          )}
        </div>
      )}
    </div>
  );
}

export default Questions;
