import React from "react";
import FlexBox from "../../components/FlexBox";
import RecoverPasswordCallback from "../../components/sessions/RecoverPasswordCallback";

const RecoverPasswordCallbackPage = () => {
  return (
    <FlexBox
      flexDirection="column"
      minHeight="100vh"
      alignItems="center"
      justifyContent="center"
    >
      <RecoverPasswordCallback />
    </FlexBox>
  );
};

export default RecoverPasswordCallbackPage;
