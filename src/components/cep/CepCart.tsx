import Box from "@component/Box";
import Card from "@component/Card";
import FlexBox from "@component/FlexBox";
import Icon from "@component/icon/Icon";
import MaskedInputCustom from "@component/masked-input/MaskedInput";
import Typography, { H6, Paragraph } from "@component/Typography";
import React, { useEffect, useState } from "react";
import Button from "@component/buttons/Button";
import Grid from "@component/grid/Grid";
import * as yup from "yup";
import cep from "cep-promise";
import { Formik } from "formik";
import ErrorMessage from "@component/ErrorMessage";
import UserOn from "@component/user-on/UserOn";
import { useSelector } from "react-redux";

export interface CepCartProps {
  address: [];
}

const CepCart: React.FC<CepCartProps> = ({ address }) => {
  const [currentCep, setCurrentCep]: any = useState({
    city: "",
    street: "",
    id: "",
  });
  const [dropdownActive, setDropdownActive] = useState(true);
  const cart = useSelector((selec: any) => selec.cart);
  const user = useSelector((selec: any) => selec.user);

  useEffect(() => {
    if (user?.token === "")
      setCurrentCep({ city: "", street: "", id: "" }); 
  }, [user]); 

  const setNewCep = async (setValues, setFieldError, newCep) => {
    if (newCep !== undefined) {
      const cepFormated = newCep.replace(/-/g, "").replace(/_/g, "");
      if (cepFormated?.length > 7) {
        try {
          const response = await cep(cepFormated);
          setCurrentCep({ ...response });
          setDropdownActive(false);
          setTimeout(() => {
            setDropdownActive(true);
          }, 500);
        } catch (error) {
          setFieldError("cep", "Cep inválido");
        }
      }
    }
  };

  const handleFormSubmit = async (values) => {};
 
  const setCurrentCepCart = (item) =>{ 
    setCurrentCep(item);
    setDropdownActive(false);
    setTimeout(() => {
      setDropdownActive(true);
    }, 500);
  }
  
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
            {currentCep.city !== "" ? "Endereço atual" : "informe seu"}
          </Typography>
          <Typography
            fontSize={12}
            fontWeight="600"
            fontFamily={"Proxima Nova,-apple-system,Roboto,Arial,sans-serif"}
            overflow={"hidden"}
            style={{
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: "180px",
            }}
          >
            {currentCep.city !== ""
              ? `${currentCep.city}, ${currentCep.street}`
              : "CEP"}
          </Typography>
        </FlexBox>
      </FlexBox>
      {dropdownActive ? (
        <Box className={"root-child"}>
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
                        fullwidth="true"
                        mask="11111-111"
                        onBlur={(info) => {
                          handleBlur(info);
                        }}
                        onChange={handleChange}
                        value={values.cep || ""}
                      />
                    </Grid>
                    <Grid item md={3} xs={12}>
                      <Button
                        type="button"
                        variant="outlined"
                        color="primary"
                        onClick={() =>
                          setNewCep(setValues, setFieldError, values.cep)
                        }
                      >
                        OK
                      </Button>
                    </Grid>
                    <Grid item md={12} xs={12}>
                      <ErrorMessage name={"cep"}></ErrorMessage>
                    </Grid>
                  </Grid>
                </form>
              )}
            </Formik>
            <UserOn
              notConnect={
                <FlexBox flexDirection={"column"} gap={8} marginTop="16px">
                  <Typography>acesse os endereços cadastrados</Typography>
                  <Button route={"login"} variant="contained" color="primary">
                    Entrar
                  </Button>
                </FlexBox>
              }
            >
              <FlexBox maxHeight={300} overflowY={"auto"}>
                <Grid container spacing={2}>
                  {cart?.address?.items?.map((item: any, ind) => (
                    <Grid item md={12} sm={12} xs={12} key={`addr-${ind}`}>
                      <Card
                        bg="gray.100"
                        p="0.5rem"
                        boxShadow="none"
                        border="1px solid"
                        cursor="pointer"
                        borderColor={
                          item.id === currentCep?.id
                            ? "primary.main"
                            : "transparent"
                        }
                        onClick={()=> setCurrentCepCart(item)}
                      >
                        <H6 mb="0.25rem" fontSize={12}>
                          CEP: {item.cep}
                        </H6>
                        <Paragraph color="gray.700" fontSize={12}>
                          {item.street}, {item.number}, {item.neighborhood}
                        </Paragraph>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </FlexBox>
            </UserOn>
          </Card>
        </Box>
      ) : null}
    </FlexBox>
  );
};

CepCart.defaultProps = {
  address: [],
};

const initialValues = {
  cep: "",
};

const checkoutSchema = yup.object().shape({
  cep: yup.string().required("cep requerido"),
});

export default CepCart;
