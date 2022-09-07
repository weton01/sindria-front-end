import Card from "@component/Card";
import FlexBox from "@component/FlexBox";
import Icon from "@component/icon/Icon";
import Typography from "@component/Typography";
import { formatCurrency } from "@utils/formatCurrency";
import { colors } from "@utils/themeColors";
import { IconSuccess } from "./result/style";

import PixResult from "@component/payment/result/pix";
import BoletoResult from "@component/payment/result/boleto";
import CardResult from "@component/payment/result/card";

export const paymentStatusResult = (payment) => {
  console.log(payment);

  const methodResult = {
    PIX: <PixResult payment={payment} />,
    BOLETO: <BoletoResult payment={payment} />,
    CREDIT_CARD: <CardResult payment={payment} />,
  };

  const resultStatus = methodResult[payment?.billingType];

  const status = {
    CONFIRMED: resultStatus,
    PENDING: resultStatus,
    AWAITING_RISK_ANALYSIS: resultStatus,
    RECEIVED: <PaymentReceived payment={payment} />,
    RECEIVED_IN_CASH: <PaymentReceived payment={payment} />,
    OVERDUE: (
      <PaymentError
        payment={payment}
        description={"Desculpe, infelizmente seu pagamento venceu."}
      />
    ),
    CHARGEBACK_REQUESTED: (
      <PaymentError
        payment={payment}
        description={
          "Houve um problema, seu pagamento não foi aprovado. Entre em contato com seu banco para mais informações."
        }
      />
    ),
    CHARGEBACK_DISPUTE: (
      <PaymentInfo
        payment={payment}
        description={
          "Seu pagamento apresentou problemas, em disputa de chargeback (caso sejam apresentados documentos para contestação)."
        }
      />
    ),
    AWAITING_CHARGEBACK_REVERSAL: (
      <PaymentInfo
        payment={payment}
        description={
          "Aguarde, disputa vencida, aguardando repasse da adquirente."
        }
      />
    ),
    DUNNING_REQUESTED: (
      <PaymentInfo
        payment={payment}
        description={"Aguarde, seu pagamento está em processo de negativação."}
      />
    ),
    DUNNING_RECEIVED: (
      <PaymentInfo
        payment={payment}
        description={"Aguarde, seu pagamento foi recuperado."}
      />
    ),
    REFUNDED: (
      <PaymentInfo
        payment={payment}
        description={"Desculpe pelo problema, seu pagamento foi estornado."}
      />
    ),
    REFUND_REQUESTED: (
      <PaymentInfo
        payment={payment}
        description={"Aguarde, seu estorno foi solicitado."}
      />
    ),
    DEFAULT: (
      <PaymentError
        payment={payment}
        description={
          "Houve um problema, seu pagamento não foi aprovado. Entre em contato com seu banco para mais informações."
        }
      />
    ),
  };

  return payment?.status in status
    ? status[payment?.status]
    : status["DEFAULT"];
};

export const PaymentReceived = ({ payment }) => {
  return (
    <Card p={"32px 16px"}>
      <FlexBox
        width={"100%"}
        height={"300px"}
        flexDirection={"column"}
        justifyContent={"center"}
        alignItems={"center"}
        gap={16}
      >
        <FlexBox justifyContent={"end"}>
          <FlexBox
            flexDirection={"column"}
            alignItems={"center"}
            justifyContent={"center"}
            backgroundColor={colors.gray["200"]}
            borderRadius={"50%"}
            width={"150px"}
            height={"150px"}
          >
            <Icon size="80px" style={{ color: colors.success.main }}>
              bag
            </Icon>
          </FlexBox>
          <IconSuccess
            size={"22px"}
            marginLeft={"-40px"}
            style={{
              background: colors.success.main,
              color: colors.body.paper,
            }}
          >
            check
          </IconSuccess>
        </FlexBox>
        <Typography textAlign={"center"} fontSize={"24px"} fontWeight={"600"}>
          Pronto, seu pagamento foi aprovado!
        </Typography>
        <Typography textAlign={"center"} fontSize={"12px"} fontWeight={"300"}>
          Número da operação: {payment.id}
        </Typography>
      </FlexBox>
      <FlexBox
        width={"100%"}
        height={"120px"}
        backgroundColor={colors.body.paper}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Typography fontWeight={"600"} fontSize={"30px"}>
          Você pagou{" "}
          <span style={{ color: colors.success.main }}>
            {formatCurrency(payment.value)}
          </span>
        </Typography>
      </FlexBox>
    </Card>
  );
};

