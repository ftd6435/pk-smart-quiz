import Button from "./Button";
import Options from "./Options";
import ProgressBar from "./ProgressBar";
import useTimer from "./TimeCalculator";

import he from 'he';

function Questions({
  questions,
  onDispatch,
  index,
  numberQuestions,
  answer,
  nextQuestion,
  correct,
  score,
  seconds,
}) {
  const currentQuestion = questions[index];
  const { min, sec } = useTimer(seconds, onDispatch);

  return (
    <div className={`${currentQuestion.type === 'multiple' ? 'multipleChoice' : 'booleanChoice'}`}>
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
          <h2>{he.decode(currentQuestion.question)}</h2>
          <Options
            answers={currentQuestion.answers}
            onDispatch={onDispatch}
            answer={answer}
            correct={correct}
          />
        </>
      )}
      {nextQuestion && (
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

export default Questions;
