import Box from "@component/Box";
import IconButton from "@component/buttons/IconButton";
import Card from "@component/Card";
import React from "react";
import { colors } from "utils/themeColors";

interface ResultProps {
  height?: string;
  width?: string;
  padding?: string;
  message?: string;
  buttons?: any;
  type?: string;
}

const Result: React.FC<ResultProps> = ({
  height = 300,
  width = "100%",
  padding = "6px 32px",
  message = "teste",
  type = "success",
}) => {
  const options = {
    success: (
      <>
        <IconButton bg={colors.success.main} p="16px">
          <img
            width="100%"
            src={`/assets/images/icons/check.svg`}
            alt={"success"}
          />
        </IconButton>
        <h1>Sucesso!</h1>
        <p>{message}</p>
      </>
    ),
    error: (
      <>
        <IconButton bg={colors.error.main} p="16px">
          <img
            width="100%"
            src={`/assets/images/icons/close.svg`}
            alt={"error"}
          />
        </IconButton>
        <h1>Desculpe, houve um erro!</h1>
        <p>{message}</p>
      </>
    ),
    warning: (
      <>
        <IconButton
          bg={colors.warn.main}
          style={{ fontSize: "36px", width: 60 }}
        >
          !
        </IconButton>
        <h1>
          Cuidado, existe alguns problemas <br />
          com sua operação!
        </h1>
        <p>{message}</p>
      </>
    ),
    empty: (
      <>
        <IconButton bg={colors.gray[300]} p="16px">
          <img
            width="100%"
            src={`/assets/images/icons/box.svg`}
            alt={"error"}
          />
        </IconButton>
        <h1>Não há dados</h1>
      </>
    ),
  };

  return (
    <Card
      height={height}
      padding={padding}
      width={width}
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <Box
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        flexDirection={"column"}
        textAlign={"center"}
      >
        {options[type]}
      </Box>
    </Card>
  );
};

export default Result;
