import Button from "@component/buttons/Button";
import DashboardPageHeader from "@component/layout/DashboardPageHeader";
import VendorDashboardLayout from "@component/layout/VendorDashboardLayout";
import { GetServerSideProps } from "next";
import React, { useEffect, useState } from "react";
import { parseCookies } from "nookies";
import { getSubCategory } from "services/category";
import { getTags } from "services/tags";
import Stepper from "@component/stepper/Stepper";
import { useRouter } from "next/router";
import Box from "@component/Box";
import { getBrands } from "services/brand";
import { getStore } from "services/store";
import ProductForm from "@component/vendor/product/ProdctForm";

const AddProduct = (props) => {
  const [selectedStep, setSelectedStep] = useState(0);
  const router = useRouter();
  const { route } = router;

  const handleStepChange = (_step, ind) => {
    switch (ind) {
      case 0:
        router.push(`/vendor/add-product/`);
        break;
      case 1:
        router.push(`/vendor/add-product/variations`);
        break;
      case 2:
        router.push(`/vendor/add-product/colors`);
        break;
      case 3:
        router.push(`/vendor/add-product/sizes`);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    switch (route) {
      case `/vendor/add-product`:
        setSelectedStep(1);
        break;
      case `/vendor/add-product/variations/[id]`:
        setSelectedStep(2);
        break;
      case `/vendor/add-product/colors/[id]`:
        setSelectedStep(3);
        break;
      case `/vendor/add-product/sizes/[id]`:
        setSelectedStep(4);
        break;

      default:
        break;
    }
  }, [route]);

  return (
    <div>
      <DashboardPageHeader
        title="Adicionar produto"
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
      <ProductForm {...props} />
    </div>
  );
};

AddProduct.layout = VendorDashboardLayout;

const stepperList = [
  {
    title: "Produto",
    disabled: false,
  },
  {
    title: "Variações",
    disabled: true,
  },
  {
    title: "Cores",
    disabled: true,
  },
  {
    title: "Tamanhos",
    disabled: true,
  },
];

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { ["shop_token"]: token } = parseCookies(ctx);
  try {
    const [categories, tags, brands, store] = await Promise.all([
      getSubCategory({ token }),
      getTags(),
      getBrands({ token }),
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

    return {
      props: {
        store: newStores || [],
        categories: newCategories || [],
        tags: newTags || [],
        brands: newBrands || [],
      },
    };
  } catch (err) {
    console.log("fail to verify tokens", err);
  }

  return {
    props: {},
  };
};

export default AddProduct;
