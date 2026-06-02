import { useEffect, useRef, useReducer, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import quizReducer from '../reducer/quizReducer';

const initial = { questions: [], currentIndex: 0, score: 0, status: 'idle', answers: [] };

function Quiz() {
  const { data, loading } = useFetch('http://localhost:5001/api/questions');  
  const [state, dispatch] = useReducer(quizReducer, initial);
  const timer = useRef(null);
  const navigate = useNavigate();
  const [temps, setTemps] = useState(60);

  useEffect(() => {
    if (data) dispatch({ type: 'START_QUIZ', payload: data });
  }, [data]);

  useEffect(() => {
    if (state.status !== 'active') return;
    setTemps(60);
    timer.current = setInterval(() => {
      setTemps(prev => {
        if (prev <= 1) {
          clearInterval(timer.current);
          dispatch({ type: 'FINISH_QUIZ' });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer.current);
  }, [state.status]);

  useEffect(() => {
  if (state.status === 'finished') {
    const token = localStorage.getItem('polyquiz_token');
    fetch('http://localhost:5001/api/users/score', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ score: state.score })
    });
    navigate('/resultats', { state: { score: state.score, total: state.questions.length } });
  }
}, [state.status]);

  if (loading) {
    return (
      <div className="container">
        <p>Chargement...</p>
      </div>
    );
  }

  const question = state.questions[state.currentIndex];
  if (!question) {
    return (
      <div className="container">
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <p style={{ color: '#666', fontSize: '0.9rem' }}>
        Question {state.currentIndex + 1} / {state.questions.length} — Catégorie : {question.categorie}
      </p>
      
      <h2>{question.text}</h2>
      
      <div className="options-container">
        {question.options.map(opt => (
          <button 
            key={opt} 
            className="btn-option"
            onClick={() => dispatch({ type: 'ANSWER_QUESTION', payload: opt })}
          >
            {opt}
          </button>
        ))}
      </div>
      
      <p style={{ marginTop: '10px' }}>Score : <strong>{state.score}</strong></p>
      <p className="timer">Temps restant : {temps}s</p>
    </div>
  );
}

export default Quiz;
