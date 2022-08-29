import Button from "@component/buttons/Button";
import Grid from "@component/grid/Grid";
import TextField, { MaskInput } from "@component/text-field/TextField";
import { FieldArray, Formik } from "formik";
import React, { useState } from "react";
import * as yup from "yup";
import { useRouter } from "next/router";
import Accordion from "@component/accordion/Accordion";
import AccordionHeader from "@component/accordion/AccordionHeader";
import Icon from "@component/icon/Icon";
import FlexBox from "@component/FlexBox";
import Avatar from "@component/avatar/Avatar";
import Typography from "@component/Typography";
import {
  patchColor,
  postColor,
  removeColor,
} from "services/inventory/variations/color";
import Select, { colourOptions } from "@component/Select";

const ColorsForm = (props) => {
  const [product, setProduct] = useState(props.product);
  const [colors, setColors] = useState([]);
  const router = useRouter();
  const id = router?.query?.id;

  const handleFormSubmit = async (values) => {
    const { netAmount, weight, height, width, color, length } = values;
    console.log("values ->>", values);

    let newColors: any = [...product.colors];
    const payload = {
      netAmount: Number(netAmount),
      height,
      weight,
      width,
      color,
      length,
    };

    const index =
      values.id === undefined
        ? product.colors?.length - 1
        : props?.product?.colors?.findIndex((item) => item.id === values.id);

    newColors[index].loading.create = true;
    setProduct({ ...product, colors: newColors });

    if (values.id !== undefined) {
      await patchColor({
        id: newColors[index].id,
        payload,
        actionSuccess: () => router.reload(),
      });
    } else
      await postColor({
        id,
        payload,
        actionSuccess: () => router.reload(),
      });

    newColors[index].loading.create = false;
    setProduct({ ...product, colors: newColors });
  };

  return (
    <div>
      <Formik
        initialValues={{ colors: [] }}
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
        }) => {
          return (
            <form onSubmit={handleSubmit}>
              <Select
                placeholder="Quais cores seu produto vai ter?"
                closeMenuOnSelect={false}
                isMulti
                options={colourOptions}
                marginTop="16px"
                onChange={(e: any) => {
                  setFieldValue("colors", e || []);
                  console.log(values.colors);
                }}
              />
              <FieldArray name="colors">
                {() =>
                  values?.colors?.map((color, index) => {
                    console.log("collorrs ->>", touched.colors);

                    const ticketErrors =
                      (errors.colors?.length && errors.colors[index]) || {};
                    const ticketTouched =
                      (Array.isArray(touched.colors) &&
                        touched.colors[index]) ||
                      {};

                    return (
                      <FlexBox marginTop={16}>
                        <Accordion key={index} isForm expanded>
                          <AccordionHeader
                            px="0px"
                            py="6px"
                            alignItems={"center"}
                          >
                            <Typography fontSize={16} fontWeight={600}>
                              <FlexBox alignItems="center">
                                <Avatar
                                  bg="primary.main"
                                  size={25}
                                  color="primary.text"
                                  mr="0.675rem"
                                >
                                  {index + 1}ª
                                </Avatar>
                                <FlexBox
                                  justifyContent={"center"}
                                  alignItems="center"
                                  gap={8}
                                >
                                  <Typography fontSize="18px">
                                    {color.label}
                                  </Typography>
                                </FlexBox>
                              </FlexBox>
                            </Typography>
                          </AccordionHeader>
                          <Grid container spacing={4}>
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
                                  ticketTouched.netAmount && ticketErrors.netAmount
                                }
                              />
                            </Grid>
                            <Grid item sm={2} xs={12}>
                              <TextField
                                name={`weight`}
                                label="Peso"
                                placeholder="0.5kg"
                                type="number"
                                addonAfter={"kg"}
                                fullwidth
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values?.weight || ""}
                                errorText={ticketTouched.weight && ticketErrors.weight}
                              />
                            </Grid>
                            <Grid item sm={2} xs={12}>
                              <TextField
                                name={`height`}
                                label="Altura"
                                placeholder="14cm"
                                type="number"
                                addonAfter={"cm"}
                                fullwidth
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values?.height || ""}
                                errorText={ticketTouched.height && ticketErrors.height}
                              />
                            </Grid>
                            <Grid item sm={2} xs={12}>
                              <TextField
                                name={`width`}
                                label="Largura"
                                placeholder="12cm"
                                type="number"
                                addonAfter={"cm"}
                                fullwidth
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values?.width || ""}
                                errorText={ticketTouched.width && ticketErrors.width}
                              />
                            </Grid>
                            <Grid item sm={2} xs={12}>
                              <TextField
                                name={`length`}
                                label="Comprimento"
                                placeholder="22cm"
                                type="number"
                                addonAfter={"cm"}
                                fullwidth
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values?.length || ""}
                                errorText={ticketTouched.length && ticketErrors.length}
                              />
                            </Grid>
                          </Grid>
                        </Accordion>
                      </FlexBox>
                    );
                  })
                }
              </FieldArray>
              <hr style={{ marginTop: 24 }} />
              <FlexBox justifyContent={"space-between"}>
                <Button
                  mt="25px"
                  variant="contained"
                  color="primary"
                  type="submit"
                >
                  Salvar
                </Button>
                <Button
                  mt="25px"
                  type="button"
                  color="secondary"
                  route={`/vendor/add-product/sizes/${id}`}
                >
                  Próximo
                  <Icon size="18px" defaultcolor="auto">
                    arrow-right
                  </Icon>
                </Button>
              </FlexBox>
            </form>
          );
        }}
      </Formik>
    </div>
  );
};

const checkoutSchema = yup.object().shape({});

export default ColorsForm;
