/**
 * Error Boundary Component
 * Catches React errors and displays fallback UI
 */

import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

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
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div style={{
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '2rem',
                    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
                    color: 'white',
                    textAlign: 'center'
                }}>
                    <span style={{ fontSize: '3rem', marginBottom: '1rem' }}>😵</span>
                    <h2 style={{ margin: '0 0 0.5rem 0' }}>出错了</h2>
                    <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '1.5rem' }}>
                        Something went wrong. Please try again.
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            background: 'linear-gradient(135deg, #667eea, #764ba2)',
                            border: 'none',
                            color: 'white',
                            padding: '0.75rem 1.5rem',
                            borderRadius: '8px',
                            fontSize: '1rem',
                            cursor: 'pointer'
                        }}
                    >
                        刷新页面
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
