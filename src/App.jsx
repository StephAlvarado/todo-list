import { useState, useEffect } from 'react';
import TodoForm from './features/TodoForm';
import TodoList from './features/TodoList/TodoList';

function App() {
  const [todoList, setTodoList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;
  const token = `Bearer ${import.meta.env.VITE_PAT}`;

  //token test

  useEffect(() => {
    const testAuth = async () => {
      try {
        const resp = await fetch(url, {
          headers: { Authorization: token },
        });
        const data = await resp.json();
        console.log('TEST RESPONSE:', data);
      } catch (err) {
        console.error('AUTH TEST ERROR:', err);
      }
    };
    testAuth();
  }, []);

  useEffect(() => {
    const fetchTodos = async () => {
      setIsLoading(true);

      const options = {
        method: 'GET',
        headers: { Authorization: token },
      };

      try {
        const resp = await fetch(url, options);

        if (!resp.ok) {
          throw new Error('Failed to fetch todos');
        }

        const { records } = await resp.json();

        const todos = records.map((record) => ({
          id: record.id,
          ...record.fields,
          isCompleted: record.fields.isCompleted || false,
        }));

        setTodoList(todos);
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTodos();
  }, []);

  const addTodo = async (title) => {
    if (!title.trim()) return;

    setIsSaving(true);

    const payload = {
      records: [{ fields: { title, isCompleted: false } }],
    };
    try {
      const resp = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!resp.ok) {
        const text = await resp.text(); // <-- get raw response
        throw new Error(`Failed to save todo: ${text}`);
      }

      const { records } = await resp.json();
      const savedTodo = {
        id: records[0].id,
        ...records[0].fields,
        isCompleted: records[0].fields.isCompleted || false,
      };

      setTodoList((prev) => [...prev, savedTodo]);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const updateTodo = async (editedTodo) => {
    const originalTodo = todoList.find((t) => t.id === editedTodo.id);

    setTodoList((prev) =>
      prev.map((t) => (t.id === editedTodo.id ? editedTodo : t))
    );
    const payload = {
      records: [
        {
          id: editedTodo.id,
          fields: {
            title: editedTodo.title,
            isCompleted: editedTodo.isCompleted,
          },
        },
      ],
    };

    try {
      const resp = await fetch(url, {
        method: 'PATCH',
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!resp.ok) {
        throw new Error('Failed to update todo');
      }
    } catch (error) {
      setErrorMessage(`${error.message}. Reverting todo...`);
    }

    setTodoList((prev) =>
      prev.map((t) => (t.id === originalTodo.id ? originalTodo : t))
    );
  };

  const completeTodo = async (id) => {
    const originalTodo = todoList.find((t) => t.id === id);
    const updatedTodo = {
      ...originalTodo,
      isCompleted: true,
    };

    const payload = {
      records: [
        {
          id: id,
          fields: {
            title: updatedTodo.title,
            isCompleted: true,
          },
        },
      ],
    };

    setTodoList((prev) =>
      prev.map((todo) => (todo.id === id ? updatedTodo : todo))
    );

    try {
      const resp = await fetch(url, {
        method: 'PATCH',
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!resp.ok) {
        throw new Error('Failed to complete todo');
      }
    } catch (error) {
      console.error(error);
      setErrorMessage(`${error.message}. Reverting todo...`);

      setTodoList((prev) =>
        prev.map((t) => (t.id === originalTodo.id ? originalTodo : t))
      );
    }
  };

  return (
    <div>
      <h1>Stephanie's Todos</h1>
      <TodoForm onAddTodo={addTodo} isSaving={isSaving} />

      <TodoList
        todoList={todoList}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
        isLoading={isLoading}
      />

      {errorMessage && (
        <div>
          <hr />
          <p>{errorMessage}</p>
          <button onClick={() => setErrorMessage('')}>Dismiss</button>
        </div>
      )}
    </div>
  );
}

export default App;
