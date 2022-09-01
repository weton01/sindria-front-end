import Avatar from "@component/avatar/Avatar";
import Card from "@component/Card";
import Container from "@component/Container";
import FlexBox from "@component/FlexBox";
import Icon from "@component/icon/Icon";
import NavbarLayout from "@component/layout/NavbarLayout";
import Typography, { H3, H6, Paragraph } from "@component/Typography";
import React from "react";
import useWindowSize from "../../hooks/useWindowSize";
import { GetServerSideProps } from "next";
import { authRoute } from "middlewares/authRoute";
import { api, PROD_URL } from "services/api";
import axios from "axios";
import { formatCurrency } from "@utils/formatCurrency";

const Shop = ({ payment }) => {
  const width = useWindowSize();

  return (
    <Container maxWidth={750}>
      <FlexBox alignItems={"center"} gap={8}>
        <H3 textAlign={"center"}>
          Compra realizada com sucesso
        </H3>
        <Icon style={{
          color: 'green',
          background: 'transparent',
          border: "2px solid green",
          borderRadius: "50%"
        }}>
          check
        </Icon>
      </FlexBox>

      <Card mt={12} p={16}>
        <FlexBox justifyContent={"space-between"}>
          <Card
            width={124}
            bg="gray.100"
            p="1rem"
            boxShadow="none"
            border="1px solid"
            borderColor="transparent"
          >
            <Paragraph color="gray.700" textAlign={"center"}>
              <H6>
                Valor
              </H6>
              <Typography lineHeight={2}  >
                {formatCurrency(payment.value)}
              </Typography>
            </Paragraph>
          </Card>
          <Card
            width={124}
            bg="gray.100"
            p="1rem"
            boxShadow="none"
            border="1px solid"
            borderColor="transparent"
          >
            <Paragraph color="gray.700" textAlign={"center"}>
              <H6>
                Validade
              </H6>
              <Typography lineHeight={2}  >
                12/04/2022
              </Typography>
            </Paragraph>
          </Card>
        </FlexBox>

        <Typography lineHeight={2} textAlign="center">
          Escaneie o QRCode ou Cole o seguinte código
        </Typography>

        <FlexBox justifyContent={"center"}  >
          <img height={250} width={250} src={`data:image/jpeg;base64,${payment.meta.encodedImage}`} />
        </FlexBox>

        <Typography mb="0.75rem">Ou copie o código a baixo</Typography>
        <Card
          bg="gray.100"
          p="1rem"
          boxShadow="none"
          border="1px solid"
          borderColor="transparent"
        >
          <FlexBox width="100%" ml={0} alignItems="center" justifyContent="space-between">
            <Paragraph color="gray.700">
              {payment.meta.payload}
            </Paragraph>

          </FlexBox>
        </Card>

      </Card>

    </Container>
  );
};

Shop.layout = NavbarLayout;

export const getServerSideProps: GetServerSideProps = async (c) => {
  return authRoute(c, async (ctx: any) => {
    const { id } = ctx.query;

    api.interceptors.request.use((config) => {
      config.headers["Authorization"] = `Bearer ${ctx.token}`;
      return config;
    });

    const { data } = await axios.get(`${PROD_URL}payment/v1/${id}`);

    return {
      props: {
        payment: data
      }
    }
  })

}
export default Shop;
