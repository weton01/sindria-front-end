import React from "react";
import {ErrorMessage as ErrorComponent} from "formik";

const ErrorMessage= ({ name }) => {
  return (
    <div className="error-input">
      <ErrorComponent name={name} />
    </div>
  );
};

export default ErrorMessage;
