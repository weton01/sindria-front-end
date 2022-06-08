import React, { ButtonHTMLAttributes } from "react";
import { SpaceProps } from "styled-system";
import { colorOptions } from "../../interfaces";
import StyledIcon from "./IconStyle";

export enum IconType {
  avatars = "avatars",
  badges = "badges",
  banners = "banners",
  brands = "brands",
  browsers = "browsers",
  faces = "faces",
  "file-types" = "badges",
  flags = "flags",
  icons = "icons",
  illustrations = "illustrations",
  landing = "landing",
  logos = "logos",
  models = "models",
  "payment-card" = "payment-card",
  "payment-methods"=  "payment-methods",
  products = "products",
  promotion = "promotion",
  shops = "shops",
  sidebar = "sidebar",
}

export interface IconProps {
  size?: string;
  children: string;
  transform?: string;
  variant?: "small" | "medium" | "large";
  color?: colorOptions;
  defaultcolor?: "currentColor" | "auto";
  typer?: IconType;
}

const Icon: React.FC<
  IconProps & SpaceProps & ButtonHTMLAttributes<IconProps>
> = ({ children, typer = IconType.icons, ...props }: IconProps) => {
  return (
    <StyledIcon
      src={`/assets/images/${typer}/${children}.svg`}
      fallback={() => <span>{children?.trim()}</span>}
      {...props}
    />
  );
};

Icon.defaultProps = {
  variant: "medium",
  defaultcolor: "currentColor",
};

export default Icon;
