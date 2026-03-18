import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary container mt-5">
          <div className="alert alert-danger" role="alert">
            <h4 className="alert-heading">🚨 Something went wrong!</h4>
            <p>We're sorry, but an unexpected error occurred. Please try refreshing the page.</p>
            <hr />
            <p className="mb-0">
              <button
                className="btn btn-outline-danger me-2"
                onClick={() => window.location.reload()}
              >
                🔄 Refresh Page
              </button>
              <button
                className="btn btn-outline-secondary"
                onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
              >
                🔙 Try Again
              </button>
            </p>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-3">
                <summary>Error Details (Development Only)</summary>
                <pre className="mt-2 p-2 bg-light rounded small">
                  {this.state.error.toString()}
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;