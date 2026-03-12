'use client';

import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div role="alert" className="flex flex-col items-center justify-center py-12 px-4 botanical-border max-w-md mx-auto">
            {/* Compass ornament */}
            <div className="flex items-center gap-2 mb-4 w-full">
              <div className="flex-1 border-t border-plate-border/40" />
              <span className="font-mono text-xs text-plate-border/50 leading-none">&#9678;</span>
              <div className="flex-1 border-t border-plate-border/40" />
            </div>

            <p className="font-mono text-xs tracking-[0.2em] text-forest uppercase mb-1">
              Specimen Error
            </p>
            <p className="font-serif text-sm italic text-sage/80">
              This section could not be rendered.
            </p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="mt-4 px-4 py-2 font-mono text-xs tracking-[0.2em] text-forest uppercase border border-plate-border hover:bg-forest hover:text-parchment transition-colors min-h-[44px]"
            >
              Retry
            </button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
