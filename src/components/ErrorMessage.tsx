import React from "react";
import {ErrorMessage} from "formik";

const ErrorMessageComponent = ({ name }) => {
  return (
    <div className="error-input">
      <ErrorMessage name={name} />
    </div>
  );
};

export default ErrorMessageComponent;
