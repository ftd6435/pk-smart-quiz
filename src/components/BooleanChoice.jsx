import ProgressBar from "./ProgressBar";
import Options from "./Options";
import Button from "./Button";
import useTimer from "./TimeCalculator";

function BooleanChoice({
  questions,
  onDispatch,
  index,
  numberQuestions,
  answer,
  status,
  correct,
  score,
  seconds,
}) {
  const currentQuestion = questions[index];
  const { min, sec } = useTimer(seconds, onDispatch);

  //   console.log(min, sec);

  return (
    <div className="booleanChoice">
      <ProgressBar
        index={index}
        numberQuestions={numberQuestions}
        answer={answer}
        score={score}
      />

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
          <h2>{currentQuestion.question}</h2>
          <Options
            answers={currentQuestion.answers}
            onDispatch={onDispatch}
            answer={answer}
            correct={correct}
          />
        </>
      )}
      {status === "nextQuestion" && (
        <div className="btn-sec">
          {index < numberQuestions - 1 ? (
            <Button onDispatch={onDispatch} type="next">
              Next
            </Button>
          ) : (
            <Button onDispatch={onDispatch} type="result">
              See Result
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export default BooleanChoice;
