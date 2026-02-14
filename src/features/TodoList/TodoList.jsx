{
  /*extract from TodoList.jsx*/
}

import TodoListItem from './TodoListItem';

function TodoList({ todoList, onCompleteTodo, onUpdateTodo, isLoading }) {
  if (isLoading) {
    return <p>Todo list loading...</p>;
  }

  if (todoList.length === 0) {
    return <p>No todos yet. </p>;
  }

  const filteredTodoList = todoList.filter((todo) => !todo.isCompleted);

  return (
    <div>
      {filteredTodoList.length === 0 ? (
        <p> Add todo above to get started </p>
      ) : (
        <ul>
          {filteredTodoList.map((todo) => (
            <TodoListItem
              key={todo.id}
              todo={todo}
              onCompleteTodo={onCompleteTodo}
              onUpdateTodo={onUpdateTodo}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

export default TodoList;
