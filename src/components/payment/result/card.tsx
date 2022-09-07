import Card from "@component/Card";
import Container from "@component/Container";
import FlexBox from "@component/FlexBox";
import Icon from "@component/icon/Icon";
import Typography, { H3, H6, Paragraph } from "@component/Typography";
import React from "react";
import Stepper from "@component/stepper/Stepper";
import { formatCurrency } from "@utils/formatCurrency";
import { colors } from "utils/themeColors";
import Button from "@component/buttons/Button";
import { useRouter } from "next/router";
import { IconSuccess } from "./style";

const CardResult = ({ payment }) => {
  const router = useRouter();
  const status = payment?.status || "CONFIRMED";

  const stepProps = {
    confirmed: {
      title: "Pedido criado",
      color:
        status === "CONFIRMED" ? colors.success.main : colors.text.secondary,
      icon: status === "CONFIRMED" && (
        <IconSuccess size={"16px"}>check</IconSuccess>
      ),
    },
    pending: {
      title: "Pagamento em análise",
      color: status === "PENDING" ? colors.success.main : colors.text.secondary,
      icon: status === "PENDING" && (
        <IconSuccess size={"16px"}>check</IconSuccess>
      ),
    },
    received: {
      title: "Pagamento aprovado",
      color:
        status === "RECEIVED" ? colors.success.main : colors.text.secondary,
      icon: status === "RECEIVED" && (
        <IconSuccess size={"16px"}>check</IconSuccess>
      ),
    },
  };

  const stepperList = [
    {
      title: (
        <FlexBox flexDirection={"column"}>
          <FlexBox gap={8}>
            <Typography
              fontSize={"16px"}
              fontWeight={600}
              color={stepProps.confirmed.color}
            >
              {stepProps.confirmed.title}
            </Typography>
            {stepProps.confirmed.icon}
          </FlexBox>
          <Typography fontSize={"12px"} color={colors.gray["800"]}>
            Foi criado um pedido com os dados fornecidos
          </Typography>
        </FlexBox>
      ),
      disabled: status === "CONFIRMED" ? false : true,
    },
    {
      title: (
        <FlexBox flexDirection={"column"}>
          <FlexBox gap={8}>
            <Typography
              fontSize={"16px"}
              fontWeight={600}
              color={stepProps.pending.color}
            > 
              {stepProps.pending.title}
            </Typography>
            {stepProps.pending.icon}
          </FlexBox>
          <Typography fontSize={"12px"} color={colors.gray["800"]}>
            Estamos verificando seus dados, isso pode levar um tempo.
          </Typography>
        </FlexBox>
      ),
      disabled: status === "PENDING" ? false : true,
    },
    {
      title: (
        <FlexBox flexDirection={"column"}>
          <FlexBox gap={8}>
            <Typography
              fontSize={"16px"}
              fontWeight={600}
              color={stepProps.received.color}
            >
              {stepProps.received.title}
            </Typography>
            {stepProps.received.icon}
          </FlexBox>
          <Typography fontSize={"12px"} color={colors.gray["800"]}>
            Notificamos o vendedor sobre seu pedido, fique atento.
          </Typography>
        </FlexBox>
      ),
      disabled: status === "RECEIVED" ? false : true,
    },
  ];

  const handleStepChange = () => {};

  return (
    <Container maxWidth={750}>
      <FlexBox justifyContent="space-between" flexWrap={"wrap"}>
        <FlexBox alignItems={"center"} gap={8} marginBottom="12px">
          <H3 textAlign={"center"}>Compra realizada com sucesso</H3>
          <IconSuccess size={"16px"}>check</IconSuccess>
        </FlexBox>
        <Typography fontSize={"16px"} fontWeight={300}>
          Total{" "}
          <span style={{ fontWeight: "700", color: colors.success.main }}>
            {formatCurrency(payment.value)}
          </span>
        </Typography>
      </FlexBox>

      <Card mt={12} p={32}>
        <Typography fontSize={"24px"} fontWeight={600} lineHeight={"150%"}>
          Quase lá, Lucas! criamos seu pedido!
        </Typography>

        <Typography fontSize={"14px"} fontWeight={300} marginBottom="24px">
          Agora vamos passar por esses três procedimentos para notificar o
          vendedor.
        </Typography>

        <FlexBox
          marginBottom={"24px"}
          alignItems={"center"}
          justifyContent="flex-start"
        >
          <FlexBox flexWrap="wrap" width={"424px"}>
            <Stepper
              direction="vertical"
              stepperList={stepperList}
              selectedStep={status === "RECEIVED" ? 3 : 2}
              onChange={handleStepChange}
            />
          </FlexBox>
          <FlexBox
            flexDirection={"column"}
            alignItems={"center"}
            justifyContent={"center"}
            backgroundColor={colors.gray["200"]} 
            borderRadius={"50%"}
            width={"230px"}
            height={"225px"}
          >
            <Icon size="110px" color={"primary"} marginTop={"-24px"}>
              credit-card
            </Icon>
            <Typography textAlign={"center"} opacity={0.7} marginTop={-16}>
              {stepProps[status.toLowerCase()].title}
            </Typography>
          </FlexBox>
        </FlexBox>
        <FlexBox gap={8} marginTop="40px">
          <Button
            variant="contained"
            color="primary.text"
            bg="primary.main"
            px="2rem"
            type="button"
          >
            Ver pedido
          </Button>
          <Button
            variant="contained"
            px="2rem"
            type="button"
            onClick={() => router.back()}
          >
            Voltar
          </Button>
        </FlexBox>
      </Card>
    </Container>
  );
};

export default CardResult;
