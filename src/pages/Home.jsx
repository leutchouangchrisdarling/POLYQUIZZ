import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

/**
 * Page d'accueil / Login — saisie du pseudo pour accéder au quiz.
 */
export default function Home() {
  const [inputPseudo, setInputPseudo] = useState('');
  const [shakeError, setShakeError] = useState(false);
  const { setPseudo, bestScore } = useUser();
  const navigate = useNavigate();

  const handleStart = (e) => {
    e.preventDefault();
    const trimmed = inputPseudo.trim();
    if (!trimmed) {
      setShakeError(true);
      setTimeout(() => setShakeError(false), 600);
      return;
    }
    setPseudo(trimmed);
    navigate('/quiz');
  };

  const categories = [
    { name: 'F1', emoji: '🏎️', color: '#e10600' },
    { name: 'MotoGP', emoji: '🏍️', color: '#ff6b00' },
    { name: 'NBA', emoji: '🏀', color: '#f58426' },
    { name: 'Manga', emoji: '🎌', color: '#e84393' },
  ];

  return (
    <div className="home-page">
      <div className="home-bg-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>

      <div className="home-content">
        <div className="logo-section">
          <h1 className="logo-title">
            <span className="logo-poly">Poly</span>
            <span className="logo-quiz">Quiz</span>
          </h1>
          <p className="logo-subtitle">Teste tes connaissances ! 🔥</p>
        </div>

        <div className="categories-preview">
          {categories.map((cat) => (
            <div
              key={cat.name}
              className="category-chip"
              style={{ '--chip-color': cat.color }}
            >
              <span className="chip-emoji">{cat.emoji}</span>
              <span className="chip-name">{cat.name}</span>
            </div>
          ))}
        </div>

        <form className="login-form" onSubmit={handleStart}>
          <div className={`input-wrapper ${shakeError ? 'shake' : ''}`}>
            <input
              type="text"
              placeholder="Entre ton pseudo..."
              value={inputPseudo}
              onChange={(e) => setInputPseudo(e.target.value)}
              className="pseudo-input"
              autoFocus
              maxLength={20}
            />
          </div>
          <button type="submit" className="start-btn">
            <span>C'est parti !</span>
            <span className="btn-arrow">→</span>
          </button>
        </form>

        {bestScore > 0 && (
          <div className="best-score-badge">
            🏆 Meilleur score : {bestScore}
          </div>
        )}

        <div className="credits">
          <p>Leutchouang Chris Darling</p>
          <p className="credits-sub">L3 Sécurité & Cryptographie — ENSPM-INFOTEL</p>
        </div>
      </div>
    </div>
  );
}
