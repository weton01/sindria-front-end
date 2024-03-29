
import Button from "@component/buttons/Button";
import IconButton from "@component/buttons/IconButton";
import Card from "@component/Card";
import FlexBox from "@component/FlexBox";
import Icon from "@component/icon/Icon";
import DashboardLayout from "@component/layout/CustomerDashboardLayout";
import DashboardPageHeader from "@component/layout/DashboardPageHeader";
import Pagination from "@component/pagination/Pagination";
import TableRow from "@component/TableRow";
import Typography, { H5 } from "@component/Typography";
import { ITEMS_PER_PAGE } from "@utils/enums";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { parseCookies } from "nookies";
import React from "react";
import Popup from "reactjs-popup";
import { api } from "services/api";
import { toast } from "react-nextjs-toast";
import Result from "@component/result";

const AddressList = (props) => {
  const { data } = props;
  const router = useRouter();
  const skip: number = parseInt(router?.query?.skip?.toString()) || 0;

  const deletePaymentMethod = async (id) => {
    toast.notify("Removendo cartão", {
      title: "Deletando...",
      duration: 2,
      type: "info",
    });
    try {
      await api.delete(`credit-card/v1/${id}`);
      router.replace(router.asPath);
      toast.notify("Cartão removido", {
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
        title="Cartões de crédito"
        iconName="credit-card_filled"
        button={
          <Link href="/payment-methods/add">
            <a>
              <Button color="primary" bg="primary.light" px="2rem">
                Adicionar novo cartão de crédito
              </Button>
            </a>
          </Link>
        }
      />

      {data?.count === 0 || data === undefined  ? (
        <Result height="300px" type="empty" />
      ) : (
        <>
          {data?.items?.map((item) => (
            <TableRow my="1rem" padding="6px 18px">
              <FlexBox alignItems="center" m="6px">
                <Card width="42px" height="28px" mr="10px" elevation={4}>
                  <img
                    width="100%"
                    src={`/assets/images/payment-methods/${item.type}.svg`}
                    alt={item.type}
                  />
                </Card> 
                <H5 className="pre" m="6px">
                  {item.name}
                </H5>
              </FlexBox>
              <Typography className="pre" m="6px">
                {item.number}
              </Typography>
              <Typography className="pre" m="6px">
                {item.expirationDate}
              </Typography>

              <Typography className="pre" textAlign="right" color="text.muted">
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
                            close();
                            deletePaymentMethod(item.id);
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
              pageCount={data?.count / ITEMS_PER_PAGE.MAX}
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

AddressList.layout = DashboardLayout;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { ["shop_token"]: token } = parseCookies(ctx);
  try {
    api.interceptors.request.use((config) => {
      config.headers["Authorization"] = `Bearer ${token}`;
      return config;
    });

    const take = ITEMS_PER_PAGE.MAX;
    const skip = ctx?.query?.skip || 0;

    const { data } = await api.get(`credit-card/v1`, {
      params: { take: take, skip: skip },
    });

    return {
      props: { data: data },
    };
  } catch (err) {
    console.log('err', err)
  }

  return {
    props: {},
  };
};

export default AddressList;
