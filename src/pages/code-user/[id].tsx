import React from "react";
import FlexBox from "../../components/FlexBox";
import Code from "../../components/sessions/Code";

const CodePage = () => {
  return (
    <FlexBox
      flexDirection="column"
      minHeight="100vh"
      alignItems="center"
      justifyContent="center"
    >
      <Code />
    </FlexBox>
  );
};

export default CodePage;
