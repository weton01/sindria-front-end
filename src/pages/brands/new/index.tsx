import React from 'react';
import DashboardLayout from "@component/layout/CustomerDashboardLayout";
import BrandsEditor from '@component/brands/BrandsForm';

const Brands = () => {
    return (
        <div>
         <BrandsEditor/> 
        </div>
    )
}

Brands.layout = DashboardLayout;

export default Brands;