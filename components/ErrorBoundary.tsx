import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 text-center bg-[#FAF9F6] dark:bg-[#0A0A0A] text-[#0A0A0A] dark:text-[#F9F8F6]">
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-black/50 dark:text-white/50 mb-3">
            Something went wrong
          </span>
          <h3 className="text-2xl font-serif italic mb-4">
            An unexpected glitch occurred
          </h3>
          <p className="text-sm text-black/70 dark:text-white/70 max-w-md mb-6 leading-relaxed">
            {this.state.error?.message || 'Please refresh or reopen the project.'}
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
            className="px-6 py-2.5 rounded-full bg-black text-white dark:bg-white dark:text-black text-xs font-mono uppercase tracking-[0.2em] font-medium"
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
