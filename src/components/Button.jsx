function Button({ type, children, onDispatch }) {
  return (
    <>
      {type === "showResult" ? (
        <button
          className="btn btn-next"
          onClick={() => onDispatch({ type: type })}
        >
          {children} &darr;
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
