import { useState } from 'react';
import TextInputWithLabel from '../../shared/TextInputWithLabel';
import styles from './TodoListItem.module.css';

function TodoListItem({ todo, onCompleteTodo, onUpdateTodo }) {
  const [isEditing, setIsEditing] = useState(false);
  const [workingTodoTitle, setWorkingTodoTitle] = useState(todo.title);

  function handleEdit(event) {
    setWorkingTodoTitle(event.target.value);
  }

  function handleCancel() {
    setWorkingTodoTitle(todo.title);
    setIsEditing(false);
  }

  function handleUpdate(event) {
    event.preventDefault();
    onUpdateTodo({
      ...todo,
      title: workingTodoTitle,
    });
    setIsEditing(false);
  }

  return (
    <li className={styles.item}>
      <form onSubmit={handleUpdate}>
        {isEditing ? (
          <>
            <TextInputWithLabel
              elementId={`edit-todo-${todo.id}`}
              label="Edit Todo"
              value={workingTodoTitle}
              onChange={handleEdit}
            />
            <button type="button" onClick={handleCancel}>
              Cancel
            </button>
            <button type="submit">Update</button>
          </>
        ) : (
          <>
            <label>
              <input
                type="checkbox"
                checked={todo.isCompleted}
                onChange={() => onCompleteTodo(todo.id)}
              />
            </label>
            <span onClick={() => setIsEditing(true)}>{todo.title}</span>
          </>
        )}
      </form>
    </li>
  );
}

export default TodoListItem;
