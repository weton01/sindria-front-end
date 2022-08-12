import React, { ChangeEvent, InputHTMLAttributes, useState } from "react";
import { SpaceProps } from "styled-system";
import Box from "../Box";
import { ReactDatePickerProps, registerLocale } from "react-datepicker";
import ptBr from 'date-fns/locale/pt-BR';
registerLocale('pt-BR', ptBr)

import "react-datepicker/dist/react-datepicker.css";
import { DatePickerWrapper, SyledDatePicker } from "./DatePickerStyle";
import { TextFieldProps } from "@component/text-field/TextField";

interface DatePickerProps {
  id: string; 
  onCustomChange: any
}

const DatePicker: React.FC<InputHTMLAttributes<HTMLInputElement> & TextFieldProps & SpaceProps & DatePickerProps> = ({
  id,
  label,
  errorText,
  onCustomChange,
  ...props
}) => {
  const [myValue, setMyValue] = useState(new Date())
  const [textId, setTextId] = useState(id);
  const [formated, setFormated] = useState(`${myValue.getFullYear()}-${myValue.getUTCMonth() + 1}-${myValue.getDate()}`)
  // extract spacing props
  let spacingProps = {};

  for (const key in props) {
    if (key.startsWith("m") || key.startsWith("p"))
      spacingProps[key] = props[key];
  }

  const localChange = (e: any) => {
    const date = new Date(e)
    setMyValue(date);
    setFormated(`${date.getFullYear()}-${date.getUTCMonth() + 1}-${date.getDate()}`)

    e = `${date.getFullYear()}-${date.getUTCMonth() + 1}-${date.getDate()}`

    onCustomChange('meta.birthDate', date.toISOString())
  }

  return (
    <DatePickerWrapper
      fullwidth={props.fullwidth}
      {...spacingProps}
    >
      {label && <label htmlFor={textId}>{label}</label>}
      <Box position="relative">

        <SyledDatePicker
          locale={"pt-BR"}
          onChange={localChange}
          value={formated}
        />
      </Box>
      {errorText && <small>{errorText}</small>}
    </DatePickerWrapper>
  );
};


export default DatePicker;
