import Box from "@component/Box";
import Button from "@component/buttons/Button";
import { Card1 } from "@component/Card1";
import Grid from "@component/grid/Grid";
import DashboardPageHeader from "@component/layout/DashboardPageHeader";
import TextField from "@component/text-field/TextField";
import { Formik } from "formik";
import React, { useState } from "react";
import * as yup from "yup";
import DashboardLayout from "../layout/CustomerDashboardLayout";
import { api } from "services/api";
import { toast } from "react-nextjs-toast";
import { useRouter } from "next/router";

const CategoryEditor = (props) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const edit = router?.query?.id ? true : false;
  const id = router?.query?.id;
  let valuesCategory = undefined;

  if (props?.data) {
    valuesCategory = props?.data;
    delete valuesCategory.id;
    delete valuesCategory.created_at;
    delete valuesCategory.updated_at;
  }

  const handleFormSubmit = async (values) => {
    delete values.groupName;
    setLoading(true);
    try {
      if (edit) {
        delete values.name;
        await api.patch(`category/v1/${id}`, values);
      } else await api.post("category/v1", values);
      toast.notify(`Categoria ${edit ? "alterada" : "adicionada"}`, {
        title: "Sucesso!",
        duration: 5,
        type: "success",
      });
      router.push("../categories");
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
        iconName="pin_filled"
        title={`${edit ? "Alterar" : "Adicionar novo "} categoria`}
        button={
          <Button
            color="primary"
            bg="primary.light"
            px="2rem"
            route="/categories"
          >
            Voltar ao categorias
          </Button>
        }
      />
      <Card1>
        <Formik
          initialValues={valuesCategory || initialValues}
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
                  {edit === false ? (
                    <Grid item md={8} xs={12}>
                      <TextField
                        name="name"
                        label="Nome"
                        fullwidth
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.name   || ""}
                        errorText={touched.name && errors.name}
                      />
                    </Grid>
                  ) : <></>} 
                  <Grid item md={edit ? 12 : 4} xs={12}>
                    <TextField
                      name="image"
                      label="Icone"
                      fullwidth
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.image || ""}
                      errorText={touched.image && errors.image}
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
                {edit ? "Alterar" : "Adicionar"}
              </Button>
            </form>
          )}
        </Formik>
      </Card1>
    </div>
  );
};

const initialValues = {
  image: "",
  name: "",
};

const checkoutSchema = yup.object().shape({
  image: yup.string().required("icone requerido"),
  name: yup.string().required("nome requerido"),
});

CategoryEditor.layout = DashboardLayout;

export default CategoryEditor;
