import Button from "@component/buttons/Button";
import { Card1 } from "@component/Card1";
import DashboardLayout from "@component/layout/CustomerDashboardLayout";
import DashboardPageHeader from "@component/layout/DashboardPageHeader";
import { useRouter } from "next/router";
import React, { useState } from "react";
import * as yup from "yup";
import FormPayment from "@component/payment/Form";
import { toast } from "react-nextjs-toast";
import { api } from "services/api";

const PaymentMethodEditor = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const {
    query: { id },
  } = useRouter();

  const handleFormSubmit = async (values) => {
    setLoading(true);
    try {
      delete values.focus;
      const payload = {
        ...values,
        number: values.number.replace(/ /g,''),
        expirationDate: values.expiry
      }
      delete payload.expiry;
      await api.post(`credit-card/v1/`, payload);
      router.push("/payment-methods");
      toast.notify("Cartão de crédito adicionado", {
        title: "Sucesso!",
        duration: 5,
        type: "success",
      });
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
        iconName="credit-card_filled"
        title={`${id === "add" ? "Adicionar novo" : "Editar"} cartão de crédito`}
        button={
          <Button
            color="primary"
            bg="primary.light"
            px="2rem"
            route="/payment-methods"
          >
            Voltar para os cartões
          </Button>
        }
      />

      <Card1>
        <FormPayment
          initialValues={initialValues}
          handleFormSubmit={handleFormSubmit}
          checkoutSchema={checkoutSchema}
          loading={loading}
        />
      </Card1>
    </div>
  );
};

const initialValues = {
  number: "",
  name: "",
  expiry: "",
  cvc: "",
};

const checkoutSchema = yup.object().shape({
  name: yup.string().required("nome requerido"),
  number: yup.string().required("número requerido"),
  expiry: yup.string().matches(/^(0[1-9]|1[0-2])\/?([0-9]{4})$/ , "data inválida").required("data requerida"),
  cvc: yup.string().required("cvc requerido"),
});

PaymentMethodEditor.layout = DashboardLayout;

export default PaymentMethodEditor;
