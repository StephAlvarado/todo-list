//import './App.css';
import { useState } from 'react';
import TodoForm from './TodoForm';
import TodoList from './TodoList';

function App() {
  const [todoList, setTodoList] = useState([]);

  function addTodo(title) {
    console.log('addTodo called with:', title);

    const newTodo = {
      title: title,
      id: Date.now(),
    };

    setTodoList([...todoList, newTodo]);
  }

  return (
    <div>
      <h1>Stephanie's Todos</h1>
      <TodoForm onAddTodo={addTodo} />

      <TodoList todoList={todoList} />
    </div>
  );
}

export default App;
