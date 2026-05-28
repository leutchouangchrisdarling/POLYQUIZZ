import { createContext, useContext, useState, useCallback } from 'react';

const UserContext = createContext(null);

/**
 * Provider global qui stocke le pseudo du joueur et son meilleur score.
 * Accessible partout dans l'app via useUser().
 */
export function UserProvider({ children }) {
  const [pseudo, setPseudo] = useState('');
  const [bestScore, setBestScore] = useState(0);

  const updateBestScore = useCallback((newScore) => {
    setBestScore((prev) => (newScore > prev ? newScore : prev));
  }, []);

  const logout = useCallback(() => {
    setPseudo('');
  }, []);

  const value = {
    pseudo,
    setPseudo,
    bestScore,
    updateBestScore,
    logout,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

/**
 * Hook pour accéder au contexte utilisateur.
 * @returns {{ pseudo: string, setPseudo: Function, bestScore: number, updateBestScore: Function, logout: Function }}
 */
export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser doit être utilisé dans un UserProvider');
  }
  return context;
}

export default UserContext;
