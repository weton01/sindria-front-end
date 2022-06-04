import React from "react";
 
class ErrorBoundary extends React.Component {
  state = {
    hasError: false,
  };

  constructor(props) {
    super(props); 
    
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) {  
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) { 
    console.log({ error, errorInfo });
  }
  render() { 
    if (this.state.hasError) { 
      return (
        <div>
          <h2>Oops, there is an error!</h2>
          <button
            type="button"
            onClick={() => this.setState({ hasError: false })}
          >
            Try again?
          </button>
        </div>
      );
    }

    // Return children components in case of no error

    return this.props.children;
  }
}

export default ErrorBoundary;
