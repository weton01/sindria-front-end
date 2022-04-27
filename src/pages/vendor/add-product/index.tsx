import Button from "@component/buttons/Button";
import Card from "@component/Card";
import DropZone from "@component/DropZone";
import Grid from "@component/grid/Grid";
import DashboardPageHeader from "@component/layout/DashboardPageHeader";
import VendorDashboardLayout from "@component/layout/VendorDashboardLayout";
import Select from "@component/Select";
import TextField, { MaskInput } from "@component/text-field/TextField";
import TextArea from "@component/textarea/TextArea";
import { Field, Formik } from "formik";
import { GetServerSideProps } from "next";
import React, { useEffect, useState } from "react";
import { parseCookies } from "nookies";
import * as yup from "yup";
import { api, patch, post } from "services/api";
import { getSubCategory } from "services/category";
import { getTags } from "services/tags";
import { getUrlAssign } from "services/product";
import ErrorMessage from "@component/ErrorMessage";
import Stepper from "@component/stepper/Stepper";
import { useRouter } from "next/router";
import Box from "@component/Box";
import axios from "axios";
import { getBrands } from "services/brand";
import { processFile } from "@utils/utils";
import { toast } from "react-nextjs-toast";

const AddProduct = (props) => {
  const { categories, tags, brands } = props;
  const [selectedStep, setSelectedStep] = useState(0);
  const router = useRouter();
  const edit = router?.query?.id ? true : false;
  const id = router?.query?.id;
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
    console.log(values);

    const { categories, tags, brand, grossAmount, netAmount } = values;
    const payload = {
      ...values,
      brand: { id: brand.value },
      grossAmount: Number(grossAmount),
      netAmount: Number(netAmount),
      categories: categories.map((item) => ({
        id: item.value,
      })),
      tags: tags.map((item) => ({
        id: item.value,
      })),
    };
    let product;

    if (edit) product = await patch("product/v1", payload);
    else product = await post("product/v1", payload);

    if (typeof product === "string") {
      toast.notify(product, {
        title: "Erro!",
        duration: 5,
        type: "error",
      });
    } else {
      toast.notify(`Produto ${edit ? "alterada" : "adicionada"}`, {
        title: "Sucesso!",
        duration: 5,
        type: "success",
      });
    }
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
            route="/vendor/add-product/products"
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
            handleSubmit,setFieldTouched,
            setFieldValue,
            setFieldError,
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
                <Grid item xs={12}>
                  <Field name="images">
                    {({ meta }) => (
                      <div>
                        <DropZone
                          imgs={values.images}
                          removeImage={(index) => {
                            const images = values.images;
                            images.splice(index, 1);
                            setFieldValue("images", images);
                          }}
                          title="Arraste ou solte a imagem do produto aqui"
                          onChange={ (files) => {
                            files.forEach(async (file: File) => { 
                              const { url } = await getUrlAssign();
                              let fd = new FormData();
                              const blob: any = await processFile(file);
                              const image = new Image();
                              image.onload = () => {
                                const canvas = document.createElement("canvas");
                                canvas.width = image.naturalWidth;
                                canvas.height = image.naturalHeight;
                                  console.log(image.naturalWidth);
                                if(image.naturalWidth > 480 || image.naturalHeight > 480){ 
                                  setFieldError("images", "limite da dimensão da imagem é 480*480");
                                  setFieldTouched("images", true, false);
                                  return
                                }
                                canvas.getContext("2d").drawImage(image, 0, 0);
                                canvas.toBlob(async (blob) => {
                                  const myImage = new File([blob], file.name, {
                                    type: blob.type,
                                  });
                                  fd.append("acl", "public-read");
                                  fd.append("Content-Type", "image/webp");

                                  fd.append("key", url.put.fields["key"]);
                                  fd.append("bucket", url.put.fields["bucket"]);
                                  fd.append(
                                    "X-Amz-Algorithm",
                                    url.put.fields["X-Amz-Algorithm"]
                                  );
                                  fd.append(
                                    "X-Amz-Credential",
                                    url.put.fields["X-Amz-Credential"]
                                  );
                                  fd.append(
                                    "X-Amz-Date",
                                    url.put.fields["X-Amz-Date"]
                                  );

                                  fd.append(
                                    "X-Amz-Signature",
                                    url.put.fields["X-Amz-Signature"]
                                  );

                                  fd.append("Policy", url.put.fields["Policy"]);

                                  fd.append("file", myImage);
                                  const result = await axios.post(
                                    url.put.url,
                                    fd
                                  );
                                  const images = values.images;

                                  images.push(url.get);
                                  setFieldValue("images", images);
                                }, "image/webp");
                              };
                              image.src = blob;
                            });
                          }}
                        />
                        {meta.touched && meta.error && (
                          <ErrorMessage name="images" />
                        )}
                      </div>
                    )}
                  </Field>
                </Grid>
                <Grid item xs={12}>
                  <TextArea
                    name="description"
                    label="Descrição"
                    placeholder="Descrição"
                    rows={6}
                    fullwidth
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.description || ""}
                    errorText={touched.description && errors.description}
                  />
                </Grid>
                <Grid item sm={6} xs={12}>
                  <TextField
                    name="grossAmount"
                    label="Valor Bruto"
                    placeholder="Valor bruto"
                    mask={MaskInput.money}
                    addonBefore="R$"
                    fullwidth
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.grossAmount || ""}
                    errorText={touched.grossAmount && errors.grossAmount}
                  />
                </Grid>
                <Grid item sm={6} xs={12}>
                  <TextField
                    name="netAmount"
                    label="Valor liquido"
                    placeholder="Valor liquido"
                    mask={MaskInput.money}
                    addonBefore="R$"
                    fullwidth
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.netAmount || ""}
                    errorText={touched.netAmount && errors.netAmount}
                  />
                </Grid>
                <Grid item sm={12} xs={12}>
                  <Select
                    name="brand"
                    label="Marcas"
                    placeholder="Selecione a marca"
                    options={brands}
                    onBlur={handleBlur}
                    onChange={(e) => {
                      setFieldValue("brand", e || []);
                    }}
                    defaultValue={values.brand || ""}
                    errorText={touched.brand && errors.brand}
                  />
                </Grid>
                <Grid item sm={12} xs={12}>
                  <Select
                    name="categories"
                    label="Categorias"
                    placeholder="Selecione as categorias"
                    isMulti
                    options={categories}
                    onBlur={handleBlur}
                    onChange={(e) => {
                      setFieldValue("categories", e || []);
                    }}
                    defaultValue={values.categories || ""}
                    errorText={touched.categories && errors.categories}
                  />
                </Grid>
                <Grid item sm={12} xs={12}>
                  <Select
                    name="tags"
                    label="Etiquetas"
                    placeholder="Selecione as etiquetas"
                    isMulti
                    options={tags}
                    onBlur={handleBlur}
                    onChange={(e) => {
                      setFieldValue("tags", e || []);
                    }}
                    defaultValue={values.tags || ""}
                    errorText={touched.tags && errors.tags}
                  />
                </Grid>
              </Grid>
              <Button
                mt="25px"
                variant="contained"
                color="primary"
                type="submit"
              >
                Criar
              </Button>
            </form>
          )}
        </Formik>
      </Card>
    </div>
  );
};

