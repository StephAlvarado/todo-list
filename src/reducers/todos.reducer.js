export const initialState = {
  todoList: [],
  isLoading: false,
  isSaving: false,
  errorMessage: '',
  sortField: 'createdTime',
  sortDirection: 'desc',
  queryString: '',
};

export const actions = {
  fetchTodos: 'fetchTodos',
  loadTodos: 'loadTodos',
  setLoadError: 'setLoadError',
  startRequest: 'startRequest',
  addTodo: 'addTodo',
  endRequest: 'endRequest',
  updateTodo: 'updateTodo',
  completeTodo: 'completeTodo',
  revertTodo: 'revertTodo',
  clearError: 'clearError',
  setSortField: 'setSortField',
  setSortDirection: 'setSortDirection',
  setQueryString: 'setQueryString',
};

export function reducer(state = initialState, action) {
  switch (action.type) {
    case actions.fetchTodos:
      return { ...state, isLoading: true };
    case actions.loadTodos:
      return { ...state, todoList: action.records, isLoading: false };
    case actions.setLoadError:
      return {
        ...state,
        errorMessage: action.error?.message || 'Error',
        isLoading: false,
        isSaving: false,
      };
    case actions.startRequest:
      return { ...state, isSaving: true };

    case actions.addTodo:
      const todoWithDefault = {
        isCompleted: false,
        ...action.savedTodo,
      };
      return {
        ...state,
        todoList: [...state.todoList, todoWithDefault],
        isSaving: false,
      };

    case actions.endRequest:
      return { ...state, isLoading: false, isSaving: false };
    case actions.updateTodo:
      return {
        ...state,
        todoList: state.todoList.map((todo) =>
          todo.id === action.editedTodo.id ? action.editedTodo : todo
        ),
        errorMessage: action.error?.message || '',
      };
    case actions.completeTodo:
      return {
        ...state,
        todoList: state.todoList.map((todo) =>
          todo.id === action.id ? { ...todo, isCompleted: true } : todo
        ),
      };

    case actions.revertTodo:
      action.editedTodo = action.originalTodo;
    case actions.updateTodo:
      return {
        ...state,
        todoList: state.todoList.map((todo) =>
          todo.id === action.editedTodo.id ? action.editedTodo : todo
        ),
        errorMessage: action.error?.message || '',
      };
    case actions.clearError:
      return { ...state, errorMessage: '' };

    case actions.setSortField:
      return { ...state, sortField: action.field };

    case actions.setSortDirection:
      return { ...state, sortDirection: action.dir };

    case actions.setQueryString:
      return { ...state, queryString: action.query };

    default:
      return state;
  }
}
