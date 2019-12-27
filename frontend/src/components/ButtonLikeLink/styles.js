import styled from 'styled-components';

export const CustomButtonLikeLink = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  text-decoration: underline;
  display: inline;
  margin: 0;
  padding: 0;
  color: ${props => props.color};
  text-decoration: none;
`;
