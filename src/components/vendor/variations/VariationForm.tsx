import Button from "@component/buttons/Button";
import Grid from "@component/grid/Grid";
import TextField, { MaskInput } from "@component/text-field/TextField";
import { Field, Formik } from "formik";
import React, { useEffect, useState } from "react";
import * as yup from "yup";
import { useRouter } from "next/router";
import DropZone, { handleOnChangeImage } from "@component/DropZone";
import ErrorMessage from "@component/ErrorMessage";
import Accordion from "@component/accordion/Accordion";
import AccordionHeader from "@component/accordion/AccordionHeader";
import Icon from "@component/icon/Icon";
import {
  patchVariation,
  postVariation,
  removeVariation,
} from "services/variation";
import FlexBox from "@component/FlexBox";
import Avatar from "@component/avatar/Avatar";
import Typography from "@component/Typography";

const VariationForm = (props) => {
  const [product, setProduct] = useState(props.product);
  const router = useRouter();
  const id = router?.query?.id;

  useEffect(() => {
    setProduct(props.product);
  }, [props]);

  const handleFormSubmit = async (values) => {
    const { netAmount, weight, height, width, image, name, length } = values;
    let newVariations: any = [...product.variations];
    const payload = {
      netAmount: Number(netAmount),
      height,
      name,
      weight,
      width,
      length,
      image:
        "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg", //image[0],
    };

    const index =
      values.id === undefined
        ? product.variations?.length - 1
        : props?.product?.variations?.findIndex(
            (item) => item.id === values.id
          );

    newVariations[index].loading.create = true;
    setProduct({ ...product, variations: newVariations });

    if (values.id !== undefined) {
      delete payload.image;
      delete payload.name;

      await patchVariation({
        id: newVariations[index].id,
        payload,
        actionSuccess: () => router.reload(),
      });
    } else
      await postVariation({
        id,
        payload,
        actionSuccess: () => router.reload(),
      });

    newVariations[index].loading.create = false;
    setProduct({ ...product, variations: newVariations });
  };

  const deleteVariation = async (id, index) => {
    let newVariations = [...product.variations];
    newVariations[index].loading.delete = true;
    setProduct({ ...product, variations: newVariations });
    await removeVariation({
      id,
    });
    router.reload();
  };

  return (
    <div>
      {product.variations
        .filter((i) => i.type === "default")
        ?.map((item, index) => {
          return (
            <div style={{ marginTop: 16 }}>
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
                  setFieldValue,
                  setFieldError,
                  setFieldTouched,
                }) => {
                  return (
                    <form onSubmit={handleSubmit}>
                      <Accordion
                        key={index}
                        isForm
                        expanded={index === product.variations?.length - 1}
                      >
                        <AccordionHeader
                          px="0px"
                          py="6px"
                          alignItems={"center"}
                        >
                          <h1>
                            {index === product.variations?.length - 1 ? (
                              "Nova variação"
                            ) : (
                              <FlexBox alignItems="center">
                                <Avatar
                                  bg="primary.main"
                                  size={25}
                                  color="primary.text"
                                  mr="0.675rem"
                                >
                                  {index + 1}ª
                                </Avatar>
                                <Typography fontSize="18px">
                                  {product.variations[index].name}
                                </Typography>
                              </FlexBox>
                            )}
                          </h1>
                        </AccordionHeader>
                        <Grid container spacing={4}>
                          <Grid item xs={12}>
                            <TextField
                              disabled={
                                index !== product.variations?.length - 1
                              }
                              name={`name`}
                              label="Nome"
                              placeholder="Nome do produto"
                              fullwidth
                              onChange={handleChange}
                              value={values.name || ""}
                              errorText={touched?.name && errors?.name}
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <Field name={"image"}>
                              {({ meta }) => (
                                <div>
                                  <DropZone
                                    disabled={
                                      index !== product.variations?.length - 1
                                    }
                                    notEdit={
                                      index !== product.variations?.length - 1
                                    }
                                    setFieldValue={setFieldValue}
                                    imgs={values.image}
                                    title="Arraste ou solte a imagem do produto aqui"
                                    onChange={(files, setLoading) => {
                                      handleOnChangeImage(
                                        files,
                                        setFieldError,
                                        setFieldTouched,
                                        setLoading,
                                        setFieldValue,
                                        values,
                                        false
                                      );
                                    }}
                                  />
                                  {meta?.touched && meta?.error && (
                                    <ErrorMessage name={"image"} />
                                  )}
                                </div>
                              )}
                            </Field>
                          </Grid>
                          <Grid item sm={4} xs={12}>
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
                          <Grid item sm={2} xs={12}>
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
                          <Grid item sm={2} xs={12}>
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
                          <Grid item sm={2} xs={12}>
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
                          <Grid item sm={2} xs={12}>
                            <TextField
                              name={`length`}
                              label="Comprimento"
                              placeholder="Largura"
                              type="number"
                              addonAfter={"cm"}
                              fullwidth
                              onBlur={handleBlur}
                              onChange={handleChange}
                              value={values?.length || ""}
                              errorText={touched?.length && errors?.length}
                            />
                          </Grid>
                          <Grid
                            item
                            sm={12}
                            xs={12}
                            style={{ display: "flex", gap: 16 }}
                            justifyContent={
                              index === product.variations?.length - 1 &&
                              "space-between"
                            }
                          >
                            <Button
                              mt="25px"
                              variant="contained"
                              color="primary"
                              type="submit"
                              loading={values?.loading?.create}
                            >
                              {index === product.variations?.length - 1
                                ? "Criar"
                                : "Alterar"}{" "}
                              variação
                            </Button>
                            {index !== product.variations?.length - 1 ? (
                              <Button
                                mt="25px"
                                color="primary"
                                onClick={() =>
                                  deleteVariation(
                                    product.variations[index].id,
                                    index
                                  )
                                }
                                type="button"
                                loading={values?.loading?.delete}
                              >
                                Remover variação
                              </Button>
                            ) : (
                              <Button
                                mt="25px"
                                type="button"
                                color="secondary"
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
              {index !== product.variations?.length - 1 && (
                <hr style={{ marginTop: 24 }} />
              )}
            </div>
          );
        })}
    </div>
  );
};

const checkoutSchema = yup.object().shape({
  name: yup.string().required("campo requerido"),
  netAmount: yup.number().required("campo requerido"),
  weight: yup.number().required("campo requerido"),
  height: yup.number().required("campo requerido"),
  width: yup.number().required("campo requerido"),
  length: yup.number().required("campo requerido"),
  //image: yup.array().min(1, "selecione uma imagem").required("campo requerido"),
});

export default VariationForm;
