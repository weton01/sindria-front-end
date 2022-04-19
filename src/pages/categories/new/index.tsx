import React from "react";
import DashboardLayout from "@component/layout/CustomerDashboardLayout";
import CategoriesEditor from "@component/categories/CategoryEditor";

const Categories = () => {
  return (
    <div>
      <CategoriesEditor />
    </div>
  );
};

Categories.layout = DashboardLayout;

export default Categories;
