import Grid from "@component/grid/Grid";
import React, { useEffect, useState } from "react";
import Button from "@component/buttons/Button";
import Card from "@component/Card";
import { ErrorMessage, Formik } from "formik";
import * as yup from "yup";
import TextField from "@component/text-field/TextField";
import DropZone, { handleOnChangeImage } from "@component/DropZone";
import DashboardLayout from "@component/layout/CustomerDashboardLayout";
import FlexBox from "@component/FlexBox";
import Avatar from "@component/avatar/Avatar";
import Typography, { H3, H6, Paragraph } from "@component/Typography";
import MaskedInputCustom from "@component/masked-input/MaskedInput";
import Select from "@component/Select";
import Divider from "@component/Divider";
import Box from "@component/Box";
import Accordion from "@component/accordion/Accordion";
import AccordionHeader from "@component/accordion/AccordionHeader";
import AddressForm from "@component/address/AddressForm";
import { request } from "services/api";
import { fail } from "@component/notification/notifcate";
import DatePicker from "@component/datepicker/DatePicker";
import { useRouter } from "next/router";

const StoreForm = ({ address, edit, data }) => {
  const [loading, setLoading]: [any, any] = useState(false);
  const router = useRouter();
  const { id } = router.query;
  const [selectedAddress, setSelectedAddress]: [any, any] = useState({
    id: "",
  }); 

  const onSubmit = async (values: any) => {
    setLoading(true);

    if (selectedAddress.id === "") {
      setLoading(false);

      return fail("Endereço Obrigatório");
    }

    if (values?.images?.length === 0) {
      setLoading(false);

      return fail("Logo Obrigatório");
    } 

    let payload = {
      ...values,
      address: { id: selectedAddress.id },
      meta: {
        ...values.meta,
        companyType: values.meta.companyType.value,
        address: selectedAddress.street,
        addressNumber: selectedAddress.number,
        complement: "-",
        province: selectedAddress.neighborhood,
        postalCode: selectedAddress.cep,
      },
    };

    if (edit) {
      payload = {
        images: values.images,
        address: { id: selectedAddress.id },
      };
    }

    if (!edit)
      await request.post({
        route: `store/v1`,
        payload: payload,
        message: `Sua loja foi criada, aproveite!`,
        actionSuccess: () => router.push("/store"),
        actionError: (err) => {
          if (err?.response?.data?.errors)
            return fail(
              err?.response?.data?.errors
                ?.map((error) => error.description)
                .join("\n")
            );
          else return fail(err?.response?.data?.message);
        },
      });
    else
      await request.patch({
        route: `store/v1/${id}`,
        payload: payload,
        message: `Editamos sua loja pra você!`,
        actionSuccess: () => router.push("/store"),
        actionError: (err) => {
          if (err?.response?.data?.errors)
            return fail(
              err?.response?.data?.errors
                ?.map((error) => error.description)
                .join("\n")
            );
          else return fail(err?.response?.data?.message);
        },
      });

    setLoading(false);
  };

  useEffect(() => {
    if (data?.address) setSelectedAddress(data.address);
    else setSelectedAddress(address.items[0]);
  }, [address]);

  return (
    <div>
      <Formik
        initialValues={
          edit
            ? {
                ...data,
                meta: data.paymentIntegration.meta.digitalAccount,
              }
            : ({ images: [] } as any)
        }
        validationSchema={checkoutSchema}
        onSubmit={onSubmit}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          setFieldValue,
          setFieldError,
          setFieldTouched,
        }) => {
          const newErrors: any = errors;

          return (
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Card p="30px" width="100%">
                    <Grid spacing={4} container>
                      <Grid item xs={12}>
                        <FlexBox alignItems="center">
                          <Avatar
                            bg="primary.main"
                            size={25}
                            color="primary.text"
                            mr="0.875rem"
                          >
                            1
                          </Avatar>
                          <Typography fontSize="18px">
                            Detalhes da Loja
                          </Typography>
                        </FlexBox>
                      </Grid>

                      <Grid item xs={12}>
                        <TextField
                          disabled={edit}
                          name={`name`}
                          label="Nome da Loja"
                          placeholder="Soluções Ltda..."
                          fullwidth
                          onChange={handleChange}
                          value={values.name || ""}
                          errorText={newErrors?.name}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <DropZone
                          multiple={false}
                          setFieldValue={setFieldValue}
                          onChange={(files, setLoading) => {
                            handleOnChangeImage(
                              files,
                              setFieldError,
                              setFieldTouched,
                              setLoading,
                              setFieldValue,
                              values,
                              false
                            );
                          }}
                          title="Arraste ou solte a imagem aqui"
                          imgs={values.images}
                        />

                        {touched.images && errors.images && (
                          <ErrorMessage name={"images"} />
                        )}
                      </Grid>
                    </Grid>
                  </Card>
                </Grid>

                <Grid item xs={12}>
                  <Card p="30px" width="100%">
                    <Grid spacing={4} container>
                      <Grid item xs={12}>
                        <FlexBox alignItems="center">
                          <Avatar
                            bg="primary.main"
                            size={25}
                            color="primary.text"
                            mr="0.875rem"
                          >
                            2
                          </Avatar>
                          <Typography fontSize="18px">
                            Dados da Conta Digital
                          </Typography>
                        </FlexBox>
                      </Grid>

                      <Grid item xs={12} xl={6}>
                        <TextField
                          disabled={edit}
                          placeholder="Email da loja..."
                          name={"meta.email"}
                          label="Email"
                          type="email"
                          fullwidth
                          onChange={handleChange}
                          value={values?.meta?.email || ""}
                          errorText={newErrors?.meta?.email}
                        />
                      </Grid>

                      <Grid item xs={12} xl={6}>
                        <TextField
                          disabled={edit}
                          name={`meta.name`}
                          label="Nome da Conta Digital"
                          placeholder="Soluções Ltda..."
                          fullwidth="true"
                          onChange={handleChange}
                          value={values?.meta?.name || ""}
                          errorText={newErrors?.meta?.name}
                        />
                      </Grid>

                      <Grid item xs={12} md={12} xl={6}>
                        <MaskedInputCustom
                          disabled={edit}
                          name={`meta.cpfCnpj`}
                          label="CNPJ"
                          mask="11.111.111/1111-11"
                          fullwidth="true"
                          onChange={handleChange}
                          value={values?.meta?.cpfCnpj || ""}
                          errorText={newErrors.meta?.cpfCnpj}
                        />
                      </Grid>

                      <Grid item xs={12} md={12} xl={6}>
                        <Select
                          disabled={edit}
                          placeholder="MEI"
                          name={`meta.companyType`}
                          label="Tipo da Empresa"
                          options={CompanyTypeList}
                          defaultValue={values?.meta?.companyType || ""}
                          onChange={(v: any) => {
                            setFieldValue("meta.companyType", v);
                          }}
                          errorText={newErrors?.meta?.companyType}
                        />
                      </Grid>

                      <Grid item xs={12} md={12} xl={6}>
                        <DatePicker
                          disabled={edit}
                          id={"birthDate"}
                          name={`meta.birthDate`}
                          label="Data de Nascimento"
                          fullwidth="true"
                          onCustomChange={setFieldValue}
                          value={values?.meta?.birthDate || ""}
                          errorText={newErrors?.meta?.birthDate}
                        />
                      </Grid>

                      <Grid item xs={12} md={12} xl={6}>
                        <MaskedInputCustom
                          disabled={edit}
                          name="meta.phone"
                          label="Telefone"
                          fullwidth="true"
                          mask="11 11111111"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values?.meta?.phone || ""}
                          errorText={newErrors?.meta?.phone}
                        />
                      </Grid>

                      <Grid item xs={12} md={12} xl={6}>
                        <MaskedInputCustom
                          disabled={edit}
                          name="meta.mobilePhone"
                          label="Celular"
                          fullwidth="true"
                          mask="11 111111111"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values?.meta?.mobilePhone || ""}
                          errorText={newErrors?.meta?.mobilePhone}
                        />
                      </Grid>
                    </Grid>
                  </Card>
                </Grid>

                <Grid item xl={12}>
                  <Card p="30px" width="100%">
                    <Grid container spacing={6}>
                      <Grid item lg={12} md={12} xs={12}>
                        <Grid item xs={12}>
                          <FlexBox alignItems="center">
                            <Avatar
                              bg="primary.main"
                              size={25}
                              color="primary.text"
                              mr="0.875rem"
                            >
                              3
                            </Avatar>
                            <Typography fontSize="18px">
                              Endereço da Loja
                            </Typography>
                          </FlexBox>
                        </Grid>

                        <Grid container>
                          <Box mb="1rem" mt="1rem">
                            <Accordion isForm expanded={false}>
                              <AccordionHeader px="0px" py="6px">
                                <H3 mb="0.75rem">Novo Endereço</H3>
                              </AccordionHeader>
                              <AddressForm redirect={"/store/new"} />
                              <Divider mt="1rem" />
                            </Accordion>
                          </Box>
                        </Grid>

                        <Typography mb="0.75rem">
                          Endereço da Empresa
                        </Typography>
                        <Grid container spacing={6}>
                          {address?.items?.map((item, ind) => (
                            <Grid
                              item
                              md={4}
                              sm={6}
                              xs={12}
                              key={`addr-${ind}`}
                            >
                              <Card
                                bg="gray.100"
                                p="1rem"
                                boxShadow="none"
                                border="1px solid"
                                cursor="pointer"
                                borderColor={
                                  item.id === selectedAddress?.id
                                    ? "primary.main"
                                    : "transparent"
                                }
                                onClick={() => { 
                                  setSelectedAddress(item);
                                }}
                              >
                                <H6 mb="0.25rem">CEP: {item.cep}</H6>
                                <Paragraph color="gray.700">
                                  {item.street}, {item.number},{" "}
                                  {item.neighborhood}
                                </Paragraph>
                              </Card>
                            </Grid>
                          ))}
                        </Grid>
                      </Grid>
                    </Grid>
                  </Card>
                </Grid>
                <Grid item xs={12} md={2}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullwidth
                    loading={loading}
                  >
                    {edit ? "Editar" : "Criar"}
                  </Button>
                </Grid>
              </Grid>
            </form>
          );
        }}
      </Formik>
    </div>
  );
};

