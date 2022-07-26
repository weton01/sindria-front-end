import Card from "@component/Card";
import DropZone, { handleOnChangeImage } from "@component/DropZone";
import FlexBox from "@component/FlexBox";
import Icon from "@component/icon/Icon";
import Rating from "@component/rating/Rating";
import TextArea from "@component/textarea/TextArea";
import Typography, { H3, H5 } from "@component/Typography";
import Button from "@component/buttons/Button";
import React from "react";
import * as yup from "yup";
import { Formik } from "formik";
import ErrorMessage from "@component/ErrorMessage";

export interface FormFeedbackProps {
  onCloseModal?: () => void;
}

const FormFeedback: React.FC<FormFeedbackProps> = ({ onCloseModal }) => {
  const handleFormSubmit = (values) => { 
  };

  return (
    <Card p="2rem 3rem" position="relative" width={600}>
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
          setFieldError,
          setFieldTouched,
          setFieldValue,
        }) => (
          <form onSubmit={handleSubmit}>
            <FlexBox flexDirection={"column"} alignItems={"center"}>
              <H3 textAlign="center" mb="0.5rem">
                Ajude-nos com seu feeback
              </H3>
              <H5
                fontWeight="600"
                fontSize="12px"
                color="gray.800"
                textAlign="center"
                mb="2.25rem"
              >
                O que você está achando do site?
                <Typography fontSize={12} fontWeight={400} textAlign={"center"}>
                  Escolha de 1 a 5 estrelas para classificar.
                </Typography>
              </H5>
              <Rating
                value={4}
                outof={5}
                color="warn"
                readonly={false}
                onChange={(value) => {
                  //setFieldValue("rating", value);
                }}
              />
              <FlexBox flexDirection={"column"} width={"100%"}>
                <FlexBox justifyContent={"space-between"} marginTop={16}>
                  <Typography fontSize={16} fontWeight={600} display={"flex"}>
                    <Icon size="24px" defaultcolor="auto" marginRight={2}>
                      comment
                    </Icon>
                    Deixe um comentário
                  </Typography>
                  {values.description.length}/300
                </FlexBox>
                <TextArea
                  fullwidth
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
                  title="Arraste ou solte a imagem do problema aqui"
                  imgs={values.image}
                />

                {touched.image && errors.image && (
                  <ErrorMessage name={"image"} />
                )}

                <FlexBox justifyContent={"flex-end"} marginTop="16px">
                  <Button  color="secondary" onClick={onCloseModal}>
                    Cancelar
                  </Button>
                  <Button
                    // loading={loading} 
                    variant="contained"
                    color="primary"
                    type="submit"
                    minWidth={140}
                  >
                    Enviar
                  </Button>
                </FlexBox>
              </FlexBox>
            </FlexBox>
          </form>
        )}
      </Formik>
    </Card>
  );
};

const initialValues = {
  rating: 4,
  description: "",
  image: [],
};

const checkoutSchema = yup.object().shape({});

export default FormFeedback;
