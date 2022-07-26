import Avatar from "@component/avatar/Avatar";
import Box from "@component/Box";
import Button from "@component/buttons/Button";
import Card from "@component/Card";
import Divider from "@component/Divider";
import DropZone from "@component/DropZone";
import FlexBox from "@component/FlexBox";
import RateForm from "@component/orders/forms/rate";
import Grid from "@component/grid/Grid";
import Icon from "@component/icon/Icon";
import DashboardLayout from "@component/layout/CustomerDashboardLayout";
import DashboardPageHeader from "@component/layout/DashboardPageHeader";
import More from "@component/more/More";
import TableRow from "@component/TableRow";
import Typography, { H5, H6, Paragraph } from "@component/Typography";
import useWindowSize from "@hook/useWindowSize";
import { paymentMethod, variationsStatus } from "@utils/convert/status";
import { formatCurrency } from "@utils/formatCurrency";
import { colors } from "@utils/themeColors";
import axios from "axios";
import { format } from "date-fns";
import { authRoute } from "middlewares/authRoute";
import { GetServerSideProps } from "next";
import React, { Fragment } from "react";
import { PROD_URL } from "services/api";

type OrderStatus = "processed" | "shipped" | "received";

const OrderDetails = ({ order }) => {
  const orderStatusList = ["processed", "shipped", "received"];
  const stepIconList = ["package-box", "truck-1", "delivery"];

  const width = useWindowSize();
  const breakpoint = 350;
  const { address } = order;

  return (
    <div>
      <DashboardPageHeader
        title="Detalhes do pedido"
        iconName="bag_filled"
        button={
          <Button color="primary" bg="primary.light" px="2rem">
            Pedir novamente
          </Button>
        }
      />
      {order.ordersStores.map((item, index) => {
        const orderStatus: OrderStatus = item.trackingStatus;
        const statusIndex = orderStatusList.indexOf(orderStatus);

        return (
          <div key={index}>
            <Typography fontSize="24px" fontWeight="500" lineHeight="2">
              Lojas Americanas
            </Typography>
            <Card p="2rem 1.5rem" mb="30px">
              <FlexBox
                flexDirection={width < breakpoint ? "column" : "row"}
                justifyContent="space-between"
                alignItems="center"
                flexWrap="wrap"
                my="2rem"
              >
                {stepIconList.map((item, ind) => (
                  <Fragment key={item}>
                    <Box position="relative">
                      <Avatar
                        size={64}
                        bg={ind <= statusIndex ? "primary.main" : "gray.300"}
                        color={
                          ind <= statusIndex ? "gray.white" : "primary.main"
                        }
                      >
                        <Icon size="32px" defaultcolor="currentColor">
                          {item}
                        </Icon>
                      </Avatar>
                      {ind < statusIndex && (
                        <Box position="absolute" right="0" top="0">
                          <Avatar size={22} bg="gray.200" color="success.main">
                            <Icon size="12px" defaultcolor="currentColor">
                              done
                            </Icon>
                          </Avatar>
                        </Box>
                      )}
                    </Box>
                    {ind < stepIconList?.length - 1 && (
                      <Box
                        flex={width < breakpoint ? "unset" : "1 1 0"}
                        height={width < breakpoint ? 50 : 4}
                        minWidth={width < breakpoint ? 4 : 50}
                        bg={ind < statusIndex ? "primary.main" : "gray.300"}
                      />
                    )}
                  </Fragment>
                ))}
              </FlexBox>
              <FlexBox
                justifyContent={width < breakpoint ? "center" : "flex-end"}
              >
                <Typography
                  p="0.5rem 1rem"
                  borderRadius="300px"
                  bg="primary.light"
                  color="primary.main"
                  textAlign="center"
                >
                  Data de entrega estimada <b>4th October</b>
                </Typography>
              </FlexBox>
            </Card>

            <Card p="0px" mb="30px" overflow="hidden">
              <TableRow
                bg="gray.200"
                p="12px"
                boxShadow="none"
                borderRadius={0}
              >
                <FlexBox className="pre" m="6px" alignItems="center">
                  <Typography fontSize="14px" color="text.muted" mr="4px">
                    Código do pedido:
                  </Typography>
                  <Typography fontSize="14px">9001997718074513</Typography>
                </FlexBox>
                <FlexBox className="pre" m="6px" alignItems="center">
                  <Typography fontSize="14px" color="text.muted" mr="4px">
                    Pediu em:
                  </Typography>
                  <Typography fontSize="14px">
                    {format(new Date(item.created_at), "dd MMM, yyyy")}
                  </Typography>
                </FlexBox>
                <FlexBox className="pre" m="6px" alignItems="center">
                  <Typography fontSize="14px" color="text.muted" mr="4px">
                    Entregue em:
                  </Typography>
                  <Typography fontSize="14px">
                    {format(new Date(), "dd MMM, yyyy")}
                  </Typography>
                </FlexBox>
              </TableRow>

              <Box py="0.5rem">
                {item.orderProducts.map((item: any, index) => {
                  const { netAmount, quantity } = item;
                  const { mutation } = item.freezeProduct;
                  const { images, name } = item.freezeProduct.product; 
                  
                  return (
                    <More key={index} component={<RateForm id={item.id}/>}>
                      {({ onToggle, open }) => (
                        <>
                          <FlexBox
                            px="1rem"
                            py="0.5rem"
                            flexWrap="wrap"
                            alignItems="center"
                            key={item.id}
                          >
                            <FlexBox
                              flex="2 2 260px"
                              m="6px"
                              alignItems="center"
                            >
                              <Avatar src={images[0]} size={64} />
                              <Box ml="20px">
                                <H6 my="0px">{name}</H6>
                                <Typography fontSize="14px" color="text.muted">
                                  {formatCurrency(netAmount)} x {quantity}
                                </Typography>
                              </Box>
                            </FlexBox>
                            <FlexBox
                              flex="1 1 240px"
                              m="6px"
                              alignItems="flex-start"
                              display="flex"
                              gap={8}
                              flexDirection={"column"}
                              justifyContent="center"
                            >
                              {mutation?.variations?.map((item, index) => (
                                <FlexBox
                                  gap={8}
                                  alignItems="center"
                                  key={index}
                                >
                                  <Typography>
                                    {variationsStatus[item.type]}
                                  </Typography>
                                  <Typography
                                    key={`typeo-${index}`}
                                    color="gray.600"
                                  >
                                    {item.type === "size" ? item.size : null}
                                    {item.type === "default" ? item.name : null}
                                    {item.type === "color" ? (
                                      <Box
                                        size={25}
                                        width={25}
                                        bg="white"
                                        display="flex"
                                        borderRadius="50%"
                                        justifyContent="center"
                                        alignItems="center"
                                        border="1px solid"
                                        key={item?.id}
                                        padding="3px"
                                      >
                                        <Box
                                          width="100%"
                                          height="100%"
                                          backgroundColor={item.color}
                                          borderRadius="50%"
                                        />
                                      </Box>
                                    ) : null}
                                  </Typography>
                                </FlexBox>
                              ))}
                            </FlexBox>
                            <FlexBox flex="160px" m="6px" alignItems="center">
                              <Button
                                variant="text"
                                color="primary"
                                onClick={() => onToggle()}
                              >
                                <Typography fontSize="14px">
                                  {!open ? "Avaliar" : "Não avaliar"}
                                </Typography>
                              </Button>
                            </FlexBox>
                          </FlexBox>
                        </>
                      )}
                    </More>
                  );
                })}
              </Box>
            </Card>
            <Divider
              marginBottom={48}
              marginTop={64}
              backgroundColor={colors.gray[400]}
            />
          </div>
        );
      })}
      <Grid container spacing={6}>
        <Grid item lg={6} md={6} xs={12}>
          <Card p="20px 30px">
            <H5 mt="0px" mb="14px">
              Endereço de entrega
            </H5>
            <Paragraph fontSize="14px" my="0px">
              <Paragraph fontWeight={600}>
                CEP: {address.cep} <br />
              </Paragraph>
              {address.street}, {address.number}, {address.city},{" "}
              {address.neighborhood}, {address.state} <br />
              {address.complement}
            </Paragraph>
          </Card>
        </Grid>
        <Grid item lg={6} md={6} xs={12}>
          <Card p="20px 30px">
            <H5 mt="0px" mb="14px">
              Resumo total
            </H5>
            <FlexBox
              justifyContent="space-between"
              alignItems="center"
              mb="0.5rem"
            >
              <Typography fontSize="14px" color="text.hint">
                Subtotal:
              </Typography>
              <H6 my="0px">{formatCurrency(order.totalValue)}</H6>
            </FlexBox>
            <FlexBox
              justifyContent="space-between"
              alignItems="center"
              mb="0.5rem"
            >
              <Typography fontSize="14px" color="text.hint">
                Taxa de envio:
              </Typography>
              <H6 my="0px">{formatCurrency(order.totalShipping)}</H6>
            </FlexBox>

            <Divider mb="0.5rem" />

            <FlexBox
              justifyContent="space-between"
              alignItems="center"
              mb="1rem"
            >
              <H6 my="0px">Total</H6>
              <H6 my="0px">
                {formatCurrency(order.totalValue + order.totalShipping)}
              </H6>
            </FlexBox>
            <Typography fontSize="14px">
              Pago por <b>{paymentMethod[order.invoiceType].name}</b>
            </Typography>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

OrderDetails.layout = DashboardLayout;

export const getServerSideProps: GetServerSideProps = async (c) => {
  return authRoute(c, async (ctx: any) => {
    try {
      const { id } = ctx.query;

      const { data } = await axios.get(`${PROD_URL}order/v1/${id}`, {
        headers: {
          Authorization: `Bearer ${ctx.token}`,
        },
      });

      const customOrder = {
        ...data,
        paymentStatus: "pending",
        totalValue: data.ordersStores.reduce(
          (accumulator, add) => accumulator + add.totalAmount,
          0
        ),
        totalShipping: data.ordersStores.reduce(
          (accumulator, add) => accumulator + add.shippingAmount,
          0
        ),
      };

      return {
        props: {
          order: customOrder,
        },
      };
    } catch {
      return {
        redirect: {
          permanent: false,
          destination: "/404",
        },
      };
    }
  });
};

export default OrderDetails;
