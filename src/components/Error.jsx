import { useQuiz } from "../contexts/QuizContext";
import Button from "./Button";

function Error({message}) {
  const {onDispatch} = useQuiz();

  return (
    <div className="error">
      <p><span>💥</span> {message}</p>
      <Button type="start" onDispatch={onDispatch}>Back to Settings</Button>
    </div>
  );
}

export default Error;
