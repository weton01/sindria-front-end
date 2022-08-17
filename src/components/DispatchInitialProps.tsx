import React from "react";
import { useDispatch } from "react-redux";

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

const DispatchInitialProps: React.FC<Props> = ({ categories, children, matches, address }) => {
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

  dispatch({
    type: "SELECT_ADDRESS",
    payload: address
  })

  return <>{children}</>;
};

export default DispatchInitialProps;
