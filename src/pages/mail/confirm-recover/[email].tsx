import React from "react";
import FlexBox from "../../../components/FlexBox";
import SendEmail from "../../../components/SendEmail";

const SendEmailPage = () => {
  return (
    <FlexBox
      flexDirection="column"
      minHeight="100vh"
      alignItems="center"
      justifyContent="center"
    >
      <SendEmail />
    </FlexBox>
  );
};

export default SendEmailPage;
