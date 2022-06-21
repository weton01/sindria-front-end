import FlexBox from "@component/FlexBox";
import { InputHTMLAttributes, useEffect, useState } from "react";
import { SpaceProps } from "styled-system";
import Box from "../Box";

export interface ColorFieldProps {
  label?: string;
  errorColor?: any;
  value?: any;
}

const ColorField: React.FC<
  InputHTMLAttributes<HTMLInputElement> & ColorFieldProps & SpaceProps
> = ({ id, label, errorColor, ...props }) => {
  const [value, setValue] = useState("");

  useEffect(() => {
    setValue(props.value);
  }, [props.value]);

  const handleChange = (e) => {
    setValue(e.target.value);
    props.onChange(e);
  };

  return (
    <>
      {label && <label>{label}</label>}
      <Box position="relative">
        <FlexBox>
          <input type="color" value={value} onChange={handleChange} />
        </FlexBox>
      </Box>
      {errorColor && <small>{errorColor}</small>}
    </>
  );
};

ColorField.defaultProps = {
  color: "default",
};

export default ColorField;
