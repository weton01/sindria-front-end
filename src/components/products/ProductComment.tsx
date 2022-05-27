import { useFormik } from "formik";
import React, { useState } from "react";
import { getDateDifference } from "../../utils/utils";
import Avatar from "../avatar/Avatar";
import Box from "../Box";
import Button from "../buttons/Button";
import FlexBox from "../FlexBox";
import Rating from "../rating/Rating";
import { H5, H6, Paragraph, SemiSpan } from "../Typography";
import * as yup from "yup";
import TextArea from "@component/textarea/TextArea";
import { api } from "services/api";
import { toast } from "react-nextjs-toast";

export interface ProductCommentProps {
  id: string;
  name: string;
  rating?: number;
  date: string;
  comment: string;
  isReview?: boolean;
  user: any;
  productUser?: any;
  reply?: object[];
}

const ProductComment: React.FC<ProductCommentProps> = ({
  name,
  rating,
  date,
  comment,
  isReview = true,
  user,
  productUser,
  reply,
  id
}) => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [replyState, setReplyState] = useState(reply);

  const handleFormSubmit = async (values) => {
    setLoading(true);
    try {
      await api.post(`comment/v1/reply/${id || undefined }`, values);
      toast.notify(`Pergunta respondida com sucesso`, {
        title: "Sucesso!",
        duration: 5,
        type: "success",
      });
      setVisible(false)
      setReplyState(values)
    } catch (err) {
      toast.notify(err.response.data.message, {
        title: "Erro!",
        duration: 5,
        type: "error",
      });
    }
    setLoading(false);
  };

  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      onSubmit: handleFormSubmit,
      initialValues,
      validationSchema: formSchema,
    });


  return (
    <Box mb="32px" maxWidth="600px">
      <FlexBox alignItems="center" mb="1rem">
        <Avatar src={`/assets/images/icons/user.svg`} borderColor="gray.400" borderRadius="5px" size={40} />
        <Box ml="0.2rem">
          <H5 mb="4px">{name}</H5>
          <FlexBox alignItems="center">
            {isReview ? (
              <>
                <Rating value={rating} color="warn" readonly />
                <H6 mx="10px">({rating})</H6>
              </>
            ) : null}
            <SemiSpan>{getDateDifference(date)}</SemiSpan>
          </FlexBox>
        </Box>
      </FlexBox>

      <Paragraph color="gray.700" mb="0.6rem">{comment}</Paragraph>
      {
        !isReview && user?.id === productUser?.id && !(replyState.length > 0)?
          <Button
            variant="outlined"
            size="small"
            color="primary"
            mb="16px"
            onClick={() => setVisible(!visible)}
          >
            Responder
          </Button>
          : null
      }

      {
        visible? <form onSubmit={handleSubmit}>
        <Box mb="24px">
          <FlexBox mb="12px">
            <H5 color="gray.700" mr="6px">
              Sua resposta
            </H5>
            <H5 color="error.main">*</H5>
          </FlexBox>

          <TextArea
            name="description"
            placeholder="Write a review here..."
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
      </form>: null}
    </Box>
  );
};

const initialValues = {

}


const formSchema = yup.object().shape({
  description: yup.string().required("senha requerida"),
});


export default ProductComment;
