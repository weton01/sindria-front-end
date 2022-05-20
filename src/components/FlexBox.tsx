import styled from "styled-components";
import {
  border,
  BorderProps,
  color,
  ColorProps,
  flexbox,
  FlexboxProps,
  layout,
  LayoutProps,
  space,
  SpaceProps,
} from "styled-system";
import Box from "./Box";

interface FlexTypes {
  gap?: string | number
}

const FlexBox = styled(Box)<
  FlexboxProps & LayoutProps & SpaceProps & ColorProps & BorderProps & FlexTypes
>`
  display: flex;
  flex-direction: row;
  gap: ${props => props.gap};
 
  ${layout}
  ${color}
  ${flexbox}
  ${space}
  ${border}
`;

export default FlexBox;
