import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Leaderboard() {
  const [classement, setClassement] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5001/api/leaderboard')
      .then(r => r.json())
      .then(d => setClassement(d));
  }, []);

  return (
    <div>
      <h1>Classement général</h1>
      {classement.map((joueur, index) => (
        <div key={joueur.pseudo}>
          <span>{index + 1}. {joueur.pseudo}</span>
          <span>{joueur.bestScore} pts</span>
        </div>
      ))}
      <Link to="/">Retour</Link>
    </div>
  );
}

export default Leaderboard;