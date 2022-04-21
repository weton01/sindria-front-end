import IconButton from "@component/buttons/IconButton";
import Image from "@component/Image";
import Link from "next/link";
import React from "react";
import Categories from "../categories/Categories";
import Container from "../Container";
import FlexBox from "../FlexBox";
import Icon from "../icon/Icon";
import SearchBox from "../search-box/SearchBox";
import { Tiny } from "../Typography";
import StyledHeader from "./HeaderStyle";
import NavLink from "../nav-link/NavLink";
import { userLogout } from "store/actions/user/actions";
import { useAppSelector, useAppDispatch } from "hooks/hooks";
import MenuItem from "@component/MenuItem";
import Menu from "@component/Menu";

type HeaderProps = {
  isFixed?: boolean;
  className?: string; 
};

const Header: React.FC<HeaderProps> = ({
  isFixed,
  className, 
}) => {
  const cartList = [];
  const user = useAppSelector((state) => state?.user);
  const dispatch = useAppDispatch();

  const onClickLogout = () => {
    dispatch(userLogout());
  };

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
        <FlexBox className="header-right" alignItems="center" gap="16px">
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
              <MenuItem key={"profile"}>Perfil</MenuItem>
              <MenuItem key={"logout"} onClick={onClickLogout}>
                Sair
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

              {!!cartList.length && (
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
                    {cartList.length}
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
