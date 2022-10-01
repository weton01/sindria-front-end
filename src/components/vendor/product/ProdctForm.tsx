import Button from "@component/buttons/Button";
import Card from "@component/Card";
import DropZone, { handleOnChangeImage } from "@component/DropZone";
import Grid from "@component/grid/Grid";
import Select from "@component/Select";
import TextField, { MaskInput } from "@component/text-field/TextField";
import TextArea from "@component/textarea/TextArea";
import { Field, Formik } from "formik";
import React, { useState } from "react";
import * as yup from "yup";
import { request } from "services/api";
import ErrorMessage from "@component/ErrorMessage";
import { useRouter } from "next/router";
import FlexBox from "@component/FlexBox";
import Avatar from "@component/avatar/Avatar";
import Typography from "@component/Typography";

const ProductForm = (props) => {
  const { categories, tags, brands, store, product, edit } = props;
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleFormSubmit = async (values) => {
    const {
      categories,
      tags,
      brand,
      unitMeasurement,
      grossAmount,
      netAmount,
      minSale,
      width,
      height,
      weight,
      length,
      store,
    } = values;

    const payload = {
      ...values,
      brand: { id: brand.value },
      images: [
        "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg",
      ],
      unitMeasurement: unitMeasurement.value,
      store: { id: store.value },
      grossAmount: Number(grossAmount),
      minSale: Number(minSale),
      width: Number(width),
      height: Number(height),
      weight: Number(weight),
      length: Number(length),
      netAmount: Number(netAmount),
      categories: categories.map((item) => ({
        id: item.value,
      })),
      tags: tags.map((item) => ({
        id: item.value,
      })),
    };

    setLoading(true);
    if (edit) {
      const id = payload.id;
      delete payload.id;
      delete payload.name;
      delete payload.rating;
      delete payload.reviewsQuantity;
      delete payload.salesQuantity;
      delete payload.created_at;
      delete payload.updated_at;
      delete payload.variations;
      delete payload.user;
      delete payload.mutations;

      await request.patch({
        route: `product/v1/${id}`,
        payload,
        message: `Produto alterado`,
        actionSuccess: (productEdited) => {
          router.push({
            pathname: `/vendor/add-product/colors/${productEdited.id}`,
          });
        },
        actionError: () =>{ 
           setLoading(false);
        }
      });
    } else 
      router.push({
        pathname: `/vendor/add-product/colors/`,
        query: { product: JSON.stringify(payload) },
      })
  };

  return (
    <Formik
      initialValues={product ? product : initialValues}
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
              <Grid item xs={12}>
                <Card p="30px" width="100%">
                  <FlexBox alignItems="center" marginBottom={16}>
                    <Avatar
                      bg="primary.main"
                      size={25}
                      color="primary.text"
                      mr="0.875rem"
                    >
                      1
                    </Avatar>
                    <Typography fontSize="18px">Detalhes do produto</Typography>
                  </FlexBox>
                  <Grid container spacing={6}>
                    <Grid item sm={12} xs={12}>
                      <TextField
                        disabled={edit}
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
                              setFieldValue={setFieldValue}
                              multiple={true}
                              imgs={values.images}
                              title="Arraste ou solte a imagem do produto aqui"
                              onChange={(files, setLoading) => {
                                handleOnChangeImage(
                                  files,
                                  setFieldError,
                                  setFieldTouched,
                                  setLoading,
                                  setFieldValue,
                                  values,
                                  true
                                );
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
                    <Grid item sm={3} xs={12}>
                      <TextField
                        name="minSale"
                        label="Venda mínima"
                        placeholder="5 produto"
                        fullwidth
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.minSale || ""}
                        errorText={touched.minSale && errors.minSale}
                      />
                    </Grid>
                    <Grid item sm={9} xs={12}>
                      <Select
                        name="unitMeasurement"
                        label="Unidade de medida"
                        placeholder="Selecione a unidade de medida"
                        options={unitMeasurement}
                        onBlur={handleBlur}
                        onChange={(e) => {
                          setFieldValue("unitMeasurement", e || []);
                        }}
                        defaultValue={values.unitMeasurement || ""}
                        errorText={
                          touched.unitMeasurement && errors.unitMeasurement
                        }
                      />
                    </Grid>
                    <Grid item sm={4} xs={12}>
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
                    <Grid item sm={8} xs={12}>
                      <Select
                        name="store"
                        label="Loja"
                        placeholder="Selecione a loja"
                        options={store}
                        onBlur={handleBlur}
                        onChange={(e) => {
                          setFieldValue("store", e);
                        }}
                        defaultValue={values.store || ""}
                        errorText={touched.store && errors.store}
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
                </Card>
              </Grid>
              <Grid item xs={12}>
                <Card p="30px" width="100%">
                  <FlexBox alignItems="center" marginBottom={16}>
                    <Avatar
                      bg="primary.main"
                      size={25}
                      color="primary.text"
                      mr="0.875rem"
                    >
                      2
                    </Avatar>
                    <Typography fontSize="18px">
                      Informações de envio
                    </Typography>
                  </FlexBox>
                  <Grid container spacing={6}>
                    <Grid item sm={6} xs={12} xl={6}>
                      <TextField
                        name="width"
                        label="Tamanho"
                        placeholder={`40cm`}
                        addonAfter={"cm"}
                        fullwidth
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.width || ""}
                        errorText={touched.width && errors.width}
                      />
                    </Grid>
                    <Grid item sm={6} xs={12} xl={6}>
                      <TextField
                        name="height"
                        label="Altura"
                        placeholder={`30cm`}
                        addonAfter={"cm"}
                        fullwidth
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.height || ""}
                        errorText={touched.height && errors.height}
                      />
                    </Grid>
                    <Grid item sm={6} xs={12} xl={6}>
                      <TextField
                        name="length"
                        label="Comprimento"
                        placeholder={`30cm`}
                        addonAfter={"cm"}
                        fullwidth
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.length || ""}
                        errorText={touched.length && errors.length}
                      />
                    </Grid>
                    <Grid item sm={6} xs={12} xl={6}>
                      <TextField
                        name="weight"
                        label="Peso"
                        placeholder={`450kg`}
                        addonAfter={"cm"}
                        fullwidth
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.weight || ""}
                        errorText={touched.weight && errors.weight}
                      />
                    </Grid>
                  </Grid>
                </Card>
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  loading={loading}
                >
                  {edit ? "Editar produto" : "Criar produto"}
                </Button>
              </Grid>
            </Grid>
          </form>
        );
      }}
    </Formik>
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
  minSale: "",
  unitMeasurement: "",
  store: "",
  length: "",
  weight: "",
  height: "",
  width: "",
};

