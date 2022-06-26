import React from "react";
import { useDispatch } from "react-redux";

type Categories = {
  clean: any[];
  formated: any[];
};

type Props = {
  categories?: Categories;
};

const DispatchInitialProps: React.FC<Props> = ({ categories, children }) => {
  const dispatch = useDispatch();

  dispatch({
    type: "SET_CATEGORY",
    payload: categories
      ? categories
      : {
          items: {
            formated: [],
            clean: [],
          },
        },
  });

  return <>{children}</>;
};

export default DispatchInitialProps;
