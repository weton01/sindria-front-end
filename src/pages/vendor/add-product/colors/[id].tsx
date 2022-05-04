import Button from "@component/buttons/Button";
import Card from "@component/Card";
import Grid from "@component/grid/Grid";
import DashboardPageHeader from "@component/layout/DashboardPageHeader";
import VendorDashboardLayout from "@component/layout/VendorDashboardLayout";
import TextField from "@component/text-field/TextField";
import { Formik } from "formik";
import { GetServerSideProps } from "next";
import React, { useEffect, useState } from "react";
import { parseCookies } from "nookies";
import * as yup from "yup";
import { api } from "services/api";
import Stepper from "@component/stepper/Stepper";
import { useRouter } from "next/router";
import Box from "@component/Box";

const ProductColor = (props) => {
  const [selectedStep, setSelectedStep] = useState(0);

  const router = useRouter();
  const { pathname } = router;

  const handleStepChange = (_step, ind) => {
    switch (ind) {
      case 0:
        router.push("/vendor/add-product");
        break;
      case 1:
        router.push("/vendor/add-product/variations");
        break;
      case 2:
        router.push("/vendor/add-product/colors");
        break;
      case 3:
        router.push("/vendor/add-product/sizes");
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    switch (pathname) {
      case "/vendor/add-product":
        setSelectedStep(1);
        break;
      case "/vendor/add-product/variations":
        setSelectedStep(2);
        break;
      case "/vendor/add-product/colors":
        setSelectedStep(3);
        break;
      case "/vendor/add-product/sizes":
        setSelectedStep(4);
        break;

      default:
        break;
    }
  }, [pathname]);

  const handleFormSubmit = async (values) => {
    const payload = {
      ...values,
      categories: values.categories.map((item) => ({
        id: item.value,
      })),
      tags: values.tags.map((item) => ({
        id: item.value,
      })),
    };
  };

  return (
    <div>
      <DashboardPageHeader
        title="Adicionar produto"
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
        <Formik
          initialValues={initialValues}
          validationSchema={checkoutSchema}
          onSubmit={handleFormSubmit}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,
          }) => (
            <form onSubmit={handleSubmit}>
              <Grid container spacing={6}>
                <Grid item sm={12} xs={12}>
                  <TextField
                    name="name"
                    label="Nome"
                    placeholder="Nome do produto"
                    fullwidth
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.name || ""}
                    errorText={touched.name && errors.name}
                  />
                </Grid>
              </Grid>
              <Button
                mt="25px"
                variant="contained"
                color="primary"
                type="submit"
              >
                Save product
              </Button>
            </form>
          )}
        </Formik>
      </Card>
    </div>
  );
};

const initialValues = {};

const checkoutSchema = yup.object().shape({});

ProductColor.layout = VendorDashboardLayout;

const stepperList = [
  {
    title: "Produto",
    disabled: false,
  },
  {
    title: "Variações",
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
];

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { ["shop_token"]: token } = parseCookies(ctx);

  try {
    api.interceptors.request.use((config) => {
      config.headers["Authorization"] = `Bearer ${token}`;
      return config;
    });

    /* const [categories, tags] = await Promise.all([]);

    
    return {
      props: { categories: newCategories, tags: newTags },
    }; */
  } catch (err) {
    console.log("fail to verify tokens", err);
  }

  return {
    props: {},
  };
};

export default ProductColor;
