import Box from "@component/Box";
import Button from "@component/buttons/Button";
import Grid from "@component/grid/Grid";
import MaskedInputCustom from "@component/masked-input/MaskedInput";
import TextField from "@component/text-field/TextField";
import { Formik } from "formik";
import React, { useState } from "react";
import * as yup from "yup";
import cep from "cep-promise";
import DashboardLayout from "../layout/CustomerDashboardLayout";
import { api } from "services/api";
import { toast } from "react-nextjs-toast";
import { useRouter } from "next/router";

const AdressForm = (props) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const edit = router?.query?.id ? true : false;
  const id = router?.query?.id;
  let valuesAddress = undefined;

  if (props?.data) {
    valuesAddress = props?.data;
    delete valuesAddress.id;
    delete valuesAddress.created_at;
    delete valuesAddress.updated_at;
    delete valuesAddress.user;
  }

  const handleFormSubmit = async (values, {resetForm}) => {
    delete values.service;
    const payload = {
      ...values,
      cep: values.cep.includes("-")
        ? values.cep
        : values.cep.substring(0, 5) + "-" + values.cep.substring(5),
    };
    setLoading(true);
    try {
      if (edit) await api.patch(`address/v1/${id}`, payload);
      else await api.post("address/v1", payload);
      toast.notify(`Endereço ${edit ? "alterado" : "adicionado"}`, {
        title: "Sucesso!",
        duration: 5,
        type: "success",
      });
      resetForm()
      router.push(props.redirect);
    } catch (err) {
      toast.notify(err.response.data.message, {
        title: "Erro!",
        duration: 5,
        type: "error",
      });
    }
    setLoading(false);
  };

  const setNewCep = async (setValues, setFieldError, newCep) => {
    if (newCep !== undefined) {
      const cepFormated = newCep.replace(/-/g, "").replace(/_/g, "");
      if (cepFormated?.length > 7) {
        try {
          const response = await cep(newCep);
          setValues({ ...response });
        } catch (error) {
          setFieldError("cep", "Cep inválido");
        }
      }
    }
  };

  return (

    <Formik
      initialValues={valuesAddress || initialValues}
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
        setValues,
        setFieldError,
        
      }) => (
        <form onSubmit={handleSubmit}>
          <Box mb="30px">
            <Grid container horizontal_spacing={6} vertical_spacing={4}>
              <Grid item md={2} xs={12}>
                <MaskedInputCustom
                  name="cep"
                  label="CEP"
                  fullwidth
                  mask="11111-111"
                  onBlur={(info) => {
                    handleBlur(info);
                    setNewCep(setValues, setFieldError, values.cep);
                  }}
                  onChange={handleChange}
                  value={values.cep || ""}
                  errorText={touched.cep && errors.cep}
                />
              </Grid>
              <Grid item md={8} xs={12}>
                <TextField
                  name="city"
                  label="Cidade"
                  fullwidth
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.city || ""}
                  errorText={touched.city && errors.city}
                />
              </Grid>
              <Grid item md={2} xs={12}>
                <TextField
                  name="state"
                  label="Estado"
                  fullwidth
                  maxLength={2}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.state || ""}
                  errorText={touched.state && errors.state}
                />
              </Grid>
              <Grid item md={5} xs={12}>
                <TextField
                  name="neighborhood"
                  label="Bairro"
                  fullwidth
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.neighborhood || ""}
                  errorText={touched.neighborhood && errors.neighborhood}
                />
              </Grid>
              <Grid item md={5} xs={12}>
                <TextField
                  name="street"
                  label="Rua"
                  fullwidth
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.street || ""}
                  errorText={touched.street && errors.street}
                />
              </Grid>
              <Grid item md={2} xs={12}>
                <TextField
                  name="number"
                  label="Número"
                  fullwidth
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.number || ""}
                  errorText={touched.number && errors.number}
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <TextField
                  name="complement"
                  label="Complemento"
                  fullwidth
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.complement || ""}
                  errorText={touched.complement && errors.complement}
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


  );
};

const initialValues = {
  cep: "",
  city: "",
  address: "",
  state: "",
  street: "",
  neighborhood: "",
  complement: "",
  number: ""
};

const checkoutSchema = yup.object().shape({
  cep: yup.string().required("cep requerido"),
  city: yup.string().required("cidade requerido"),
  state: yup.string().required("estado requerido")?.length(2, "máximo 2 siglas"),
  street: yup.string().required("rua requerida"),
  neighborhood: yup.string().required("bairro requerida"),
  number: yup.number().typeError("somente número").required("número requerido"),
});

AdressForm.layout = DashboardLayout;

export default AdressForm;
