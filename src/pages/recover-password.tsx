import React from "react";
import FlexBox from "../components/FlexBox";
import RecoverPassword from "../components/sessions/RecoverPassword";

const RecoverPasswordPage = () => {
  return (
    <FlexBox
      flexDirection="column"
      minHeight="100vh"
      alignItems="center"
      justifyContent="center"
    >
      <RecoverPassword />
    </FlexBox>
  );
};

export default RecoverPasswordPage;
