import NextImage, { ImageProps } from "next/image";
import { useState } from "react";
import styled from "styled-components";
import {
  border,
  BorderProps,
  color,
  ColorProps,
  space,
  SpaceProps,
} from "styled-system";
import Spin from "./spin/Spin";

interface LazyImageProps {
  onLoad?: () => void;
  props?: any;
}

interface LazySpinn {
  spinning?: boolean
}

const LazyImageStyle = styled(NextImage)<
  ImageProps & BorderProps & SpaceProps & ColorProps
>`
  display: block;
  ${color}
  ${space}
  ${border}
`;

const LazyImage: React.FC<
  LazyImageProps & ImageProps & BorderProps & SpaceProps & ColorProps & LazySpinn
> = ({ onLoad,   ...props }) => {
  const [count, setCount] = useState(1);
  const [loading, setLoading] = useState(false);

  const onLoadImage = async (props) => {
    let currentCount = count;
    setCount(currentCount + 1);
    if (count === 2) {
      setLoading(false);
    }
  };

  return (
    <Spin loading={props.spinning? loading: false}>
      <LazyImageStyle onLoad={onLoadImage} {...props} />
    </Spin>
  );
};

export default LazyImage;
