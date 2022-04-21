import Link from "next/link";
import React from "react";
import Icon from "../../icon/Icon";
import { StyledCategoryMenuItem } from "./CategoryMenuItemStyle";

interface CategoryMenuItemProps {
  href: string;
  icon?: string;
  title: string;
  caret?: boolean;
}

const CategoryMenuItem: React.FC<CategoryMenuItemProps> = ({
  href,
  icon,
  title,
  caret,
  children,
}) => {
  return (
    <StyledCategoryMenuItem>
      <Link href={href}>
        <div className="category-dropdown-link">
          {icon && (
            <img
              width="20px"
              src={`/assets/images/icons/${icon}.svg`}
              onError={(e) => {
                e.currentTarget.src = "/assets/images/icons/cloud-off.svg";
              }}
            />
          )}
          <span className="title">{title}</span>
          {caret && <Icon variant="small">chevron-right</Icon>}
        </div>
      </Link>
      {children}
    </StyledCategoryMenuItem>
  );
};

CategoryMenuItem.defaultProps = {
  caret: true,
};

export default CategoryMenuItem;
