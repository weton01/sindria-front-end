import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Container from "../Container";
import Box from "../Box";
import Grid from "../grid/Grid";
import Navbar from "../navbar/Navbar";
import Stepper from "../stepper/Stepper";
import AppLayout from "./AppLayout";
import { useSelector } from "react-redux";

const CheckoutNavLayout: React.FC = ({children }) => {
  const [selectedStep, setSelectedStep] = useState(0);
  const user = useSelector((selec: any) =>
    selec?.user
  );

  const router = useRouter();
  const { pathname } = router;

  const stepperList = [
    {
      title: "Carrinho",
      disabled: false,
    },
    {
      title: "Entrega",
      disabled: !user.isLogged,
    },
    {
      title: "Pagamento",
      disabled: !user.isLogged,
    },
    {
      title: "Confirmação",
      disabled: true,
    },
  ];

  const handleStepChange = (_step, ind) => {
    switch (ind) {
      case 0:
        router.push("/cart");
        break;
      case 1:
        router.push("/cart/shipping");
        break;
      case 2:
        router.push("/cart/payment");
        break;
      case 3:
        router.push("/orders");
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    switch (pathname) {
      case "/cart":
        setSelectedStep(1);
        break;
      case "/cart/shipping":
        setSelectedStep(2);
        break;
      case "/cart/payment":
        setSelectedStep(3);
        break;
      case "/cart/checkout":
        setSelectedStep(4);
        break;
      default:
        break;
    }
  }, [pathname]);

  return (
    <AppLayout navbar={<Navbar />}>
      <Container my="2rem">
        <Box mb="14px">
          <Grid container spacing={6}>
            <Grid item lg={8} md={8} xs={12}>
              <Stepper
                stepperList={stepperList}
                selectedStep={selectedStep}
                onChange={handleStepChange}
              />
            </Grid>
          </Grid>
        </Box>
        {children}
      </Container>
    </AppLayout>
  );
};



export default CheckoutNavLayout;
