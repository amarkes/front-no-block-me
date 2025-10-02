import { createContext, useContext } from 'react';
import { usePomodoro } from '../hooks/usePomodoro';

const PomodoroContext = createContext();

export const usePomodoroContext = () => {
  const context = useContext(PomodoroContext);
  if (!context) {
    throw new Error('usePomodoroContext must be used within a PomodoroProvider');
  }
  return context;
};

export const PomodoroProvider = ({ children }) => {
  const pomodoroData = usePomodoro();

  return (
    <PomodoroContext.Provider value={pomodoroData}>
      {children}
    </PomodoroContext.Provider>
  );
};
