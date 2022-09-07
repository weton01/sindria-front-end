import Icon from "@component/icon/Icon";
import styled from "styled-components";
import { colors } from "utils/themeColors";

export const IconSuccess = styled(Icon)`
color: ${colors.success.main};
background: transparent;
border: 2px solid ${colors.success.main};
border-radius: 50%;
padding: 2px;
height: 30px;
width: 30px;
`;
 