export const PaymentError = ({ payment, description }) => {
  return (
    <Card p={"32px 0px 0px 0px"}>
      <FlexBox
        width={"100%"}
        height={"350px"}
        flexDirection={"column"}
        justifyContent={"center"}
        alignItems={"center"}
        gap={16}
      >
        <FlexBox justifyContent={"end"}>
          <FlexBox
            flexDirection={"column"}
            alignItems={"center"}
            justifyContent={"center"}
            backgroundColor={colors.gray["200"]}
            borderRadius={"50%"}
            width={"150px"}
            height={"150px"}
          >
            <Icon size="80px" style={{ color: colors.error.main }}>
              bag
            </Icon>
          </FlexBox>
          <IconSuccess
            size={"22px"}
            marginLeft={"-40px"}
            style={{
              background: colors.error.main,
              color: colors.body.paper,
              borderColor: colors.error.main,
            }}
          >
            x
          </IconSuccess>
        </FlexBox>
        <Typography textAlign={"center"} fontSize={"24px"} fontWeight={"600"}>
          O seu pagamento foi recusado!
        </Typography>
        <Typography textAlign={"center"} fontSize={"12px"} fontWeight={"300"}>
          Número da operação: {payment.id}
        </Typography>
      </FlexBox>
      <FlexBox
        width={"100%"}
        height={"120px"}
        backgroundColor={colors.error.light}
        justifyContent={"center"}
        alignItems={"center"}
        flexDirection={"column"}
        p={"16px"}
      >
        <Typography fontWeight={"600"} fontSize={"18px"} lineHeight={"200%"}>
          O que aconteceu?
        </Typography>
        <Typography
          fontWeight={"300"}
          fontSize={"14px"}
          width={"80%"}
          textAlign={"center"}
        >
          {description}
        </Typography>
      </FlexBox>
    </Card>
  );
};

export const PaymentInfo = ({ payment, description }) => {
  return (
    <Card p={"32px 0px 0px 0px"}>
      <FlexBox
        width={"100%"}
        height={"350px"}
        flexDirection={"column"}
        justifyContent={"center"}
        alignItems={"center"}
        gap={16}
      >
        <FlexBox justifyContent={"end"}>
          <FlexBox
            flexDirection={"column"}
            alignItems={"center"}
            justifyContent={"center"}
            backgroundColor={colors.gray["200"]}
            borderRadius={"50%"}
            width={"150px"}
            height={"150px"}
          >
            <Icon size="80px" style={{ color: colors.warn.main }}>
              bag
            </Icon>
          </FlexBox>
          <FlexBox
            size={"22px"}
            marginLeft={"-40px"}
            style={{
              background: colors.warn.main,
              color: colors.body.paper,
              borderColor: colors.warn.main,
              borderRadius: "50%",
              textAlign: "center",
              justifyContent: "center",
            }}
          >
            !
          </FlexBox>
        </FlexBox>
        <Typography textAlign={"center"} fontSize={"24px"} fontWeight={"600"}>
          Houve um problema com seu pagamento!
        </Typography>
        <Typography textAlign={"center"} fontSize={"12px"} fontWeight={"300"}>
          Número da operação: {payment.id}
        </Typography>
      </FlexBox>
      <FlexBox
        width={"100%"}
        height={"120px"}
        backgroundColor={colors.warn.light}
        justifyContent={"center"}
        alignItems={"center"}
        flexDirection={"column"}
        p={"16px"}
      >
        <Typography fontWeight={"600"} fontSize={"18px"} lineHeight={"200%"}>
          O que aconteceu?
        </Typography>
        <Typography
          fontWeight={"300"}
          fontSize={"14px"}
          width={"80%"}
          textAlign={"center"}
        >
          {description}
        </Typography>
      </FlexBox>
    </Card>
  );
};
