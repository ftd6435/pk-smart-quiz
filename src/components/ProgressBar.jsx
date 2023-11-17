import { useQuiz } from "../contexts/QuizContext";

function ProgressBar() {
    const {index, numberQuestions, answer, score} = useQuiz();
    const possibleScore = 10 * numberQuestions;

    return (
        <div className="progress">
            <progress value={index + Number(answer !== null)} max={numberQuestions}></progress>
            <p>Question <strong>{index + 1}</strong> / {numberQuestions}</p>
            <p><strong>{score}</strong> / {possibleScore} points</p>
        </div>
    )
}

export default ProgressBar;
