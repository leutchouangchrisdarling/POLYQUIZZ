import { useReducer, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import useFetch from '../hooks/useFetch';
import { quizReducer, initialState } from '../components/QuizEngine';

/**
 * Couleurs par catégorie pour le style dynamique.
 */
const categoryColors = {
  F1: { bg: '#e10600', light: 'rgba(225,6,0,0.15)', emoji: '🏎️' },
  MotoGP: { bg: '#ff6b00', light: 'rgba(255,107,0,0.15)', emoji: '🏍️' },
  NBA: { bg: '#f58426', light: 'rgba(245,132,38,0.15)', emoji: '🏀' },
  Manga: { bg: '#e84393', light: 'rgba(232,67,147,0.15)', emoji: '🎌' },
};

/**
 * Mélange un tableau sans muter l'original (Fisher-Yates).
 */
function shuffleArray(arr) {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function Quiz() {
  const { data: questions, loading, error } = useFetch('/questions.json');
  const [state, dispatch] = useReducer(quizReducer, initialState);
  const { pseudo, updateBestScore } = useUser();
  const navigate = useNavigate();
  const timerRef = useRef(null);
  const feedbackTimeoutRef = useRef(null);

  // Démarrer le quiz quand les questions sont chargées
  useEffect(() => {
    if (questions && state.status === 'idle') {
      dispatch({ type: 'START_QUIZ', payload: shuffleArray(questions) });
    }
  }, [questions, state.status]);

  // Chrono de 60 secondes avec useRef
  useEffect(() => {
    if (state.status === 'playing' && state.timeLeft > 0) {
      timerRef.current = setInterval(() => {
        dispatch({ type: 'TICK_TIMER' });
      }, 1000);

      return () => clearInterval(timerRef.current);
    }

    if (state.status === 'playing' && state.timeLeft <= 0) {
      clearInterval(timerRef.current);
      dispatch({ type: 'FINISH_QUIZ' });
    }
  }, [state.status, state.timeLeft]);

  // Naviguer vers résultats quand le quiz est fini
  useEffect(() => {
    if (state.status === 'finished') {
      clearInterval(timerRef.current);
      updateBestScore(state.score);
      // Petit délai pour voir le dernier feedback
      const timeout = setTimeout(() => {
        navigate('/resultats', {
          state: {
            score: state.score,
            total: state.questions.length,
            answers: state.answers,
            timeUsed: 60 - state.timeLeft,
          },
        });
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [state.status, state.score, state.questions.length, state.answers, state.timeLeft, updateBestScore, navigate]);

  const handleAnswer = useCallback(
    (option) => {
      if (state.selectedAnswer !== null) return; // Empêcher double-clic

      dispatch({ type: 'ANSWER_QUESTION', payload: option });

      // Passer à la question suivante après feedback
      feedbackTimeoutRef.current = setTimeout(() => {
        dispatch({ type: 'NEXT_QUESTION' });
      }, 1200);
    },
    [state.selectedAnswer]
  );

  // Cleanup du timeout de feedback
  useEffect(() => {
    return () => {
      if (feedbackTimeoutRef.current) {
        clearTimeout(feedbackTimeoutRef.current);
      }
    };
  }, []);

  if (loading) {
    return (
      <div className="quiz-page">
        <div className="loader-container">
          <div className="loader-spinner"></div>
          <p className="loader-text">Chargement des questions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="quiz-page">
        <div className="error-container">
          <p className="error-emoji">😵</p>
          <p className="error-text">Erreur : {error}</p>
        </div>
      </div>
    );
  }

  if (state.status === 'idle' || state.questions.length === 0) {
    return null;
  }

  const currentQuestion = state.questions[state.currentIndex];
  const catStyle = categoryColors[currentQuestion.categorie] || categoryColors.F1;
  const progress = ((state.currentIndex + 1) / state.questions.length) * 100;
  const isPulsing = state.timeLeft <= 10;

  return (
    <div className="quiz-page">
      <div className="quiz-header">
        <div className="quiz-header-top">
          <div className="player-badge">
            <span className="player-icon">👤</span>
            <span className="player-name">{pseudo}</span>
          </div>
          <div className={`timer-badge ${isPulsing ? 'pulse' : ''}`}>
            <span className="timer-icon">⏱️</span>
            <span className="timer-value">{state.timeLeft}s</span>
          </div>
          <div className="score-badge">
            <span className="score-icon">⭐</span>
            <span className="score-value" key={state.score}>
              {state.score}
            </span>
          </div>
        </div>

        <div className="progress-bar-container">
          <div
            className="progress-bar-fill"
            style={{
              width: `${progress}%`,
              backgroundColor: catStyle.bg,
            }}
          ></div>
          <span className="progress-text">
            {state.currentIndex + 1} / {state.questions.length}
          </span>
        </div>
      </div>

      <div className="question-card" key={currentQuestion.id}>
        <div
          className="question-category-tag"
          style={{ backgroundColor: catStyle.bg }}
        >
          <span>{catStyle.emoji}</span>
          <span>{currentQuestion.categorie}</span>
        </div>

        <h2 className="question-text">{currentQuestion.libelle}</h2>

        <div className="options-grid">
          {currentQuestion.options.map((option) => {
            let optionClass = 'option-btn';

            if (state.selectedAnswer !== null) {
              if (option === currentQuestion.bonne_reponse) {
                optionClass += ' correct';
              } else if (option === state.selectedAnswer && !state.isCorrect) {
                optionClass += ' wrong';
              } else {
                optionClass += ' dimmed';
              }
            }

            return (
              <button
                key={`${currentQuestion.id}-${option}`}
                className={optionClass}
                onClick={() => handleAnswer(option)}
                disabled={state.selectedAnswer !== null}
                style={{
                  '--option-accent': catStyle.bg,
                  '--option-light': catStyle.light,
                }}
              >
                <span className="option-text">{option}</span>
                {state.selectedAnswer !== null &&
                  option === currentQuestion.bonne_reponse && (
                    <span className="option-icon">✓</span>
                  )}
                {state.selectedAnswer === option &&
                  !state.isCorrect && (
                    <span className="option-icon">✗</span>
                  )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
