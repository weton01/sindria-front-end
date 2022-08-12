import Grid from "@component/grid/Grid";
import DashboardPageHeader from "@component/layout/DashboardPageHeader";
import React, { useEffect, useState } from "react";
import useWindowSize from "../../hooks/useWindowSize";
import Button from '@component/buttons/Button'
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
import AddressForm from '@component/address/AddressForm';
import { GetServerSideProps } from "next";
import { authRoute } from "middlewares/authRoute";
import axios from "axios";
import { PROD_URL } from "services/api";
import { useSelector } from "react-redux";
import { fail } from "@component/notification/notifcate";
import DatePicker from "@component/datepicker/DatePicker";
import { useRouter } from "next/router";

const Store = ({ address }) => {
  const [loading, setLoading]: [any, any] = useState(false)
  const [selectedAddress, setSelectedAddress]: [any, any] = useState({ id: '' })

  const width = useWindowSize();

  const user = useSelector((selec: any) =>
    selec?.user
  );

  const onSubmit = async (values: any) => {
    setLoading(true)
    const router = useRouter();

    if (selectedAddress.id === '') {
      setLoading(false)

      return fail('Endereço Obrigatório')
    }
    
    if (values?.images?.length === 0) {
      setLoading(false)

      return fail('Logo Obrigatório')
    }
    
    delete values.image;

    try {
      const { data } = await axios.post(`${PROD_URL}store/v1`, {
        ...values,
        address: { id: selectedAddress.id },
        meta: {
          ...values.meta,
          email: user.user.email,
          address: selectedAddress.street,
          addressNumber: selectedAddress.number,
          complement: "-",
          province: selectedAddress.neighborhood,
          postalCode: selectedAddress.cep
        }
      }, {
        headers: { 'Authorization': `Bearer ${user.token}` }
      })

      router.push('/store')
    } catch (err) {
      setLoading(false)

      if(err?.response?.data?.errors)
        return fail(err?.response?.data?.errors?.map(error => error.description).join('\n'))
      else 
        return  fail(err?.response?.data?.message)
    }
    setLoading(false)
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
        initialValues={{ images: [] } as any}
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
                          <Typography fontSize="18px">Dados da Conta Digital</Typography>
                        </FlexBox>
                      </Grid>

                      <Grid item xs={12} xl={6}>
                        <TextField
                          name={`meta.name`}
                          label="Nome da Conta Digital"
                          placeholder="Soluções Ltda..."
                          fullwidth
                          onChange={handleChange}
                          value={values?.meta?.name || ""}
                          errorText={newErrors?.meta?.name}
                        />
                      </Grid>

                      <Grid item xs={12} md={12} xl={6}>
                        <MaskedInputCustom
                          name={`meta.cpfCnpj`}
                          label="CNPJ"
                          mask="11.111.111/1111-11"
                          fullwidth
                          onChange={handleChange}
                          value={values?.meta?.cpfCnpj || ""}
                          errorText={newErrors.meta?.cpfCnpj}
                        />
                      </Grid>

                      <Grid item xs={12} md={12} xl={6}>
                        <Select
                          placeholder="MEI"
                          name={`meta.companyType`}
                          label="Tipo da Empresa"
                          options={CompanyTypeList}
                          value={values?.meta?.companyType || "MEI"}
                          onChange={(v: any) => {
                            setFieldValue("meta.companyType", v.value)
                          }}
                          errorText={newErrors?.meta?.companyType}
                        />
                      </Grid>

                      <Grid item xs={12} md={12} xl={6}>
                        <DatePicker
                          name={`meta.birthDate`}
                          label="Data de Nascimento"
                          fullwidth
                          onCustomChange={setFieldValue}
                          value={values?.meta?.birthDate || ""}
                          errorText={newErrors?.meta?.birthDate}
                        />
                      </Grid>

                      <Grid item xs={12} md={12} xl={6}>
                        <MaskedInputCustom
                          name="meta.phone"
                          label="Telefone"
                          fullwidth
                          mask="11 11111111"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values?.meta?.phone || ""}
                          errorText={newErrors?.meta?.phone}
                        />
                      </Grid>

                      <Grid item xs={12} md={12} xl={6}>
                        <MaskedInputCustom
                          name="meta.mobilePhone"
                          label="Celular"
                          fullwidth
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
                              3
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
                                <H3 mb="0.75rem" >Novo Endereço</H3>
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
                                  console.log(item)
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
                    loading={loading}
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
    ['name']: yup.string().required('Campo Obrigatório'),
    ['cpfCnpj']: yup.string().required('Campo Obrigatório'),
    ['companyType']: yup.string().required('Campo Obrigatório'),
    ['birthDate']: yup.string().required('Campo Obrigatório'),
    ['phone']: yup.string().required('Campo Obrigatório'),
    ['mobilePhone']: yup.string().required('Campo Obrigatório'),
  })

});

Store.layout = DashboardLayout;

const CompanyTypeList = [
  { label: "MEI(Micro Empreendedor Individual)", value: "MEI" },
  { label: "LIMITED(Empresa Limitada)", value: "LIMITED" },
  { label: "INDIVIDUAL(Empresa Individual)", value: "INDIVIDUAL" },
  { label: "ASSOCIATION(Associação)", value: "ASSOCIATION" },
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
