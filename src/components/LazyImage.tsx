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

const LazyImageStyle = styled(NextImage)<
  ImageProps & BorderProps & SpaceProps & ColorProps
>`
  display: block;
  ${color}
  ${space}
  ${border}
`;

const LazyImage: React.FC<
  LazyImageProps & ImageProps & BorderProps & SpaceProps & ColorProps
> = ({ onLoad, ...props }) => {
  const [count, setCount] = useState(1);
  const [loading, setLoading] = useState(true);

  const onLoadImage = async (props) => {
    let currentCount = count;
    setCount(currentCount + 1);
    if (count === 2) {
      setLoading(false);
    }
  };

  return (
    <Spin loading={loading}>
      <LazyImageStyle onLoad={onLoadImage} {...props} />
    </Spin>
  );
};

export default LazyImage;
