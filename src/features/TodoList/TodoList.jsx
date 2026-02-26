import TodoListItem from './TodoListItem';
import styles from './TodoList.module.css';

function TodoList({ todoList, onCompleteTodo, onUpdateTodo }) {
  // Safety check if todoList is undefined at first render
  if (!todoList) return null;

  const filteredTodoList = todoList.filter((todo) => !todo.isCompleted);

  return (
    <div className={styles.container}>
      {filteredTodoList.length === 0 ? (
        <p className={styles.emptyMessage}>Add todo above to get started</p>
      ) : (
        <ul className={styles.list}>
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
