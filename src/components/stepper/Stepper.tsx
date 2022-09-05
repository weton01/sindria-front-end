import Typography from "@component/Typography";
import React, { Fragment, useEffect, useState } from "react";
import Box from "../Box";
import { Chip } from "../Chip";
import FlexBox from "../FlexBox";

type Step = {
  title: string | any;
  disabled?: boolean;
};

type StepperProps = {
  selectedStep?: number;
  stepperList: Step[];
  onChange?: (Step, index) => void;
  direction?: string;
};

const StepperVertical = (props) => {
  return (
    <>
      {props.stepperList.map((step, ind) => (
        <FlexBox gap={8}>
          <FlexBox
            key={step.title}
            flexDirection="column"
            justifyContent={"center"}
            alignItems="center"
          >
            <Chip
              bg={ind <= props.selected ? "primary.main" : "primary.light"}
              color={ind <= props.selected ? "white" : "primary.main"}
              p="0.5rem 1.5rem"
              fontSize="14px"
              fontWeight="600"
              my="4px"
              cursor={step.disabled ? "not-allowed" : "pointer"}
              onClick={props.handleStepClick(step, ind)}
            >
              {ind + 1}
            </Chip>
            {ind < props.stepperList?.length - 1 && (
              <Box
                width={"4px"}
                minHeight={"40px"}
                height="100%"
                bg={ind < props.selected ? "primary.main" : "primary.light"}
              />
            )}
          </FlexBox>
          <Typography maxWidth={300} marginTop={"4px"} width="300px" >
            {step.title}
          </Typography>
        </FlexBox>
      ))}
    </>
  );
};

const StepperHorizontal = (props) => {
  return (
    <FlexBox
      alignItems="center"
      flexWrap="wrap"
      justifyContent="center"
      my="-4px"
    >
      {props.stepperList.map((step, ind) => (
        <Fragment key={step.title}>
          <Chip
            bg={ind <= props.selected ? "primary.main" : "primary.light"}
            color={ind <= props.selected ? "white" : "primary.main"}
            p="0.5rem 1.5rem"
            fontSize="14px"
            fontWeight="600"
            my="4px"
            cursor={step.disabled ? "not-allowed" : "pointer"}
            onClick={props.handleStepClick(step, ind)}
          >
            {ind + 1}. {step.title}
          </Chip>
          {ind < props.stepperList?.length - 1 && (
            <Box
              width={"40px"}
              height={"4px"}
              bg={ind < props.selected ? "primary.main" : "primary.light"}
            />
          )}
        </Fragment>
      ))}
    </FlexBox>
  );
};

const Stepper: React.FC<StepperProps> = ({
  selectedStep,
  stepperList,
  onChange,
  direction,
}) => {
  const [selected, setSelected] = useState(selectedStep - 1);

  const handleStepClick = (step: Step, ind) => () => {
    if (!step.disabled) {
      setSelected(ind);
      if (onChange) onChange(step, ind);
    }
  };

  useEffect(() => {
    setSelected(selectedStep - 1);
  }, [selectedStep]);

  return direction === "horizontal" ? (
    <StepperHorizontal
      selected={selected}
      handleStepClick={handleStepClick}
      stepperList={stepperList}
    />
  ) : (
    <StepperVertical
      selected={selected}
      handleStepClick={handleStepClick}
      stepperList={stepperList}
    />
  );
};

Stepper.defaultProps = {
  selectedStep: 1,
  direction: "horizontal",
};

export default Stepper;
