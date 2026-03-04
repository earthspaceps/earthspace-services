import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Frontend Error caught by boundary:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    height: '100vh', display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center', textAlign: 'center',
                    padding: '20px', fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
                }}>
                    <h1 style={{ fontSize: '2rem', color: '#111827', marginBottom: '1rem' }}>Something went wrong</h1>
                    <p style={{ color: '#4b5563', marginBottom: '2rem', maxWidth: '500px' }}>
                        We've encountered an unexpected error. Please try refreshing the page or contact support if the issue persists.
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            padding: '12px 24px', background: '#2563eb', color: '#fff',
                            borderRadius: '8px', border: 'none', fontWeight: 600, cursor: 'pointer'
                        }}
                    >
                        Refresh Page
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
