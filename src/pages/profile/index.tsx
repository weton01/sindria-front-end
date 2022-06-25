import Avatar from "@component/avatar/Avatar";
import Box from "@component/Box";
import Button from "@component/buttons/Button";
import IconButton from "@component/buttons/IconButton";
import Card from "@component/Card";
import { Chip } from "@component/Chip";
import Divider from "@component/Divider";
import FlexBox from "@component/FlexBox";
import Grid from "@component/grid/Grid";
import Icon from "@component/icon/Icon";
import DashboardLayout from "@component/layout/CustomerDashboardLayout";
import DashboardPageHeader from "@component/layout/DashboardPageHeader";
import TableRow from "@component/TableRow";
import Typography, { H3, H5, Small } from "@component/Typography";
import { format } from "date-fns";
import Link from "next/link";
import React from "react";

const Profile = () => {
  return (
    <div>
      <DashboardPageHeader
        iconName="user_filled"
        title="Meu perfil"
        button={
          <Link href="/profile/edit">
            <Button color="primary" bg="primary.light" px="2rem">
              Editar perfil
            </Button>
          </Link>
        }
      />

      <Box mb="30px">
        <Grid container spacing={6}>
          <Grid item lg={6} md={6} sm={12} xs={12}>
            <FlexBox as={Card} p="14px 32px" height="100%" alignItems="center">
              <Avatar src="/assets/images/faces/ralph.png" size={64} />
              <Box ml="12px" flex="1 1 0">
                <FlexBox
                  flexWrap="wrap"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <div>
                    <H5 my="0px">Luciano Hulk</H5>
                    <FlexBox alignItems="center">
                      <Typography fontSize="14px" color="text.hint">
                        Créditos:
                      </Typography>
                      <Typography ml="4px" fontSize="14px" color="primary.main">
                        R$900,33
                      </Typography>
                    </FlexBox>
                  </div>
                  <Chip p="0.25rem 1rem" bg={`secondary.light`}>
                    <Small color={`text.main`} letterSpacing="0.2em">
                      PRATA
                    </Small>
                  </Chip>
                </FlexBox>
              </Box>
            </FlexBox>
          </Grid>

          <Grid item lg={6} md={6} sm={12} xs={12}>
            <Grid container spacing={4}>
              {infoList.map((item) => (
                <Grid item lg={3} sm={6} xs={6} key={item.subtitle}>
                  <FlexBox
                    as={Card}
                    flexDirection="column"
                    alignItems="center"
                    height="100%"
                    p="1rem 1.25rem"
                  >
                    <H3 color="primary.main" my="0px" fontWeight="600">
                      {item.title}
                    </H3>
                    <Small color="text.muted" textAlign="center">
                      {item.subtitle}
                    </Small>
                  </FlexBox>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Box>

      <TableRow p="0.75rem 1.5rem" mb={"30px"}>
        <FlexBox flexDirection="column" p="0.5rem">
          <Small color="text.muted" mb="4px" textAlign="left">
            Nome
          </Small>
          <span>Ralph</span>
        </FlexBox>
        <FlexBox flexDirection="column" p="0.5rem">
          <Small color="text.muted" mb="4px" textAlign="left">
            CPF/RG
          </Small>
          <span>50501459-2</span>
        </FlexBox>
        <FlexBox flexDirection="column" p="0.5rem">
          <Small color="text.muted" mb="4px" textAlign="left">
            Email
          </Small>
          <span>ralfedwards@email.com</span>
        </FlexBox>
        <FlexBox flexDirection="column" p="0.5rem">
          <Small color="text.muted" mb="4px" textAlign="left">
            Celular
          </Small>
          <span>+19999379949</span>
        </FlexBox>
        <FlexBox flexDirection="column" p="0.5rem">
          <Small color="text.muted" mb="4px">
            Data de nascimento
          </Small>
          <span className="pre">
            {format(new Date(1996 / 11 / 16), "dd MMM, yyyy")}
          </span>
        </FlexBox>
      </TableRow>

      <FlexBox as={Card} p="24px 24px" flexDirection={"column"}>
        <FlexBox
          width={"100%"}
          alignItems="center"
          justifyContent="space-between"
          gap={32}
          p={"0px 24px"}
        >
          <IconButton size="small" variant="contained" type="button" p="2rem">
            <FlexBox flexDirection="column" alignItems={"center"}>
              <Small letterSpacing="0.2em" mb={3}>
                <Icon color="primary" size="40px" defaultcolor="auto">
                  heart
                </Icon>
              </Small>
              <Typography fontSize={16} color="secondary.dark" fontWeight={500}>
                Favoritos
              </Typography>
            </FlexBox>
          </IconButton>

          <IconButton size="small" variant="contained" type="button" p="2rem">
            <FlexBox flexDirection="column" alignItems={"center"}>
              <Small letterSpacing="0.2em" mb={3}>
                <Icon color="primary" size="40px" defaultcolor="auto">
                  Coupon
                </Icon>
              </Small>
              <Typography fontSize={16} color="secondary.dark" fontWeight={500}>
                Cupons
              </Typography>
            </FlexBox>
          </IconButton>

          <IconButton size="small" variant="contained" type="button" p="2rem">
            <FlexBox flexDirection="column" alignItems={"center"}>
              <Small letterSpacing="0.2em" mb={3}>
                <Icon color="primary" size="40px" defaultcolor="auto">
                  clock-circular-outline
                </Icon>
              </Small>
              <Typography fontSize={16} color="secondary.dark" fontWeight={500}>
                Visualizados
              </Typography>
            </FlexBox>
          </IconButton>

          <IconButton size="small" variant="contained" type="button" p="2rem">
            <FlexBox flexDirection="column" alignItems={"center"}>
              <Small letterSpacing="0.2em" mb={3}>
                <Icon color="primary" size="40px" defaultcolor="auto">
                  comment
                </Icon>
              </Small>
              <Typography fontSize={16} color="secondary.dark" fontWeight={500}>
                Comentários
              </Typography>
            </FlexBox>
          </IconButton>
        </FlexBox>
        <Link href={"23"}>
          <Small style={{ cursor: "pointer" }}>
            <Divider
              backgroundColor={"gray.300"}
              marginTop={24}
              marginBottom={3}
            />
            <FlexBox
              gap={16}
              alignItems="center"
              justifyContent={"space-between"}
            >
              <FlexBox gap={16} alignItems="center">
                <Small letterSpacing="0.2em">
                  <Icon color="primary" size="24px" defaultcolor="auto">
                    refund
                  </Icon>
                </Small>
                <Typography
                  fontSize={16}
                  color="secondary.dark"
                  fontWeight={500}
                >
                  Reembolso e devoluções
                </Typography>
              </FlexBox>
              <Icon size="24px" defaultcolor="auto">
                arrow-right
              </Icon>
            </FlexBox>
          </Small>
        </Link>
        <Link href={"232"}>
          <Small style={{ cursor: "pointer" }}>
            <Divider
              backgroundColor={"gray.300"}
              marginTop={3}
              marginBottom={3}
            />
            <FlexBox
              gap={16}
              alignItems="center"
              justifyContent={"space-between"}
            >
              <FlexBox gap={16} alignItems="center">
                <Small letterSpacing="0.2em">
                  <Icon color="primary" size="24px" defaultcolor="auto">
                    bag_filled
                  </Icon>
                </Small>
                <Typography
                  fontSize={16}
                  color="secondary.dark"
                  fontWeight={500}
                >
                  Minha loja
                </Typography>
              </FlexBox>{" "}
              <Icon size="24px" defaultcolor="auto">
                arrow-right
              </Icon>
            </FlexBox>
          </Small>
        </Link>
      </FlexBox>
    </div>
  );
};

const infoList = [
  {
    title: "16",
    subtitle: "Todos pedidos",
  },
  {
    title: "02",
    subtitle: "Aguardando pagamentos",
  },
  {
    title: "00",
    subtitle: "À espera de envio",
  },
  {
    title: "01",
    subtitle: "Aguardando entrega",
  },
];

Profile.layout = DashboardLayout;

export default Profile;
