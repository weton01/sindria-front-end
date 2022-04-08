import { useFormik } from "formik";
import Link from "next/link";
import React, { useState } from "react";
import * as yup from "yup";
import { useRouter } from "next/router";
import Button from "../buttons/Button";
import IconButton from "../buttons/IconButton";
import CheckBox from "../CheckBox";
import FlexBox from "../FlexBox";
import Icon from "../icon/Icon";
import TextField from "../text-field/TextField";
import { H3, H5, H6, SemiSpan } from "../Typography";
import { StyledSessionCard } from "./SessionStyle";
import { api } from "services/api";

const Signup: React.FC = () => {
  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisibility((visible) => !visible);
  };

  const handleFormSubmit = async (values) => {
    setLoading(true);
    try {
      delete values.re_password;
      delete values.agreement;
      const { data, status } = await api.post("auth/signup", values);
      if (status === 201) {
        localStorage.setItem("user", JSON.stringify(data));
        router.push(`/code-user/${data.id}`);
      }
    } catch (error) {
      setMessage(error?.response?.data?.message || "Erro inesperado!");
    }
    setLoading(false);
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
          Crie Sua Conta
        </H3>
        <H5
          fontWeight="600"
          fontSize="12px"
          color="gray.800"
          textAlign="center"
          mb="2.25rem"
        >
          Por favor, preencha todos os formulários para continuar
        </H5>

        <TextField
          mb="0.75rem"
          name="username"
          label="Nome Completo"
          placeholder="João da Silva"
          fullwidth
          onBlur={handleBlur}
          onChange={handleChange}
          value={values.username || ""}
          errorText={touched.username && errors.username}
        />
        <TextField
          mb="0.75rem"
          name="email"
          placeholder="exmple@mail.com"
          label="Email"
          type="email"
          fullwidth
          onBlur={handleBlur}
          onChange={handleChange}
          value={values.email || ""}
          errorText={touched.email && errors.email}
        />
        <TextField
          mb="0.75rem"
          name="password"
          placeholder="*********"
          type={passwordVisibility ? "text" : "password"}
          label="Senha"
          fullwidth
          endAdornment={
            <IconButton
              size="small"
              type="button"
              p="0.25rem"
              mr="0.25rem"
              color={passwordVisibility ? "gray.700" : "gray.600"}
              onClick={togglePasswordVisibility}
            >
              <Icon variant="small" defaultcolor="currentColor">
                {passwordVisibility ? "eye-alt" : "eye"}
              </Icon>
            </IconButton>
          }
          onBlur={handleBlur}
          onChange={handleChange}
          value={values.password || ""}
          errorText={touched.password && errors.password}
        />
        <TextField
          mb="1rem"
          name="re_password"
          placeholder="*********"
          type={passwordVisibility ? "text" : "password"}
          label="Confirmar Senhar"
          fullwidth
          endAdornment={
            <IconButton
              size="small"
              type="button"
              p="0.25rem"
              mr="0.25rem"
              color={passwordVisibility ? "gray.700" : "gray.600"}
              onClick={togglePasswordVisibility}
            >
              <Icon variant="small" defaultcolor="currentColor">
                {passwordVisibility ? "eye-alt" : "eye"}
              </Icon>
            </IconButton>
          }
          onBlur={handleBlur}
          onChange={handleChange}
          value={values.re_password || ""}
          errorText={touched.re_password && errors.re_password}
        />

        <CheckBox
          mb="1.75rem"
          name="agreement"
          color="secondary"
          checked={values.agreement}
          onChange={handleChange}
          label={
            <FlexBox>
              <SemiSpan>Li e concordo com os </SemiSpan>
              <a href="/" target="_blank" rel="noreferrer noopener">
                <H6 ml="0.5rem" borderBottom="1px solid" borderColor="gray.900">
                  Termos & Condições
                </H6>
              </a>
            </FlexBox>
          }
        />

        <Button
          mb="1.65rem"
          variant="contained"
          color="primary"
          type="submit"
          fullwidth
          loading={loading}
        >
          Criar Conta
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
        {/* 
        <Box mb="1rem">
          <Divider width="200px" mx="auto" />
          <FlexBox justifyContent="center" mt="-14px">
            <Span color="text.muted" bg="body.paper" px="1rem">
              Ou
            </Span>
          </FlexBox>
        </Box>
        
        <FlexBox
          justifyContent="center"
          alignItems="center"
          bg="#3B5998"
          borderRadius={5}
          height="40px"
          color="white"
          cursor="pointer"
          mb="0.75rem"
        >
          <Icon variant="small" defaultcolor="auto" mr="0.5rem">
            facebook-filled-white
          </Icon>
          <Small fontWeight="600">Continue with Facebook</Small>
        </FlexBox>

        <FlexBox
          justifyContent="center"
          alignItems="center"
          bg="#4285F4"
          borderRadius={5}
          height="40px"
          color="white"
          cursor="pointer"
          mb="1.25rem"
        >
          <Icon variant="small" defaultcolor="auto" mr="0.5rem">
            google-1
          </Icon>
          <Small fontWeight="600">Continue with Google</Small>
        </FlexBox> */}
      </form>
      <FlexBox justifyContent="center" bg="gray.200" py="19px">
        <SemiSpan>Não possui uma conta?</SemiSpan>
        <Link href="/login">
          <a>
            <H6 ml="0.5rem" borderBottom="1px solid" borderColor="gray.900">
              Entre
            </H6>
          </a>
        </Link>
      </FlexBox>
    </StyledSessionCard>
  );
};

const initialValues = {
  username: "",
  email: "",
  password: "",
  re_password: "",
  agreement: false,
};

const formSchema = yup.object().shape({
  username: yup.string().required("nome requerido"),
  email: yup.string().email("email inválido").required("email requerido"),
  password: yup.string().required("senha requerida"),
  re_password: yup
    .string()
    .oneOf([yup.ref("password"), null], "As senhas devem corresponder")
    .required("digite a senha novamente"),
  agreement: yup
    .bool()
    .test(
      "agreement",
      "Você tem que concordar com nossos Termos e Condições!",
      (value) => value === true
    )
    .required("Você tem que concordar com nossos Termos e Condições!"),
});

export default Signup;
