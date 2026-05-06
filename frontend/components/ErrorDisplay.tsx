import { ErrorState } from '@/lib/errors';

interface ErrorDisplayProps {
  error: ErrorState;
  onDismiss?: () => void;
}

export function ErrorDisplay({ error, onDismiss }: ErrorDisplayProps) {
  return (
    <div className="mt-6 bg-red-50 border-2 border-red-200 rounded-2xl p-6 animate-fade-in">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <svg 
            className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path 
              fillRule="evenodd" 
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" 
              clipRule="evenodd" 
            />
          </svg>
          <div className="flex-1">
            <h3 className="font-semibold text-red-800 mb-1">{error.title}</h3>
            <p className="text-red-700 text-sm mb-2">{error.message}</p>
            {error.details && (
              <details className="mt-2">
                <summary className="text-xs text-red-600 cursor-pointer hover:text-red-800 select-none">
                  Technical Details
                </summary>
                <p className="text-xs text-red-600 mt-2 font-mono bg-red-100 p-2 rounded break-all">
                  {error.details}
                </p>
              </details>
            )}
          </div>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="ml-4 text-red-400 hover:text-red-600 transition-colors"
            aria-label="Dismiss error"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path 
                fillRule="evenodd" 
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" 
                clipRule="evenodd" 
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
