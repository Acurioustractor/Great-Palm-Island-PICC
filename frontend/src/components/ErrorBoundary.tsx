'use client';

import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div style={{
          padding: '2rem',
          textAlign: 'center',
          background: '#f8f9fa',
          borderRadius: '8px',
          border: '1px solid #e9ecef',
          margin: '1rem'
        }}>
          <h3 style={{ color: '#19466C', marginBottom: '1rem' }}>
            Something went wrong
          </h3>
          <p style={{ color: '#6c757d', marginBottom: '1rem' }}>
            We're experiencing a temporary issue loading this content.
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            style={{
              padding: '0.5rem 1rem',
              background: '#19466C',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}