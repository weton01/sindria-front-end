import Button from "@component/buttons/Button";
import IconButton from "@component/buttons/IconButton";
import Card from "@component/Card";
import FlexBox from "@component/FlexBox";
import Icon from "@component/icon/Icon";
import DashboardLayout from "@component/layout/CustomerDashboardLayout";
import DashboardPageHeader from "@component/layout/DashboardPageHeader";
import Pagination from "@component/pagination/Pagination";
import TableRow from "@component/TableRow";
import Typography, { H5, Small } from "@component/Typography";
import { ITEMS_PER_PAGE } from "@utils/enums";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React from "react";
import Popup from "reactjs-popup";
import { api, PROD_URL, request } from "services/api";
import { toast } from "react-nextjs-toast";
import Result from "@component/result";
import { authRoute } from "middlewares/authRoute";
import axios from "axios";
import { fail } from "@component/notification/notifcate";
import { getStore } from "services/store";

const Categories = ({ stores }) => {
  const router = useRouter();
  const skip: number = parseInt(router?.query?.skip?.toString()) || 0;

  const deleteStore = async (id) => {
    toast.notify("Removendo loja", {
      title: "Deletando...",
      duration: 2,
      type: "info",
    });

    await request.remove({
      route: `store/v1/${id}`,
      message: `Store removido!`,
      actionSuccess: () => router.push("/store"),
      actionError: () => {
        return fail("Falha ao remover a loja");
      },
    });
  };

  const editStore = (id) => {
    router.push(`store/${id}`);
  };

  return (
    <div>
      <DashboardPageHeader
        title="Lojas"
        iconName="shop"
        button={
          <Button
            color="primary"
            bg="primary.light"
            px="2rem"
            route="/store/new"
          >
            Adicionar nova loja
          </Button>
        }
      />
      {stores?.count === 0 || stores === undefined ? (
        <Result height="300px" type="empty" />
      ) : (
        <>
          {stores?.items?.map((item) => (
            <TableRow my="1rem" padding="6px 18px">
              <FlexBox alignItems="center" m="6px">
                <Card width="42px" height="28px" mr="10px" elevation={4}>
                  <img
                    width="100%"
                    src={item.images[0]}
                    alt={item.images[0]}
                    className="list-image"
                    onError={(e) => {
                      e.currentTarget.src =
                        "/assets/images/icons/cloud-off.svg";
                    }}
                  />
                </Card>
                <H5 className="pre" m="6px">
                  {item.name}
                </H5>
                <Small ml="20px" className="pre" m="6px">
                  {item.active ? "Ativa" : "Inativa"}
                </Small>
              </FlexBox>
              <Typography className="pre" textAlign="right" color="text.muted">
                <IconButton
                  size="small"
                  onClick={() => {
                    editStore(item.id);
                  }}
                >
                  <Icon variant="small" defaultcolor="currentColor">
                    edit
                  </Icon>
                </IconButton>
                <Popup
                  closeOnDocumentClick
                  trigger={
                    <IconButton size="small">
                      <Icon variant="small" defaultcolor="currentColor">
                        delete
                      </Icon>
                    </IconButton>
                  }
                  position="left center"
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
                            close();
                            deleteStore(item.id);
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
            </TableRow>
          ))}
          <FlexBox justifyContent="center" mt="2.5rem">
            <Pagination
              initialPage={Math.trunc(skip / ITEMS_PER_PAGE.MAX)}
              pageCount={stores?.count / ITEMS_PER_PAGE.MAX}
              onChange={(data: any) => {
                router.push(
                  `/payment-methods?skip=${data * ITEMS_PER_PAGE.MAX}`
                );
              }}
            />
          </FlexBox>
        </>
      )}
    </div>
  );
};

Categories.layout = DashboardLayout;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return authRoute(ctx, async ({ token }: any) => {
    try {
      const [store] = await Promise.all([
        getStore({
          token,
          take: 1000,
          skip: 0,
        }),
      ]);
 
      return {
        props: {
          stores: store,
        },
      };
    } catch {
      return {
        redirect: {
          permanent: false,
          destination: "/404",
        },
      };
    }
  });
};

export default Categories;
