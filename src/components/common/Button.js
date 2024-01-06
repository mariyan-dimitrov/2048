import styled from 'styled-components';
import generalStyles from '../../_constants/generalStyles';

const Button = ({ text, onClick, className }) => (
  <Wrap className={className} onClick={onClick}>
    {text}
  </Wrap>
);

export default Button;

const Wrap = styled.button`
  border: none;
  padding: ${generalStyles.spacing_8} ${generalStyles.spacing_16};
  border-radius: ${generalStyles.border_radius};
  font-size: 16px;
  background-color: ${({ theme }) => theme.btn_button};
  transition: background-color 0.3s ease;
  color: ${({ theme }) => theme.text_color};
  margin-top: ${generalStyles.spacing_8};
  cursor: pointer;

  &:hover {
    background-color: ${({ btn_hover_button }) => btn_hover_button};
  }
`;
