import Button from "@component/buttons/Button";
import Grid from "@component/grid/Grid";
import TextField, { MaskInput } from "@component/text-field/TextField";
import { FieldArray, Formik } from "formik";
import React from "react";
import * as yup from "yup";
import { useRouter } from "next/router";
import Accordion from "@component/accordion/Accordion";
import AccordionHeader from "@component/accordion/AccordionHeader";
import Icon from "@component/icon/Icon";
import FlexBox from "@component/FlexBox";
import Avatar from "@component/avatar/Avatar";
import Typography from "@component/Typography"; 
import Select, { colourOptions, sizeOptions } from "@component/Select";
import { withRouter } from "next/router"; 

const SizesForm = (props) => { 
  const router = useRouter(); 

  const handleFormSubmit = async (values) => {  
    const productParse = JSON.parse(props?.router?.query?.product);
    const payload = {
      ...productParse,
      sizes: values,
    };

    router.push({
      pathname: `/vendor/add-product/sizes/`,
      query: { product: JSON.stringify(payload) },
    })
  };

  return (
    <div>
      <Formik
        initialValues={{ sizes: [] }}
        validationSchema={checkoutSchema}
        onSubmit={handleFormSubmit}
      >
        {({
          values,
          errors, 
          handleChange,
          handleBlur,
          handleSubmit,
          setFieldValue,
        }) => {
          return (
            <form onSubmit={handleSubmit}>
              <Select
                placeholder="Quais tamanhos seu produto vai ter?"
                closeMenuOnSelect={false}
                isMulti
                options={sizeOptions}
                marginTop="16px"
                onChange={(e: any) => {
                  setFieldValue("sizes", e || []);
                  console.log(values.sizes);
                }}
              />
              {values.sizes.length === 0 ? (
                <Typography
                  fontSize={"24px"}
                  fontWeight="600"
                  textAlign="center"
                  marginTop="54px"
                  marginBottom="24px"
                >
                  Nenhum tamanho selecionado!
                </Typography>
              ) : (
                <>
                  <FieldArray name="sizes">
                    {() =>
                      values?.sizes?.map((color, index) => {
                        const ticketErrors =
                          (errors.sizes?.length && errors.sizes[index]) || {}; 

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
                                      {index + 1}
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
                                    name={`sizes.${index}.netAmount`}
                                    label="Valor liquido"
                                    placeholder="Valor liquido"
                                    mask={MaskInput.money}
                                    addonBefore="R$"
                                    fullwidth
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values?.netAmount || ""}
                                    errorText={
                                      ticketErrors.netAmount
                                    }
                                  />
                                </Grid>
                                <Grid item sm={2} xs={12}>
                                  <TextField
                                    name={`sizes.${index}.weight`}
                                    label="Peso"
                                    placeholder="0.5kg"
                                    type="number"
                                    addonAfter={"kg"}
                                    fullwidth
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values?.weight || ""}
                                    errorText={
                                      ticketErrors.weight 
                                    }
                                  />
                                </Grid>
                                <Grid item sm={2} xs={12}>
                                  <TextField
                                    name={`sizes.${index}.height`}
                                    label="Altura"
                                    placeholder="14cm"
                                    type="number"
                                    addonAfter={"cm"}
                                    fullwidth
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values?.height || ""}
                                    errorText={
                                      ticketErrors.height  
                                    }
                                  />
                                </Grid>
                                <Grid item sm={2} xs={12}>
                                  <TextField
                                    name={`sizes.${index}.width`}
                                    label="Largura"
                                    placeholder="12cm"
                                    type="number"
                                    addonAfter={"cm"}
                                    fullwidth
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values?.width || ""}
                                    errorText={
                                      ticketErrors.width 
                                    }
                                  />
                                </Grid>
                                <Grid item sm={2} xs={12}>
                                  <TextField
                                    name={`sizes.${index}.length`}
                                    label="Comprimento"
                                    placeholder="22cm"
                                    type="number"
                                    addonAfter={"cm"}
                                    fullwidth
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values?.length || ""}
                                    errorText={
                                      ticketErrors.length 
                                    }
                                  />
                                </Grid>
                              </Grid>
                            </Accordion>
                          </FlexBox>
                        );
                      })
                    }
                  </FieldArray>
                </>
              )}
              <FlexBox justifyContent={"space-between"}>
                <Button
                  disabled={values.sizes.length === 0}
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
                  route={`/vendor/add-product/inventory`}
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

const checkoutSchema = yup.object().shape({
  sizes: yup.array(
    yup.object({
      netAmount: yup.number().required("campo requerido!"),
      weight: yup.number().required("campo requerido!"),
      height: yup.number().required("campo requerido!"),
      width: yup.number().required("campo requerido!"),
      length: yup.number().required("campo requerido!"),
    })
  ),
});

export default withRouter(SizesForm);
