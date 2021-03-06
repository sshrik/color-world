import styled from 'styled-components';

interface ContainerProps {
  blendMode: string;
}

export const Container = styled.div<ContainerProps>`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;

  position: relative;

  overflow: hidden;

  & > * {
    background-blend-mode: ${({ blendMode }) => blendMode};
    mix-blend-mode: ${({ blendMode }) => blendMode};
  }
`;

export const Header = styled.h4`
  color: black;
`;

interface CircleProps {
  x: number;
  y: number;
  r: number;
  color: string;
}

export const Circle = styled.div<CircleProps>`
  position: absolute;
  border-radius: 50%;
  width: ${({ r }) => r}px;
  height: ${({ r }) => r}px;
  left: ${({ x, r }) => x - r / 2}px;
  top: ${({ y, r }) => y - r / 2}px;
  background-color: ${({ color }) => color};
`;

export const Button = styled.button`
  width: 200px;
  height: 36px;

  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  right: 24px;
  bottom: 24px;

  background-color: #29bfb8;
  color: white;
  font-size: 20px;

  cursor: pointer;
  border: none;
  border-radius: 4px;

  transition-duration: 0.3s;

  &:hover {
    background-color: #22a09a;
  }
`;
