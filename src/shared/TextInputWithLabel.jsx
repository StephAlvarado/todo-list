import styled from 'styled-components';

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-bottom: 10px;
`;

const StyledLabel = styled.label`
  font-weight: bold;
`;

const StyledInput = styled.input`
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #ccc;
`;

function TextInputWithLabel({ elementId, label, onChange, value, ref }) {
  return (
    <StyledContainer>
      <StyledLabel htmlFor={elementId}>{label}</StyledLabel>
      <StyledInput
        id={elementId}
        ref={ref}
        value={value}
        onChange={onChange}
        type="text"
      />
    </StyledContainer>
  );
}

export default TextInputWithLabel;
