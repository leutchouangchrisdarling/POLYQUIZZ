/**
 * Moteur du quiz basé sur useReducer.
 * Actions : START_QUIZ, ANSWER_QUESTION, FINISH_QUIZ, TICK_TIMER
 */

export const initialState = {
  status: 'idle', // idle | playing | finished
  questions: [],
  currentIndex: 0,
  score: 0,
  answers: [],
  timeLeft: 60,
  selectedAnswer: null,
  isCorrect: null,
};

export function quizReducer(state, action) {
  switch (action.type) {
    case 'START_QUIZ': {
      return {
        ...initialState,
        status: 'playing',
        questions: action.payload,
        timeLeft: 60,
      };
    }

    case 'ANSWER_QUESTION': {
      const currentQuestion = state.questions[state.currentIndex];
      const isCorrect = action.payload === currentQuestion.bonne_reponse;

      // Crée un nouveau tableau d'answers sans push()
      const newAnswers = [
        ...state.answers,
        {
          questionId: currentQuestion.id,
          selected: action.payload,
          correct: currentQuestion.bonne_reponse,
          isCorrect,
        },
      ];

      return {
        ...state,
        score: isCorrect ? state.score + 1 : state.score,
        answers: newAnswers,
        selectedAnswer: action.payload,
        isCorrect,
      };
    }

    case 'NEXT_QUESTION': {
      const nextIndex = state.currentIndex + 1;
      if (nextIndex >= state.questions.length) {
        return {
          ...state,
          status: 'finished',
          selectedAnswer: null,
          isCorrect: null,
        };
      }
      return {
        ...state,
        currentIndex: nextIndex,
        selectedAnswer: null,
        isCorrect: null,
      };
    }

    case 'TICK_TIMER': {
      return {
        ...state,
        timeLeft: state.timeLeft - 1,
      };
    }

    case 'FINISH_QUIZ': {
      return {
        ...state,
        status: 'finished',
        selectedAnswer: null,
        isCorrect: null,
      };
    }

    default:
      return state;
  }
}
