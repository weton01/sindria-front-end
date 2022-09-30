import Card from "@component/Card";
import Icon from "@component/icon/Icon";
import { useAppDispatch } from "@hook/hooks";
import { formatCurrency } from "@utils/formatCurrency";
import { useRouter } from "next/router";
import React, { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Box from "../../components/Box";
import Button from "../../components/buttons/Button";
import { Card1 } from "../../components/Card1";
import Divider from "../../components/Divider";
import FlexBox from "../../components/FlexBox";
import Grid from "../../components/grid/Grid";
import CheckoutNavLayout from "../../components/layout/CheckoutNavLayout";
import ProductCard7 from "../../components/product-cards/ProductCard7";
import TextArea from "../../components/textarea/TextArea";
import Typography from "../../components/Typography";


const Cart = () => {
  const router = useRouter()
  const dispatch = useAppDispatch();

  const cart = useSelector((selec: any) =>
    selec?.cart
  )

  const [products, setProducts] = useState([])
  const [description, setDescription] = useState(cart?.description)
  const [total, setTotal] = useState(0)
  const [editing, setEditing] = useState(false)

  const onChange = (e) => {
    setDescription(e.target.value)
  }

  const nextPage = () => {
    router.push('/cart/shipping')
  }

  const onClickAddDescription = () => {
    dispatch(setDescription(description))

    setEditing(false)
  }

  useEffect(() => {
    let newTotal = 0

    products.forEach(element => {
      newTotal += element.netAmount
    });

    setTotal(newTotal)
  }, [products])


  useEffect(() => {
    let newProducts = [];

    cart?.orderStores?.forEach(ost => {
      newProducts = [...newProducts, ...ost.orderProducts]
    })

    setProducts(newProducts)
  }, [cart, setProducts])

  return (
    <Fragment>
      <Grid container spacing={6}>
        <Grid item lg={8} md={8} xs={12}>
          {products?.map((item, index) => (
            <ProductCard7
              {...item?.otherProps}
              key={index}
              mb="1.5rem"
              qty={item.quantity}
              price={item.netAmount}
              name={item?.otherProps?.title}
              imgUrl={item?.otherProps?.images[0]}
              mutation={item?.otherProps?.mutation}
              item={item}
              id={item?.otherProps?.id}
            />
          ))}
        </Grid>
        <Grid item lg={4} md={4} xs={12}>
          <Card1>
            <FlexBox
              justifyContent="space-between"
              alignItems="center"
              mb="1rem"
            >
              <Typography color="gray.600">Total:</Typography>
              <FlexBox alignItems="flex-end">
                <Typography fontSize="18px" fontWeight="600" lineHeight="1">
                  {formatCurrency(total)}
                </Typography>
              </FlexBox>
            </FlexBox>

            <Divider mb="1rem" />

            <FlexBox alignItems="center" mb="1rem" justifyContent="space-between">
              <FlexBox>
                <Typography fontWeight="600" mr="10px">
                  Comentários adicionais
                </Typography>
                <Box p="3px 10px" bg="primary.light" borderRadius="3px">
                  <Typography fontSize="12px" color="primary.main">
                    Nota
                  </Typography>
                </Box>
              </FlexBox>
              {
                cart.description !== "" ?
                  <Box cursor="pointer">
                    <Icon size="20px" onClick={() => setEditing(!editing)}>
                      {editing ? "close" : "edit"}
                    </Icon>
                  </Box>

                  : null
              }
            </FlexBox>

            {
              cart.description === "" || editing ?
                <TextArea
                  onChange={onChange}
                  rows={6}
                  fullwidth mb="1rem"
                  value={description}
                />
                : (
                  <Card
                    bg="gray.100"
                    p="1rem"
                    boxShadow="none"
                    border="1px solid"
                    borderColor={"transparent"}
                    height="150px"
                  >
                    <Typography>
                      {cart.description}
                    </Typography>
                  </Card>
                )
            }

            {
              cart.description === "" || editing ?
                <Button
                  variant="outlined"
                  color="primary"
                  mt="1rem"
                  mb="30px"

                  fullwidth
                  onClick={onClickAddDescription}
                >
                  Adicionar Comentário
                </Button>

                : null
            }

            <Divider mb="1rem" mt="1rem" />
            <Button onClick={nextPage} variant="contained" color="primary" fullwidth>
              Entrega
            </Button>
          </Card1>
        </Grid>
      </Grid>
    </Fragment>
  );
};

const stateList = [
  {
    value: "New York",
    label: "New York",
  },
  {
    value: "Chicago",
    label: "Chicago",
  },
];

Cart.layout = CheckoutNavLayout;

export default Cart;
