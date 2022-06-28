import Grid from "@component/grid/Grid";
import DashboardPageHeader from "@component/layout/DashboardPageHeader";
import React, { useState } from "react";
import useWindowSize from "../../hooks/useWindowSize";
import Button from '@component/buttons/Button'
import Card from "@component/Card";
import { ErrorMessage, Field, Formik } from "formik";
import * as yup from "yup";
import TextField, { MaskInput } from "@component/text-field/TextField";
import DropZone, { handleOnChangeImage } from "@component/DropZone";
import DashboardLayout from "@component/layout/CustomerDashboardLayout";
import FlexBox from "@component/FlexBox";
import Avatar from "@component/avatar/Avatar";
import Typography from "@component/Typography";
import MaskedInputCustom from "@component/masked-input/MaskedInput";
import Select from "@component/Select";
import DatePicker from "@component/datepicker/Datepicker";
import { uuid } from "uuidv4";
import Divider from "@component/Divider";
import Box from "@component/Box";

const Store = () => {
  const width = useWindowSize();
  const isTablet = width < 1025;
  const [companyMembers, setCompanyMembers] = useState([uuid()])

  const hadleAddNewCompanyMember = () => {
    const newCompanyMembers = [...companyMembers];
    newCompanyMembers.push(uuid());

    setCompanyMembers(newCompanyMembers);
  };

  return (
    <div>
      <DashboardPageHeader
        title={`Criar Loja`}
        iconName="home"
        button={
          <Button
            color="primary"
            bg="primary.light"
            px="2rem"
            route="/"
          >
            Voltar para produtos
          </Button>
        }
      />
      <Formik
        initialValues={{} as any}
        validationSchema={checkoutSchema}
        onSubmit={() => { }}
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

          return (
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Card p="30px" width="100%" >
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
                          <Typography fontSize="18px">Detalhes da Loja</Typography>
                        </FlexBox>
                      </Grid>

                      <Grid item xs={12}>
                        <TextField
                          name={`name`}
                          label="Nome da Loja"
                          placeholder="Soluções Ltda..."
                          fullwidth
                          onChange={handleChange}
                          value={values.name || ""}
                          errorText={touched?.name && errors?.name}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Field name={"image"}>
                          {({ meta }) => (
                            <div>
                              <DropZone
                                imgs={values.image}
                                removeImage={(index) => {
                                  const image = values.image;
                                  image.splice(index, 1);
                                  setFieldValue("image", image);
                                }}
                                title="Arraste ou solte a logo da loja aqui"
                                onChange={(files, setLoading) => {
                                  handleOnChangeImage(
                                    files,
                                    setFieldError,
                                    setFieldTouched,
                                    setLoading,
                                    setFieldValue
                                  );
                                }}
                              />
                              {meta?.touched && meta?.error && (
                                <ErrorMessage name={"image"} />
                              )}
                            </div>
                          )}
                        </Field>
                      </Grid>
                    </Grid>

                  </Card>
                </Grid>

                <Grid item xs={3.5}>
                  <Card p="30px" width="100%" >
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
                          <Typography fontSize="18px">Dados Pessoais</Typography>
                        </FlexBox>
                      </Grid>

                      <Grid item xs={12}>
                        <MaskedInputCustom
                          name="document"
                          label="Número do CNPJ"
                          fullwidth
                          mask="11.111.111/1111-11"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.number || ""}
                          errorText={touched.number && errors.number}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <MaskedInputCustom
                          name="phone"
                          label="Número do Celular"
                          fullwidth
                          mask="+55 (11) 11111-1111"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.number || ""}
                          errorText={touched.number && errors.number}
                        />
                      </Grid>
                    </Grid>

                  </Card>
                </Grid>

                <Grid item xs={4.5}>
                  <Card p="30px" width="100%" >
                    <Grid spacing={4} container>
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
                          <Typography fontSize="18px">Dados da Empresa</Typography>
                        </FlexBox>
                      </Grid>
                      <Grid item xs={7}>
                        <TextField
                          name={`businessArea`}
                          label="Código de Negócio"
                          placeholder="133445"
                          fullwidth
                          onChange={handleChange}
                          value={values.name || ""}
                          errorText={touched?.name && errors?.name}
                        />
                      </Grid>
                      <Grid item xs={5}>
                        <MaskedInputCustom
                          name="cnae"
                          label="CNAE"
                          fullwidth
                          mask="1111111"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.number || ""}
                          errorText={touched.number && errors.number}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          name={`linesOfBusiness`}
                          label="Ramo de Atuação"
                          placeholder="Textil..."
                          fullwidth
                          onChange={handleChange}
                          value={values.name || ""}
                          errorText={touched?.name && errors?.name}
                        />
                      </Grid>
                    </Grid>
                  </Card>
                </Grid>

                <Grid item xs={4}>
                  <Card p="30px" width="100%" >
                    <Grid spacing={4} container>
                      <Grid item xs={12}>
                        <FlexBox alignItems="center">
                          <Avatar
                            bg="primary.main"
                            size={25}
                            color="primary.text"
                            mr="0.875rem"
                          >
                            4
                          </Avatar>
                          <Typography fontSize="18px">Tipo da Empresa</Typography>
                        </FlexBox>
                      </Grid>
                      <Grid item xs={12}>
                        <Select
                          name="companyType"
                          label="Tipo de companhia"
                          options={CompanyTypeList}
                          value={values.country || "US"}
                          errorText={touched.country && errors.country}
                          onChange={(v) => {
                            setFieldValue("companyType", v);
                          }}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <TextField
                          name="monthlyIncomeOrRevenue"
                          label="Renda mensal ou receita"
                          mask={MaskInput.money}
                          addonBefore="R$"
                          fullwidth
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.netAmount || ""}
                          errorText={touched.netAmount && errors.netAmount}
                        />
                      </Grid>
                    </Grid>
                  </Card>
                </Grid>

                <Grid item xs={12}>
                  <Card p="30px" width="100%" >
                    <Grid spacing={4} container>
                      <Grid item xs={12}>
                        <FlexBox alignItems="center">
                          <Avatar
                            bg="primary.main"
                            size={25}
                            color="primary.text"
                            mr="0.875rem"
                          >
                            5
                          </Avatar>
                          <Typography fontSize="18px">Representatividade Legal</Typography>
                        </FlexBox>
                      </Grid>

                      <Grid item xs={6}>
                        <TextField
                          name={`legalRepresentative.name`}
                          label="Nome"
                          placeholder="João da Silva..."
                          fullwidth
                          onChange={handleChange}
                          value={values.legalRepresentative?.name || ""}
                          errorText={touched?.legalRepresentative && errors?.legalRepresentative}
                        />
                      </Grid>

                      <Grid item xs={6}>
                        <TextField
                          name={`legalRepresentative.motherName`}
                          label="Nome da Mãe"
                          placeholder="Ana Aparecida..."
                          fullwidth
                          onChange={handleChange}
                          value={values.legalRepresentative?.motherName || ""}
                          errorText={touched?.legalRepresentative && errors?.legalRepresentative}
                        />
                      </Grid>

                      <Grid item xs={4}>
                        <MaskedInputCustom
                          name="legalRepresentative.document"
                          label="Número do CPF"
                          fullwidth
                          mask="111.111.111-11"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.legalRepresentative?.document || ""}
                          errorText={touched.legalRepresentative && errors.legalRepresentative}
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <DatePicker
                          label="Número do CPF"
                          name="legalRepresentative.date"
                          date={values.legalRepresentative?.date}
                          format="YYYY-MM-DD"
                          selected={(values.legalRepresentative?.date && new Date(values.legalRepresentative?.date)) || null}
                          onChange={(val) => {
                            const date = new Date(val.toString())
                            setFieldValue('legalRepresentative.date', date.toISOString());
                          }}
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <Select
                          name="legalRepresentative.type"
                          label="Tipo"
                          placeholder="selecione..."
                          options={legalRepresentativeType}
                          value={values.legalRepresentative?.type || "US"}
                          errorText={touched.legalRepresentative && errors.legalRepresentative}
                          onChange={(value) => {
                            setFieldValue("legalRepresentative.type", value);
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Card>
                </Grid>

                <Grid item xs={12}>
                  <Card p="30px" width="100%" >
                    <Grid spacing={4} container>
                      <Grid item xs={12}>
                        <FlexBox alignItems="center">
                          <Avatar
                            bg="primary.main"
                            size={25}
                            color="primary.text"
                            mr="0.875rem"
                          >
                            6
                          </Avatar>
                          <Typography fontSize="18px">Membros da Companhia</Typography>
                        </FlexBox>
                      </Grid>
                      <Button
                        variant="text"
                        size="small"
                        color="primary"
                        mt="1rem"
                        width="100%"
                        height="46px"
                        onClick={hadleAddNewCompanyMember}
                      >
                        Adicionar Membro +
                      </Button>
                      {
                        companyMembers?.map((item, index) => (

                          <Box width="100%" key={`company-members-${index}`}>
                            <Grid spacing={4} container>
                              <Grid item xs={12}>
                                <Select
                                  name="companyType"
                                  label="Tipo de companhia"
                                  options={CompanyTypeList}
                                  value={values.country || "US"}
                                  errorText={touched.country && errors.country}
                                  onChange={(v) => {
                                    setFieldValue("companyType", v);
                                  }}
                                />
                              </Grid>

                              <Grid item xs={12}>
                                <TextField
                                  name="monthlyIncomeOrRevenue"
                                  label="Renda mensal ou receita"
                                  mask={MaskInput.money}
                                  addonBefore="R$"
                                  fullwidth
                                  onBlur={handleBlur}
                                  onChange={handleChange}
                                  value={values.netAmount || ""}
                                  errorText={touched.netAmount && errors.netAmount}
                                />
                              </Grid>
                            </Grid>
                            <Divider bg="gray.300" mb="1.5rem" />
                          </Box>
                        ))
                      }
                    </Grid>
                  </Card>
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
  name: yup.string().required("campo requerido"),
  description: yup.string().required("campo requerido"),
  grossAmount: yup.number().required("campo requerido"),
  netAmount: yup.number().required("campo requerido"),
  images: yup
    .array()
    .min(1, "selecione uma imagem")
    .required("campo requerido"),
  categories: yup
    .array()
    .min(1, "selecione uma categoria")
    .required("campo requerido"),
  tags: yup
    .array()
    .min(1, "selecione uma etiqueta")
    .required("campo requerido"),
  brand: yup.object().required("campo requerido"),
});

Store.layout = DashboardLayout;

const CompanyTypeList = [
  { label: "MEI", value: "MEI" },
  { label: "EI", value: "EI" },
  { label: "EIRELI", value: "EIRELI" },
  { label: "LTDA", value: "LTDA" },
  { label: "SA", value: "SA" },
  { label: "INSTITUITION NGO ASSOCIATION", value: "INSTITUITION_NGO_ASSOCIATION" },
]

const legalRepresentativeType = [
  { label: "Individual", value: "INDIVIDUAL" },
  { label: "Advogado", value: "ATTORNEY" },
  { label: "Designado(a)", value: "DESIGNEE" },
  { label: "Membro", value: "MEMBER" },
  { label: "Diretor", value: "DIRECTOR" },
  { label: "Presidente", value: "PRESIDENT" },
]

export default Store;
