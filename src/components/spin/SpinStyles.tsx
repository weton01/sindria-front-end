import styled from "styled-components";
import { string } from "yup/lib/locale";



export const StyledSpin = styled.div`
  position: relative;
  
`;

interface StyledSpinProps {
  size?: string;
};

export const SpinnerStyle = styled.div<StyledSpinProps>`
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    opacity: 0.3;
    z-index: 5;
    background: #000;
    .spin{
        display: inline-block;
        width: ${props => props.size || "85px"};
        height: ${props => props.size || "85px"};
        border: 3px solid rgba(255, 255, 255, 0.6);
        border-radius: 50%;
        border-top-color: #636767;
        animation: spin 1s ease-in-out infinite;
        -webkit-animation: spin 1s ease-in-out infinite;
        @keyframes spin {
            to {
            -webkit-transform: rotate(360deg);
            }
        }
        @-webkit-keyframes spin {
            to {
            -webkit-transform: rotate(360deg);
            }
        }
    }
   
`;