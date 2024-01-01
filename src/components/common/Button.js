import styled from 'styled-components';

const Button = ({ text, onClick, className }) => (
  <Wrap className={className} onClick={onClick}>
    {text}
  </Wrap>
);

export default Button;

const Wrap = styled.button`
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 16px;
  background-color: #ffb756;
  transition: background-color 0.3s ease;
  color: #fff;
  margin-top: 8px;
  cursor: pointer;

  &:hover {
    background-color: #f59b21;
  }
`;
