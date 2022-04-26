import React from "react";

import { StyledSpin, SpinnerStyle } from "./SpinStyles";

type SpinProps = {
  loading: boolean;
  children: any;
};

const Spin: React.FC<SpinProps> = ({ loading, children }) => { 
  return (
    <StyledSpin>
      {loading ? (
        <SpinnerStyle>
          <div className="spin"></div>
        </SpinnerStyle>
      ) : null}
      <div style={{zIndex: 0}}>{children}</div>
    </StyledSpin>
  );
};

Spin.defaultProps = {
  loading: false,
};

export default Spin;