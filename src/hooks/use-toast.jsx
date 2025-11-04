import * as React from "react";

// Context for sharing toast state
const ToastContext = React.createContext();

export function ToastProviderWrapper({ children }) {
  const [toasts, setToasts] = React.useState([]);

  // Function to show a toast
  const toast = React.useCallback(({ title, description, action, ...props }) => {
    const id = Math.random().toString(36).slice(2);
    const newToast = { id, title, description, action, ...props };
    setToasts((prev) => [...prev, newToast]);

    // Optional auto-remove after 4s
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const value = { toasts, toast };

  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  );
}

// Hook for using toast context
export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProviderWrapper");
  }
  return context;
}

// Optional direct export for simple usage
export const toast = {
  success: (msg) => alert(`✅ ${msg}`),
  error: (msg) => alert(`❌ ${msg}`),
};
