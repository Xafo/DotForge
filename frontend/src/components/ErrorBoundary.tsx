import { Component, type ReactNode } from 'react'

interface Props { children: ReactNode }
interface State { error: Error | null }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen flex items-center justify-center p-8">
          <div className="text-center max-w-md">
            <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-4">
              {this.state.error.message}
            </p>
            <button
              onClick={() => { localStorage.clear(); window.location.href = '/login' }}
              className="text-sm text-brand-600 dark:text-brand-400 hover:underline"
            >
              Clear session & restart
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
