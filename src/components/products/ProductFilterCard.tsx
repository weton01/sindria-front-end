import Box from "@component/Box";
import { formatCurrency } from "@utils/formatCurrency";
import { useRouter } from "next/router";
import React, { useState } from "react";
import Card from "../Card";
import Divider from "../Divider";
import FlexBox from "../FlexBox";
import TextField, { MaskInput } from "../text-field/TextField";
import { H5, H6, Paragraph, SemiSpan, Small } from "../Typography";
import Button from "@component/buttons/Button";
import { useSelector } from "react-redux";
import Accordion from "@component/accordion/Accordion";
import AccordionHeader from "@component/accordion/AccordionHeader";

export interface FilterProps {
  filter: any
}

const fncAddChecked = (item) => {
  item.checked = true
  return item
}

const ProductFilterCard: React.FC<FilterProps> = ({ filter }) => {
  const { brands, sizes, tags, } = filter;
  const router = useRouter()

  const categories = useSelector((selec: any) =>
    selec?.category?.items?.clean
  );

  const foundCategory = categories.find((c, index) => {

    if (c.id === filter.categories[0].c_id) {
      c.subCategories = c.subCategories.slice(0, 4)
      return true
    }
    const foundSubCategory = c.subCategories.find(
      c2 => c2.id === filter.categories[0].c_id
    )

    if (foundSubCategory) {
      c.subCategories = c.subCategories.slice(0, 4)
      return true
    }
    return false
  })
  
  const [minValue, setMinValue] = useState(parseFloat(filter.minMax[0].minAmount))
  const [maxValue, setMaxValue] = useState(parseFloat(filter.minMax[0].maxAmount))

  const routerPush = (query) => (
    router.push({
      path: '/',
      query: query
    })
  )

  const fncRenderBrands = (item => (
    <Box
      color="text.muted"
      lineHeight="24px"
      fontSize={13}
      cursor="pointer"
      onClick={() => {
        const newBrand = brands.find(br => {
          return br.v_id === item.v_id
        })
        routerPush({
          ...router.query,
          take: 10,
          skip: 0,
          'p.brand': newBrand.b_id
        })
      }}
    >
      {item.b_name} ({item.b_qtd})
    </Box>
  ))

  const fncRenderSizes = (item => (
    <Box
      color="text.muted"
      lineHeight="24px"
      fontSize={13}
      cursor="pointer"
      key={item.v_id}
      onClick={() => {
        const newSize = sizes.find(br => {
          return br.v_id === item.v_id
        })
        routerPush({
          ...router.query,
          take: 10,
          skip: 0,
          'p.size': newSize.v_id,
        })
      }}
    >
      {item.v_size}  ({item.v_qtd})
    </Box>
  ))

  const fncRenderTags = (item => (
    <Box
      color="text.muted"
      lineHeight="24px"
      fontSize={13}
      cursor="pointer"
      key={item.t_id}
      onClick={() => {
        const newTag = brands.find(br => {
          return br.t_id === item.t_id
        })
        routerPush({
          ...router.query,
          take: 10,
          skip: 0,
          'p.tag': newTag.t_id,
        })
      }}
    >
      {item.t_name} ({item.t_qtd})
    </Box>
  ))


  return (
    <Card p="18px 27px" elevation={5}>
      <H6 mb="10px">Categorias</H6>
      {
        filter.categories.map((item, index) => {
          return index === 0 ? (
            <Accordion key={foundCategory.name} expanded>
              <AccordionHeader
                px="0px"
                py="6px"
                color="text.muted"
              // justifyContent="flex-start"
              >
                <SemiSpan className="cursor-pointer" mr="9px">
                  {foundCategory.name}
                </SemiSpan>
              </AccordionHeader>
              {foundCategory.subCategories.map((item2) => (
                <Paragraph
                  className="cursor-pointer"
                  fontSize="14px"
                  color="text.muted"
                  pl="22px"
                  py="6px"
                  key={item.name}
                >
                  {item2.name}
                </Paragraph>
              ))}
            </Accordion>
          ) : (
            <Paragraph
              className="cursor-pointer"
              fontSize="14px"
              color="text.muted"
              py="6px"
              key={item.name}
            >
              {item.name}
            </Paragraph>
          )
        })
      }
      <Divider mt="18px" mb="24px" />

      <H6 mb="16px">Preços</H6>
      <Small color="text.muted">
        Valor Mínimo: {formatCurrency(parseFloat(filter.minMax[0].minAmount))}
      </Small  >
      <br></br>
      <Small color="text.muted">
        Valor Maximo: {formatCurrency(parseFloat(filter.minMax[0].maxAmount))}
      </Small>

      <FlexBox mt="8px" justifyContent="space-between" alignItems="center">
        <TextField
          fontSize={10}
          value={minValue}
          mask={MaskInput.money}
          height={32}
          placeholder="0"
          fullwidth
          onChange={(e) => {
            setMinValue(parseFloat(e.target.value))
          }}
        />
        <H5 color="text.muted" px="0.5rem">
          -
        </H5>
        <TextField
          fontSize={10}
          value={maxValue}
          mask={MaskInput.money}
          height={32}
          placeholder="250"
          fullwidth
          onChange={(e) => {
            setMaxValue(parseFloat(e.currentTarget.value))
          }}

        />
        <Button
          width={50}
          size={'smallest'}
          variant="contained"
          color="primary"
          ml={"4px"}
          onClick={() => {
            routerPush({
              ...router.query,
              take: 10,
              skip: 0,
              'p.minAmount': minValue,
              'p.maxAmount': maxValue
            })
          }}
        >
          Filtrar
        </Button>
      </FlexBox>
      <Divider my="24px" />

      {
        brands.length > 0 ? <>
          <H6 mb="12px">Marcas</H6>
          {brands.map(fncAddChecked).map(fncRenderBrands)}
          <Divider my="24px" />
        </> : null
      }

      {
        sizes?.length > 0 ? <>
          <H6 mb="12px">Tamanhos</H6>
          {sizes.map(fncAddChecked).map(fncRenderSizes)}
          <Divider my="24px" />
        </> : null
      }

      {
        tags ? <>
          <H6 mb="12px">Etiquetas</H6>
          {tags.map(fncAddChecked).map(fncRenderTags)}
        </> : null
      }
    </Card>
  );
};


export default ProductFilterCard;
