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
import Link from "next/link";
import React from "react";
import { parseCookies } from "nookies";
import * as yup from "yup";
import { api, post, put } from "services/api";
import { getSubCategory } from "services/category";
import { getTags } from "services/tags";
import { postUrlAssign } from "services/product";
import ErrorMessage from "@component/ErrorMessage";

const AddProduct = (props) => {
  const { categories, tags } = props;
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
    console.log(payload);
  };

  return (
    <div>
      <DashboardPageHeader
        title="Add Product"
        iconName="delivery-box"
        button={
          <Link href="/vendor/products">
            <Button color="primary" bg="primary.light" px="2rem">
              Back to Product List
            </Button>
          </Link>
        }
      />

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
                <Grid item xs={12}>
                  <Field name="images">
                    {({ meta }) => (
                      <div>
                        <DropZone
                          imgs={values.images}
                          removeImage={(index) => {
                            const images = values.images;
                            images.splice(index, 1)
                            setFieldValue("images", images);
                          }}
                          title="Arraste ou solte a imagem do produto aqui"
                          onChange={async (files) => {
                            const { url } = await postUrlAssign();
                            console.log(files);

                            files.forEach(async (file) => {
                              const reader = new FileReader();
                              reader.onabort = () =>
                                console.log("file reading was aborted");
                              reader.onerror = () =>
                                console.log("file reading has failed");
                              reader.onloadend = async () => {
                                const binaryStr = reader.result;
                                console.log(binaryStr);

                                const result = await put(url.put, binaryStr, {
                                  headers: { "Content-Type": "image/webp" },
                                });
                              }; 
                              const images = values.images;
                              images.push(
                                "https://hips.hearstapps.com/vader-prod.s3.amazonaws.com/1588187076-greentshirt-1588187065.jpg"
                              );
                              setFieldValue("images", images);
                              reader.readAsBinaryString(file); 
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
                Save product
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
  images: ["https://hips.hearstapps.com/vader-prod.s3.amazonaws.com/1588187076-greentshirt-1588187065.jpg"],
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
});

AddProduct.layout = VendorDashboardLayout;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { ["shop_token"]: token } = parseCookies(ctx);

  try {
    api.interceptors.request.use((config) => {
      config.headers["Authorization"] = `Bearer ${token}`;
      return config;
    });

    const [categories, tags] = await Promise.all([getSubCategory(), getTags()]);

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

    return {
      props: { categories: newCategories, tags: newTags },
    };
  } catch (err) {
    console.log("fail to verify tokens", err);
  }

  return {
    props: {},
  };
};

export default AddProduct;
