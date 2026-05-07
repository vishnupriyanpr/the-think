import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="neo-shell flex min-h-screen items-center justify-center px-5 py-16">
          <div className="neo-card max-w-xl bg-white p-8 text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center border-[3px] border-[var(--ink)] bg-[var(--red)] shadow-[4px_4px_0_var(--ink)]">
              <svg width="34" height="34" viewBox="0 0 34 34" fill="none" aria-hidden="true">
                <path d="M17 4L31 29H3L17 4Z" stroke="currentColor" strokeWidth="3" strokeLinejoin="miter" />
                <path d="M17 13V20" stroke="currentColor" strokeWidth="3" strokeLinecap="square" />
                <path d="M17 25H17.01" stroke="currentColor" strokeWidth="4" strokeLinecap="square" />
              </svg>
            </div>
            <h2 className="font-display text-5xl leading-none tracking-[-0.07em]">
              Something broke
            </h2>
            <p className="mx-auto mt-4 max-w-sm text-base font-bold leading-7 text-[var(--muted)]">
              Refresh the page and The Think will take another swing.
            </p>
            <button onClick={() => window.location.reload()} className="neo-button mt-7">
              Refresh page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
