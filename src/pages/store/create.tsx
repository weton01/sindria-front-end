import Grid from "@component/grid/Grid";
import DashboardPageHeader from "@component/layout/DashboardPageHeader";
import React, { useEffect, useState } from "react";
import useWindowSize from "../../hooks/useWindowSize";
import Button from '@component/buttons/Button'
import Card from "@component/Card";
import { ErrorMessage, Field, Formik, yupToFormErrors } from "formik";
import * as yup from "yup";
import TextField, { MaskInput } from "@component/text-field/TextField";
import DropZone, { handleOnChangeImage } from "@component/DropZone";
import DashboardLayout from "@component/layout/CustomerDashboardLayout";
import FlexBox from "@component/FlexBox";
import Avatar from "@component/avatar/Avatar";
import Typography, { H3, H6, Paragraph } from "@component/Typography";
import MaskedInputCustom from "@component/masked-input/MaskedInput";
import Select from "@component/Select";
import DatePicker from "@component/datepicker/Datepicker";
import { uuid } from "uuidv4";
import Divider from "@component/Divider";
import Box from "@component/Box";
import Accordion from "@component/accordion/Accordion";
import AccordionHeader from "@component/accordion/AccordionHeader";
import AddressForm from '@component/address/AddressForm';
import { GetServerSideProps } from "next";
import { authRoute } from "middlewares/authRoute";
import axios from "axios";
import { PROD_URL } from "services/api";
import { useSelector } from "react-redux";
import { fail } from "@component/notification/notifcate";

