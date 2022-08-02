import { themeGet } from "@styled-system/theme-get";
import styled from "styled-components";
import { color, ColorProps, space, SpaceProps } from "styled-system";
 
export interface MenuItemInterface {
  width?: string; 
} 

const MenuItem = styled.div<ColorProps & SpaceProps & MenuItemInterface>`
  padding: 0.5rem 1rem;
  cursor: pointer; 
  color: ${themeGet("colors.text.secondary")};   
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
  width: ${({width}) => width };
  display: ${({width}) => width !== "auto"? "block": "flex" };

  &:hover {
    color: ${themeGet("colors.primary.main")};
    background-color: ${themeGet("colors.gray.100")};
  }
  ${color}
  ${space}
`;

MenuItem.defaultProps = {
  width: "auto"
};

export default MenuItem;