const checkoutSchema = yup.object().shape({
  name: yup.string().required("Campo Obrigatório"),
  meta: yup.object().shape({
    ["name"]: yup.string().required("Campo Obrigatório"),
    ["email"]: yup.string().email("email inválido").required("email requerido"),
    ["cpfCnpj"]: yup.string().required("Campo Obrigatório"),
    ["companyType"]: yup.lazy((value) => {
      switch (typeof value) {
        case "string":
          return yup.string().required("Campo Obrigatório"); // schema for string
        default:
          return yup.object().required("Campo Obrigatório"); // here you can decide what is the default
      }
    }),
    ["birthDate"]: yup.string().required("Campo Obrigatório"),
    ["phone"]: yup.string().required("Campo Obrigatório"),
    ["mobilePhone"]: yup.string().required("Campo Obrigatório"),
  }),
});

StoreForm.layout = DashboardLayout;

StoreForm.defaultProps = {
  address: [],
  edit: false,
  data: {},
};

const CompanyTypeList = [
  { label: "MEI(Micro Empreendedor Individual)", value: "MEI" },
  { label: "LIMITED(Empresa Limitada)", value: "LIMITED" },
  { label: "INDIVIDUAL(Empresa Individual)", value: "INDIVIDUAL" },
  { label: "ASSOCIATION(Associação)", value: "ASSOCIATION" },
];

export default StoreForm;
