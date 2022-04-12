import { useFormik } from "formik";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import * as yup from "yup";
import Button from "../buttons/Button";
import FlexBox from "../FlexBox";
import TextField from "../text-field/TextField";
import { H3, H5, H6, SemiSpan } from "../Typography";
import { StyledSessionCard } from "./SessionStyle";
import { api } from "services/api";


const RecoverPassword: React.FC = () => { 
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter(); 

  const handleFormSubmit = async (values) => {
    setLoading(true);
    try {
      await api.post("auth/v1/recover-password", values);  
      router.push(`mail/confirm-recover/${values.email}`);
    } catch (error) {
      if(error?.response?.data?.active === false){  
        router.push(`/code-user/${error?.response?.data?.id}`);
      }
      setMessage(error?.response?.data?.message || "Erro inesperado!");
    }
    setLoading(false)
  };

  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      onSubmit: handleFormSubmit,
      initialValues,
      validationSchema: formSchema,
    });

  return (
    <StyledSessionCard mx="auto" my="2rem" boxShadow="large">
      <form className="content" onSubmit={handleSubmit}>
        <H3 textAlign="center" mb="0.5rem">
          Esqueceu sua senha de login?
        </H3>
        <H5
          fontWeight="600"
          fontSize="12px"
          color="gray.800"
          textAlign="center"
          mb="2.25rem"
        >
          Informe seu e-mail de cadastro
        </H5>

        <TextField
          mb="0.75rem"
          name="email"
          placeholder="exemplo@mail.com"
          label="Email"
          type="email"
          fullwidth
          onBlur={handleBlur}
          onChange={handleChange}
          value={values.email || ""}
          errorText={touched.email && errors.email}
        /> 

        <Button
          mb="1.65rem"
          variant="contained"
          color="primary"
          type="submit"
          fullwidth
          loading={loading}
        >
          Enviar
        </Button>
        <H5
          fontWeight="600"
          fontSize="12px"
          color="red"
          textAlign="center"
          mb="2.25rem"
        >
          {message}
        </H5>
 
      </form>

      <FlexBox justifyContent="center" bg="gray.200" py="19px">
        <SemiSpan>Não possui uma conta?</SemiSpan>
        <Link href="/signup">
            <a>
              <H6 ml="0.5rem" borderBottom="1px solid" borderColor="gray.900">
                Inscrever-se
              </H6>
            </a>
          </Link>
      </FlexBox>
    </StyledSessionCard>
  );
};

const initialValues = {
  email: "", 
};

const formSchema = yup.object().shape({
  email: yup.string().email("email inválido").required("email requerido"), 
});

export default RecoverPassword;
