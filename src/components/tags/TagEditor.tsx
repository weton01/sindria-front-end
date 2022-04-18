import Box from "@component/Box";
import Button from "@component/buttons/Button";
import { Card1 } from "@component/Card1";
import Grid from "@component/grid/Grid";
import DashboardPageHeader from "@component/layout/DashboardPageHeader";
import TextField from "@component/text-field/TextField";
import { Formik } from "formik";
import React, { useState } from "react";
import * as yup from "yup";
import DashboardLayout from "@component/layout/CustomerDashboardLayout";
import { api } from "services/api";
import { toast } from "react-nextjs-toast";
import { useRouter } from "next/router";

const TagsEditor = (props) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter(); 
  let valuesTags = undefined;

  if (props?.data) {
    valuesTags = props?.data;
    delete valuesTags?.id;
    delete valuesTags?.created_at;
    delete valuesTags?.updated_at; 
  }

  const handleFormSubmit = async (values) => {
    setLoading(true);
    try {
     await api.post("tag/v1", values);
      toast.notify(`Tag adicionada`, {
        title: "Sucesso!",
        duration: 5,
        type: "success",
      });
      router.push("../tags");
    } catch (err) {
      toast.notify(err.response.data.message, {
        title: "Erro!",
        duration: 5,
        type: "error",
      });
    }
    setLoading(false);
  };

  return (
    <div>
      <DashboardPageHeader
        iconName="comment"
        title={`Adicionar nova etiqueta`}
        button={
          <Button color="primary" bg="primary.light" px="2rem" route="/tags">
            Voltar as etiquetas
          </Button>
        }
      />
      <Card1>
        <Formik
          initialValues={valuesTags || initialValues}
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
          }) => (
            <form onSubmit={handleSubmit}>
              <Box mb="30px">
                <Grid container horizontal_spacing={6} vertical_spacing={4}>
                  <Grid item md={12} xs={12}>
                    <TextField
                      name="name"
                      label="Nome"
                      fullwidth
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.name || ""}
                      errorText={touched.name && errors.name} 
                    />
                  </Grid> 
                </Grid>
              </Box>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                loading={loading}
              >
                Adicionar
              </Button>
            </form>
          )}
        </Formik>
      </Card1>
    </div>
  );
};

const initialValues = { 
  name: "",
};

const checkoutSchema = yup.object().shape({ 
  name: yup.string().required("nome requerido"),
});

TagsEditor.layout = DashboardLayout;

export default TagsEditor;
