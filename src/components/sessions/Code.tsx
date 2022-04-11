import Box from "@component/Box";
import IconButton from "@component/buttons/IconButton";
import CountDown from "@component/CountDown";
import Icon from "@component/icon/Icon";
import { H3, H5 } from "@component/Typography";
import { useAppDispatch } from "@hook/hooks";
import { useRouter } from "next/router"; 
import React, { useState } from "react";
import ReactCodeInput from "react-verification-code-input";
import { api } from "services/api";
import { userSignIn } from "store/actions/user/actions";
import Button from "../buttons/Button";
import { StyledSessionCard } from "./SessionStyle";

const Signup: React.FC = () => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [finish, setFinish] = useState(true);
  const dispatch = useAppDispatch();

  const onComplete = async (activationCode) => {
    setLoading(true);
    try {
      const { data } = await api.patch(`auth/active-user/${router.query.id}`, {
        activationCode,
      }); 
      dispatch(userSignIn(data));
      router.push("/");
    } catch (error) {
      setMessage(error?.response?.data?.message || "Erro inesperado!");
    }
    setLoading(false);
  };

  const resend = async () => {
    setLoading(true);
    try {
      await api.post("auth/recover-password", {email: router.query.email}); 
      setFinish(true);
    } catch (error) { 
    }
    setLoading(false);
  };

  const toBack = () => {
    router.back();
  };

  return (
    <StyledSessionCard
      mx="auto"
      my="2rem"
      boxShadow="large"
      padding="24px 48px 8px 48px"
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
          Por favor entre com os 4 digitos enviado em seu <br /> <b>e-mail</b>
        </H5>
        <ReactCodeInput onComplete={onComplete} loading={loading} fields={4} />

        {finish ? (
          <CountDown
            onFinish={() => {
              setFinish(false);
            }}
            seconds={10}
          >
            Renviar código em
          </CountDown>
        ) : null}
        <Button
          variant="contained"
          color="primary"
          type="submit"
          width={350}
          disabled={finish}
          loading={loading}
          style={{ marginTop: 16 }}
        >
          Enviar novamente
        </Button>
        <H5
          fontWeight="600"
          fontSize="12px"
          color="red"
          textAlign="center"
          mb="2.25rem"
        >
          {message}
        </H5>
      </Box>
    </StyledSessionCard>
  );
};
export default Signup;
