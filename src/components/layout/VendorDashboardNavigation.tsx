import Box from "@component/Box";
import { useRouter } from "next/router";
import React from "react";
import FlexBox from "../FlexBox";
import Icon from "../icon/Icon";
import {
  DashboardNavigationWrapper,
  StyledDashboardNav,
} from "./DashboardStyle";

const VendorDashboardNavigation = () => {
  const { pathname } = useRouter();

  return (
    <DashboardNavigationWrapper px="0px" py="1.5rem" color="gray.900">
      {linkList.map((item) => (
        <StyledDashboardNav
          isCurrentPath={pathname.includes(item.href)}
          href={item.href}
          key={item.title}
          px="1.5rem"
          mb="1.25rem"
        >
          <FlexBox alignItems="center">
            <Box className="dashboard-nav-icon-holder">
              <Icon variant="small" defaultcolor="currentColor" mr="10px">
                {item.iconName}
              </Icon>
            </Box>
            <span>{item.title}</span>
          </FlexBox>
          <span>{item.count}</span>
        </StyledDashboardNav>
      ))}
    </DashboardNavigationWrapper>
  );
};

const linkList = [
  {
    href: "/vendor/dashboard",
    title: "Painel de controle",
    iconName: "board",
  },
  {
    href: "/vendor/products",
    title: "Produtos",
    iconName: "box",
    count: 300,
  },
  {
    href: "/vendor/add-product",
    title: "Novo Produto",
    iconName: "upload",
  },
  {
    href: "/vendor/orders",
    title: "Pedidos",
    iconName: "shopping-cart",
    count: 40,
  },
  {
    href: "/vendor/account-settings",
    title: "Configurações de conta",
    iconName: "gear-2",
  },
];

export default VendorDashboardNavigation;
