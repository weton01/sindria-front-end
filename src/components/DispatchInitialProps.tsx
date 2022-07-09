import React from "react";
import { useDispatch } from "react-redux";

type Categories = {
  clean: any[];
  formated: any[];
};

type Props = {
  categories?: Categories;
  matches: any[]
};

const DispatchInitialProps: React.FC<Props> = ({ categories, children, matches }) => {
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

  dispatch({
    type: "SET_INITIAL_MATCH",
    payload: matches
  })

  return <>{children}</>;
};

export default DispatchInitialProps;
