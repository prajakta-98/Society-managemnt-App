function ErrorMessage({ message = 'Something went wrong.', onRetry }) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800" role="alert">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p>{message}</p>
        {onRetry && (
          <button
            type="button"
            className="font-semibold text-red-700 underline underline-offset-2 hover:text-red-900"
            onClick={onRetry}
          >
            Try again
          </button>
        )}
      </div>
    </div>
  );
}

export default ErrorMessage;
