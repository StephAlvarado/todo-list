import { useState, useEffect } from 'react';
import styled from 'styled-components';

/* Styled Components */
const StyledForm = styled.form`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const StyledInput = styled.input`
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #ccc;
  margin-right: 10px;
`;

const StyledButton = styled.button`
  padding: 6px 12px;
  border-radius: 6px;
  border: none;
  background-color: #4a90e2;
  color: white;
  cursor: pointer;
  transition: 0.2s ease;

  &:hover {
    background-color: #357bd8;
  }
`;

const StyledLabel = styled.label`
  margin-right: 5px;
`;

const StyledSelect = styled.select`
  padding: 6px;
  border-radius: 6px;
  border: 1px solid #ccc;
  margin-right: 10px;
`;

function TodosViewForm({
  sortField,
  setSortField,
  sortDirection,
  setSortDirection,
  queryString,
  setQueryString,
}) {
  const [localQueryString, setLocalQueryString] = useState(queryString);

  useEffect(() => {
    const debounce = setTimeout(() => setQueryString(localQueryString), 500);
    return () => clearTimeout(debounce);
  }, [localQueryString, setQueryString]);

  const preventRefresh = (e) => e.preventDefault();

  return (
    <StyledForm onSubmit={preventRefresh}>
      {/* Search Field */}
      <div>
        <StyledLabel htmlFor="search">Search todos:</StyledLabel>
        <StyledInput
          id="search"
          type="text"
          value={localQueryString}
          onChange={(e) => setLocalQueryString(e.target.value)}
          placeholder="Type to search..."
        />
        <StyledButton type="button" onClick={() => setLocalQueryString('')}>
          Clear
        </StyledButton>
      </div>

      {/* Sort Controls */}
      <div>
        <StyledLabel htmlFor="sortField">Sort by:</StyledLabel>
        <StyledSelect
          id="sortField"
          value={sortField}
          onChange={(e) => setSortField(e.target.value)}
        >
          <option value="title">Title</option>
          <option value="createdTime">Time added</option>
        </StyledSelect>

        <StyledLabel htmlFor="sortDirection">Direction:</StyledLabel>
        <StyledSelect
          id="sortDirection"
          value={sortDirection}
          onChange={(e) => setSortDirection(e.target.value)}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </StyledSelect>
      </div>
    </StyledForm>
  );
}

export default TodosViewForm;
