import Button from "@component/buttons/Button";
import Card from "@component/Card";
import Grid from "@component/grid/Grid";
import DashboardPageHeader from "@component/layout/DashboardPageHeader";
import VendorDashboardLayout from "@component/layout/VendorDashboardLayout";
import TextField, { MaskInput } from "@component/text-field/TextField";
import { Field, Formik } from "formik";
import { GetServerSideProps } from "next";
import React, { useEffect, useState } from "react";
import { parseCookies } from "nookies";
import * as yup from "yup";
import { api } from "services/api";
import { getProductById, getUrlAssign } from "services/product";
import Stepper from "@component/stepper/Stepper";
import { useRouter } from "next/router";
import Box from "@component/Box";
import DropZone from "@component/DropZone";
import ErrorMessage from "@component/ErrorMessage";
import { processFile } from "@utils/utils";
import Accordion from "@component/accordion/Accordion";
import AccordionHeader from "@component/accordion/AccordionHeader";
import axios from "axios";
import { toast } from "react-nextjs-toast";
import Icon from "@component/icon/Icon";
import {
  patchVariation,
  postVariation,
  removeVariation,
} from "services/variation";

const ProductVariation = (props) => {
  const [product, setProduct] = useState(props.product);
  const [selectedStep, setSelectedStep] = useState(0);
  const router = useRouter();
  const id = router?.query?.id;
  const { route } = router;
 
  const handleStepChange = (_step, ind) => {
    switch (ind) {
      case 0:
        router.push(`/vendor/add-product/${id}`);
        break;
      case 1:
        router.push(`/vendor/add-product/variations/${id}`);
        break;
      case 2:
        router.push(`/vendor/add-product/colors/${id}`);
        break;
      case 3:
        router.push(`/vendor/add-product/sizes/${id}`);
        break;
      default:
        break;
    }
  };
  useEffect(() => {
    switch (route) {
      case `/vendor/add-product/[id]`:
        setSelectedStep(1);
        break;
      case `/vendor/add-product/variations/[id]`:
        setSelectedStep(2);
        break;
      case `/vendor/add-product/colors/[id]`:
        setSelectedStep(3);
        break;
      case `/vendor/add-product/sizes/[id]`:
        setSelectedStep(4);
        break;

      default:
        break;
    }
  }, [route]);

  const handleOnChangeImage = (
    files = [],
    setFieldError: any,
    setFieldTouched: any,
    setLoading: any,
    setFieldValue: any
  ) => {
    files.map(async (file: File, index) => {
      const { url } = await getUrlAssign();
      let fd = new FormData();
      const blob: any = await processFile(file);
      const image = new Image();

      image.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;

        if (image.naturalWidth > 480 || image.naturalHeight > 480) {
          setFieldError("image", "limite da dimensão da imagem é 480*480");
          setFieldTouched("image", true, false);
          setLoading(false);
          return;
        }

        canvas.getContext("2d").drawImage(image, 0, 0);
        canvas.toBlob(async (blob) => {
          const myImage = new File([blob], file.name, {
            type: blob.type,
          });

          fd.append("acl", "public-read");
          fd.append("Content-Type", "image/webp");
          fd.append("key", url.put.fields["key"]);
          fd.append("bucket", url.put.fields["bucket"]);
          fd.append("X-Amz-Algorithm", url.put.fields["X-Amz-Algorithm"]);
          fd.append("X-Amz-Credential", url.put.fields["X-Amz-Credential"]);
          fd.append("X-Amz-Date", url.put.fields["X-Amz-Date"]);
          fd.append("X-Amz-Signature", url.put.fields["X-Amz-Signature"]);
          fd.append("Policy", url.put.fields["Policy"]);
          fd.append("file", myImage);

          await axios.post(url.put.url, fd, {
            onUploadProgress: (progress: ProgressEvent) => {
              let percent = Math.round(
                (progress.loaded * 100) / progress.total
              );
              if (percent === 100 && files.length - 1 === index) {
                setLoading(false);
              }
            },
          });

          const image = [url.get];
          setFieldValue("image", image);
        }, "image/webp");
      };
      image.src = blob;
    });
  };

  const handleFormSubmit = async (values) => {
    let result;
    const { netAmount, weight, height, width, image, name } = values;
    let newVariations = [...product.variations];

    const payload = {
      netAmount: Number(netAmount),
      height,
      name,
      weight,
      width,
      image: image[0],
    };

    const index =
      values.id === undefined
        ? product.variations.length - 1
        : props?.product?.variations?.findIndex(
            (item) => item.id === values.id
          );

    newVariations[index].loading.create = true;
    setProduct({ ...product, variations: newVariations });

    if (values.id !== undefined) {
      delete payload.name;
      delete payload.image;
      result = await patchVariation(id, payload);
    } else result = await postVariation(id, payload);

    if (typeof result === "string") {
      toast.notify(result, {
        title: "Erro!",
        duration: 5,
        type: "error",
      });
    } else {
      toast.notify(`Variação ${values.id ? "alterada" : "adicionada"}`, {
        title: "Sucesso!",
        duration: 5,
        type: "success",
      });
      router.reload();
    }

    newVariations[index].loading.create = false;
    setProduct({ ...product, variations: newVariations });
  };

  const deleteVariation = async (id, index) => {
    let newVariations = [...product.variations];
    newVariations[index].loading.delete = true;
    setProduct({ ...product, variations: newVariations });

    const result = await removeVariation(id);

    if (typeof result === "string") {
      toast.notify(result, {
        title: "Erro!",
        duration: 5,
        type: "error",
      });
    } else {
      toast.notify(`Variação deletada`, {
        title: "Sucesso!",
        duration: 5,
        type: "success",
      });
      router.reload();
    }

    newVariations[index].loading.delete = false;
    setProduct({ ...product, variations: newVariations });
  };

  return (
    <div>
      <DashboardPageHeader
        title={`Produto ${product.name}`}
        iconName="delivery-box"
        button={
          <Button
            color="primary"
            bg="primary.light"
            px="2rem"
            route="/vendor/products"
          >
            Voltar para produtos
          </Button>
        }
      />

      <Box mb="14px" width="100%">
        <Stepper
          stepperList={stepperList}
          selectedStep={selectedStep}
          onChange={handleStepChange}
        />
      </Box>
      <Card p="30px">
        {product.variations
          .filter((i) => i.type === "default")
          .map((item, index) => {
            return (
              <Formik
                key={index}
                initialValues={item}
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
                  setFieldError,
                  setFieldTouched,
                }) => {
                  return (
                    <form onSubmit={handleSubmit}>
                      <Accordion
                        key={index}
                        isForm
                        expanded={index === product.variations.length - 1}
                      >
                        <AccordionHeader px="0px" py="6px">
                          <h1>
                            {index === product.variations.length - 1
                              ? "Nova variação"
                              : `Variação ${index + 1}`}
                          </h1>
                        </AccordionHeader>
                        <Grid container spacing={4}>
                          <Grid item xs={12}>
                            <TextField
                              disabled={index !== product.variations.length - 1}
                              name={`name`}
                              label="Nome"
                              placeholder="Nome do produto"
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
                                    disabled={
                                      index !== product.variations.length - 1
                                    }
                                    notEdit={
                                      index !== product.variations.length - 1
                                    }
                                    imgs={values.image}
                                    removeImage={(index) => {
                                      const image = values.image;
                                      image.splice(index, 1);
                                      setFieldValue("image", image);
                                    }}
                                    title="Arraste ou solte a imagem do produto aqui"
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
                          <Grid item sm={3} xs={12}>
                            <TextField
                              name={`netAmount`}
                              label="Valor liquido"
                              placeholder="Valor liquido"
                              mask={MaskInput.money}
                              addonBefore="R$"
                              fullwidth
                              onBlur={handleBlur}
                              onChange={handleChange}
                              value={values?.netAmount || ""}
                              errorText={
                                touched?.netAmount && errors?.netAmount
                              }
                            />
                          </Grid>
                          <Grid item sm={3} xs={12}>
                            <TextField
                              name={`weight`}
                              label="Peso"
                              placeholder="Peso"
                              type="number"
                              addonAfter={"kg"}
                              fullwidth
                              onBlur={handleBlur}
                              onChange={handleChange}
                              value={values?.weight || ""}
                              errorText={touched?.weight && errors?.weight}
                            />
                          </Grid>
                          <Grid item sm={3} xs={12}>
                            <TextField
                              name={`height`}
                              label="Altura"
                              placeholder="Altura"
                              type="number"
                              addonAfter={"cm"}
                              fullwidth
                              onBlur={handleBlur}
                              onChange={handleChange}
                              value={values?.height || ""}
                              errorText={touched?.height && errors?.height}
                            />
                          </Grid>
                          <Grid item sm={3} xs={12}>
                            <TextField
                              name={`width`}
                              label="Largura"
                              placeholder="Largura"
                              type="number"
                              addonAfter={"cm"}
                              fullwidth
                              onBlur={handleBlur}
                              onChange={handleChange}
                              value={values?.width || ""}
                              errorText={touched?.width && errors?.width}
                            />
                          </Grid>
                          <Grid
                            item
                            sm={12}
                            xs={12}
                            style={{ display: "flex", gap: 16 }}
                          >
                            <Button
                              mt="25px"
                              variant="contained"
                              color="primary"
                              type="submit"
                              loading={values?.loading?.create}
                            >
                              {index === product.variations.length - 1
                                ? "Criar"
                                : "Alterar"}{" "}
                              variação
                            </Button>
                            {index !== product.variations.length - 1 ? (
                              <Button
                                mt="25px"
                                variant="outlined"
                                color="primary"
                                onClick={() =>
                                  deleteVariation(values.id, index)
                                }
                                type="button"
                                loading={values?.loading?.delete}
                              >
                                Remover variação
                              </Button>
                            ) : (
                              <Button
                                mt="25px"
                                variant="outlined"
                                type="button"
                                route={`/vendor/add-product/colors/${id}`}
                              >
                                Próximo
                                <Icon size="18px" defaultcolor="auto">
                                  arrow-right
                                </Icon>
                              </Button>
                            )}
                          </Grid>
                        </Grid>
                      </Accordion>
                    </form>
                  );
                }}
              </Formik>
            );
          })}
      </Card>
    </div>
  );
};

