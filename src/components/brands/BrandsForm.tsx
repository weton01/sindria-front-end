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

const BrandsEditor = (props) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const edit = router?.query?.id ? true : false;
  const id = router?.query?.id;
  let valuesBrands = undefined;

  if (props?.data) {
    valuesBrands = props?.data;
    delete valuesBrands?.id;
    delete valuesBrands?.created_at;
    delete valuesBrands?.updated_at; 
  }

  const handleFormSubmit = async (values) => {
    setLoading(true);
    try {
      if (edit) await api.patch(`brand/v1/${id}`, values);
      else await api.post("brand/v1", values);
      toast.notify(`Marca ${edit ? "alterado" : "adicionado"}`, {
        title: "Sucesso!",
        duration: 5,
        type: "success",
      });
      router.push("../brands");
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
        iconName="brand"
        title={`${edit ? "Alterar" : "Adicionar nova "} marca`}
        button={
          <Button color="primary" bg="primary.light" px="2rem" route="/brands">
            Voltar as marcas
          </Button>
        }
      />
      <Card1>
        <Formik
          initialValues={valuesBrands || initialValues}
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
                  <Grid item md={8} xs={12}>
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
                  <Grid item md={4} xs={12}>
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

BrandsEditor.layout = DashboardLayout;

export default BrandsEditor;
