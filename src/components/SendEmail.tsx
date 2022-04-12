import Box from "@component/Box";
import IconButton from "@component/buttons/IconButton";
import Icon from "@component/icon/Icon";
import { H3, H5 } from "@component/Typography";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { StyledSessionCard } from "components/sessions/SessionStyle";
import Button from "components/buttons/Button";
import CountDown from "./CountDown";
import { api } from "services/api";

const SendEmail: React.FC = () => {
  const router = useRouter();
  const [finish, setFinish] = useState(true);
  const [loading, setLoading] = useState(false);

  const toBack = () => {
    router.back();
  }; 

  const resend = async () => {
    setLoading(true);
    try {
      await api.post("auth/v1/recover-password", {email: router.query.email}); 
      setFinish(true);
    } catch (error) { 
    }
    setLoading(false);
  };

  return (
    <StyledSessionCard
      mx="auto"
      my="2rem"
      boxShadow="large"
      padding="24px 48px 48px 48px"
    >
      <IconButton
        bg="gray.200"
        p="8px"
        style={{ position: "absolute", margin: "0px 0px 0px -25px" }}
        onClick={toBack}
      >
        <Icon size="24px" defaultcolor="auto">
          arrow-left
        </Icon>
      </IconButton>
      <Box
        display="flex"
        justifyContent={"center"}
        flexDirection={"column"}
        alignItems="center"
        gap={8}
        style={{ marginTop: 62 }}
      >
        <IconButton bg="gray.200" p="24px">
          <Icon size="32px" defaultcolor="auto">
            telegram
          </Icon>
        </IconButton>

        <H3 textAlign="center" mb="0.5rem">
          Verifique em seu email
        </H3>
        <H5
          fontWeight="600"
          fontSize="12px"
          color="gray.800"
          textAlign="center"
          mb="2.25rem"
        >
          Por favor, verifique em sua caixa de entra <br /> ou em seu spam.
        </H5>
        {finish? 
        <CountDown
          onFinish={() => {
            setFinish(false);
          }} 
        >
          Renviar código em
        </CountDown>
        : null}
        <Button
          mb="1.65rem"
          variant="contained"
          color="primary"
          disabled={finish}
          loading={loading}
          onClick={resend}
        >
          Reenviar
        </Button>
      </Box>
    </StyledSessionCard>
  );
};
export default SendEmail;