const initialValues = {
  name: "",
  netAmount: "",
  weight: "",
  height: "",
  width: "",
  image: [],
  type: "default",
  loading: { create: false, delete: false },
};

const checkoutSchema = yup.object().shape({
  name: yup.string().required("campo requerido"),
  netAmount: yup.number().required("campo requerido"),
  weight: yup.number().required("campo requerido"),
  height: yup.number().required("campo requerido"),
  width: yup.number().required("campo requerido"),
  image: yup.array().min(1, "selecione uma imagem").required("campo requerido"),
});

ProductVariation.layout = VendorDashboardLayout;

const stepperList = [
  {
    title: "Produto",
    disabled: false,
  },
  {
    title: "Variações",
    disabled: false,
  },
  {
    title: "Cores",
    disabled: false,
  },
  {
    title: "Tamanhos",
    disabled: false,
  },
];

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { ["shop_token"]: token } = parseCookies(ctx);
  const { id } = ctx.query;
  try {
    api.interceptors.request.use((config) => {
      config.headers["Authorization"] = `Bearer ${token}`;
      return config;
    });

    const [product] = await Promise.all([getProductById(id)]);

    if ("name" in product) {
      product.variations.push(initialValues);
      return {
        props: { product },
      };
    }
    return {
      notFound: true,
    };
  } catch (err) {
    return {
      notFound: true,
    };
  }
};

export default ProductVariation;
