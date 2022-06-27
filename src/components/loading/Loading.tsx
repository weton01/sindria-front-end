import FlexBox from "@component/FlexBox";
import { H1 } from "@component/Typography";
import MovingText from "react-moving-text";

const Loading = () => (
  <FlexBox
    width={"100vw"}
    height={"100vh"}
    alignItems="center"
    justifyContent="center"
    flexDirection={"column"}
  >
    <MovingText
      type="bounce"
      duration="1000ms"
      delay="0.5s"
      direction="normal"
      timing="ease"
      iteration="infinite"
      fillMode="none"
    >
      <H1
        borderTop={"3px solid"}
        borderBottom="3px solid"
        borderColor="primary"
        borderRadius={3}
      >
        SINDRIA
      </H1>
    </MovingText>
  </FlexBox>
);

export default Loading;
