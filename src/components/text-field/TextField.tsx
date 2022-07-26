import FlexBox from "@component/FlexBox";
import Typography from "@component/Typography";
import { formatReal, formatNumber } from "@utils/fortMoney";
import { cloneElement, InputHTMLAttributes, useEffect, useState } from "react";
import { SpaceProps } from "styled-system";
import { colorOptions } from "../../interfaces";
import Box from "../Box";
import { SyledTextField, TextFieldWrapper } from "./TextFieldStyle";

export enum MaskInput {
  "money",
  "text",
  "percentage",
  "number",
}

export interface TextFieldProps {
  labelColor?: colorOptions;
  label?: string;
  errorText?: any;
  id?: any;
  fullwidth?: boolean;
  endAdornment?: any;
  mask?: MaskInput;
  value?: any;
  addonAfter?: any;
  addonBefore?: any;
  fontSize?: number | string;
}

const TextField: React.FC<
  InputHTMLAttributes<HTMLInputElement> & TextFieldProps & SpaceProps
> = ({ id, label, errorText, labelColor, endAdornment, ...props }) => {
  const [textId, setTextId] = useState(id);
  const [value, setValue] = useState("");

  // extract spacing props
  let spacingProps = {};
  for (const key in props) {
    if (key.startsWith("m") || key.startsWith("p"))
      spacingProps[key] = props[key];
  }

  const handleChange = (e) => {
    setValue(e.target.value);

    if (props.mask === MaskInput.money) {
      e.target.value = parseFloat(
        formatReal(e.target.value.replace(/\./g, "").replace(/\,/g, "."))
          .replace(/\./g, "")
          .replace(/\,/g, ".")
      );

      e.currentTarget.value = parseFloat(
        formatReal(e.currentTarget.value.replace(/\./g, "").replace(/\,/g, "."))
          .replace(/\./g, "")
          .replace(/\,/g, ".")
      );
    }

    props.onChange(e);
  };

  const getValue = (value) => {
    switch (props.mask) {
      case MaskInput.money:
        return formatReal(value);
      case MaskInput.number:
        return formatNumber(value);
      default:
        return value;
    }
  };

  useEffect(() => {
    if (!id) setTextId(Math.random());

    setValue(props.value);
  }, []);

  useEffect(() => {
    setValue(props.value);
  }, [props.value]);

  return (
    <TextFieldWrapper
      color={labelColor && `${labelColor}.main`}
      fullwidth={props.fullwidth}
      {...spacingProps}
    >
      {label && <label htmlFor={textId}>{label}</label>}
      <Box position="relative">
        <FlexBox>
          {props.addonBefore ? (
            <FlexBox
              minWidth="40px"
              justifyContent="center"
              alignItems="center"
              backgroundColor="#ebedf0"
              border="1px solid #DAE1E7"
              borderRight="none"
            >
              <Typography fontSize="16px">{props.addonBefore}</Typography>
            </FlexBox>
          ) : null}
          <SyledTextField
            id={textId}
            {...props}
            onChange={handleChange}
            value={getValue(value)}
            
          />
          {props.addonAfter ? (
            <FlexBox
              minWidth="40px"
              justifyContent="center"
              alignItems="center"
              backgroundColor="#ebedf0"
              border="1px solid #DAE1E7" 
              borderLeft="none"
            >
              <Typography fontSize="16px">{props.addonAfter}</Typography>
            </FlexBox>
          ) : null}
        </FlexBox>
        {endAdornment &&
          cloneElement(endAdornment, {
            className: `end-adornment ${endAdornment.className}`,
          })}
      </Box>
      {errorText && <small>{errorText}</small>}
    </TextFieldWrapper>
  );
};

TextField.defaultProps = {
  color: "default",
  mask: MaskInput.text,
};

export default TextField;
