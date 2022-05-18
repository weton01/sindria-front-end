import Card from "@component/Card";
import { Span } from "@component/Typography";
import { debounce } from "lodash";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { api } from "services/api";
import Box from "../Box";
import FlexBox from "../FlexBox";
import Icon from "../icon/Icon";
import Menu from "../Menu";
import MenuItem from "../MenuItem";
import TextField from "../text-field/TextField";
import StyledSearchBox from "./SearchBoxStyle";
import { parseCookies } from 'nookies'

export interface SearchBoxProps { }

const SearchBox: React.FC<SearchBoxProps> = () => {
  const [resultList, setResultList] = useState([]);
  const cookies = parseCookies()

  const [category, setCategory] = useState({
    id: null,
    name: 'Todas Categorias'
  });

  const categories = useSelector((selec: any) =>
    selec.category?.items?.clean
  );

  const handleCategoryChange = (cat) => () => {
    setCategory(cat);
  };

  useEffect(() => { 
  }, [category])

  const search = async (e) => {
    const value = e.target?.value;
    if (!value) setResultList([]);
    else {
      const { data } = await api.get(`product/v1/navbar/${value}`, {
        params: {
          category: category.id
        },
        headers: { Authorization: `Bearer ${cookies['shop_token']}` }
      })
      
      setResultList(data);
    }
  };

  const hanldeSearch = (event) => {
    search(event);
  };

  const handleDocumentClick = () => {
    setResultList([]);
  };

  useEffect(() => {
    window.addEventListener("click", handleDocumentClick);
    return () => {
      window.removeEventListener("click", handleDocumentClick);
    };
  }, []);

  return (
    <Box position="relative" flex="1 1 0" maxWidth="670px" mx="auto">
      <StyledSearchBox>
        <Icon className="search-icon" size="18px">
          search
        </Icon>
        <TextField
          className="search-field"
          placeholder="Procure e pressione enter..."
          fullwidth
          onChange={hanldeSearch}
        />
        <Menu
          className="category-dropdown"
          direction="right"
          handler={
            <FlexBox className="dropdown-handler" alignItems="center">
              <span style={{ width: 130, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: 'nowrap' }}>{category.name}</span>
              <Icon variant="small">chevron-down</Icon>
            </FlexBox>
          }
        >
          {categories?.map((item) => (
            <MenuItem key={item.id} onClick={handleCategoryChange(item)}>
              {item.name}
            </MenuItem>
          ))}
        </Menu>
        {/* <Box className="menu-button" ml="14px" cursor="pointer">
          <Icon color="primary">menu</Icon>
        </Box> */}
      </StyledSearchBox>

      {!!resultList.length && (
        <Card
          position="absolute"
          top="100%"
          py="0.5rem"
          width="100%"
          boxShadow="large"
          zIndex={99}
        >
          {resultList.map((item) => (
            <Link href={`/product/search/${item.name}`} key={`link-${item.id}`}>
              <MenuItem key={`menu-item-${item.id}`}>
                <Span fontSize="14px">{item.name}</Span>
              </MenuItem>
            </Link>
          ))}
        </Card>
      )}
    </Box>
  );
};

const dummySearchResult = [
  "Macbook Air 13",
  "Ksus K555LA",
  "Acer Aspire X453",
  "iPad Mini 3",
];

export default SearchBox;
