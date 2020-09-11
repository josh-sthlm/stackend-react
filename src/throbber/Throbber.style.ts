import styled from 'styled-components';

export const ModalThrobberOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 32765;
  background: rgba(0, 0, 0, 0.5);

  ${props => !!props.theme.ModalThrobberOverlay && props.theme.ModalThrobberOverlay(props)};
`;

export const ModalThrobber = styled.div`
  width: 8em;
  height: 8em;
  margin: 20vh auto;
  text-align: center;
  border-radius: 50%;
  /*background-color: #f5f5f5;*/
  background-image: url(${require('./throbber-unbranded.svg')});

  ${props => !!props.theme.ModalThrobber && props.theme.ModalThrobber(props)};
`;

export const LoadingThrobber = styled.div`
  height: 2px;
  width: 100vw;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 800;
  overflow: hidden;
  background-color: #ddd;

  @keyframes loading {
    from {
      left: -200px;
      width: 30%;
    }
    50% {
      width: 30%;
    }
    70% {
      width: 70%;
    }
    80% {
      left: 50%;
    }
    95% {
      left: 120%;
    }
    to {
      left: 100%;
    }
  }

  &:before {
    display: block;
    position: absolute;
    content: '';
    left: -200px;
    width: 200px;
    height: 4px;
    background-color: #2980b9;
    animation: loading 2s linear infinite;
  }
`;
