import Avatar from "@component/avatar/Avatar";
import Box from "@component/Box";
import Card from "@component/Card";
import FlexBox from "@component/FlexBox";
import React, { useEffect, useState } from "react";
import Button from "../buttons/Button";
import { Card1 } from "../Card1";
import Grid from "../grid/Grid";
import Typography, { H5, H6, Paragraph } from "../Typography";
import { useSelector } from "react-redux";
import Icon, { IconType } from "@component/icon/Icon";
import { fail, success } from "@component/notification/notifcate";
import { PROD_URL } from "services/api";
import axios from "axios";
import { parseCookies } from "nookies";
import { useAppDispatch } from "@hook/hooks";
import { useRouter } from "next/router";
import { ShippingTypes } from "@component/shipping/shipping";
import { formatCurrency } from "@utils/formatCurrency";
import Divider from "@component/Divider";
import { formatFloat } from "@utils/formatFloat";
import { Formik } from "formik";
import TextField from "@component/text-field/TextField";
import MaskedInputCustom from "@component/masked-input/MaskedInput";

const TranslatePaymentMethod = {
  CREDIT_CARD: "Crédito",
  PIX: "PIX",
  BOLETO: "Boleto",
}

const TranslateIcon = {
  CREDIT_CARD: "credit",
  PIX: "pix",
  BOLETO: "boleto",
}

function addDaysWRONG(date: Date, days: any): Date {
  const result = new Date();
  result.setDate(date.getDate() + days);
  return result;
}

const clearCart = (cart, user, values) => {
  const newCart = { ...cart }
  newCart.orderStores = [...newCart.orderStores]

  if (cart.invoiceType === 'BOLETO') {
    newCart.installments = 1
  }

  if (cart.invoiceType === 'CREDIT_CARD') {
    newCart.extraCreditCard = {
      email: user.user.email,
      postalCode: cart?.address?.cep.replace('-', ''),
      addressNumber: cart?.address?.number,
      ...values
    }
    newCart.installments = cart.installments
  }

  delete newCart.fee
  delete newCart.coupon
  newCart.orderStores = newCart.orderStores.map(ost => {
    const newOst = { ...ost };
    const { trackingEstimated } = newOst?.shippingPrice

    newOst.store = { id: newOst.storeId }
    newOst.description = newOst.description || " "
    newOst.shippingAmount = newOst?.shippingPrice?.Valor
    newOst.totalAmount = newOst?.netAmount
    newOst.orderProducts = newOst.orderProducts.map(item => {
      delete item.otherProps
      return item
    })

    newOst.trackingEstimated = addDaysWRONG(
      new Date(),
      formatFloat(trackingEstimated)
    ).toISOString()


    delete newOst.nVlAltura
    delete newOst.nVlComprimento
    delete newOst.nVlDiametro
    delete newOst.nVlLargura
    delete newOst.nVlPeso
    delete newOst.userId
    delete newOst.shippingPrice
    delete newOst.storeName
    delete newOst.storeId
    delete newOst.netAmount
    return newOst
  })

  delete newCart.description

  newCart.address = { id: newCart.address.id }
  newCart.creditCard = { id: newCart.creditCard.id }

  return newCart
}

interface CheckoutForm2props {
  data: any
}

