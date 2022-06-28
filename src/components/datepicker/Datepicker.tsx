import FlexBox from "@component/FlexBox";
import { Label } from "@component/masked-input/MaskedInputStyle";
import { InputHTMLAttributes } from "react";
import { SpaceProps } from "styled-system";
import StyledDatepicker from "./DatepickerStyle";

export interface DatePickerProps {
  selected: any;
  format: any;
  label: string;
  date: any;
}

const DatePicker: React.FC<
  InputHTMLAttributes<HTMLInputElement> & DatePickerProps & SpaceProps
> = ({ ...props }) => {

  return (
    <FlexBox flexDirection={'column'}>
      <Label>
        {props.label}
        
        </Label>
      <StyledDatepicker {...props} />
    </FlexBox>
  );
};


export default DatePicker;
