import { Component, type ReactNode } from "react";

interface Props {
  onError?: () => void;
  children: ReactNode;
}

interface State {
  failed: boolean;
}

// Three.js/WebGL context creation can throw synchronously (no GPU, hardware
// acceleration disabled, driver crash, too many contexts already open) —
// without a boundary that's an uncaught render error that blanks the page.
// Catching it here just means falling back to the existing CSS 3D case,
// which every visitor already gets on mobile/reduced-motion anyway.
export class WebGLErrorBoundary extends Component<Props, State> {
  state: State = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    this.props.onError?.();
  }

  render() {
    if (this.state.failed) return null;
    return this.props.children;
  }
}
