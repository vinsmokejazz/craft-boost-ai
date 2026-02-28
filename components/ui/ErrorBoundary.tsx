"use client";

import { Component, type ReactNode } from "react";
import { AlertCircle, RotateCcw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallbackMessage?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="glass flex flex-col items-center justify-center rounded-2xl p-12 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-danger/10">
            <AlertCircle className="h-7 w-7 text-danger/70" />
          </div>
          <h3 className="mt-4 text-base font-semibold text-foreground">
            Something went wrong
          </h3>
          <p className="mt-1 max-w-md text-sm text-white/40">
            {this.props.fallbackMessage ??
              this.state.error?.message ??
              "An unexpected error occurred."}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="mt-4 flex items-center gap-2 rounded-lg border border-white/8 px-4 py-2 text-xs font-medium text-white/60 transition hover:border-white/15 hover:text-white/90"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
