import React from "react";
import { useSelector } from "react-redux";
import CategoryMenuItem from "./category-menu-item/CategoryMenuItem";
import { StyledCategoryDropdown } from "./CategoryDropdownStyle";
import MegaMenu1 from "./mega-menu/MegaMenu1";
import MegaMenu2 from "./mega-menu/MegaMenu2";

export interface CategoryDropdownProps {
  open: boolean;
  position?: "absolute" | "relative";
  categories?: any
}

const CategoryDropdown: React.FC<CategoryDropdownProps> = ({
  open,
  position, 
}) => {
  const megaMenu = {
    MegaMenu1,
    MegaMenu2,
  };
 
  const categories = useSelector((selec: any )=> selec.category.items); 
  
  return (
    <StyledCategoryDropdown open={open} position={position}>
      {categories?.map((item) => {
        let MegaMenu = megaMenu[item.menuComponent];

        return (
          <CategoryMenuItem
            title={item.title}
            href={item.href}
            icon={item.icon}
            key={item.title}
          >
            <MegaMenu data={item.menuData || {}} />
          </CategoryMenuItem>
        );
      })}
    </StyledCategoryDropdown>
  );
};

CategoryDropdown.defaultProps = {
  position: "absolute",
};

export default CategoryDropdown;
