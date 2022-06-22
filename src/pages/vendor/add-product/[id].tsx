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
import * as yup from "yup";
import { getSubCategory } from "services/category";
import { getTags } from "services/tags";
import { getProductById, getUrlAssign } from "services/product";
import ErrorMessage from "@component/ErrorMessage";
import Stepper from "@component/stepper/Stepper";
import { useRouter } from "next/router";
import Box from "@component/Box";
import axios from "axios";
import { getBrands } from "services/brand";
import { processFile } from "@utils/utils";
import Icon from "@component/icon/Icon";
import { authRoute } from "middlewares/authRoute";
import { request } from "services/api";

const EditProduct = (props) => {
  const { categories, tags, brands, product } = props;
  const [selectedStep, setSelectedStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const id = router?.query?.id;
  const { route } = router;

  const valuesForm = {
    name: product.name,
    categories: product.categories,
    brand: product.brand,
    tags: product.tags,
    description: product.description,
    grossAmount: product.grossAmount,
    netAmount: product.netAmount,
    images: product.images,
  };

  console.log(tags);

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
    const { categories, tags, brand, grossAmount, netAmount } = values;
    const payload = {
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
    setLoading(true);
    await request.patch({
      route: `product/v1/${id}`,
      payload,
      message: "Produto alterado!",
      actionSuccess: (product) =>
        router.push(`/vendor/add-product/variations/${product.id}`),
    });

    setLoading(false);
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
        <Formik
          initialValues={valuesForm}
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
            setFieldTouched,
            setFieldValue,
            setFieldError,
          }) => {
            return (
              <form onSubmit={handleSubmit}>
                <Grid container spacing={6}>
                  <Grid item sm={12} xs={12}>
                    <TextField
                      disabled
                      name="name"
                      label="Nome"
                      placeholder="Nome do produto"
                      fullwidth
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.name || ""}
                      errorText={touched?.name && errors?.name}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Field name="images">
                      {({ meta }) => (
                        <div>
                          <DropZone
                            multiple={true}
                            imgs={values.images}
                            setFieldValue={setFieldValue}
                            title="Arraste ou solte a imagem do produto aqui"
                            onChange={(files, setLoading) => {
                              files.forEach(async (file: File, index) => {
                                const { url } = await getUrlAssign();
                                let fd = new FormData();
                                const blob: any = await processFile(file);
                                const image = new Image();
                                image.onload = () => {
                                  const canvas =
                                    document.createElement("canvas");
                                  canvas.width = image.naturalWidth;
                                  canvas.height = image.naturalHeight;
                                  console.log(image.naturalWidth);
                                  if (
                                    image.naturalWidth > 480 ||
                                    image.naturalHeight > 480
                                  ) {
                                    setFieldError(
                                      "images",
                                      "limite da dimensão da imagem é 480*480"
                                    );
                                    setFieldTouched("images", true, false);
                                    setLoading(false);
                                    return;
                                  }
                                  canvas
                                    .getContext("2d")
                                    .drawImage(image, 0, 0);
                                  canvas.toBlob(async (blob) => {
                                    const myImage = new File(
                                      [blob],
                                      file.name,
                                      {
                                        type: blob.type,
                                      }
                                    );
                                    fd.append("acl", "public-read");
                                    fd.append("Content-Type", "image/webp");

                                    fd.append("key", url.put.fields["key"]);
                                    fd.append(
                                      "bucket",
                                      url.put.fields["bucket"]
                                    );
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

                                    fd.append(
                                      "Policy",
                                      url.put.fields["Policy"]
                                    );

                                    fd.append("file", myImage);
                                    await axios.post(url.put.url, fd, {
                                      onUploadProgress: (
                                        progress: ProgressEvent
                                      ) => {
                                        let percent = Math.round(
                                          (progress.loaded * 100) /
                                            progress.total
                                        );
                                        if (
                                          percent === 100 &&
                                          files?.length - 1 === index
                                        ) {
                                          setLoading(false);
                                        }
                                      },
                                    });
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
                      label="Marca"
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
                <Grid item sm={12} xs={12} style={{ display: "flex", gap: 16 }}>
                  <Button
                    mt="25px"
                    variant="contained"
                    color="primary"
                    type="submit"
                    loading={loading}
                  >
                    Editar
                  </Button>
                  <Button
                    mt="25px"
                    variant="outlined"
                    type="button"
                    route={`/vendor/add-product/variations/${id}`}
                  >
                    Próximo
                    <Icon size="18px" defaultcolor="auto">
                      arrow-right
                    </Icon>
                  </Button>
                </Grid>
              </form>
            );
          }}
        </Formik>
      </Card>
    </div>
  );
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

EditProduct.layout = VendorDashboardLayout;

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

export const getServerSideProps: GetServerSideProps = async (c) => {
  return authRoute(c, async ({ token, id }: any) => {
    try {
      let [categories, tags, brands, product] = await Promise.all([
        getSubCategory({ token }),
        getTags(),
        getBrands({ token }),
        getProductById({ id, token }),
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

      product.brand = {
        label: product.brand.name,
        value: product.brand.id,
      };

      product.categories = product?.categories?.map((item) => {
        return {
          label: item.name,
          value: item.id,
        };
      });

      product.tags = product?.tags?.map((item) => {
        return {
          label: item.name,
          value: item.id,
        };
      });

      return {
        props: {
          categories: newCategories,
          tags: newTags,
          brands: newBrands,
          product,
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

export default EditProduct;
