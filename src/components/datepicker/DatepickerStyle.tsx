import styled from "styled-components";
import {
  BorderProps,
  ColorProps,
  SpaceProps,
} from "styled-system";
import { DatePickerProps } from "./Datepicker";
import DatePickerr from "react-datepicker";


const StyledDatepicker = styled(DatePickerr) <
  DatePickerProps & BorderProps & ColorProps & SpaceProps
  >`
  padding: 8px 12px;
  height: 40px;
  font-size: inherit;
  color: #2B3445;
  border-radius: 5px;
  border: 1px solid;
  border-color: #DAE1E7;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  width: 100%;
  outline: none;
  font-family: inherit;
`;

export default StyledDatepicker;
