import React from "react";
import { useDispatch } from "react-redux";
import { setCategory } from "store/categorySlice";

type Categories = {
  clean: any[];
  formated: any[];
};

type Props = {
  categories?: Categories;
  matches: any[];
  address: any[];
  children: any
};

const DispatchInitialProps: React.FC<Props> = ({ categories, children }) => {
  const dispatch = useDispatch();

  dispatch(
    setCategory(
      categories
        ? categories
        : {
          items: {
            formated: [],
            clean: [],
          },
        },
    ));

  return <>{children}</>;
};

export default DispatchInitialProps;