const initialValues = {
  name: "",
  grossAmount: "",
  netAmount: "",
  tags: [],
  categories: [],
  images: [],
  brand: "",
};

const checkoutSchema = yup.object().shape({
  name: yup.string().required("campo requerido"),
  description: yup.string().required("campo requerido"),
  grossAmount: yup.number().required("campo requerido"),
  netAmount: yup.number().required("campo requerido"),
  images: yup
    .array()
    .min(1, "selecione uma imagem")
    .required("campo requerido"),
  categories: yup
    .array()
    .min(1, "selecione uma categoria")
    .required("campo requerido"),
  tags: yup
    .array()
    .min(1, "selecione uma etiqueta")
    .required("campo requerido"),
  brand: yup.object().required("campo requerido"),
});

AddProduct.layout = VendorDashboardLayout;

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

    const [categories, tags, brands] = await Promise.all([
      getSubCategory(),
      getTags(),
      getBrands(),
    ]);

    const newCategories = categories?.items?.map((item) => {
      return {
        label: item.name,
        value: item.id,
      };
    });

    const newTags = tags?.items?.map((item) => {
      return {
        label: item.name,
        value: item.id,
      };
    });

    const newBrands = brands?.items?.map((item) => {
      return {
        label: item.name,
        value: item.id,
      };
    });

    return {
      props: { categories: newCategories, tags: newTags, brands: newBrands },
    };
  } catch (err) {
    console.log("fail to verify tokens", err);
  }

  return {
    props: {},
  };
};

export default AddProduct;
