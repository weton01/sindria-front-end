import { useFormik } from "formik";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useCallback, useState } from "react";
import * as yup from "yup";
import Button from "../buttons/Button";
import IconButton from "../buttons/IconButton";
import FlexBox from "../FlexBox";
import Icon from "../icon/Icon";
import TextField from "../text-field/TextField";
import { H3, H5, H6, SemiSpan } from "../Typography";
import { StyledSessionCard } from "./SessionStyle";
import { api } from "services/api";


const RecoverPasswordCallback: React.FC = () => {
  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const togglePasswordVisibility = useCallback(() => {
    setPasswordVisibility((visible) => !visible);
  }, []);

  const handleFormSubmit = async (values) => {
    setLoading(true);
    try {
      delete values.confPassword;
      await api.post(
        `auth/recover-password/callback/${router.query.token}`,
        values
      );
      router.push("/");
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
          Nova senha
        </H3>
        <H5
          fontWeight="600"
          fontSize="12px"
          color="gray.800"
          textAlign="center"
          mb="2.25rem"
        >
          Forneça a nova senha para altera-la
        </H5>

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
        <TextField
          mb="1rem"
          name="confPassword"
          placeholder="*********"
          autoComplete="on"
          type={passwordVisibility ? "text" : "password"}
          label="Confirmar Senha"
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
          value={values.confPassword || ""}
          errorText={touched.confPassword && errors.confPassword}
        />

        <Button
          mb="1.65rem"
          variant="contained"
          color="primary"
          type="submit"
          fullwidth
          loading={loading}
        >
          Alterar
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
  password: "",
};

const formSchema = yup.object().shape({
  password: yup.string().required("senha requerida"),
  confPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "As senhas não iguais")
    .required("confirme sua senha"),
});

export default RecoverPasswordCallback;
