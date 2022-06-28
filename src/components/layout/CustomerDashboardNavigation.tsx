import Box from "@component/Box";
import { useRouter } from "next/router";
import React, { Fragment } from "react";
import FlexBox from "../FlexBox";
import Icon from "../icon/Icon";
import Typography from "../Typography";
import {
  DashboardNavigationWrapper,
  StyledDashboardNav,
} from "./DashboardStyle";

const CustomerDashboardNavigation = () => {
  const { pathname } = useRouter();

  return (
    <DashboardNavigationWrapper px="0px" pb="1.5rem" color="gray.900">
      {linkList.map((item) => (
        <Fragment key={item.title}>
          <Typography p="26px 30px 1rem" color="text.muted" fontSize="12px">
            {item.title}
          </Typography>
          {item.list.map((item) => (
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
        </Fragment>
      ))}
    </DashboardNavigationWrapper>
  );
};

const linkList = [
  {
    title: "PAINEL DE CONTROLE",
    list: [
      {
        href: "/orders",
        title: "Pedidos",
        iconName: "bag",
        count: 5,
      },
      {
        href: "/wish-list",
        title: "Lista de Desejos",
        iconName: "heart",
        count: 19,
      },
      {
        href: "/store",
        title: "Sua Loja",
        iconName: "home",
        count: 1,
      },
    ],
  },
  {
    title: "CONFIGURAÇÕES DE CONTA",
    list: [
      {
        href: "/profile",
        title: "Perfil",
        iconName: "user",
        count: 3,
      },
      {
        href: "/address",
        title: "Endereços",
        iconName: "pin",
        count: 16,
      },
      {
        href: "/payment-methods",
        title: "Cartões de crédito",
        iconName: "credit-card",
        count: 4, 
      }, 
    ],
  },
  {
    title: "ADMIN",
    list: [
      {
        href: "/categories",
        title: "Categorias",
        iconName: "category",
        count: 3,
      },
      {
        href: "/subcategory",
        title: "Subcategoria",
        iconName: "categories",
        count: 3,
      },
      {
        href: "/brands",
        title: "Marcas",
        iconName: "brand",
        count: 16,
      },
      {
        href: "/tags",
        title: "Etiqueta",
        iconName: "comment",
        count: 16,
      },
    ],
  },
];

export default CustomerDashboardNavigation;
