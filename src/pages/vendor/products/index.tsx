import Avatar from "@component/avatar/Avatar";
import IconButton from "@component/buttons/IconButton";
import FlexBox from "@component/FlexBox";
import Hidden from "@component/hidden/Hidden";
import Icon from "@component/icon/Icon";
import DashboardPageHeader from "@component/layout/DashboardPageHeader";
import VendorDashboardLayout from "@component/layout/VendorDashboardLayout";
import Pagination from "@component/pagination/Pagination";
import TableRow from "@component/TableRow";
import Typography, { H5 } from "@component/Typography";
import { ITEMS_PER_PAGE } from "@utils/enums";
import { formatCurrency } from "@utils/formatCurrency";
import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";
import React from "react";
import Popup from "reactjs-popup";
import { api } from "services/api";
import { getProduct } from "services/product";
import Button from "@component/buttons/Button";
import Grid from "@component/grid/Grid";
import { useRouter } from "next/router";
import { toast } from "react-nextjs-toast";
import { authRoute } from "middlewares/authRoute";

const Products = (props) => {
  const { products } = props;
  const router = useRouter();
  const skip: number = parseInt(router?.query?.skip?.toString()) || 0;

  const deleteProduct = async (id) => {
    toast.notify("Removendo produto", {
      title: "Deletando...",
      duration: 2,
      type: "info",
    });
    try {
      await api.delete(`product/v1/${id}`);
      router.replace(router.asPath);
      toast.notify("Produto removido", {
        title: "Sucesso!",
        duration: 5,
        type: "success",
      });
    } catch (err) {
      toast.notify(err.response.data.message, {
        title: "Erro!",
        duration: 5,
        type: "error",
      });
    }
  };

  return (
    <div>
      <DashboardPageHeader
        title="Produtos"
        iconName="delivery-box"
        button={
          <Button
            color="primary"
            bg="primary.light"
            px="2rem"
            route="/vendor/add-product"
          >
            Adicionar novo produto
          </Button>
        }
      />

      <Hidden down={769}>
        <TableRow padding="0px 18px" boxShadow="none" bg="none">
          <Grid container>
            <Grid item sm={6} xs={6}>
              <H5 ml="58px" color="text.muted" textAlign="left">
                Nome
              </H5>
            </Grid>
            <Grid item sm={2} xs={6}>
              <H5 H5 color="text.muted">
                Valor Líquido
              </H5>
            </Grid>
            <Grid item sm={2} xs={6}>
              <H5 color="text.muted">Valor Bruto</H5>
            </Grid>
            <Grid item sm={0} xs={6}>
              {null}
            </Grid>
            <Grid item sm={0} xs={6}>
              {null}
            </Grid>
            <Grid item sm={0} xs={6}>
              {null}
            </Grid>
          </Grid>
        </TableRow>
      </Hidden>

      {products?.items?.map((item, ind) => (
        <TableRow my="1rem" padding="6px 18px" key={ind}>
          <Grid container alignItems={"center"}>
            <Grid item sm={6} xs={6}>
              <FlexBox alignItems="center">
                <Avatar src={item.images[0]} size={40} />
                <Typography textAlign="left" ml="18px">
                  {item.name}
                </Typography>
              </FlexBox>
            </Grid>

            <Grid item sm={2} xs={6}>
              <H5 textAlign="left" fontWeight="400">
                {formatCurrency(item.netAmount)}
              </H5>
            </Grid>
            <Grid item sm={2} xs={6}>
              <H5 textAlign="left" fontWeight="400">
                {formatCurrency(item.grossAmount)}
              </H5>
            </Grid>
            <Grid item sm={2} xs={0}>
              <FlexBox>
                <Typography
                  className="pre"
                  textAlign="right"
                  color="text.muted"
                >
                  <Typography
                    as="a"
                    href={`/vendor/add-product/${item.id}`}
                    color="inherit"
                  >
                    <IconButton size="small">
                      <Icon variant="small" defaultcolor="currentColor">
                        edit
                      </Icon>
                    </IconButton>
                  </Typography>
                  <Popup
                    closeOnDocumentClick
                    trigger={
                      <IconButton size="small">
                        <Icon variant="small" defaultcolor="currentColor">
                          delete
                        </Icon>
                      </IconButton>
                    }
                    position="right center"
                  >
                    {(close) => (
                      <div>
                        Deseja realmete deletar?
                        <span style={{ display: "flex", gap: 8 }}>
                          <Button
                            onClick={() => {
                              close();
                            }}
                            size="small"
                          >
                            Não
                          </Button>
                          <Button
                            color="primary"
                            bg="primary.light"
                            onClick={() => {
                              deleteProduct(item.id);
                              close();
                            }}
                            size="small"
                          >
                            Sim
                          </Button>
                        </span>
                      </div>
                    )}
                  </Popup>
                </Typography>
                <Hidden flex="0 0 0 !important" down={769}>
                  <Typography
                    as="a"
                    textAlign="center"
                    color="text.muted"
                    href={`/product/${item.id}`}
                  >
                    <IconButton size="small">
                      <Icon variant="small" defaultcolor="currentColor">
                        arrow-right
                      </Icon>
                    </IconButton>
                  </Typography>
                </Hidden>
              </FlexBox>
            </Grid>
          </Grid>
        </TableRow>
      ))}

      <FlexBox justifyContent="center" mt="2.5rem">
        <Pagination
          initialPage={Math.trunc(skip / ITEMS_PER_PAGE.MAX)}
          pageCount={products?.count / ITEMS_PER_PAGE.MAX}
          onChange={(data: any) => {
            router.push(`/vendor/products?skip=${data * ITEMS_PER_PAGE.MAX}`);
          }}
        />
      </FlexBox>
    </div>
  );
};

const productList = [
  {
    orderNo: "1050017AS",
    stock: 30,
    price: 350,
    href: "/vendor/products/5452423",
  },
  {
    orderNo: "1050017AS",
    stock: 20,
    price: 500,
    href: "/vendor/products/5452423",
  },
  {
    orderNo: "1050017AS",
    stock: 2,
    price: 700,
    href: "/vendor/products/5452423",
  },
  {
    orderNo: "1050017AS",
    stock: 25,
    price: 300,
    href: "/vendor/products/5452423",
  },
  {
    orderNo: "1050017AS",
    stock: 1,
    price: 700,
    href: "/vendor/products/5452423",
  },
];

Products.layout = VendorDashboardLayout;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return authRoute(ctx, async ({ token }: any) => {
    try {
      api.interceptors.request.use((config) => {
        config.headers["Authorization"] = `Bearer ${token}`;
        return config;
      });

      const take = ITEMS_PER_PAGE.MAX;
      const { skip = 0 } = ctx.query;

      let [products] = await Promise.all([
        getProduct({
          params: {
            take,
            skip, 
          },
        }),
      ]);

      return {
        props: {
          products: products || [],
        },
      };
    } catch (err) {
      console.log("fail to verify tokens", err);
    }

    return {
      props: {},
    };
  });
};

export default Products;
