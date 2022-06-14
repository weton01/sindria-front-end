import FlexBox from "@component/FlexBox";
import Icon from "@component/icon/Icon";
import Radio from "@component/radio/Radio";
import Typography, { H6 } from "@component/Typography";
import { formatCurrency } from "@utils/formatCurrency";
import { formatFloat } from "@utils/formatFloat";
import React, { useState } from "react";
import { useAppDispatch } from "@hook/hooks";

interface ShippingProps {
  values: any
}

export const ShippingTypes = {
  "04014": { icon: "truck", type: "Sedex" },
  "04510": { icon: "package-box", type: "Pac" },
}

const Shipping: React.FC<ShippingProps> = ({
  values
}: ShippingProps) => {
  const dispatch = useAppDispatch();
  const [code, setCode] = useState("04014")

  const onHandleChangeRadio = (it) => {
    setCode(it.Codigo)
    dispatch({
      type: "SET_SHIPPING",
      payload: {
        user: values.user,
        price: it
      }
    })
  }

  return (
    <FlexBox
      p={10}
      width="100%"
      backgroundColor="#F6F9FC"
      gap={12}
      justifyContent="center"
      flexDirection="column"
    >
      <H6 >
        Loja: {values?.user}
      </H6>
      <FlexBox alignItems="center" gap={12}>
        {values?.data?.map(it => (
          <FlexBox width="50%" alignItems="center">
            <Radio
              checked={code === it.Codigo}
              name="credit"
              color="secondary"
              onChange={() => onHandleChangeRadio(it)}
            />
            <Icon size="45px" color="secondary">
              {ShippingTypes[it.Codigo].icon}
            </Icon>
            <FlexBox flexDirection="column" pl={10} width="150px" justifyContent={"center"}>
              <Typography fontSize={13}>
                {ShippingTypes[it.Codigo].type}
              </Typography>
              <Typography fontSize={13}>
                {it.PrazoEntrega} dias úteis
              </Typography>
              <Typography fontSize={13}>
                {formatCurrency(formatFloat(it?.Valor))}
              </Typography>
            </FlexBox>
          </FlexBox>
        ))}
      </FlexBox>
    </FlexBox>
  );
};


export default Shipping;
