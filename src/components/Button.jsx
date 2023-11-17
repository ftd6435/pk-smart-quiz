import { useQuiz } from "../contexts/QuizContext";

function Button({ type, children }) {
  const {onDispatch} = useQuiz();

  return (
    <>
      {type === "showResult" ? (
        <button
          className="btn btn-next"
          onClick={() => onDispatch({ type: type })}
        >
          {children} &darr;
        </button>
      ) : type === "hideResult" ? (
        <button
          className="btn btn-next"
          onClick={() => onDispatch({ type: type })}
        >
          {children} &uarr;
        </button>
      ) : type === "start" ? (
        <button
          className="btn btn-next"
          onClick={() => onDispatch({ type: type })}
        >
          &#x21BB; {children} 
        </button>
      ) : (
        <button
          className="btn btn-next"
          onClick={() => onDispatch({ type: type })}
        >
          {children} &rarr;
        </button>
      )}
    </>
  );
}

export default Button;

