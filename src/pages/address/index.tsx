import Button from "@component/buttons/Button";
import IconButton from "@component/buttons/IconButton";
import FlexBox from "@component/FlexBox";
import Icon from "@component/icon/Icon";
import DashboardLayout from "@component/layout/CustomerDashboardLayout";
import DashboardPageHeader from "@component/layout/DashboardPageHeader";
import Pagination from "@component/pagination/Pagination";
import Result from "@component/result";
import TableRow from "@component/TableRow";
import Typography from "@component/Typography"; 
import { ITEMS_PER_PAGE } from "@utils/enums";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { parseCookies } from "nookies";
import React from "react";
import { toast } from "react-nextjs-toast";
import Popup from "reactjs-popup";
import { api } from "services/api";

const AddressList = (props) => {
  const { data } = props;
  const router = useRouter();
  const skip: number = parseInt(router?.query?.skip?.toString()) || 0;

  const deleteAddress = async (id) => {
    toast.notify("Removendo endereço", {
      title: "Deletando...",
      duration: 2,
      type: "info",
    });
    try {
      await api.delete(`address/v1/${id}`);
      router.replace(router.asPath);
      toast.notify("Endereço removido", {
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
        title="Meus endereços"
        iconName="pin_filled"
        button={
          <Button
            color="primary"
            bg="primary.light"
            px="2rem"
            route="address/new"
          >
            Adicionar novo endereço
          </Button>
        }
      />
      {data?.count === 0 || data === undefined ? (
        <Result height="300px" type="empty" />
      ) : (
        <>
          {data?.items?.map((item) => (
            <TableRow my="1rem" padding="6px 18px">
              <Typography className="pre" m="6px" textAlign="left">
                {item.cep}
              </Typography>
              <Typography flex="1 1 260px !important" m="6px" textAlign="left">
                {`${item.city}, ${item.state}, ${item.street}, ${item.number}`}
              </Typography>
              <Typography className="pre" m="6px" textAlign="left"></Typography> 
              <Typography className="pre" textAlign="right" color="text.muted">
                <Link href={`/address/${item.id}`}>
                  <Typography
                    as="a"
                    href="/address/xkssThds6h37sd"
                    color="inherit"
                  >
                    <IconButton size="small">
                      <Icon variant="small" defaultcolor="currentColor">
                        edit
                      </Icon>
                    </IconButton>
                  </Typography>
                </Link>
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
                            deleteAddress(item.id);
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
                router.push(`/address?skip=${data * ITEMS_PER_PAGE.MAX}`);
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

    const { data } = await api.get(`address/v1`, {
      params: { take: take, skip: skip },
    });

    return {
      props: { data: data },
    };
  } catch (err) {
    console.log("fail to verify tokens", err);
  }

  return {
    props: {},
  };
};

export default  AddressList;