const unitMeasurement = [
  { label: "KG", value: "KG" },
  { label: "CM", value: "CM" },
  { label: "MT", value: "MT" },
  { label: "LT", value: "LT" },
  { label: "UN", value: "UN" },
];

const checkoutSchema = yup.object().shape({
  name: yup.string().required("campo requerido"),
  description: yup.string().required("campo requerido"),
  grossAmount: yup.number().required("campo requerido"),
  netAmount: yup.number().required("campo requerido"),
  /*  images: yup
    .array()
    .min(1, "selecione uma imagem")
    .required("campo requerido"), */
  categories: yup
    .array()
    .min(1, "selecione uma categoria")
    .required("campo requerido"),
  tags: yup
    .array()
    .min(1, "selecione uma etiqueta")
    .required("campo requerido"),
  brand: yup.object().required("campo requerido"),
  minSale: yup.number().required("campo requerido"),
  unitMeasurement: yup.lazy((value) => {
    switch (typeof value) {
      case "string":
        return yup.string().required("Campo Obrigatório"); // schema for string
      default:
        return yup.object().required("Campo Obrigatório"); // here you can decide what is the default
    }
  }),
  store: yup.lazy((value) => {
    switch (typeof value) {
      case "string":
        return yup.string().required("Campo Obrigatório"); // schema for string
      default:
        return yup.object().required("Campo Obrigatório"); // here you can decide what is the default
    }
  }),
  length: yup.number().required("campo requerido"),
  weight: yup.number().required("campo requerido"),
  height: yup.number().required("campo requerido"),
  width: yup.number().required("campo requerido"),
});

export default ProductForm;
