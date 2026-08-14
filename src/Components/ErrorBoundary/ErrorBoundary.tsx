import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Uygulama hatası yakalandı:', error, info.componentStack);
  }

  handleReload = () => {
    this.setState({ error: null });
    window.location.reload();
  };

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-6 text-center">
          <p className="text-gray-800 text-lg font-semibold">Bir şeyler ters gitti.</p>
          <p className="text-sm text-gray-500 max-w-md">{this.state.error.message}</p>
          <button
            type="button"
            onClick={this.handleReload}
            className="bg-[#E91D34] text-white text-sm font-semibold rounded-full px-6 py-3 hover:bg-[#CA192D] transition-colors"
          >
            Sayfayı Yenile
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
