import axios from "axios";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { PROD_URL } from "services/api";
import { CSSProperties } from "styled-components";
import Button from "../buttons/Button";
import FlexBox from "../FlexBox";
import Icon from "../icon/Icon";
import Rating from "../rating/Rating";
import { StyledProductCard3 } from "./ProductCardStyle";

export interface ProductCard3Props {
  className?: string;
  style?: CSSProperties;
  id?: string;
}

const ProductCard3: React.FC<ProductCard3Props> = ({ ...props }) => {
  const dispatch = useDispatch();

  const user = useSelector((selec: any) =>
    selec?.user
  );

  const favorites = useSelector((selec: any) =>
    selec?.favorites?.matches
  );

  const foundProduct = favorites.find(item => item.id === props.id)

  const onMatch = () => {
    axios.post(`${PROD_URL}product/v1/${props.id}`, {}, {
      headers: {
        'Authorization': `Bearer ${user.token}`
      }
    })

    dispatch({
      type: "MATCH_PRODUCT",
      payload: props.id
    });

  }

  return (
    <StyledProductCard3 {...props}>
      <div className="image-holder">
        <div className="sale-chip">50% off</div>
        <img src="/assets/images/products/macbook.png" alt="golden-watch" />
      </div>
      <div className="details">
        <FlexBox justifyContent="space-between">
          <div>
            <h4>ASUS ROG Strix G15</h4>
          </div>

          <div className="icon-holder">
            {/* <Icon className="favorite-icon outlined-icon">heart</Icon> */}

            {
              user.isLogged ? (
                <FlexBox className="extra-icons">
                  <Icon
                    onClick={onMatch}
                    color={foundProduct ? 'primary' : 'secondary'}
                    className={`favorite-icon`}
                    variant="small"
                  >
                    {foundProduct ? 'heart-filled' : 'heart'}
                  </Icon>
                  {/* <Icon className="favorite-icon" color="primary" variant="small">
                heart-filled
              </Icon> */}
                </FlexBox>
              ) : null
            }
          </div>
        </FlexBox>
        <FlexBox justifyContent="space-between">
          <div>
            <Rating
              value={3.5}
              outof={5}
              color="warn"
              onChange={(value) => {
              }}
            />
            <div className="price">
              <h4>R$445.00</h4>
              <del>R$250</del>
            </div>
          </div>

          <div className="add-cart">
            <Button variant="outlined" color="primary" padding="5px">
              <Icon variant="small">minus</Icon>
            </Button>
            <span>45</span>
            <Button variant="outlined" color="primary" padding="5px">
              <Icon variant="small">plus</Icon>
            </Button>
          </div>
        </FlexBox>
      </div>
    </StyledProductCard3>
  );
};

export default ProductCard3;
