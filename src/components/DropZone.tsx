import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Box from "./Box";
import Button from "./buttons/Button";
import IconButton from "./buttons/IconButton";
import Divider from "./Divider";
import Grid from "./grid/Grid";
import Icon from "./icon/Icon";
import LazyImage from "./LazyImage";
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
  const onDrop = useCallback((acceptedFiles) => {
    if (onChange) onChange(acceptedFiles);
  }, []);

  const validatorFile =  (file: File) => {
    const maxLength = 20;
    const maxSize = 10000000;

    if (file.size > maxSize) {
      return {
        code: "file-too-large",
        message: `a imagem não pode exceder ${maxSize} bytes`,
      };
    }

    if (file.name.length > maxLength) {
      return {
        code: "name-too-large",
        message: `o nome da imagem é muito grande não pode exceder ${maxLength} caracteres`,
      };
    }

    return null;
  };

  const { getRootProps, getInputProps, fileRejections, isDragActive } =
    useDropzone({
      onDrop,
      validator: validatorFile,
      multiple: true,
      accept: ".jpeg,.jpg,.png,.webp",
      maxFiles: 10,
    });

  const fileRejectionItems = fileRejections.map(({ file, errors }: any) => (
    <li key={file.path}>
      {file.path}
      <ul>
        {console.log(errors)}
        {errors.map((e) => (
          <li key={e.code}>{e.message}</li>
        ))}
      </ul>
    </li>
  ));

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
        <Button
          color="primary"
          bg="primary.light"
          px="2rem"
          mb="22px"
          type="button"
        >
          Selecione o arquivo
        </Button>

        <Small color="text.muted">Carregar imagem 480*480</Small>
        <aside>
          <ul className="error-input">{fileRejectionItems}</ul>
        </aside>
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
