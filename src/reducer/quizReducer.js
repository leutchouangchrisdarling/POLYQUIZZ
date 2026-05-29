function quizReducer(state, action) {
  switch (action.type) {
    case 'START_QUIZ':
      return { ...state, questions: action.payload, currentIndex: 0, score: 0, status: 'active', answers: [] };
    case 'ANSWER_QUESTION':
      const question = state.questions[state.currentIndex];
      const correct = action.payload === question.bonne_reponse;
      return {
        ...state,
        score: correct ? state.score + 1 : state.score,
        answers: [...state.answers, action.payload],
        currentIndex: state.currentIndex + 1,
        status: state.currentIndex + 1 >= state.questions.length ? 'finished' : 'active'
      };
    case 'FINISH_QUIZ':
      return { ...state, status: 'finished' };
    default:
      return state;
  }
}

export default quizReducer;
