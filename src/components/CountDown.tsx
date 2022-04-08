import systemCss from "@styled-system/css";
import { getHourMinute } from "@utils/utils";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

interface CountDownProps {
  seconds: number;
  onFinish: any;
  children: any;
}

const StyledCountDown = styled.div(systemCss({}));

const CountDown: React.FC<CountDownProps> = ({
  seconds,
  onFinish,
  children,
  ...props
}) => {
  const [counter, setCounter] = useState(0);
  const timer = useRef(null);
  const [date, setDate] = useState(
    new Date(
      new Date(new Date().toLocaleDateString()).setMilliseconds(seconds * 1000)
    )
  );

  useEffect(() => {
    timer.current = setInterval(
      () =>
        setCounter((v) => {
          setDate((date) => {
            date.setMilliseconds(-1000);
            return date;
          });
          return v + 1;
        }),
      1000
    );
    return () => {
      clearInterval(timer.current);
    };
  }, []);

  useEffect(() => {
    if (counter === seconds) {
      onFinish();
      clearInterval(timer.current);
    }
  }, [counter]);

  return (
    <StyledCountDown {...props}>
      {children} {getHourMinute(date)}
    </StyledCountDown>
  );
};

CountDown.defaultProps = {
  seconds: 5000,
};

export default CountDown;
