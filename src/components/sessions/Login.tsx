import { useFormik } from "formik";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useCallback, useState } from "react";
import * as yup from "yup";
import Box from "../Box";
import Button from "../buttons/Button";
import IconButton from "../buttons/IconButton";
import Divider from "../Divider";
import FlexBox from "../FlexBox";
import Icon from "../icon/Icon";
import TextField from "../text-field/TextField";
import { H3, H5, H6, SemiSpan, Small, Span } from "../Typography";
import { StyledSessionCard } from "./SessionStyle";
import { api } from "services/api"; 
import { useAppDispatch } from "hooks/hooks";

import { setCookie } from 'nookies'
import { userSignin } from "store/userSlice";

const Login: React.FC = () => {
  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();
  const dispatch = useAppDispatch(); 
  
  const togglePasswordVisibility = useCallback(() => {
    setPasswordVisibility((visible) => !visible);
  }, []);

  const handleGoogleLogin = async () =>{
    const { data } = await api.get("auth/google", values);

  }

  const handleFacebookLogin = async () =>{
    const { data } = await api.get("auth/facebook", values);

  }

  const handleFormSubmit = async (values) => {
    setLoading(true);
    try {
      const { data } = await api.post("auth/v1/signin", values); 
      setCookie(undefined, 'shop_token', data?.token.toString(), {
        maxAge: 60 * 60  * 7,
        path: '/'
      })
      dispatch(userSignin(data));
      router.back();
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
          Bem-vindo ao Shop
        </H3>
        <H5
          fontWeight="600"
          fontSize="12px"
          color="gray.800"
          textAlign="center"
          mb="2.25rem"
        >
          Faça login com e-mail e senha
        </H5>

        <TextField
          mb="0.75rem"
          name="email"
          placeholder="exemplo@mail.com"
          label="Email ou número de telefone"
          type="email"
          fullwidth
          onBlur={handleBlur}
          onChange={handleChange}
          value={values.email || ""}
          errorText={touched.email && errors.email}
        />
        <TextField
          mb="1rem"
          name="password"
          placeholder="*********"
          autoComplete="on"
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

        <Button
          mb="1.65rem"
          variant="contained"
          color="primary"
          type="submit"
          fullwidth
          loading={loading}
        >
          Entrar
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
          onClick={handleFacebookLogin}
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
          onClick={handleGoogleLogin}
        >
          <Icon variant="small" defaultcolor="auto" mr="0.5rem">
            google-1
          </Icon>
          <Small fontWeight="600" >Continue with Google</Small>
        </FlexBox> 
        <FlexBox justifyContent="center" mb="1.25rem">
          <SemiSpan>Não possui uma conta?</SemiSpan>
          <Link href="/signup">
            <a>
              <H6 ml="0.5rem" borderBottom="1px solid" borderColor="gray.900">
                Inscrever-se
              </H6>
            </a>
          </Link>
        </FlexBox>
      </form>

      <FlexBox justifyContent="center" bg="gray.200" py="19px">
        <SemiSpan>Esqueceu sua senha?</SemiSpan>
        <Link href="/recover-password">
          <a>
            <H6 ml="0.5rem" borderBottom="1px solid" borderColor="gray.900">
              Recupere
            </H6>
          </a>
        </Link>
      </FlexBox>
    </StyledSessionCard>
  );
};

const initialValues = {
  email: "",
  password: "",
};

const formSchema = yup.object().shape({
  email: yup.string().email("email inválido").required("email requerido"),
  password: yup.string().required("senha requerida"),
});

export default Login;
