import Box from "@component/Box";
import Card from "@component/Card";
import FlexBox from "@component/FlexBox";
import Icon from "@component/icon/Icon";
import MaskedInputCustom from "@component/masked-input/MaskedInput";
import Typography from "@component/Typography";
import React from "react";
import Button from "@component/buttons/Button";
import Grid from "@component/grid/Grid";
import * as yup from "yup";
import cep from "cep-promise";
import { Formik } from "formik";

export interface CepCartProps {
  name?: string;
  address?: string;
}

const CepCart: React.FC<CepCartProps> = ({ name, address }) => {
  
  const setNewCep = async (setValues, setFieldError, newCep) => {
    if (newCep !== undefined) {
      const cepFormated = newCep.replace(/-/g, "").replace(/_/g, "");
      if (cepFormated?.length > 7) {
        try {
          const response = await cep(newCep);
          setValues({ ...response });
        } catch (error) {
          setFieldError("cep", "Cep inválido");
        }
      }
    }
  };

  const handleFormSubmit = async (values) => {};

  return (
    <FlexBox
      className="root"
      position="relative"
      flexDirection="column"
      alignItems="center"
    >
      <FlexBox gap={4} marginTop="1" className="nav-link">
        <Icon defaultcolor="auto" size="22px">
          map-pin
        </Icon>
        <FlexBox flexDirection={"column"}>
          <Typography
            fontSize={11}
            color="gray.600"
            lineHeight={"11px"}
            fontWeight="600"
          >
            {name ? name : "informe seu"}
          </Typography>
          <Typography
            fontSize={12}
            fontWeight="600"
            fontFamily={"Proxima Nova,-apple-system,Roboto,Arial,sans-serif"}
          >
            {address ? address : "CEP"}
          </Typography>
        </FlexBox>
      </FlexBox>
      <Box className="root-child">
        <Card mt="1.25rem" p="24px" boxShadow="large" minWidth="300px">
          <Typography fontSize={"14px"} marginBottom="16px">
            para ver os melhores fretes e prazos para sua região
          </Typography>{" "}
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
              setFieldError,
            }) => (
              <form onSubmit={handleSubmit}>
                <Grid
                  container
                  horizontal_spacing={2}
                  vertical_spacing={2}
                  alignItems="flex-end"
                >
                  <Grid item md={9} xs={12}>
                    <MaskedInputCustom
                      name="cep"
                      label="digite seu CEP"
                      fullwidth
                      mask="11111-111"
                      onBlur={(info) => {
                        handleBlur(info);
                        setNewCep(setValues, setFieldError, values.cep);
                      }}
                      onChange={handleChange}
                      value={values.cep || ""}
                      errorText={touched.cep && errors.cep}
                    />
                  </Grid>
                  <Grid item md={3} xs={12}>
                    <Button type="submit" variant="outlined" color="primary">
                      OK
                    </Button>
                  </Grid>
                </Grid>
              </form>
            )}
          </Formik>
          <FlexBox flexDirection={"column"} gap={8} marginTop="16px">
            <Typography>acesse os endereços cadastrados</Typography>
            <Button type="submit" variant="contained" color="primary">
              Entrar
            </Button>
          </FlexBox>
        </Card>
      </Box>
    </FlexBox>
  );
};

CepCart.defaultProps = {};

const initialValues = {
  cep: "",
};

const checkoutSchema = yup.object().shape({
  cep: yup.string().required("cep requerido"),
});

export default CepCart;