const Store = ({ address }) => {
  const [selectedAddress, setSelectedAddress] = useState({ id: '' })

  const width = useWindowSize();

  const token = useSelector((selec: any) =>
    selec?.user?.token
  );

  const onSubmit = async (values: any) => {
    if (selectedAddress.id === '') {
      return fail('Endereço Obrigatório')
    }

    if (values?.images?.length === 0) {
      return fail('Logo Obrigatório')
    }

    const { data } = await axios.post(`${PROD_URL}store/v1`, values, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
  }

  useEffect(() => {
    setSelectedAddress(address.items[0])
  }, [address])

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
        initialValues={{images: []} as any}
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
                <Grid item xl={12}>
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
                          errorText={newErrors?.name}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Field name={"images"}>
                          {({ meta }) => (
                            <div>
                              <DropZone
                                imgs={values.images}
                                removeImage={(index) => {
                                  const image = values.images;
                                  image.splice(index, 1);
                                  setFieldValue("images", image);
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
                              {meta?.error && (
                                <ErrorMessage name={"images"} />
                              )}
                            </div>
                          )}
                        </Field>
                      </Grid>
                    </Grid>

                  </Card>
                </Grid>

                <Grid item xs={12} >
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
                          <Typography fontSize="18px">Dados da Empresa</Typography>
                        </FlexBox>
                      </Grid>

                      <Grid item xs={12}>
                        <TextField
                          name={`meta.Name`}
                          label="Nome da Empresa"
                          placeholder="Soluções Ltda..."
                          fullwidth
                          onChange={handleChange}
                          value={values?.meta?.Name || ""}
                          errorText={newErrors?.meta?.Name}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <TextField
                          name={`meta.CommercialName`}
                          label="Nome Fantasia"
                          placeholder="Soluções Ltda..."
                          fullwidth
                          onChange={handleChange}
                          value={values?.meta?.CommercialName || ""}
                          errorText={newErrors?.meta?.CommercialName}
                        />
                      </Grid>

                      <Grid item xs={12} md={12} xl={6}>
                        <MaskedInputCustom
                          name={`meta.Identity`} 
                          label="CNPJ"
                          mask="11.111.111/1111-11"
                          fullwidth
                          onChange={handleChange}
                          value={values?.meta?.Identity || ""}
                          errorText={newErrors.meta?.Identity}
                        />
                      </Grid>

                      <Grid item xs={12} md={12} xl={6}>
                        <TextField
                          name={`meta.ResponsibleName`}
                          label="Responsável Legal"
                          placeholder="João da Silva..."
                          fullwidth
                          onChange={handleChange}
                          value={values?.meta?.ResponsibleName || ""}
                          errorText={newErrors?.meta?.ResponsibleName}
                        />
                      </Grid>

                      <Grid item xs={12} md={12} xl={6}>
                        <MaskedInputCustom
                          name={`meta.ResponsibleIdentity`}
                          label="CPF do Responsável"
                          mask="111.111.111-11"
                          fullwidth
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values?.meta?.ResponsibleIdentity || ""}
                          errorText={newErrors?.meta?.ResponsibleIdentity}
                        />
                      </Grid>

                      <Grid item xs={12} md={12} xl={6}>
                        <MaskedInputCustom
                          name="meta.ResponsiblePhone"
                          label="Telefone do Responsável"
                          fullwidth
                          mask="+55 (11) 11111-1111"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values?.meta?.ResponsiblePhone || ""}
                          errorText={newErrors?.meta?.ResponsiblePhone}
                        />
                      </Grid>
                    </Grid>

                  </Card>
                </Grid>

                <Grid item xs={12} >
                  <Card p="30px" width="100%" >
                    <Grid spacing={4} container>
                      <Grid item xs={12}  >
                        <FlexBox alignItems="center">
                          <Avatar
                            bg="primary.main"
                            size={25}
                            color="primary.text"
                            mr="0.875rem"
                          >
                            3
                          </Avatar>
                          <Typography fontSize="18px">Contato da Empresa</Typography>
                        </FlexBox>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <TextField
                          name={`meta.TechName`}
                          label="Nome de Contato"
                          placeholder="João da Silva..."
                          fullwidth
                          onChange={handleChange}
                          value={values?.meta?.TechName || ""}
                          errorText={newErrors?.meta?.TechName}
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <MaskedInputCustom
                          name={`meta.TechIdentity`}
                          label="CPF do Contato"
                          mask="111.111.111-11"
                          fullwidth
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values?.meta?.TechIdentity || ""}
                          errorText={newErrors?.meta?.TechIdentity}
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <TextField
                          name={`meta.TechEmail`}
                          label="E-mail do Contato"
                          placeholder="any@mail.com"
                          fullwidth
                          onChange={handleChange}
                          value={values?.meta?.TechEmail || ""}
                          errorText={newErrors?.meta?.TechEmail}
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>

                        <MaskedInputCustom
                          name={`meta.TechPhone`}
                          label="Telefone do Contato"
                          fullwidth
                          mask="+55 (11) 11111-1111"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values?.meta?.TechPhone || ""}
                          errorText={newErrors?.meta?.TechPhone}
                        />
                      </Grid>


                    </Grid>

                  </Card>
                </Grid>

                <Grid item xl={12}>
                  <Card p="30px" width="100%" >

                    <Grid container spacing={6}>
                      <Grid item lg={12} md={12} xs={12}>
                        <Grid item xs={12}  >
                          <FlexBox alignItems="center">
                            <Avatar
                              bg="primary.main"
                              size={25}
                              color="primary.text"
                              mr="0.875rem"
                            >
                              4
                            </Avatar>
                            <Typography fontSize="18px">Endereço da Loja</Typography>
                          </FlexBox>
                        </Grid>

                        <Grid container  >
                          <Box mb="1rem" mt="1rem">
                            <Accordion
                              isForm
                              expanded={false}
                            >
                              <AccordionHeader px="0px" py="6px">
                                <H3 mb="0.75rem" >Novo Endereço de Entrega</H3>
                              </AccordionHeader>
                              <AddressForm redirect={'/store/create'} />
                              <Divider mt="1rem" />
                            </Accordion>
                          </Box>
                        </Grid>

                        <Typography mb="0.75rem">Endereço da Empresa</Typography>
                        <Grid container spacing={6}>
                          {address?.items.map((item, ind) => (
                            <Grid item md={4} sm={6} xs={12} key={`addr-${ind}`}>
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
                                  setSelectedAddress(item)
                                }}
                              >
                                <H6 mb="0.25rem">CEP: {item.cep}</H6>
                                <Paragraph color="gray.700">{item.street}, {item.number}, {item.neighborhood}</Paragraph>
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
                  >
                    Criar
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
  name: yup.string().required('Campo Obrigatório'),
  meta: yup.object().shape({
    ['Name']: yup.string().required('Campo Obrigatório'),
    ['CommercialName']: yup.string().required('Campo Obrigatório'),
    ['Identity']: yup.string().required('Campo Obrigatório'),
    ['ResponsibleName']: yup.string().required('Campo Obrigatório'),
    ['ResponsibleIdentity']: yup.string().required('Campo Obrigatório'),
    ['ResponsiblePhone']: yup.string().required('Campo Obrigatório'),
    ['TechName']: yup.string().required('Campo Obrigatório'),
    ['TechIdentity']: yup.string().required('Campo Obrigatório'),
    ['TechEmail']: yup.string().email('Campo é um E-mail').required('Campo Obrigatório'),
    ['TechPhone']: yup.string().required('Campo Obrigatório'),
  })

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

export const getServerSideProps: GetServerSideProps = async (c) => {
  return authRoute(c, async (ctx: any) => {
    try {
      const { data } = await axios.get(`${PROD_URL}address/v1`, {
        params: { skip: 0, take: 10, orderBy: 'DESC' },
        headers: {
          'Authorization': `Bearer ${ctx.token}`
        }
      })

      return {
        props: {
          address: data
        }
      }

    } catch {
      return {
        redirect: {
          permanent: false,
          destination: "/404"
        }
      }
    }
  })
}

export default Store;
