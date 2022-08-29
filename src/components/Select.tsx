import React, { InputHTMLAttributes } from "react";
import ReactSelect, { StylesConfig } from "react-select";
import { SpaceProps } from "styled-system";
import { colors } from "../utils/themeColors";
import Box from "./Box";
import Typography from "./Typography";
import chroma from "chroma-js";

type SelectOption = {
  label: any;
  value: any;
};

export interface ColourOption {
  readonly value: string;
  readonly label: string;
  readonly color: string;
  readonly isFixed?: boolean;
  readonly isDisabled?: boolean;
}

interface SelectProps
  extends InputHTMLAttributes<HTMLInputElement>,
    SpaceProps {
  options: SelectOption[] | ColourOption[];
  value?: any;
  defaultValue?: any;
  label?: string;
  errorText?: any;
  isMulti?: any;
  closeMenuOnSelect?: any;
  styles?: any;
}

export const colourOptions: ColourOption[] = [
  { value: "black", label: "Preto", color: "black" },
  { value: "white", label: "Branco", color: "white" },
  { value: "blue", label: "Azul", color: "#0052CC" },
  { value: "red", label: "Vermelho", color: "#FF5630", isFixed: true },
  { value: "purple", label: "Roxo", color: "#5243AA" },
  { value: "orange", label: "Laranja", color: "#FF8B00" },
  { value: "yellow", label: "Amarelo", color: "#FFC400" },
  { value: "green", label: "Verde", color: "#36B37E" },
  { value: "silver", label: "Prata", color: "#666666" },
  { value: "ocean", label: "Oceano", color: "#00B8D9", isFixed: true },
  { value: "forest", label: "Floresta", color: "#00875A" },
  { value: "slate", label: "Ardósia", color: "#253858" },
]; 

const Select: React.FC<SelectProps> = ({
  options,
  id,
  label,
  errorText,
  ...props
}) => {
  // extract spacing props
  let spacingProps = {};
  for (const key in props) {
    if (key.startsWith("m") || key.startsWith("p"))
      spacingProps[key] = props[key];
  }

  return (
    <Box {...spacingProps}>
      {label && (
        <Typography fontSize="0.875rem" mb="6px">
          {label}
        </Typography>
      )}
      <ReactSelect
        // label="Single Select"
        // placeholder="Single Select"
        // defaultValue={options[0]}
        // isLoading={isLoading}
        // isClearable={true}
        // isRtl={isRtl}
        // isSearchable={isSearchable}
        // menuIsOpen={true}
        // name="color"
        options={options}
        isDisabled={props.disabled || false}
        styles={customStyles}
        theme={(theme) => ({
          ...theme,
          colors: {
            ...theme.colors,
            primary50: colors.gray[100],
            primary: colors.primary.main,
            neutral20: colors.text.disabled,
          },
        })}
        {...props}
      />
      {errorText && (
        <Typography color="error.main" ml="0.25rem" mt="0.25rem" as="small">
          {errorText}
        </Typography>
      )}
    </Box>
  );
};

const customStyles = {
  input: (styles) => ({ ...styles, height: 30 }),
  option: (provided, state) => ({
    ...provided,
    color: "inherit",
    backgroundColor: state.isFocused ? "rgba(0,0,0, 0.015)" : "inherit",
    cursor: "pointer",
  }),
};

export default Select;
