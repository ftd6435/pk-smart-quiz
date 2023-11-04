import Button from "./Button";

function Error({message, onDispatch = null}) {
  return (
    <div className="error">
      <p><span>💥</span> {message}</p>
      <Button type="start" onDispatch={onDispatch}>Back to Settings</Button>
    </div>
  );
}

export default Error;
