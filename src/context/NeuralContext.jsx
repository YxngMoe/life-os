import { createContext, useContext } from 'react';
import { useStorage } from '../hooks/useStorage';
import useNeuralContext from '../hooks/useNeuralContext';
import { DEFAULT_GOALS } from '../data/defaults';

const NeuralCtx = createContext(null);

export function NeuralProvider({ children }) {
  const [checks] = useStorage('checks', {});
  const [schk] = useStorage('schk', {});
  const [goals] = useStorage('goals', DEFAULT_GOALS);
  const [todos] = useStorage('todos', []);
  const [agentLog] = useStorage('agent_log', []);
  const neural = useNeuralContext({ checks, schk, goals, todos, agentLog });
  return <NeuralCtx.Provider value={neural}>{children}</NeuralCtx.Provider>;
}

export function useNeural() {
  const ctx = useContext(NeuralCtx);
  if (!ctx) throw new Error('useNeural must be used within NeuralProvider');
  return ctx;
}

/** Safe hook — returns null outside provider */
export function useNeuralOptional() {
  return useContext(NeuralCtx);
}
