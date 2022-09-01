import React, { Fragment, useEffect, useState } from "react";
import * as yup from "yup";
import Typography, { H3, H6, Paragraph } from "../Typography";
import Grid from "../grid/Grid";
import TextField from "../text-field/TextField";
import Button from "../buttons/Button";
import { useRouter } from "next/router";
import { Card1 } from "../Card1";
import Radio from "../radio/Radio";
import FlexBox from "../FlexBox";
import Divider from "../Divider";
import useWindowSize from "../../hooks/useWindowSize";
import Avatar from "@component/avatar/Avatar";
import Card from "@component/Card";
import PaymentFormV2 from "@component/payment/Form";
import { api } from "services/api";
import { toast } from "react-nextjs-toast";
import { useAppDispatch } from "@hook/hooks";
import Icon, { IconType } from "@component/icon/Icon";
import Accordion from "@component/accordion/Accordion";
import AccordionHeader from "@component/accordion/AccordionHeader";
import Box from "@component/Box";


const PaymentForm = ({ creditCards }) => {
  const width = useWindowSize();
  const isMobile = width < 769;

  const router = useRouter()
  const dispatch = useAppDispatch();

  const [selectedCreditCard, setSelectedCreditCard] = useState({ id: '' })
  const [paymentMethod, setPaymentMethod] = useState("credit");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setSelectedCreditCard(creditCards?.items[0])
  }, [creditCards])

  useEffect(() => {
    dispatch({
      type: "SELECT_CREDIT_CARD",
      payload: selectedCreditCard
    })
  }, [selectedCreditCard])

  useEffect(() => {
    dispatch({
      type: "SELECT_PAYMENT_TYPE",
      payload: paymentMethod
    })
  }, [paymentMethod])

  const returnPage = () => {
    router.push('/cart/shipping')
  }

  const nextPage = () => {
    router.push('/cart/checkout')
  }

  const handlePaymentMethodChange = ({ target: { name } }) => {
    setPaymentMethod(name);
  };

  const handleFormSubmit = async (values) => {
    setLoading(true);
    try {
      delete values.focus;
      const payload = {
        ...values,
        number: values.number.replace(/ /g, ''),
        expirationDate: values.expiry
      }
      delete payload.expiry;
      await api.post(`credit-card/v1/`, payload);
      router.push("/cart/payment");
      toast.notify("Cartão de crédito adicionado", {
        title: "Sucesso!",
        duration: 5,
        type: "success",
      });
    } catch (err) {
      toast.notify(err.response.data.message, {
        title: "Erro!",
        duration: 5,
        type: "error",
      });
    }
    setLoading(false);
  };

  return (
    <Fragment>

      <Card1 mb="2rem">
        <Radio
          name="CREDIT_CARD"
          mb="1.5rem"
          color="secondary"
          checked={paymentMethod === "CREDIT_CARD"}
          label={
            <Typography ml="6px" fontWeight="600" fontSize="18px">
              Pagar com Cartão de Crédito
            </Typography>
          }
          onChange={handlePaymentMethodChange}
        />


        {paymentMethod === "CREDIT_CARD" && (
          <>
            <Box mb="1rem">
              <Accordion
                isForm
                expanded={false}
              >
                <AccordionHeader px="0px" py="6px">
                  <H3 mb="0.75rem" >Novo Cartão de Crédito</H3>
                </AccordionHeader>
                <PaymentFormV2
                  initialValues={initialValues}
                  handleFormSubmit={handleFormSubmit}
                  checkoutSchema={checkoutSchema}
                  loading={loading}
                />
                <Divider mt="1rem" />

              </Accordion>
            </Box>

            <Typography mb="0.75rem" >Cartão de Crédito para pagamento</Typography>
            <Box mb="1rem">
              <Grid container spacing={6}>
                {creditCards?.items?.map((item, ind) => (
                  <Grid item md={4} sm={6} xs={12} key={`addr-${ind}`}>
                    <Card
                      display="flex"
                      flexDirection="column"
                      justifyContent="center"
                      alignItems="flex-start"
                      bg="gray.100"
                      p="1rem"
                      boxShadow="none"
                      border="1px solid"
                      cursor="pointer"
                      borderColor={
                        item.id === selectedCreditCard?.id
                          ? "primary.main"
                          : "transparent"
                      }
                      onClick={() => {
                        setSelectedCreditCard(item)
                      }}
                    >

                      <H6 mb="0.25rem">{item.number}</H6>
                      <FlexBox width="100%" ml={0} alignItems="center" justifyContent="space-between">
                        <Paragraph color="gray.700">
                          {item.expirationDate}
                        </Paragraph>

                        <Icon
                          typer={IconType["payment-card"]}
                        >
                          {item.type}
                        </Icon>
                      </FlexBox>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>

          </>

        )}
        <Divider mb="1.25rem" mx="-2rem" />

        <Radio
          name="PIX"
          mb="1.5rem"
          color="secondary"
          checked={paymentMethod === "PIX"}
          label={
            <Typography ml="6px" fontWeight="600" fontSize="18px">
              Pagar com PIX
            </Typography>
          }
          onChange={handlePaymentMethodChange}
        />
        <Divider mb="1.5rem" mx="-2rem" />

        <Radio
          name="BOLETO"
          color="secondary"
          checked={paymentMethod === "BOLETO"}
          label={
            <Typography ml="6px" fontWeight="600" fontSize="18px">
              Pagar com Boleto
            </Typography>
          }
          onChange={handlePaymentMethodChange}
        />
      </Card1>

      <Grid container spacing={7}>
        <Grid item sm={6} xs={12}>
          <Button onClick={returnPage} variant="outlined" color="primary" type="button" fullwidth>
            Voltar para Entrega
          </Button>
        </Grid>
        <Grid item sm={6} xs={12}>
          <Button onClick={nextPage} variant="contained" color="primary" type="submit" fullwidth>
            Confirmar
          </Button>
        </Grid>
      </Grid>
    </Fragment>
  );
};

const initialValues = {
  number: "",
  name: "",
  expiry: "",
  cvc: "",
};

const checkoutSchema = yup.object().shape({
  name: yup.string().required("nome requerido"),
  number: yup.string().required("número requerido"),
  expiry: yup.string().matches(/^(0[1-9]|1[0-2])\/?([0-9]{4})$/, "data inválida").required("data requerida"),
  cvc: yup.string().required("cvc requerido"),
});


export default PaymentForm;
