import styled, { keyframes } from 'styled-components';
import colors from '~/styles/colors';

export const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

export const CustomLoading = styled.div`
  border-radius: 100%;
  border: 5px solid #dedede;
  border-left-color: ${colors.primary};
  /* border-left-color: #487bff; */
  height: 50px;
  width: 50px;
  animation: ${rotate} 2s linear infinite;
`;

export const Message = styled.p`
  margin-top: 8px;
  color: ${colors.primary};
  font-weight: bold;
  font-size: 16px;
`;
