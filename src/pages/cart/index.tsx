import { CartItem } from "@reducer/cartReducer";
import { formatCurrency } from "@utils/formatCurrency";
import Link from "next/link";
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
import Select from "../../components/Select";
import TextField from "../../components/text-field/TextField";
import TextArea from "../../components/textarea/TextArea";
import Typography from "../../components/Typography";
import countryList from "../../data/countryList";


const Cart = () => {
  const products = useSelector((selec: any) =>
    selec?.cart?.orderProducts
  )
  const [total, setTotal] = useState(0)

  useEffect(() => {
    let newTotal = 0

    products.forEach(element => {
      newTotal += element.netAmount
    });

    setTotal(newTotal)
  }, [products])

  return (
    <Fragment>
      <Grid container spacing={6}>
        <Grid item lg={8} md={8} xs={12}>
          {products.map((item, index) => (
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

            <FlexBox alignItems="center" mb="1rem">
              <Typography fontWeight="600" mr="10px">
                Additional Comments
              </Typography>
              <Box p="3px 10px" bg="primary.light" borderRadius="3px">
                <Typography fontSize="12px" color="primary.main">
                  Note
                </Typography>
              </Box>
            </FlexBox>

            <TextArea rows={6} fullwidth mb="1rem" />

            <Divider mb="1rem" />

            <TextField placeholder="Voucher" fullwidth />

            <Button
              variant="outlined"
              color="primary"
              mt="1rem"
              mb="30px"
              fullwidth
            >
              Apply Voucher
            </Button>

            <Divider mb="1.5rem" />

            <Typography fontWeight="600" mb="1rem">
              Shipping Estimates
            </Typography>

            <Select
              mb="1rem"
              label="Country"
              placeholder="Select Country"
              options={countryList}
              onChange={(e) => {
                console.log(e);
              }}
            />

            <Select
              label="State"
              placeholder="Select State"
              options={stateList}
              onChange={(e) => {
                console.log(e);
              }}
            />

            <Box mt="1rem">
              <TextField label="Zip Code" placeholder="3100" fullwidth />
            </Box>

            <Button variant="outlined" color="primary" my="1rem" fullwidth>
              Calculate Shipping
            </Button>
            <Link href="/checkout">
              <Button variant="contained" color="primary" fullwidth>
                Checkout Now
              </Button>
            </Link>
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
