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
import ColorsForm from "@component/vendor/colors/ColorsForm";
import { getColorById } from "services/inventory/variations/color";
import Typography from "@component/Typography";

const ProductColor = (props) => {
  const [selectedStep, setSelectedStep] = useState(0);
  const router = useRouter();
  const id = router?.query?.id;
  const { route } = router;

  const handleStepChange = (_step, ind) => {
    switch (ind) {
      case 0:
        router.push(`/vendor/add-product/${id}`);
        break;
      case 1:
        router.push(`/vendor/add-product/colors/${id}`);
        break;
      case 2:
        router.push(`/vendor/add-product/sizes/${id}`);
        break;
      case 3:
        router.push(`/vendor/add-product/inventory/${id}`);
        break;
      case 4:
        router.push(`/vendor/add-product/variations/${id}`);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    switch (route) {
      case `/vendor/add-product/[id]`:
        setSelectedStep(1);
        break;
      case `/vendor/add-product/colors/[id]`:
        setSelectedStep(2);
        break;
      case `/vendor/add-product/sizes/[id]`:
        setSelectedStep(3);
        break; 
      case `/vendor/add-product/inventory/[id]`:
        setSelectedStep(4);
        break;
      case `/vendor/add-product/variations/[id]`:
        setSelectedStep(5);
        break;
      default:
        break;
    }
  }, [route]);

  return (
    <div>
      <DashboardPageHeader
        title={`Produto ${props.product.name}`}
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
          Cores do Produto
        </Typography>
        <ColorsForm {...props} />
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

ProductColor.layout = VendorDashboardLayout;

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
    disabled: false,
  },
];

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { ["shop_token"]: token } = parseCookies(ctx);
  const { id } = ctx.query;

  console.log('====================================');
  console.log(token);
  console.log('====================================');

  try {
    const [product] = await Promise.all([getColorById({ id, token })]);

    if ("name" in product) {
      product.colors.push(initialValues);

      return {
        props: { product },
      };
    }
    return {
      notFound: true,
    };
  } catch (err) {
    return {
      notFound: true,
    };
  }
};

export default ProductColor;
