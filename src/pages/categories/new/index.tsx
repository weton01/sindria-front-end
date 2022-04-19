import React from "react";
import DashboardLayout from "@component/layout/CustomerDashboardLayout";
import NewCategoriesEditor from "@component/categories/CategoryEditor";

const NewCategories = () => {
  return (
    <div>
      <NewCategoriesEditor />
    </div>
  );
};

NewCategories.layout = DashboardLayout;

export default NewCategories;
