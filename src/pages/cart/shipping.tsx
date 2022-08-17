import AddressForm from "@component/address/AddressForm";
import Avatar from "@component/avatar/Avatar";
import Box from "@component/Box";
import Button from "@component/buttons/Button";
import Card from "@component/Card";
import { Card1 } from "@component/Card1";
import CheckoutSummary2 from "@component/checkout/CheckoutSummary2";
import FlexBox from "@component/FlexBox";
import Shipping from "@component/shipping/shipping";
import Typography, { H3, H6, Paragraph } from "@component/Typography";
import { useAppDispatch } from "@hook/hooks";
import axios from "axios";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import { PROD_URL } from "services/api";
import Grid from "../../components/grid/Grid";
import CheckoutNavLayout from "../../components/layout/CheckoutNavLayout";
import Accordion from "@component/accordion/Accordion";
import AccordionHeader from "@component/accordion/AccordionHeader";
import Divider from "@component/Divider";
import { useSelector } from "react-redux";
import Spin from "@component/spin/Spin";
import { authRoute } from "middlewares/authRoute";
import Container from "@component/Container";
import { formatFloat } from "@utils/formatFloat";

const Checkout = ({ address }) => {
  const [selectedAddress, setSelectedAddress] = useState({ id: "" });
  const [loadingShippings, setLoadingShippings] = useState(false);
  const [shippings, setShippings] = useState([]);

  const router = useRouter();
  const dispatch = useAppDispatch();

  const orderStores = useSelector((selec: any) => selec?.cart?.orderStores);

  const fetchShippings = useCallback(async () => {
    setLoadingShippings(true);
    if (orderStores?.length > 0) {
      const promises = orderStores?.map((ost) => {
        const localPromises: any[] = [];

        const totalValue = ost?.nVlAltura + ost?.nVlLargura + ost?.nVlDiametro;
        if (totalValue < 200) {
          localPromises.push({
            sCepOrigem: "13844-257",
            sCepDestino: "01032-000 ",
            nVlPeso: ost?.nVlPeso.toString(),
            nCdFormato: "1",
            nVlComprimento:
              ost?.nVlComprimento > 15 ? ost?.nVlComprimento.toString() : "15",
            nVlAltura: ost?.nVlAltura > 15 ? ost?.nVlAltura.toString() : "15",
            nVlLargura:
              ost?.nVlLargura > 15 ? ost?.nVlLargura?.toString() : "15",
            nVlDiametro:
              ost?.nVlDiametro > 15 ? ost?.nVlDiametro?.toString() : "15",
            nCdServico: ["04014", "04510"],
            user: ost.userId,
          });
        } else {
          const rest = totalValue % 200;

          for (let i = 0; i < totalValue / 200; i++) {
            localPromises.push({
              sCepOrigem: "13844-257",
              sCepDestino: "01032-000 ",
              nVlPeso: ost?.nVlPeso.toString(),
              nCdFormato: "1",
              nVlComprimento: "66.66",
              nVlAltura: "66.66",
              nVlLargura: "66.66",
              nVlDiametro: "33.33",
              nCdServico: ["04014", "04510"],
              user: ost.userId,
            });
          }

          localPromises.push({
            sCepOrigem: "13844-257",
            sCepDestino: "01032-000 ",
            nVlPeso: ost?.nVlPeso.toString(),
            nCdFormato: "1",
            nVlComprimento: (rest / 3).toString(),
            nVlAltura: (rest / 3).toString(),
            nVlLargura: (rest / 3).toString(),
            nVlDiametro: (rest / 2).toString(),
            nCdServico: ["04014", "04510"],
            user: ost.userId,
          });
        }

        return localPromises;
      });

      console.log("here", promises);

      const shippings = await Promise.all(
        promises.map(async (p) => {
          let user;

          const items = await Promise.all(
            p.map((i) => {
              user = i.user;
              delete i.user;
              return axios.post(`${PROD_URL}/shipping/v1`, i);
            })
          );

          const newItem = [
            {
              Codigo: "04014",
              Valor: 0,
              PrazoEntrega: "",
            },
            {
              Codigo: "04510",
              Valor: 0,
              PrazoEntrega: "",
            },
          ];

          console.log("newItem: ", newItem);

          items.forEach((l) => {
            l?.data?.forEach((l3) => {
              const index = newItem.findIndex(
                (l2) => l2.Codigo === l3.Codigo
              );
              if (index < 0) {
                return;
              }
              console.log('l3', l3.Valor)
              newItem[index].Valor += formatFloat(l3.Valor)
              newItem[index].PrazoEntrega = l3.PrazoEntrega;
            });
          });

          console.log("newItemAfter: ", newItem);

          return {
            data: newItem,
            user,
          };
        })
      );

      setShippings(shippings);
    }

    setLoadingShippings(false);
  }, [selectedAddress]);

  useEffect(() => {
    setSelectedAddress(address.items[0]);
  }, [address]);

  useEffect(() => {
    dispatch({
      type: "SELECT_ADDRESS",
      payload: selectedAddress,
    });
  }, [selectedAddress]);

  useEffect(() => {
    console.log("chegou aqui");
    fetchShippings();
  }, [fetchShippings]);

  useEffect(() => {
    if (shippings[0] && shippings[0].data && shippings[0].data.length > 0) {
      dispatch({
        type: "SET_SHIPPING",
        payload: {
          user: shippings[0]?.user,
          price: shippings[0].data[0],
        },
      });
    }
  }, [shippings]);

  const returnPage = () => {
    router.push("/cart");
  };

  const nextPage = () => {
    router.push("/cart/payment");
  };

  return (
    <Container my="1.5rem">
      <Grid container spacing={6}>
        <Grid item lg={8} md={8} xs={12}>
          <Card1 mb="1.5rem">
            <FlexBox alignItems="center" mb="1.75rem">
              <Avatar
                bg="primary.main"
                size={32}
                color="primary.text"
                mr="0.875rem"
              >
                1
              </Avatar>
              <Typography fontSize="20px">Detalhes do Envio</Typography>
            </FlexBox>

            <Grid container>
              <Box mb="1rem">
                <Accordion isForm expanded={false}>
                  <AccordionHeader px="0px" py="6px">
                    <H3 mb="0.75rem">Novo Endereço de Entrega</H3>
                  </AccordionHeader>
                  <AddressForm redirect={"/cart/checkout"} />
                  <Divider mt="1rem" />
                </Accordion>
              </Box>
            </Grid>

            <Typography mb="0.75rem">Endereço de Entrega</Typography>
            <Grid container spacing={6}>
              {address?.items.map((item, ind) => (
                <Grid item md={4} sm={6} xs={12} key={`addr-${ind}`}>
                  <Card
                    bg="gray.100"
                    p="1rem"
                    boxShadow="none"
                    border="1px solid"
                    cursor="pointer"
                    borderColor={
                      item.id === selectedAddress?.id
                        ? "primary.main"
                        : "transparent"
                    }
                    onClick={() => {
                      setSelectedAddress(item);
                    }}
                  >
                    <H6 mb="0.25rem">CEP: {item.cep}</H6>
                    <Paragraph color="gray.700">
                      {item.street}, {item.number}, {item.neighborhood}
                    </Paragraph>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <FlexBox mt="1.5rem" alignItems="center" mb="1.75rem">
              <Avatar
                bg="primary.main"
                size={32}
                color="primary.text"
                mr="0.875rem"
              >
                2
              </Avatar>
              <Typography fontSize="20px">Valores do Frete</Typography>
            </FlexBox>
            <Spin loading={loadingShippings} size="30px">
              <FlexBox flexDirection={"column"} gap={8}>
                {shippings.map((item, index) => (
                  <Shipping key={`shi-${index}`} values={item} />
                ))}
              </FlexBox>
            </Spin>
          </Card1>
          <Grid container spacing={7}>
            <Grid item sm={6} xs={12}>
              <Button
                onClick={returnPage}
                variant="outlined"
                color="primary"
                type="button"
                fullwidth
              >
                Voltar ao Carrinho
              </Button>
            </Grid>
            <Grid item sm={6} xs={12}>
              <Button
                disabled={loadingShippings}
                onClick={nextPage}
                variant="contained"
                color="primary"
                type="submit"
                fullwidth
              >
                Pagamento
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid item lg={4} md={4} xs={12}>
          <CheckoutSummary2 />
        </Grid>
      </Grid>
    </Container>
  );
};

Checkout.layout = CheckoutNavLayout;

export default Checkout;
