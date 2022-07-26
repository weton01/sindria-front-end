import { ITEMS_PER_PAGE } from "@utils/enums";
import { useRouter } from "next/router";
import React from "react";
import FlexBox from "../FlexBox";
import Hidden from "../hidden/Hidden";
import DashboardPageHeader from "../layout/DashboardPageHeader";
import Pagination from "../pagination/Pagination";
import TableRow from "../TableRow";
import { H5 } from "../Typography";
import OrderRow from "./OrderRow";

export interface CustomerOrderListProps {
  orders: { items: []; count: number };
}

const CustomerOrderList: React.FC<CustomerOrderListProps> = ({ orders }) => {
  const router = useRouter();
  const { skip = 0 }: any = router.query; 

  return (
    <>
      <DashboardPageHeader title="Meus pedidos" iconName="bag_filled" />
      <Hidden down={769}>
        <TableRow padding="0px 18px" boxShadow="none" bg="none">
          <H5 color="text.muted" my="0px" mx="6px" textAlign="left">
            Data do pedido
          </H5>
          <H5 color="text.muted" my="0px" mx="6px" textAlign="left">
            Status
          </H5>
          <H5 color="text.muted" my="0px" mx="6px" textAlign="left">
            Meio de pagamento
          </H5>
          <H5 color="text.muted" my="0px" mx="6px" textAlign="left">
            Total
          </H5>
          <H5
            flex="0 0 0 !important"
            color="text.muted"
            px="22px"
            my="0px"
          ></H5>
        </TableRow>
      </Hidden>

      {orders?.items?.map((item, ind) => (
        <OrderRow item={item} key={ind} />
      ))}

      <FlexBox justifyContent="center" mt="2.5rem">
        <Pagination
          initialPage={Math.trunc(skip / ITEMS_PER_PAGE.MAX)}
          pageCount={orders?.count / ITEMS_PER_PAGE.MAX}
          onChange={(data: any) => {
            router.push(`/orders?skip=${data * ITEMS_PER_PAGE.MAX}`);
          }}
        />
      </FlexBox>
    </>
  );
};

export default CustomerOrderList;
