import Button from "@component/buttons/Button";
import Card from "@component/Card";
import Grid from "@component/grid/Grid";
import DashboardPageHeader from "@component/layout/DashboardPageHeader";
import VendorDashboardLayout from "@component/layout/VendorDashboardLayout";
import TextField, { MaskInput } from "@component/text-field/TextField";
import { Formik } from "formik";
import { GetServerSideProps } from "next";
import React, { useEffect, useState } from "react";
import { parseCookies } from "nookies";
import * as yup from "yup";
import { api } from "services/api";
import { getProductById } from "services/product";
import Stepper from "@component/stepper/Stepper";
import { useRouter } from "next/router";
import Box from "@component/Box";
import Accordion from "@component/accordion/Accordion";
import AccordionHeader from "@component/accordion/AccordionHeader";
import { toast } from "react-nextjs-toast";
import Icon from "@component/icon/Icon";
import { patchColors, postColors, removeColors } from "services/color";
import ColorField from "@component/color-field/ColorField";

const ProductColors = (props) => {
  const [product, setProduct] = useState(props.product);
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
        router.push(`/vendor/add-product/variations/${id}`);
        break;
      case 2:
        router.push(`/vendor/add-product/colors/${id}`);
        break;
      case 3:
        router.push(`/vendor/add-product/sizes/${id}`);
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
      case `/vendor/add-product/variations/[id]`:
        setSelectedStep(2);
        break;
      case `/vendor/add-product/colors/[id]`:
        setSelectedStep(3);
        break;
      case `/vendor/add-product/sizes/[id]`:
        setSelectedStep(4);
        break;

      default:
        break;
    }
  }, [route]);

  const handleFormSubmit = async (values) => {
    let result;
    const { netAmount, weight, height, width, name } = values;
    let newColorss = [...product.variations];

    const payload = {
      netAmount: Number(netAmount),
      height,
      name,
      weight,
      width,
    };

    const index =
      values.id === undefined
        ? product.variations.length - 1
        : props?.product?.colors?.findIndex((item) => item.id === values.id);

    newColorss[index].loading.create = true;
    setProduct({ ...product, colors: newColorss });

    if (values.id !== undefined) {
      delete payload.name;
      result = await patchColors(id, payload);
    } else result = await postColors(id, payload);

    if (typeof result === "string") {
      toast.notify(result, {
        title: "Erro!",
        duration: 5,
        type: "error",
      });
    } else {
      toast.notify(`Cor ${values.id ? "alterada" : "adicionada"}`, {
        title: "Sucesso!",
        duration: 5,
        type: "success",
      });
      router.reload();
    }

    newColorss[index].loading.create = false;
    setProduct({ ...product, colors: newColorss });
  };

  const deleteColors = async (id, index) => {
    let newColorss = [...product.variations];
    newColorss[index].loading.delete = true;
    setProduct({ ...product, colors: newColorss });

    const result = await removeColors(id);

    if (typeof result === "string") {
      toast.notify(result, {
        title: "Erro!",
        duration: 5,
        type: "error",
      });
    } else {
      toast.notify(`Cor deletada`, {
        title: "Sucesso!",
        duration: 5,
        type: "success",
      });
      router.reload();
    }

    newColorss[index].loading.delete = false;
    setProduct({ ...product, colors: newColorss });
  };

  return (
    <div>
      <DashboardPageHeader
        title={`Produto ${product.name}`}
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
        {product.variations
          .filter((i) => i.type === "default")
          .map((item, index) => {
            return (
              <Formik
                key={index}
                initialValues={item}
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
                }) => {
                  return (
                    <form onSubmit={handleSubmit}>
                      <Accordion
                        key={index}
                        isForm
                        expanded={index === product.variations.length - 1}
                      >
                        <AccordionHeader px="0px" py="6px">
                          <h1>
                            {index === product.variations.length - 1
                              ? "Nova cor"
                              : `Cor ${index + 1}`}
                          </h1>
                        </AccordionHeader>
                        <Grid container spacing={4}>
                          <Grid item sm={12} xs={12}> 
                          <ColorField label="Tet"/>
                          </Grid>
                          <Grid item sm={3} xs={12}>
                            <TextField
                              name={`netAmount`}
                              label="Valor liquido"
                              placeholder="Valor liquido"
                              mask={MaskInput.money}
                              addonBefore="R$"
                              fullwidth
                              onBlur={handleBlur}
                              onChange={handleChange}
                              value={values?.netAmount || ""}
                              errorText={
                                touched?.netAmount && errors?.netAmount
                              }
                            />
                          </Grid>
                          <Grid item sm={3} xs={12}>
                            <TextField
                              name={`weight`}
                              label="Peso"
                              placeholder="Peso"
                              type="number"
                              addonAfter={"kg"}
                              fullwidth
                              onBlur={handleBlur}
                              onChange={handleChange}
                              value={values?.weight || ""}
                              errorText={touched?.weight && errors?.weight}
                            />
                          </Grid>
                          <Grid item sm={3} xs={12}>
                            <TextField
                              name={`height`}
                              label="Altura"
                              placeholder="Altura"
                              type="number"
                              addonAfter={"cm"}
                              fullwidth
                              onBlur={handleBlur}
                              onChange={handleChange}
                              value={values?.height || ""}
                              errorText={touched?.height && errors?.height}
                            />
                          </Grid>
                          <Grid item sm={3} xs={12}>
                            <TextField
                              name={`width`}
                              label="Largura"
                              placeholder="Largura"
                              type="number"
                              addonAfter={"cm"}
                              fullwidth
                              onBlur={handleBlur}
                              onChange={handleChange}
                              value={values?.width || ""}
                              errorText={touched?.width && errors?.width}
                            />
                          </Grid>
                          <Grid
                            item
                            sm={12}
                            xs={12}
                            style={{ display: "flex", gap: 16 }}
                          >
                            <Button
                              mt="25px"
                              variant="contained"
                              color="primary"
                              type="submit"
                              loading={values?.loading?.create}
                            >
                              {index === product.variations.length - 1
                                ? "Criar"
                                : "Alterar"}{" "}
                              cor
                            </Button>
                            {index !== product.variations.length - 1 ? (
                              <Button
                                mt="25px"
                                variant="outlined"
                                color="primary"
                                onClick={() => deleteColors(values.id, index)}
                                type="button"
                                loading={values?.loading?.delete}
                              >
                                Remover cor
                              </Button>
                            ) : (
                              <Button
                                mt="25px"
                                variant="outlined"
                                type="button"
                                route={`/vendor/add-product/colors/${id}`}
                              >
                                Próximo
                                <Icon size="18px" defaultcolor="auto">
                                  arrow-right
                                </Icon>
                              </Button>
                            )}
                          </Grid>
                        </Grid>
                      </Accordion>
                    </form>
                  );
                }}
              </Formik>
            );
          })}
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
  loading: { create: false, delete: false },
};

const checkoutSchema = yup.object().shape({
  name: yup.string().required("campo requerido"),
  netAmount: yup.number().required("campo requerido"),
  weight: yup.number().required("campo requerido"),
  height: yup.number().required("campo requerido"),
  width: yup.number().required("campo requerido"),
  image: yup.array().min(1, "selecione uma imagem").required("campo requerido"),
});

ProductColors.layout = VendorDashboardLayout;

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
  const { id } = ctx.query;
  try {
    api.interceptors.request.use((config) => {
      config.headers["Authorization"] = `Bearer ${token}`;
      return config;
    });

    const [product] = await Promise.all([getProductById(id)]);
    console.log("====================================");
    console.log(product);
    console.log("====================================");
    return {
      props: { product },
    };
  } catch (err) {
    return {
      notFound: true,
    };
  }
};

export default ProductColors;
