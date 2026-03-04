import { useReducer, useEffect, useCallback } from 'react';
import TodoForm from './features/TodoForm';
import TodoList from './features/TodoList/TodoList';
import TodosViewForm from './features/TodosViewForm';
import styles from './App.module.css';
import './App.css';

import {
  reducer as todosReducer,
  actions as todoActions,
  initialState as initialTodosState,
} from './reducers/todos.reducer';

const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;

function App() {
  const [todoState, dispatch] = useReducer(todosReducer, initialTodosState);

  const encodeUrl = useCallback(() => {
    let sortQuery = `sort[0][field]=${todoState.sortField || 'createdTime'}&sort[0][direction]=${
      todoState.sortDirection || 'desc'
    }`;

    let searchQuery = '';

    if (todoState.queryString) {
      searchQuery = `&filterByFormula=SEARCH("${todoState.queryString}", {title})`;
    }

    return encodeURI(`${url}?${sortQuery}${searchQuery}`);
  }, [todoState.sortField, todoState.sortDirection, todoState.queryString]);

  // Fetch todos
  useEffect(() => {
    dispatch({ type: todoActions.fetchTodos });

    fetch(encodeUrl(), {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_PAT}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const formattedTodos = data.records.map((record) => ({
          id: record.id,
          ...record.fields,
        }));
        dispatch({ type: todoActions.loadTodos, records: formattedTodos });
      })
      .catch((error) => dispatch({ type: todoActions.setLoadError, error }));
  }, [encodeUrl]);

  // Add todo
  const addTodo = async (title) => {
    dispatch({ type: todoActions.startRequest });

    const newRecord = { fields: { title, isCompleted: false } };

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_PAT}`,
        },
        body: JSON.stringify({ records: [newRecord] }),
      });
      const data = await res.json();
      const savedTodo = { id: data.records[0].id, ...data.records[0].fields };
      dispatch({ type: todoActions.addTodo, savedTodo });
    } catch (error) {
      dispatch({ type: todoActions.setLoadError, error });
    } finally {
      dispatch({ type: todoActions.endRequest });
    }
  };

  // Complete todo
  const completeTodo = async (id) => {
    const originalTodo = todoState.todoList.find((t) => t.id === id);

    try {
      const res = await fetch(`${url}/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_PAT}`,
        },
        body: JSON.stringify({ fields: { isCompleted: true } }),
      });
      const updatedRecord = await res.json();
      dispatch({ type: todoActions.completeTodo, id: updatedRecord.id });
    } catch (error) {
      dispatch({ type: todoActions.revertTodo, originalTodo });
      dispatch({ type: todoActions.setLoadError, error });
    }
  };

  // Update todo
  const updateTodo = async (editedTodo) => {
    try {
      const res = await fetch(`${url}/${editedTodo.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_PAT}`,
        },
        body: JSON.stringify({ fields: { title: editedTodo.title } }),
      });
      const updatedRecord = await res.json();
      dispatch({
        type: todoActions.updateTodo,
        editedTodo: { ...editedTodo, ...updatedRecord.fields },
      });
    } catch (error) {
      dispatch({ type: todoActions.setLoadError, error });
    }
  };

  // Clear error
  const clearError = () => dispatch({ type: todoActions.clearError });

  return (
    <div className={styles.appContainer}>
      <div className={styles.appCard}>
        <h1>
          <img
            src="/logo.png"
            alt="Todo Logo"
            width="30"
            style={{ marginRight: '10px' }}
          />
          Stephanie's Todos
        </h1>

        <TodoForm onAddTodo={addTodo} isSaving={todoState.isSaving} />

        <TodoList
          todoList={todoState.todoList}
          onCompleteTodo={completeTodo}
          onUpdateTodo={updateTodo}
        />

        <TodosViewForm
          sortField={todoState.sortField}
          setSortField={(field) =>
            dispatch({ type: todoActions.setSortField, field })
          }
          sortDirection={todoState.sortDirection}
          setSortDirection={(dir) =>
            dispatch({ type: todoActions.setSortDirection, dir })
          }
          queryString={todoState.queryString}
          setQueryString={(query) =>
            dispatch({ type: todoActions.setQueryString, query })
          }
        />

        {todoState.errorMessage && (
          <div style={{ color: 'red', marginTop: '10px' }}>
            {todoState.errorMessage}{' '}
            <button onClick={clearError}>Dismiss</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
