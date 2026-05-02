'use client';
import React, { Component } from 'react';
import type { ReactNode, ErrorInfo } from 'react';
import { logger } from '@/utils';
import styles from './ErrorBoundary.module.scss';

interface ErrorBoundaryProps {
  children:  ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    logger.error('[ErrorBoundary] Uncaught error:', error, info.componentStack);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return this.props.fallback ?? <DefaultFallback />;
    }
    return this.props.children;
  }
}

function DefaultFallback() {
  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Something went wrong</h2>
      <p className={styles.message}>An unexpected error occurred. Please refresh the page.</p>
      <button className={styles.button} onClick={() => window.location.reload()}>
        Refresh page
      </button>
    </div>
  );
}