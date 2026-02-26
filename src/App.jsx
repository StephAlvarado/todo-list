import { useState, useEffect, useCallback } from 'react';
import TodoForm from './features/TodoForm';
import TodoList from './features/TodoList/TodoList';
import TodosViewForm from './features/TodosViewForm';
import styles from './App.module.css';
import './App.css';

const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;

function App() {
  const [todoList, setTodoList] = useState([]);
  const [sortField, setSortField] = useState('createdTime');
  const [sortDirection, setSortDirection] = useState('desc');
  const [queryString, setQueryString] = useState('');

  const encodeUrl = useCallback(() => {
    let sortQuery = `sort[0][field]=${sortField}&sort[0][direction]=${sortDirection}`;

    let searchQuery = '';

    if (queryString) {
      searchQuery = `&filterByFormula=SEARCH("${queryString}", {title})`;
    }

    return encodeURI(`${url}?${sortQuery}${searchQuery}`);
  }, [sortField, sortDirection, queryString]);

  useEffect(() => {
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
        setTodoList(formattedTodos);
      })
      .catch((error) => console.error(error));
  }, [encodeUrl]);

  function addTodo(title) {
    const newRecord = {
      fields: {
        title: title,
        isCompleted: false,
      },
    };

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${import.meta.env.VITE_PAT}`,
      },
      body: JSON.stringify({ records: [newRecord] }),
    })
      .then((res) => res.json())
      .then((data) => {
        const createdTodo = data.records[0];
        setTodoList((prev) => [
          ...prev,
          { id: createdTodo.id, ...createdTodo.fields },
        ]);
      })
      .catch((err) => console.error('Error adding todo:', err));
  }

  function completeTodo(id) {
    fetch(`${url}/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${import.meta.env.VITE_PAT}`,
      },
      body: JSON.stringify({
        fields: { isCompleted: true },
      }),
    })
      .then((res) => res.json())
      .then((updatedRecord) => {
        setTodoList((prev) =>
          prev.map((t) =>
            t.id === id
              ? { ...t, isCompleted: updatedRecord.fields.isCompleted }
              : t
          )
        );
      })
      .catch((err) => console.error('Error completing todo:', err));
  }

  function updateTodo(editedTodo) {
    fetch(`${url}/${editedTodo.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${import.meta.env.VITE_PAT}`,
      },
      body: JSON.stringify({
        fields: { title: editedTodo.title },
      }),
    })
      .then((res) => res.json())
      .then((updatedRecord) => {
        setTodoList((prev) =>
          prev.map((t) =>
            t.id === editedTodo.id ? { ...t, ...updatedRecord.fields } : t
          )
        );
      })
      .catch((err) => console.error('Error updating todo:', err));
  }

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

        <TodoForm onAddTodo={addTodo} />

        <TodoList
          todoList={todoList}
          onCompleteTodo={completeTodo}
          onUpdateTodo={updateTodo}
        />

        <TodosViewForm
          sortField={sortField}
          setSortField={setSortField}
          sortDirection={sortDirection}
          setSortDirection={setSortDirection}
          queryString={queryString}
          setQueryString={setQueryString}
        />
      </div>
    </div>
  );
}

export default App;
