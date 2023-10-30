function Input({ limit, onSetLimit }) {
  return (
    <input
      type="number"
      value={limit}
      onChange={(e) => onSetLimit(e.target.value)}
      placeholder="Number of questions"
      min="1"
      max="50"
    />
  );
}

export default Input;