import React, { useState } from "react";
import Box from "../Box";
import Button from "../buttons/Button";
import FlexBox from "../FlexBox";
import TextArea from "../textarea/TextArea";
import { H2, H5 } from "../Typography";
import ProductComment from "./ProductComment";
import { useFormik } from "formik";
import * as yup from "yup";
import { api } from "services/api";
import { toast } from "react-nextjs-toast";
import { useRouter } from 'next/router'

export interface ProductQuestionProps {
  comments: any[]
  user: any
  productId: string
}

const ProductQuestion: React.FC<ProductQuestionProps> = ({productId, comments, user }: ProductQuestionProps) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter()

  const handleFormSubmit = async (values, { resetForm }) => {
    setLoading(true);
    try {
      await api.post(`comment/v1/${productId}`, values);
      toast.notify(`Pergunta criada com sucesso`, {
        title: "Sucesso!",
        duration: 5,
        type: "success",
      });
      router.reload()
      resetForm()
    } catch (err) {
      toast.notify(err.response.data.message, {
        title: "Erro!",
        duration: 5,
        type: "error",
      });
    }
    setLoading(false);
  };

  const {
    values,
    errors,
    touched,
    dirty,
    isValid,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
  } = useFormik({
    initialValues: initialValues,
    validationSchema: reviewSchema,
    onSubmit: handleFormSubmit,
  });


  return (
    <Box>
      {comments?.map((item, ind) => (
        <ProductComment
          name={item?.user?.username}
          isReview={false}
          comment={item.description}
          date={item.created_at}
          productUser={user}
          key={ind}
          reply={item.reply}
          id={item.id}
        />
      ))}

      <H2 fontWeight="600" mt="55px" mb="20">
        Escreva uma pergunta para esse produto
      </H2>

      <form onSubmit={handleSubmit}>
        <Box mb="24px">
          <FlexBox mb="12px">
            <H5 color="gray.700" mr="6px">
              Sua pergunta
            </H5>
            <H5 color="error.main">*</H5>
          </FlexBox>

          <TextArea
            name="description"
            placeholder="Escreva uma pergunta"
            fullwidth
            rows={8}
            onBlur={handleBlur}
            onChange={handleChange}
            value={values.description || ""}
            errorText={touched.description && errors.description}
          />
        </Box>

        <Button
          variant="contained"
          color="primary"
          size="small"
          type="submit"
          loading={loading}
        >
          Enviar
        </Button>
      </form>
    </Box>
  );
};

const initialValues = {
};

const reviewSchema = yup.object().shape({
  description: yup.string().required("Obrigatório"),
});

export default ProductQuestion;
