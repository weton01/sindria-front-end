import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import Box from "./Box";
import Button from "./buttons/Button";
import IconButton from "./buttons/IconButton";
import Divider from "./Divider";
import Grid from "./grid/Grid";
import Icon from "./icon/Icon";
import LazyImage from "./LazyImage";
import Spinner from "./Spinner";
import Typography, { H5, Small } from "./Typography";

export interface DropZoneProps {
  onChange?: (files: []) => void;
  removeImage?: (index: number) => void;
  title?: string;
  imgs?: [];
}

const DropZone: React.FC<DropZoneProps> = ({
  onChange,
  removeImage,
  title = "Arraste ou solte o arquivo aqui",
  imgs = [],
}) => {
  const [loading, setLoading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles) => { 
    setLoading(true);
    if (onChange) await onChange(acceptedFiles);
    setLoading(false);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    accept: ".jpeg,.jpg,.png,.webp",
    maxFiles: 10,
  });

  return (
    <>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
        border="1px dashed"
        borderColor="gray.400"
        borderRadius="10px"
        marginBottom={16}
        bg={isDragActive && "gray.200"}
        transition="all 250ms ease-in-out"
        style={{ outline: "none" }}
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        <H5 mb="18px" color="text.muted">
          {title}
        </H5>

        <Divider width="200px" mx="auto" />
        <Typography
          color="text.muted"
          bg={isDragActive ? "gray.200" : "body.paper"}
          lineHeight="1"
          px="1rem"
          mt="-10px"
          mb="18px"
        >
          em
        </Typography>
        {loading ? (
          <Box
            minHeight="100px"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            gap={10}
          >
            <Spinner />
            <div>Carregando arquivo...</div>
          </Box>
        ) : (
          <Button
            color="primary"
            bg="primary.light"
            px="2rem"
            mb="22px"
            type="button"
          >
            Selecione o arquivo
          </Button>
        )}

        <Small color="text.muted">Carregar imagem 280*280</Small>
      </Box>
      <Grid container spacing={4}>
        {imgs.length > 0
          ? imgs.map((item, index) => {
              return (
                <Grid
                  item
                  xl={2}
                  xs={2}
                  style={{
                    display: "flex",
                    flexFlow: "column",
                    alignItems: "flex-end",
                    gap: 4,
                  }}
                >
                  <IconButton
                    size="small"
                    variant="contained"
                    type="button"
                    bg="gray.400"
                    p="0.15rem"
                    mr="0.15rem"
                    color={"gray.700"}
                    marginRight="-8px"
                  >
                    <Icon
                      variant="small"
                      defaultcolor="currentColor"
                      onClick={() => removeImage(index)}
                    >
                      x
                    </Icon>
                  </IconButton>
                  <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    minHeight="120px"
                    minWidth={"120px"}
                    border="1px dashed"
                    borderColor="gray.500"
                    borderRadius="10px"
                    marginBottom={16}
                    bg={isDragActive && "gray.200"}
                    transition="all 250ms ease-in-out"
                    style={{ outline: "none" }}
                  >
                    <LazyImage src={item} width="100px" height="100px" />
                  </Box>
                </Grid>
              );
            })
          : null}
      </Grid>
    </>
  );
};

export default DropZone;
