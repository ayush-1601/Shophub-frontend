function ErrorMessage({ message, onRetry }) {
  return (
    <div className="status-panel" role="alert">
      <p>{message || 'Something went wrong. Please try again.'}</p>
      {onRetry ? (
        <button type="button" className="button" onClick={onRetry}>
          Retry
        </button>
      ) : null}
    </div>
  )
}

export default ErrorMessage
