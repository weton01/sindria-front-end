import IconButton from "@component/buttons/IconButton";
import Image from "@component/Image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Categories from "../categories/Categories";
import Container from "../Container";
import FlexBox from "../FlexBox";
import Icon from "../icon/Icon";
import SearchBox from "../search-box/SearchBox";
import Typography, { Small, Tiny } from "../Typography";
import StyledHeader from "./HeaderStyle";
import NavLink from "../nav-link/NavLink";
import { userLogout } from "store/actions/user/actions";
import { useAppSelector, useAppDispatch } from "hooks/hooks";
import MenuItem from "@component/MenuItem";
import Menu from "@component/Menu";
import { useSelector } from "react-redux";
import { destroyCookie } from "nookies";
import { colors } from "@utils/themeColors";
import Divider from "@component/Divider";

type HeaderProps = {
  isFixed?: boolean;
  className?: string;
};

const Header: React.FC<HeaderProps> = ({ isFixed, className }) => {
  const [products, setProducts] = useState([]);
  const [productsQuantity, setProductsQuantity] = useState(0);

  const user = useAppSelector((state) => state?.user);
  const dispatch = useAppDispatch();

  const onClickLogout = () => {
    dispatch(userLogout());
    destroyCookie(undefined, "shop_token", {
      maxAge: 60 * 60 * 7,
      path: "/",
    });
  };

  const orderStores = useSelector((selec: any) => selec?.cart?.orderStores);

  useEffect(() => {
    let newProducts = [];

    orderStores?.forEach((ost) => {
      newProducts = [...newProducts, ...ost.orderProducts];
    });

    setProducts(newProducts);
  }, [orderStores, setProducts]);

  useEffect(() => {
    let total: number = 0;

    products.forEach((p) => {
      total += p.quantity;
    });

    setProductsQuantity(total);
  }, [products]);

  return (
    <StyledHeader className={className}>
      <Container
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        height="100%"
      >
        <FlexBox className="logo" alignItems="center" mr="1rem">
          <Link href="/">
            <a>
              <Image src="/assets/images/logo.svg" alt="logo" />
            </a>
          </Link>

          {isFixed && (
            <div className="category-holder">
              <Categories>
                <FlexBox color="text.hint" alignItems="center" ml="1rem">
                  <Icon>categories</Icon>
                  <Icon>arrow-down-filled</Icon>
                </FlexBox>
              </Categories>
            </div>
          )}
        </FlexBox>

        <FlexBox justifyContent="center" flex="1 1 0">
          <SearchBox />
        </FlexBox>
        <FlexBox className="header-right" alignItems="center" gap={16}>
          {user.isLogged ? (
            <Menu
              className="category-dropdown"
              direction="right"
              handler={
                <FlexBox className="dropdown-handler" alignItems="center">
                  <IconButton bg="gray.200" p="12px">
                    <Icon variant="small">user-2</Icon>
                  </IconButton>
                </FlexBox>
              }
            >
              <Link href={"/profile"}>
                <MenuItem key={"profile"} style={{ width: 332 }}>
                  <FlexBox gap={16} alignItems={"center"} width="100%">
                    <IconButton bg="gray.200" p="18px">
                      <Icon variant="small">user-2</Icon>
                    </IconButton>
                    <FlexBox flexDirection={"column"}>
                      <Typography fontSize={16} fontWeight={600}>
                        Wesley Campana Ferreira
                      </Typography>
                      <Small>Veja seu perfil</Small>
                    </FlexBox>
                  </FlexBox>
                </MenuItem>
              </Link>
              <Divider bg={colors.gray["300"]} />
              <Link href={"/orders"}>
                <MenuItem key={"order"}>
                  <FlexBox gap={16} alignItems={"center"} width="100%">
                    <IconButton bg="gray.200" p="8px">
                      <Icon variant="small" size="16px">
                        bag
                      </Icon>
                    </IconButton>
                    <Typography fontSize={14} fontWeight={600}>
                      Todos pedidos
                    </Typography>
                  </FlexBox>
                </MenuItem>
              </Link>
              <Link href={"/coupons"}>
                <MenuItem key={"coupon"}>
                  <FlexBox gap={16} alignItems={"center"} width="100%">
                    <IconButton bg="gray.200" p="8px">
                      <Icon variant="small" size="16px">
                        coupon
                      </Icon>
                    </IconButton>
                    <Typography fontSize={14} fontWeight={600}>
                      Cupons
                    </Typography>
                  </FlexBox>
                </MenuItem>
              </Link>
              <Link href={"/wish-list"}>
                <MenuItem key={"wish-list"}>
                  <FlexBox gap={16} alignItems={"center"} width="100%">
                    <IconButton bg="gray.200" p="8px">
                      <Icon variant="small" size="16px">
                        heart
                      </Icon>
                    </IconButton>
                    <Typography fontSize={14} fontWeight={600}>
                      Lista de desejos
                    </Typography>
                  </FlexBox>
                </MenuItem>
              </Link>
              <Link href={"/favorite-stores"}>
                <MenuItem key={"favorite-stores"}>
                  <FlexBox gap={16} alignItems={"center"} width="100%">
                    <IconButton bg="gray.200" p="8px">
                      <Icon variant="small" size="16px">
                        bookmark
                      </Icon>
                    </IconButton>
                    <Typography fontSize={14} fontWeight={600}>
                      Lojas favoritas
                    </Typography>
                  </FlexBox>
                </MenuItem>
              </Link>
              <MenuItem key={"feedback"}>
                <FlexBox gap={16} alignItems={"center"} width="100%">
                  <IconButton bg="gray.200" p="8px">
                    <Icon variant="small" size="16px">
                      feedback-thumbs-up
                    </Icon>
                  </IconButton>
                  <Typography fontSize={14} fontWeight={600}>
                    Dar feedback
                  </Typography>
                </FlexBox>
              </MenuItem>
              <MenuItem key={"logout"} onClick={onClickLogout}>
                <FlexBox gap={16} alignItems={"center"} width="100%">
                  <IconButton bg="gray.200" p="8px">
                    <Icon variant="small" size="16px">
                      log-out
                    </Icon>
                  </IconButton>
                  <Typography fontSize={14} fontWeight={600}>
                    Sair
                  </Typography>
                </FlexBox>
              </MenuItem>
            </Menu>
          ) : (
            <>
              <NavLink
                className="nav-link"
                href={"/signup"}
                key={"signup"}
                rel="noopener noreferrer"
              >
                Criar conta
              </NavLink>
              <NavLink
                className="nav-link"
                href={"/login"}
                key={"login"}
                rel="noopener noreferrer"
              >
                Entre
              </NavLink>
            </>
          )}

          <NavLink
            className="nav-link"
            href={"/cart"}
            key={"cart"}
            rel="noopener noreferrer"
          >
            <FlexBox alignItems="flex-start">
              <IconButton bg="gray.200" p="12px">
                <Icon size="20px">bag</Icon>
              </IconButton>

              {!!products?.length && (
                <FlexBox
                  borderRadius="300px"
                  bg="error.main"
                  px="5px"
                  py="2px"
                  alignItems="center"
                  justifyContent="center"
                  ml="-1rem"
                  mt="-9px"
                >
                  <Tiny color="white" fontWeight="600">
                    {productsQuantity}
                  </Tiny>
                </FlexBox>
              )}
            </FlexBox>
          </NavLink>
        </FlexBox>
      </Container>
    </StyledHeader>
  );
};

export default Header;
