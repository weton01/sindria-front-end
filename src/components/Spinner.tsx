import systemCss from "@styled-system/css";
import styled, { css, keyframes } from "styled-components";

const rotate = keyframes`
  0% {transform: rotate(0deg);}
  100% {transform: rotate(360deg);}
`;

const Spinner = styled.div(
  systemCss({
    width: 24,
    height: 24,
    border: "4px solid",
    borderColor: "primary",
    borderTop: `13px solid white`,
    borderRadius: "50%",
    transitionProperty: "transform",
  }),
  css`
    animation: ${rotate} 1.2s infinite linear;
  `
);

export default Spinner;
