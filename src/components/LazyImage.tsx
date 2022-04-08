import NextImage, { ImageProps } from "next/image";
import styled from "styled-components";
import {
  border,
  BorderProps,
  color,
  ColorProps,
  space,
  SpaceProps,
} from "styled-system";

const LazyImage = styled(NextImage)<
  ImageProps & BorderProps & SpaceProps & ColorProps
>`
  display: block;
  ${color}
  ${space}
  ${border}
`;

export default LazyImage;
