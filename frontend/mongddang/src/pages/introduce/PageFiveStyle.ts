import styled from "@emotion/styled";

export const Wrap = styled.div`
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


export const SlideImage1 = styled.img`
  width: 12rem;
  height: 12rem;
  margin-bottom: 2rem;
`;
export const SlideImage2 = styled.img`
  width: 12rem;
  height: 12rem;
  margin-bottom: 2rem;
`;

export const SlideTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
`;

export const SlideSubTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
`;

export const SlideDescription = styled.p`
  text-align: center;
  white-space: pre-line;
  color: #666;
`;