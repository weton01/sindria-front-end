import Divider from "@component/Divider";
import DropZone, { handleOnChangeImage } from "@component/DropZone";
import FlexBox from "@component/FlexBox";
import { colors } from "@utils/themeColors";
import React, { useState } from "react";
import { Formik } from "formik";
import * as yup from "yup";
import ErrorMessage from "@component/ErrorMessage";
import Grid from "@component/grid/Grid";
import Box from "@component/Box";
import Rating from "@component/rating/Rating";
import Typography from "@component/Typography";
import Icon from "@component/icon/Icon";
import TextArea from "@component/textarea/TextArea";
import Button from "@component/buttons/Button";
import { request } from "services/api";
import { useRouter } from "next/router";

export default function RateForm({ id }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleFormSubmit = async (values) => {  
    setLoading(true);
    await request.post({
      route: `review/v1/${id}`,
      payload: values,
      message: `Obrigado por dar seu feedback!`,
      actionSuccess: () => router.reload()}
    );
    setLoading(false);
  };

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
        setFieldTouched,
        setFieldValue,
        setFieldError,
      }) => { 
        return (
          <form onSubmit={handleSubmit}>
            <Box padding={16}>
              <Grid container>
                <Divider
                  width={"100%"}
                  backgroundColor={colors.gray[400]}
                  marginTop={2}
                  marginBottom={3}
                />
                <Grid item xs={12}>
                  <FlexBox
                    flexDirection={"column"}
                    alignItems={"center"}
                    gap={16}
                    marginBottom={16}
                  >
                    <Typography fontSize={16} fontWeight={600}>
                      O que você achou desse produto?
                      <Typography
                        fontSize={12}
                        fontWeight={400}
                        textAlign={"center"}
                      >
                        Escolha de 1 a 5 estrelas para classificar.
                      </Typography>
                    </Typography>
                    <Rating
                      value={4}
                      outof={5}
                      color="warn"
                      readonly={false}
                      onChange={(value) => {
                        setFieldValue("rating", value);
                      }}
                    />
                  </FlexBox>
                  <FlexBox justifyContent={"space-between"}>
                    <Typography fontSize={16} fontWeight={600} display={"flex"}>
                      <Icon size="24px" defaultcolor="auto" marginRight={2}>
                        comment
                      </Icon>
                      Deixe um comentário
                    </Typography>
                    {values.description.length}/300
                  </FlexBox>
                  <TextArea
                    maxLength={300}
                    name="description"
                    placeholder="Descrição"
                    rows={6}
                    marginBottom={3}
                    marginTop={2}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.description || ""}
                    errorText={touched.description && errors.description}
                  />
                  <DropZone
                    multiple={true}
                    setFieldValue={setFieldValue}
                    onChange={(files, setLoading) => {
                      handleOnChangeImage(
                        files,
                        setFieldError,
                        setFieldTouched,
                        setLoading,
                        setFieldValue,
                        values,
                        true
                      );
                    }}
                    title="Arraste ou solte a imagem do produto que chegou aqui"
                    imgs={values.image}
                  />

                  {touched.image && errors.image && (
                    <ErrorMessage name={"image"} />
                  )}

                  <Button
                    loading={loading}
                    mb="1.65rem"
                    variant="contained"
                    color="primary"
                    marginTop="16px"
                    type="submit"
                  >
                    Enviar
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </form>
        );
      }}
    </Formik>
  );
}

const initialValues = {
  rating: 4,
  description: "",
  image: [],
};

const checkoutSchema = yup.object().shape({
  rating: yup.string().required("avaliação requerida"),
  description: yup.string().required("descrição requerida"),
  image: yup.array().required("imagem requerida"),
});
