import styled from "@emotion/styled";

export const Container = styled.div`
  position: relative;
  height: 100vh;
  width: 100vw;
  overflow: hidden
`;

export const SlideContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  &::-webkit-scrollbar {
    display: none;
  }
  scrollbar-width: none;
`;

export const Slide = styled.div`
  flex: 0 0 100%;
  width: 100vw;
  height: 100vh;
  scroll-snap-align: start;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

export const Navigation = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 2rem;
  background: linear-gradient(to top, white 60%, transparent);
  padding-top: 2rem;
`;

export const Indicators = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

interface DotProps {
  active: boolean;
}

export const Dot = styled.button<DotProps>`
  width: ${props => props.active ? '1rem' : '0.5rem'};
  height: 0.5rem;
  border-radius: 9999px;
  background-color: ${props => props.active ? '#7C3AED' : '#D1D5DB'};
  transition: all 0.2s ease-in-out;
  border: none;
  padding: 0;
  cursor: pointer;
`;

export const StartButton = styled.button`
  background-color: #7C3AED;
  color: white;
  padding: 0.75rem 2rem;
  border-radius: 9999px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: #6D28D9;
  }
`;