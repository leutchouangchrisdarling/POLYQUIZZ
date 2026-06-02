import { useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

function Resultats() {
  const { state } = useLocation();
  const { pseudo, updateBestScore } = useUser();
  const navigate = useNavigate();

  const score = state?.score || 0;
  const total = state?.total || 10;

  const ratio = useMemo(() => {
    return ((score / total) * 100).toFixed(1);
  }, [score, total]);

  // Safe and clean React state update on mount
  useEffect(() => {
    updateBestScore(score);
  }, [score, updateBestScore]);

  return (
    <div className="container">
      <h1>Résultats</h1>
      <p style={{ fontSize: '1.2rem', textAlign: 'center', margin: '10px 0' }}>
        Pseudo : <strong>{pseudo}</strong>
      </p>
      
      <p style={{ textAlign: 'center' }}>
        Score : <strong>{score} / {total}</strong>
      </p>
      
      <p style={{ textAlign: 'center', marginBottom: '15px' }}>
        Ratio : <strong>{ratio}%</strong>
      </p>
      
      <button onClick={() => navigate('/')}>Rejouer</button>
    </div>
  );
}

export default Resultats;
