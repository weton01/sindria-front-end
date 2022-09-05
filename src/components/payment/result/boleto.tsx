import Card from "@component/Card";
import Container from "@component/Container";
import FlexBox from "@component/FlexBox";
import Icon from "@component/icon/Icon";
import Typography, { H3, Paragraph } from "@component/Typography";
import React from "react";
import Stepper from "@component/stepper/Stepper";
import Barcode from "react-barcode";
import useWindowSize from "@hook/useWindowSize";
import { formatCurrency } from "@utils/formatCurrency";
import { colors } from "utils/themeColors";
import Clipboard from "@component/clipboard/Clipboard";

const BoletoResult = ({ payment }) => {
  const width = useWindowSize();
  const stepperList = [
    {
      title: "Abra o app do seu banco e vá até o menu Boleto",
    },
    {
      title:
        "Escolha a opção para pagar com Boleto e escaneie o código ao lado. Se preferir você pode copiar o código logo em baixo",
    },
    {
      title: "Revise as informações e finalize o pagamento.",
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
          Quase lá, Lucas! agora é so realizar o pagamento!
        </Typography>

        <Typography fontSize={"14px"} fontWeight={300} marginBottom="16px">
          Você tem 5 dias para pagar, após esse período cancelaremos seu
          pedido.
        </Typography>

        <FlexBox
          gap={32}
          marginBottom={"8px"}
          marginTop={"24px"}
          flexDirection="column"
          justifyContent={"start"}
        >
          <FlexBox flexWrap="wrap">
            <Stepper
              direction="vertical"
              stepperList={stepperList}
              selectedStep={3}
              onChange={handleStepChange}
            />
          </FlexBox>
          <Barcode
            value={payment.meta.barCode}
            heigth={"5px"}
            width={width < 1024 ? "1" : "2"}
            fontSize={width < 1024 ? "11px" : "18px"}
          />
        </FlexBox>

        <Typography mb="0.75rem">
          Escaneie o código de barras ou copie o seguinte código
        </Typography>
        <Card
          bg="gray.100"
          p="0.8rem"
          boxShadow="none"
          border="1px solid"
          borderColor="transparent"
        >
          <FlexBox gap={16} alignItems="center" justifyContent={"space-between"}>
            <Paragraph
              color="gray.700"
              style={{ wordWrap: "break-word", wordBreak: "break-word" }}
              fontSize="12px"
              maxWidth={"530px"}
            >
              {payment.meta.barCode}
            </Paragraph>
            <Clipboard copy={payment.meta.barCode} message="Código copiado!">
              <FlexBox
                alignItems={"center"}
                border="1px solid"
                borderColor={"gray.400"}
                borderRadius="10px"
                p="16px 10px"
              >
                <Paragraph color="gray.700" fontSize="11px" width={"75px"}>
                  Copiar código
                </Paragraph>
                <Icon color="inherit" size="14px">
                  paperclip
                </Icon>
              </FlexBox>
            </Clipboard>
          </FlexBox>
        </Card>
      </Card>
    </Container>
  );
};

export default BoletoResult;
