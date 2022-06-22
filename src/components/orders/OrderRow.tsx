import {
  paymentStatus,
  colorsStatus,
  paymentMethod,
} from "@utils/convert/status";
import { formatCurrency } from "@utils/formatCurrency";
import { format } from "date-fns";
import Link from "next/link";
import React from "react";
import Box from "../Box";
import IconButton from "../buttons/IconButton";
import { Chip } from "../Chip";
import Hidden from "../hidden/Hidden";
import Icon from "../icon/Icon";
import TableRow from "../TableRow";
import Typography, { H5, Small } from "../Typography";

export interface OrderRowProps {
  item: {
    id: string;
    paymentStatus: string;
    created_at: string | Date;
    totalValue: number;
    invoiceType: string;
  };
}

const OrderRow: React.FC<OrderRowProps> = ({ item }) => {
  return (
    <Link href={"orders/" + item.id}>
      <TableRow as="a" href={"orders/" + item.id} my="1rem" padding="6px 18px">
        <Typography m="6px" textAlign="left">
          {format(new Date(item.created_at), "dd/MM/yyyy HH:MM")}
        </Typography>
        <Box m="6px">
          <Chip
            p="0.25rem 1rem"
            bg={`${colorsStatus[item.paymentStatus]}.light`}
          >
            <Small color={`${colorsStatus[item.paymentStatus]}.main`}>
              {paymentStatus[item.paymentStatus]}
            </Small>
          </Chip>
        </Box>
        <Typography m="6px" textAlign="left" display={"flex"}>
          <Icon size="24px" defaultcolor="auto" marginRight={2}>
            {paymentMethod[item.invoiceType].icon}
          </Icon>
          {paymentMethod[item.invoiceType].name}
        </Typography>
        <Typography m="6px" textAlign="left">
          {formatCurrency(item.totalValue)}
        </Typography>
        <Hidden flex="0 0 0 !important" down={769}>
          <Typography textAlign="center" color="text.muted">
            <IconButton size="small">
              <Icon variant="small" defaultcolor="currentColor">
                arrow-right
              </Icon>
            </IconButton>
          </Typography>
        </Hidden>
      </TableRow>
    </Link>
  );
};

export default OrderRow;
