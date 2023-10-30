function ProgressBar({index, numberQuestions, answer, score}) {
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
