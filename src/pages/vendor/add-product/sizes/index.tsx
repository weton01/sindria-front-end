import Button from "@component/buttons/Button";
import Card from "@component/Card";
import DashboardPageHeader from "@component/layout/DashboardPageHeader";
import VendorDashboardLayout from "@component/layout/VendorDashboardLayout";
import { GetServerSideProps } from "next";
import React, { useEffect, useState } from "react";
import { parseCookies } from "nookies";
import Stepper from "@component/stepper/Stepper";
import { useRouter } from "next/router";
import Box from "@component/Box";
import SizesForm from "@component/vendor/sizes/SizesForm";
import { getColorById } from "services/inventory/variations/color";
import Typography from "@component/Typography";
import { isJson } from "@utils/utils";

const ProductSize = (props) => {
  const [selectedStep, setSelectedStep] = useState(0);
  const router = useRouter(); 
  const { route } = router;

  const handleStepChange = (_step, ind) => {
    switch (ind) {
      case 0:
        router.push(`/vendor/add-product/`);
        break;
      case 1:
        router.push(`/vendor/add-product/colors/`);
        break;
      case 2:
        router.push(`/vendor/add-product/sizes/`);
        break;
      case 3:
        router.push(`/vendor/add-product/inventory/`);
        break;
      case 4:
        router.push(`/vendor/add-product/variations/`);
        break;
      default:
        break;
    }
  };

  useEffect(() => {  
    switch (route) {
      case `/vendor/add-product`:
        setSelectedStep(1);
        break;
      case `/vendor/add-product/colors`:
        setSelectedStep(2);
        break;
      case `/vendor/add-product/sizes`:
        setSelectedStep(3);
        break;
      case `/vendor/add-product/inventory`:
        setSelectedStep(4);
        break;
      case `/vendor/add-product/variations`:
        setSelectedStep(5);
        break;
      default:
        break;
    }
  }, [route]);

  return (
    <div>
      <DashboardPageHeader
        title={`Produto / Tamanhos`}
        iconName="delivery-box"
        button={
          <Button
            color="primary"
            bg="primary.light"
            px="2rem"
            route="/vendor/products"
          >
            Voltar para produtos
          </Button>
        }
      />
      <Box mb="14px" width="100%">
        <Stepper
          stepperList={stepperList}
          selectedStep={selectedStep}
          onChange={handleStepChange}
        />
      </Box>
      <Card p="30px">
        <Typography fontSize={"24px"} fontWeight={600}>
          Tamanhos do Produto
        </Typography>
        <SizesForm {...props} />
      </Card>
    </div>
  );
};

const initialValues = {
  name: "",
  netAmount: "",
  weight: "",
  height: "",
  width: "",
  image: [],
  type: "default",
  length: "",
  loading: { create: false, delete: false },
};

ProductSize.layout = VendorDashboardLayout;

const stepperList = [
  {
    title: "Produto",
    disabled: false,
  },
  {
    title: "Cores",
    disabled: false,
  },
  {
    title: "Tamanhos",
    disabled: false,
  },
  {
    title: "Estoque",
    disabled: true,
  },
];

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { ["shop_token"]: token } = parseCookies(ctx);
  const { id } = ctx.query;

  if (!isJson(ctx.query.product))
    return {
      redirect: {
        permanent: false,
        destination: "/vendor/add-product/",
      },
    };

  try {
    const [product] = await Promise.all([getColorById({ id, token })]);

    product.colors.push(initialValues);

    return {
      props: { product },
    };
  } catch (err) {
    return {
      notFound: true,
    };
  }
};

export default ProductSize;
