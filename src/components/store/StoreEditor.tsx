import DashboardPageHeader from "@component/layout/DashboardPageHeader";
import React, {  } from "react";
import Button from '@component/buttons/Button'
import DashboardLayout from "@component/layout/CustomerDashboardLayout";
import StoreForm from "./StoreForm";

const StoreEditor = ({ address, store }) => { 
  return (
    <div>
      <DashboardPageHeader
        title={`Editar Loja`}
        iconName="home"
        button={
          <Button
            color="primary"
            bg="primary.light"
            px="2rem"
            route="/store"
          >
            Voltar para as lojas
          </Button>
        }
      /> 
      <StoreForm address={address} edit={true} data={store}/> 
    </div>
  );
};
 
StoreEditor.layout = DashboardLayout; 
 
export default StoreEditor;
