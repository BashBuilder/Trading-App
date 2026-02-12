import { useState } from "react";

let currentState = {
  isAuthenticated: false,
};

const listeners = new Set<(state: typeof currentState) => void>();

function setState(next: typeof currentState) {
  currentState = next;
  listeners.forEach((l) => l(currentState));
}

export function useAuthStore() {
  const [state, setLocalState] = useState(currentState);

  if (!listeners.has(setLocalState)) {
    listeners.add(setLocalState);
  }

  return {
    ...state,
    login: () => setState({ isAuthenticated: true }),
    logout: () => setState({ isAuthenticated: false }),
  };
}
