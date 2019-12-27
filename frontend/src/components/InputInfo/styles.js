import styled from 'styled-components';
import colors from '~/styles/colors';

export const CustomInput = styled.input.attrs({
  disabled: true,
})`
  background-color: #f5f5f5 !important;
  border: 1px solid ${colors.border};
  border-radius: 4px;
  height: 40px;
  padding: 0 15px;
  color: ${colors.input};
  margin: 0 0 10px;
  width: 100%;
`;
