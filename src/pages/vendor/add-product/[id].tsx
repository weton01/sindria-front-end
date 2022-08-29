import Button from "@component/buttons/Button";
import DashboardPageHeader from "@component/layout/DashboardPageHeader";
import VendorDashboardLayout from "@component/layout/VendorDashboardLayout";
import { GetServerSideProps } from "next";
import React, { useEffect, useState } from "react";
import * as yup from "yup";
import { getSubCategory } from "services/category";
import { getTags } from "services/tags";
import { getProductById } from "services/product";
import Stepper from "@component/stepper/Stepper";
import { useRouter } from "next/router";
import Box from "@component/Box";
import { getBrands } from "services/brand";
import { authRoute } from "middlewares/authRoute";
import { getStore } from "services/store";
import ProductForm from "@component/vendor/product/ProdctForm";

const EditProduct = (props) => {
  const { product } = props;
  const [selectedStep, setSelectedStep] = useState(0);
  const router = useRouter();
  const id = router?.query?.id;
  const { route } = router;

  console.log('====================================');
  console.log(props);
  console.log('====================================');
 const handleStepChange = (_step, ind) => {
    switch (ind) {
      case 0:
        router.push(`/vendor/add-product/${id}`);
        break;
      case 1:
        router.push(`/vendor/add-product/colors/${id}`);
        break;
      case 2:
        router.push(`/vendor/add-product/sizes/${id}`);
        break;
      case 3:
        router.push(`/vendor/add-product/inventory/${id}`);
        break;
      case 4:
        router.push(`/vendor/add-product/variations/${id}`);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    switch (route) {
      case `/vendor/add-product/[id]`:
        setSelectedStep(1);
        break;
      case `/vendor/add-product/colors/[id]`:
        setSelectedStep(3);
        break;
      case `/vendor/add-product/sizes/[id]`:
        setSelectedStep(4);
        break; 
      case `/vendor/add-product/inventory/[id]`:
        setSelectedStep(3);
        break;
      case `/vendor/add-product/variations/[id]`:
        setSelectedStep(2);
        break;
      default:
        break;
    }
  }, [route]);

  return (
    <div>
      <DashboardPageHeader
        title={`${product.name}`}
        iconName="delivery-box"
        button={
          <Button
            color="primary"
            bg="primary.light"
            px="2rem"
            route="/vendor/products"
          >
            Voltar para produtos
          </Button>
        }
      /> 
      <Box mb="14px" width="100%">
        <Stepper
          stepperList={stepperList}
          selectedStep={selectedStep}
          onChange={handleStepChange}
        />
      </Box>
      <ProductForm {...props} edit />
    </div>
  );
};
 
EditProduct.layout = VendorDashboardLayout;

const stepperList = [
  {
    title: "Produto",
    disabled: false,
  },
  {
    title: "Cores",
    disabled: false,
  },
  {
    title: "Tamanhos",
    disabled: false,
  }, 
  {
    title: "Estoque",
    disabled: false,
  }, 
];
 
export const getServerSideProps: GetServerSideProps = async (c) => {
  return authRoute(c, async ({ token, ...ctx }: any) => {
    try {
      const { id } = ctx.query;

      let [categories, tags, brands, product, store] = await Promise.all([
        getSubCategory({ token }),
        getTags(),
        getBrands({ token }),
        getProductById({ id, token }),
        getStore({ token, skip: 0, take: 10000 }),
      ]);

      const newCategories = categories?.items?.map((item) => {
        return {
          label: item.name,
          value: item.id,
        };
      });

      const newTags = tags?.items?.map((item) => {
        return {
          label: item.name,
          value: item.id,
        };
      });

      const newBrands = brands?.items?.map((item) => {
        return {
          label: item.name,
          value: item.id,
        };
      });

      const newStores = store?.items?.map((item) => {
        return {
          label: item.name,
          value: item.id,
        };
      });

      product.brand = {
        label: product.brand.name,
        value: product.brand.id,
      };

      product.store = {
        label: product.store.name,
        value: product.store.id,
      };

      product.unitMeasurement = {
        label: product.unitMeasurement,
        value: product.unitMeasurement,
      };
      
      product.categories = product?.categories?.map((item) => {
        return {
          label: item.name,
          value: item.id,
        };
      });

      product.tags = product?.tags?.map((item) => {
        return {
          label: item.name,
          value: item.id,
        };
      });
      

      return {
        props: {
          store: newStores || [],
          categories: newCategories,
          tags: newTags,
          brands: newBrands,
          product,
        },
      };
    } catch {}
  });
};

export default EditProduct;
