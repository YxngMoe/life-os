import { Component } from 'react';

export default class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="pin-screen">
          <div className="glass-card glass-card--elevated" style={{ padding: 32, maxWidth: 400, textAlign: 'center' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>⚠️</div>
            <h1 className="text-headline mb-12">Something went wrong</h1>
            <p className="text-caption text-secondary mb-16">{this.state.error.message}</p>
            <button type="button" className="glass-btn glass-btn--primary" onClick={() => window.location.reload()}>
              Reload app
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
