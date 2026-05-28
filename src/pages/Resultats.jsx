import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

/**
 * Couleurs par catégorie.
 */
const categoryColors = {
  F1: '#e10600',
  MotoGP: '#ff6b00',
  NBA: '#f58426',
  Manga: '#e84393',
};

const categoryEmojis = {
  F1: '🏎️',
  MotoGP: '🏍️',
  NBA: '🏀',
  Manga: '🎌',
};

export default function Resultats() {
  const location = useLocation();
  const navigate = useNavigate();
  const { pseudo, bestScore } = useUser();

  const { score = 0, total = 0, answers = [], timeUsed = 0 } =
    location.state || {};

  // useMemo pour calculer le ratio de bonnes réponses
  const ratio = useMemo(() => {
    if (total === 0) return 0;
    return Math.round((score / total) * 100);
  }, [score, total]);

  // useMemo pour calculer les stats par catégorie
  const categoryStats = useMemo(() => {
    const stats = {};
    answers.forEach((ans) => {
      const qId = ans.questionId;
      const cat = qId.split('-')[0].toUpperCase() === 'MOTOGP'
        ? 'MotoGP'
        : qId.split('-')[0].charAt(0).toUpperCase() + qId.split('-')[0].slice(1);

      // Fix category name mapping
      let catName;
      if (qId.startsWith('f1')) catName = 'F1';
      else if (qId.startsWith('motogp')) catName = 'MotoGP';
      else if (qId.startsWith('nba')) catName = 'NBA';
      else if (qId.startsWith('manga')) catName = 'Manga';
      else catName = 'Autre';

      if (!stats[catName]) {
        stats[catName] = { correct: 0, total: 0 };
      }
      stats[catName].total += 1;
      if (ans.isCorrect) stats[catName].correct += 1;
    });
    return stats;
  }, [answers]);

  const getMessage = () => {
    if (ratio === 100) return { text: 'PARFAIT ! Tu es un génie ! 🧠', emoji: '🏆' };
    if (ratio >= 75) return { text: 'Excellent ! Impressionnant !', emoji: '🔥' };
    if (ratio >= 50) return { text: 'Pas mal du tout !', emoji: '💪' };
    if (ratio >= 25) return { text: 'Tu peux faire mieux !', emoji: '📚' };
    return { text: 'Il faut réviser... 😅', emoji: '😬' };
  };

  const message = getMessage();

  const handleReplay = () => {
    navigate('/quiz');
  };

  const handleHome = () => {
    navigate('/');
  };

  return (
    <div className="results-page">
      <div className="results-bg-shapes">
        <div className="r-shape r-shape-1"></div>
        <div className="r-shape r-shape-2"></div>
      </div>

      <div className="results-content">
        <div className="results-header">
          <p className="results-player">Bravo {pseudo} !</p>
          <div className="results-emoji-big">{message.emoji}</div>
          <p className="results-message">{message.text}</p>
        </div>

        <div className="score-circle-container">
          <div className="score-circle">
            <svg viewBox="0 0 120 120" className="score-ring">
              <circle
                cx="60"
                cy="60"
                r="54"
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="8"
              />
              <circle
                cx="60"
                cy="60"
                r="54"
                fill="none"
                stroke={ratio >= 50 ? '#00e676' : '#ff5252'}
                strokeWidth="8"
                strokeDasharray={`${(ratio / 100) * 339.29} 339.29`}
                strokeLinecap="round"
                className="score-ring-fill"
              />
            </svg>
            <div className="score-circle-text">
              <span className="score-big">{ratio}%</span>
              <span className="score-detail">
                {score}/{total}
              </span>
            </div>
          </div>
        </div>

        <div className="stats-row">
          <div className="stat-card">
            <span className="stat-icon">⏱️</span>
            <span className="stat-value">{timeUsed}s</span>
            <span className="stat-label">Temps</span>
          </div>
          <div className="stat-card">
            <span className="stat-icon">⭐</span>
            <span className="stat-value">{score}</span>
            <span className="stat-label">Score</span>
          </div>
          <div className="stat-card">
            <span className="stat-icon">🏆</span>
            <span className="stat-value">{bestScore}</span>
            <span className="stat-label">Record</span>
          </div>
        </div>

        <div className="category-breakdown">
          <h3 className="breakdown-title">Par catégorie</h3>
          <div className="breakdown-grid">
            {Object.entries(categoryStats).map(([cat, data]) => (
              <div
                key={cat}
                className="breakdown-card"
                style={{ '--cat-color': categoryColors[cat] || '#6c5ce7' }}
              >
                <span className="breakdown-emoji">
                  {categoryEmojis[cat] || '❓'}
                </span>
                <span className="breakdown-name">{cat}</span>
                <span className="breakdown-score">
                  {data.correct}/{data.total}
                </span>
                <div className="breakdown-bar">
                  <div
                    className="breakdown-bar-fill"
                    style={{
                      width: `${(data.correct / data.total) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="answers-review">
          <h3 className="review-title">Récapitulatif</h3>
          {answers.map((ans) => {
            let catName;
            if (ans.questionId.startsWith('f1')) catName = 'F1';
            else if (ans.questionId.startsWith('motogp')) catName = 'MotoGP';
            else if (ans.questionId.startsWith('nba')) catName = 'NBA';
            else if (ans.questionId.startsWith('manga')) catName = 'Manga';
            else catName = 'Autre';

            return (
              <div
                key={ans.questionId}
                className={`review-item ${ans.isCorrect ? 'review-correct' : 'review-wrong'}`}
              >
                <span className="review-cat-dot" style={{ backgroundColor: categoryColors[catName] }}></span>
                <span className="review-status">{ans.isCorrect ? '✓' : '✗'}</span>
                <div className="review-details">
                  <span className="review-selected">{ans.selected}</span>
                  {!ans.isCorrect && (
                    <span className="review-correct-answer">→ {ans.correct}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="results-actions">
          <button className="replay-btn" onClick={handleReplay}>
            <span>🔄</span>
            <span>Rejouer</span>
          </button>
          <button className="home-btn" onClick={handleHome}>
            <span>🏠</span>
            <span>Accueil</span>
          </button>
        </div>
      </div>
    </div>
  );
}
