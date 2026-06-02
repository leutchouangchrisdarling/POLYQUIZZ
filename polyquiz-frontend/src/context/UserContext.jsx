import { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [pseudo, setPseudo] = useState(null);
  const [bestScore, setBestScore] = useState(0);

  const updateBestScore = (score) => {
    if (score > bestScore) setBestScore(score);
  };

  return (
    <UserContext.Provider value={{ pseudo, setPseudo, bestScore, updateBestScore }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
