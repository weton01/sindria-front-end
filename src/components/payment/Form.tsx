import Button from "@component/buttons/Button";
import Grid from "@component/grid/Grid";
import TextField from "@component/text-field/TextField";
import { Formik } from "formik";
import React from "react";
import Cards from "react-credit-cards";
import MaskedInputCustom from "@component/masked-input/MaskedInput";
import FlexBox from "@component/FlexBox";

const FormPayment = ({
  initialValues,
  checkoutSchema,
  handleFormSubmit,
  loading = false,
}) => {
  return (
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
        setValues,
      }) => {
        const handleFocus = (e) => {
          const { name } = e.target;
          setValues({ ...values, focus: name });
        };

        return (
          <form onSubmit={handleSubmit}>
            <Grid container alignItems={"center"}>
              <Grid item md={6} xs={12} spacing={0} >
                <FlexBox alignItems="center" justifyContent="flex-start" >
                  <div>
                    <Cards
                      cvc={values.cvc}
                      expiry={values.expiry}
                      focused={values.focus}
                      name={values.name}
                      number={values.number}
                      /* preview={true}
                      issuer="mastercard" */
                      placeholders={{ name: "NOME COMPLETO" }}
                      locale={{ valid: "válido até" }}
                    />
                  </div>
                </FlexBox>
              </Grid>
              <Grid item md={6} xs={12}>
                <Grid container alignItems={"flex-start"} spacing={4}>
                  <Grid item md={12} xs={12}>
                    <MaskedInputCustom
                      name="number"
                      label="Número do cartão"
                      fullwidth
                      mask="1111 1111 1111 1111"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      onFocus={handleFocus}
                      value={values.number || ""}
                      errorText={touched.number && errors.number}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <TextField
                      name="name"
                      label="Nome do titular do cartão"
                      fullwidth
                      onBlur={handleBlur}
                      onChange={handleChange}
                      onFocus={handleFocus}
                      value={values.name || ""}
                      errorText={touched.name && errors.name}
                    />
                  </Grid>
                  <Grid item md={6} xs={6}>
                    <MaskedInputCustom
                      name="expiry"
                      label="Válido até"
                      fullwidth
                      mask="11/1111"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      onFocus={handleFocus}
                      value={values.expiry || ""}
                      errorText={touched.expiry && errors.expiry}
                    />
                  </Grid>
                  <Grid item md={6} xs={6}>
                    <MaskedInputCustom
                      name="cvc"
                      label="CVC"
                      mask="111"
                      fullwidth
                      onBlur={handleBlur}
                      onChange={handleChange}
                      onFocus={handleFocus}
                      value={values.cvc || ""}
                      errorText={touched.cvc && errors.cvc}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              style={{ marginTop: 32 }}
              loading={loading}
            >
              Adicionar
            </Button>
          </form>
        );
      }}
    </Formik>
  );
};

export default FormPayment;
