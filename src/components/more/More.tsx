import React, { useEffect, useState } from "react";

export interface MoreProps {
  open?: boolean;
  children?: any;
  component?: React.ReactChild;
  onClose?: () => void;
  onOpen?: () => void;
}

const More: React.FC<MoreProps> = ({ children, open, component, ...props }) => {
  const [state, setState] = useState({
    open: open,
  });

  const onToggle = () => {
    setState({ open: !state.open });
  };

  const onOpen = () => {
    setState({ open: true });
  };

  const onClose = () => {
    setState({ open: false });
  };

  return (
    <div {...props}>
      {children({
        ...state,
        onClose,
        onOpen,
        onToggle,
      })}
      {state.open ? component : null}
    </div>
  );
};

More.defaultProps = {
  open: false,
};

export default More;