const CheckoutForm2: React.FC<CheckoutForm2props> = ({ data }) => {
  const [loading, setLoading] = useState(false)
  const [cart, setCart]: [any, any] = useState({})
  const [user, setUser]: [any, any] = useState({})
  const [selectedCoupon, setSelectedCoupon] = useState({ id: '', discount: 0 })

  const dispatch = useAppDispatch();
  const router = useRouter();

  const tempCart = useSelector((selec: any) =>
    selec.cart
  );

  const tempUser = useSelector((selec: any) =>
    selec.user
  );

  useEffect(() => {
    setCart(tempCart)
  }, [tempCart, setCart])

  useEffect(() => {
    setUser(tempUser)
  }, [tempUser, setUser])

  useEffect(() => {
    setSelectedCoupon(data?.items[0])
  }, [data])

  useEffect(() => {

    if (selectedCoupon?.id !== '')
      dispatch({
        type: "SET_COUPON",
        payload: selectedCoupon
      })
  }, [selectedCoupon])

  const cookies = parseCookies()

  const handleFormSubmit = async (values) => {
    setLoading(true);
    const newCart = clearCart(cart, user, values)

    try {
      const { data } = await axios.post(`${PROD_URL}order/v1`, newCart, {
        headers: {
          'Authorization': `Bearer ${cookies['shop_token']}`
        }
      })

      router.push(`/payment/${data?.bill?.id}`);

      dispatch({
        type: "CLEAR_CART",
        payload: {}
      })

      success('success')
    } catch (err) {
      fail(err?.response?.data?.message)
    }
    setLoading(false);
  };

  return (
    <Formik
      initialValues={{
        name: '',
        cpfCnpj: '',
        phone: '',
        mobilePhone: '',
      }}
      onSubmit={handleFormSubmit}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
      }) => (
        <form onSubmit={handleSubmit}>
          <Box>
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
                <Typography fontSize="20px">Detalhes de Entrega</Typography>
              </FlexBox>

              <Typography mb="0.75rem">Endereço de entrega</Typography>

              <Card
                bg="gray.100"
                p="1rem"
                boxShadow="none"
                border="1px solid"
                borderColor="transparent"
              >
                <H6 mb="0.25rem">CEP: {cart?.address?.cep}</H6>
                <Paragraph color="gray.700">{cart?.address?.street}, {cart?.address?.number}, {cart?.address?.neighborhood}</Paragraph>
              </Card>
            </Card1>

            <Card1 mb="1.5rem">
              <FlexBox alignItems="center" mb="1.75rem">
                <Avatar
                  bg="primary.main"
                  size={32}
                  color="primary.text"
                  mr="0.875rem"
                >
                  2
                </Avatar>
                <Typography fontSize="20px">Detalhes do Envio</Typography>
              </FlexBox>

              <Typography mb="0.75rem">Lojas e Preços</Typography>

              {
                cart?.orderStores?.map((item, index) => {
                  return (
                    <React.Fragment key={`fx-1-${index}`}
                    >
                      <FlexBox
                        p={10}
                        width="100%"
                        backgroundColor="#F6F9FC"
                        gap={12}
                        justifyContent="center"
                        flexDirection="column"
                      >
                        <H6 >
                          Produtos da Loja: {item?.storeName}
                        </H6>
                        <FlexBox alignItems="center" gap={12}>
                          <FlexBox width="100%" alignItems="center" gap={10}>
                            <Icon size="45px" color="secondary">
                              {ShippingTypes[item?.shippingPrice?.Codigo]?.icon}
                            </Icon>
                            <Typography fontSize={13}>
                              <strong>Tipo de Envio:</strong> {ShippingTypes[item?.shippingPrice?.Codigo]?.type}
                            </Typography>
                            <Typography fontSize={13}>
                              <strong>Tempo de Entrega:</strong> {item?.shippingPrice?.PrazoEntrega} dias úteis
                            </Typography>
                            <Typography fontSize={13}>
                              <strong>Preço:</strong> {formatCurrency(item.shippingPrice?.Valor)}
                            </Typography>
                          </FlexBox>

                        </FlexBox>
                      </FlexBox>{
                        index !== cart.orderStores.length - 1 ? (
                          <Divider
                            bg="gray.300" mb="0.5rem" />
                        ) : null
                      }
                    </React.Fragment>
                  )
                })
              }
            </Card1>

            <Card1 mb="1.5rem">
              <FlexBox alignItems="center" mb="1.75rem">
                <Avatar
                  bg="primary.main"
                  size={32}
                  color="primary.text"
                  mr="0.875rem"
                >
                  3
                </Avatar>
                <Typography fontSize="20px">Cupom de Desconto</Typography>
              </FlexBox>
              <Grid container horizontal_spacing={6} vertical_spacing={4}>
                {data?.items?.map(coupon => (
                  <Grid item lg={4} md={6} xs={12}>
                    <Card
                      bg="gray.100"
                      p="0rem 1rem 0rem 1rem"
                      boxShadow="none"
                      border="1px solid"
                      mb="1rem"
                      display="flex"
                      height={75}
                      borderColor={
                        coupon.id === selectedCoupon?.id
                          ? "primary.main"
                          : "transparent"
                      }
                    >
                      <FlexBox alignItems="center" gap={16} width="100%">
                        <Icon color="secondary" size="30px">
                          coupon
                        </Icon>
                        <FlexBox flexDirection="column" justifyContent="center" width="100%" >
                          <Typography fontSize={13}>
                            {coupon.description}
                          </Typography>
                          <H5  >
                            {formatCurrency(coupon.discount)}
                          </H5>
                        </FlexBox>
                      </FlexBox>
                    </Card>
                  </Grid>))}
              </Grid>
            </Card1>

            <Card1 mb="1.5rem">
              <FlexBox alignItems="center" mb="1.75rem">
                <Avatar
                  bg="primary.main"
                  size={32}
                  color="primary.text"
                  mr="0.875rem"
                >
                  4
                </Avatar>
                <Typography fontSize="20px">Informações de Pagamento</Typography>
              </FlexBox>

              <Typography mb="0.75rem">Método de Pagamento</Typography>
              <Card
                bg="gray.100"
                p="1rem"
                boxShadow="none"
                border="1px solid"
                borderColor="transparent"
                mb="1rem"
                display="flex"
              >
                <FlexBox alignItems="center" gap={4}>
                  <Icon
                  >
                    {TranslateIcon[cart?.invoiceType]}
                  </Icon>
                  <H6 ml="4px">{TranslatePaymentMethod[cart?.invoiceType]}</H6>
                  {
                    cart?.invoiceType === 'PIX' ? <>
                      PIX
                    </>
                      : null
                  }
                </FlexBox>
              </Card>
              {
                cart?.invoiceType === 'CREDIT_CARD' ? <>
                  <Typography mb="0.75rem">Cartão de crédito</Typography>

                  <Card
                    bg="gray.100"
                    p="1rem"
                    boxShadow="none"
                    border="1px solid"
                    borderColor="transparent"
                  >
                    <H6 mb="0.25rem">{cart?.creditCard?.number}</H6>
                    <FlexBox width="100%" ml={0} alignItems="center" justifyContent="space-between">
                      <Paragraph color="gray.700">
                        {cart?.creditCard?.expirationDate}</Paragraph>

                      <Icon
                        typer={IconType["payment-card"]}
                      >
                        visa
                      </Icon>
                    </FlexBox>
                  </Card>
                </>
                  : null
              }
              {
                cart?.invoiceType === 'CREDIT_CARD' ? <>
                  <Box mb="30px" mt={12}>
                    <Grid container horizontal_spacing={6} vertical_spacing={4}>
                      <Grid item md={6} xs={12}>
                        <TextField
                          name="name"
                          label="Nome"
                          fullwidth
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.name || ""}
                          errorText={touched.name && errors.name}
                        />
                      </Grid>
                      <Grid item md={6} xs={12}>
                        <MaskedInputCustom
                          name="cpfCnpj"
                          label="CPF"
                          fullwidth
                          mask="11111111111"
                          onChange={handleChange}
                          value={values.cpfCnpj || ""}
                          errorText={touched.cpfCnpj && errors.cpfCnpj}
                        />
                      </Grid>
                      <Grid item md={6} xs={12}>
                        <MaskedInputCustom
                          name="phone"
                          label="Telefone"
                          fullwidth
                          mask="11 11111111"
                          onChange={handleChange}
                          value={values.phone || ""}
                          errorText={touched.phone && errors.phone}
                        />
                      </Grid>
                      <Grid item md={6} xs={12}>
                        <MaskedInputCustom
                          name="mobilePhone"
                          label="Celular"
                          fullwidth
                          mask="11 111111111"
                          onChange={handleChange}
                          value={values.mobilePhone || ""}
                          errorText={touched.mobilePhone && errors.mobilePhone}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </>
                  : null
              }

            </Card1>

            <Grid>
              <Button
                variant="contained"
                color="primary"
                mt="1.5rem"
                type="submit"
                fullwidth
                loading={loading}
              >
                Fazer Pedido
              </Button>
            </Grid>
          </Box >
        </form>
      )}

    </Formik>
  );
};

export default CheckoutForm2;
