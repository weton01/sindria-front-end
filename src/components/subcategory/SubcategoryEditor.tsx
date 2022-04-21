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
import Select from "@component/Select";

const SubcategoryEditor = (props) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [id, setId] = useState(router?.query?.id);
  const edit = router?.query?.id ? true : false;
  let valuesSubcategory = undefined;

  if (props?.data) {
    valuesSubcategory = props?.data;
    delete valuesSubcategory?.id;
  }

  const handleFormSubmit = async (values) => {
    setLoading(true);
    try {
      const payload = {
        groupName: values.groupName,
        name: values.name,
      };

      if (edit) delete payload.name;

      if (edit) {
        await api.patch(`category/v1/sub-category/${id}`, payload);
      } else await api.post(`category/v1/sub-category/${id}`, payload);
      toast.notify(`Subcategoria ${edit ? "alterada" : "adicionada"}`, {
        title: "Sucesso!",
        duration: 5,
        type: "success",
      });
      router.push("../subcategory");
    } catch (err) {
      toast.notify(err.response.data.message, {
        title: "Erro!",
        duration: 5,
        type: "error",
      });
    }
    setLoading(false);
  };

  if (edit) {
    delete checkoutSchema.fields.id;
    delete checkoutSchema.fields.name;
  }

  return (
    <div>
      <DashboardPageHeader
        iconName="pin_filled"
        title={`${edit ? "Alterar" : "Adicionar nova "} subcategoria`}
        button={
          <Button
            color="primary"
            bg="primary.light"
            px="2rem"
            route="/subcategory"
          >
            Voltar a subcategorias
          </Button>
        }
      />
      <Card1>
        <Formik
          initialValues={valuesSubcategory || initialValues}
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
            setFieldValue,
          }) => (
            <form onSubmit={handleSubmit}>
              <Box mb="30px">
                <Grid container horizontal_spacing={6} vertical_spacing={4}>
                  {!edit ? (
                    <Grid item md={4} xs={12}>
                      <Select
                        placeholder="selecione a categoria"
                        name="id"
                        label="Categoria"
                        options={props.options}
                        value={values.id}
                        errorText={touched.id && errors.id}
                        onChange={(event: any) => {
                          setFieldValue("id", event);
                          setId(event.value);
                        }}
                      />
                    </Grid>
                  ) : (
                    <></>
                  )}
                  {!edit ? (
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
                  ) : (
                    <></>
                  )}
                  <Grid item md={12} xs={12}>
                    <TextField
                      name="groupName"
                      label="Grupo"
                      fullwidth
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.groupName || ""}
                      errorText={touched.groupName && errors.groupName}
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
  groupName: "",
  name: "",
  id: "",
};

const checkoutSchema = yup.object().shape({
  id: yup.object().required("categoria requerido"),
  groupName: yup.string().required("grupo requerido"),
  name: yup.string().required("nome requerido"),
});

SubcategoryEditor.layout = DashboardLayout;

export default SubcategoryEditor;
