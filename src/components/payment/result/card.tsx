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

const CardResult = ({ payment }) => {
  const router = useRouter();

  const stepperList = [
    {
      title: (
        <FlexBox flexDirection={"column"}>
          <Typography fontSize={"16px"} fontWeight={600}>
            Pedido criado
          </Typography>
          <Typography fontSize={"12px"}>
            Foi criado um pedido com os dados fornecidos
          </Typography>
        </FlexBox>
      ),
    },
    {
      title: (
        <FlexBox flexDirection={"column"}>
          <Typography fontSize={"16px"} fontWeight={600}>
            Pagamento em análise
          </Typography>
          <Typography fontSize={"12px"}>
            Estamos verificando seus dados, isso pode levar um tempo.
          </Typography>
        </FlexBox>
      ),
    },
    {
      title: (
        <FlexBox flexDirection={"column"}>
          <Typography fontSize={"16px"} fontWeight={600}>
            Pagamento aprovado
          </Typography>
          <Typography fontSize={"12px"}>
            Notificamos o vendedor sobre seu pedido, fique atento.
          </Typography>
        </FlexBox>
      ),
    },
  ];

  const handleStepChange = () => {};

  return (
    <Container maxWidth={750}>
      <FlexBox justifyContent="space-between" flexWrap={"wrap"}>
        <FlexBox alignItems={"center"} gap={8} marginBottom="12px">
          <H3 textAlign={"center"}>Compra realizada com sucesso</H3>
          <Icon
            style={{
              color: colors.success.main,
              background: "transparent",
              border: `2px solid ${colors.success.main}`,
              borderRadius: "50%",
              padding: "2px",
            }}
            size={"16px"}
          >
            check
          </Icon>
        </FlexBox>
        <Typography fontSize={"16px"} fontWeight={300}>
          Total{" "}
          <span style={{ fontWeight: "700", color: colors.success.main }}>
            {formatCurrency(payment.value)}
          </span>
        </Typography>
      </FlexBox>

      <Card mt={12} p={32}>
        <Typography fontSize={"16px"} fontWeight={600} marginBottom="8px">
          Quase lá, Lucas! criamos seu pedido!
        </Typography>

        <Typography fontSize={"14px"} fontWeight={300} marginBottom="16px">
          Agora vamos passar por esses três procedimentos para notificar o
          vendedor.
        </Typography>

        <FlexBox
          alignItems={"center"}
          justifyContent="center"
          gap={32}
          flexWrap="wrap"
          marginBottom={"24px"}
        >
          <FlexBox flexWrap="wrap">
            <Stepper
              direction="vertical"
              stepperList={stepperList}
              selectedStep={2}
              onChange={handleStepChange}
            />
          </FlexBox>
        </FlexBox>
        <FlexBox gap={8}> 
          <Button
            variant="contained"
            color="primary.text"
            bg="primary.main"
            px="2rem" 
            type="button"
          >
            Ver pedido
          </Button>
          <Button variant="contained" px="2rem"   type="button" onClick={()=> router.back()}>
            Voltar
          </Button>
        </FlexBox>
      </Card>
    </Container>
  );
};

export default CardResult;
