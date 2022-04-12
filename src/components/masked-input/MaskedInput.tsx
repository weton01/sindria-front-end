import React from "react";
import { colorOptions } from "../../interfaces";
import { InputMask, TextFieldWrapper, Label } from "./MaskedInputStyle";

export interface Props {
  name: string;
  value: string;
  mask: string;
  labelColor?: colorOptions;
  label?: string;
  errorText?: any;
  id?: any;
  fullwidth?: boolean;
  endAdornment?: any;
  onBlur?: any;
  onChange?: any;
  onFocus?: any;
}

const MaskedInputCustom: React.FC<Props> = (props) => {
  return (
    <TextFieldWrapper>
      <Label>{props?.label}</Label>
      <InputMask {...props} />
      {props.errorText && <small>{props.errorText}</small>}
    </TextFieldWrapper>
  );
};
export default MaskedInputCustom;
