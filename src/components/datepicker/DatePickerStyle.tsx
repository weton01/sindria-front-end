import Datepicker from "react-datepicker";
import systemCss from "@styled-system/css";
import styled from "styled-components";
import { color, compose, space } from "styled-system";
import { convertHexToRGB } from "../../utils/utils"; 

export const SyledDatePicker = styled(Datepicker)<any>(
  (props) =>
    systemCss({
      padding: "8px 12px",
      height: props.height ? props.height : '40px',
      fontSize: props.fontSize ? props.fontSize : "inherit",
      color: "body.text",
      borderRadius: 5,
      border: "1px solid",
      borderColor: "text.disabled",
      borderTopLeftRadius: props.addonBefore ? 0 : 5,
      borderBottomLeftRadius: props.addonBefore ? 0 : 5,
      borderTopRightRadius: props.addonAfter ? 0 : 5,
      borderBottomRightRadius: props.addonAfter ? 0 : 5,
      width: props.fullwidth ? "100%" : "inherit",
      outline: "none",
      fontFamily: "inherit",

      "&:hover": {
        borderColor: "gray.500",
      },
      "&:focus": {
        outlineColor: "primary.main",
        borderColor: "primary.main",
        boxShadow: `1px 1px 8px 4px rgba(${convertHexToRGB(
          props.theme.colors.primary.light
        )}, 0.1)`,
      },
    }),
  compose(color)
);

export const DatePickerWrapper = styled.div<any>(
  (props) =>
    systemCss({
      position: "relative",
      width: props.fullwidth ? "100%" : "inherit",

      label: {
        display: "block",
        marginBottom: "6px",
        fontSize: "0.875rem",
      },

      small: {
        display: "block",
        color: "error.main",
        marginTop: "0.25rem",
        marginLeft: "0.25rem",
      },

      ".end-adornment": {
        position: "absolute",
        top: "50%",
        transform: "translateY(-50%)",
        right: "0.25rem",
      },
    }),
  compose(color, space)
);
