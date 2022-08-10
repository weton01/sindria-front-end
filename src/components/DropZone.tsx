import { processFile } from "@utils/utils";
import axios from "axios";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { getUrlAssign } from "services/product";
import Box from "./Box";
import Button from "./buttons/Button";
import IconButton from "./buttons/IconButton";
import Divider from "./Divider";
import FlexBox from "./FlexBox";
import Grid from "./grid/Grid";
import Icon from "./icon/Icon";
import LazyImage from "./LazyImage";
import Spinner from "./Spinner";
import Typography, { H5, Small } from "./Typography";

export interface DropZoneProps {
  onChange?: (files: [], setLoading: any) => void;
  setFieldValue: any;
  title?: string;
  multiple?: boolean;
  imgs?: any[];
  disabled?: boolean;
  notEdit?: boolean;
}

export const handleOnChangeImage = (
  files = [],
  setFieldError: any,
  setFieldTouched: any,
  setLoading: any,
  setFieldValue: any,
  values: any,
  multiple: boolean = false
) => {
  files.map(async (file: File, index) => {
    const { url } = await getUrlAssign();
    let fd = new FormData();
    const blob: any = await processFile(file);
    const image = new Image();

    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;

      if (image.naturalWidth > 480 || image.naturalHeight > 480) {
        setFieldError("image", "limite da dimensão da imagem é 480*480");
        setFieldTouched("image", true, false);
        setLoading(false);
        return;
      }
      canvas.getContext("2d").drawImage(image, 0, 0);
      canvas.toBlob(async (blob) => {
        const myImage = new File([blob], file.name, {
          type: blob.type,
        });

        fd.append("acl", "public-read");
        fd.append("Content-Type", "image/webp");
        fd.append("key", url.put.fields["key"]);
        fd.append("bucket", url.put.fields["bucket"]);
        fd.append("X-Amz-Algorithm", url.put.fields["X-Amz-Algorithm"]);
        fd.append("X-Amz-Credential", url.put.fields["X-Amz-Credential"]);
        fd.append("X-Amz-Date", url.put.fields["X-Amz-Date"]);
        fd.append("X-Amz-Signature", url.put.fields["X-Amz-Signature"]);
        fd.append("Policy", url.put.fields["Policy"]);
        fd.append("file", myImage);

        await axios.post(url.put.url, fd, {
          onUploadProgress: (progress: ProgressEvent) => {
            let percent = Math.round((progress.loaded * 100) / progress.total);
            if (percent === 100 && files?.length - 1 === index) {
              setLoading(false);
            }
          },
        });

        const images = [...values.image];

        images.push(url.get);
        setFieldValue("image", images);
      }, "image/webp");
    };
    image.src = blob;
  });
};

const DropZone: React.FC<DropZoneProps> = ({
  onChange,
  setFieldValue,
  multiple,
  title,
  imgs,
  disabled,
  notEdit,
}) => {
  const [loading, setLoading] = useState(false);

  const onDrop = (acceptedFiles) => {
    if (onChange) onChange(acceptedFiles, setLoading);
  };

  const validatorFile = (file: File) => {
    const maxLength = 20;
    const maxSize = 10000000;

    if (file.size > maxSize) {
      setLoading(false);
      return {
        code: "file-too-large",
        message: `a imagem não pode exceder ${maxSize} bytes`,
      };
    }

    if (file.name?.length > maxLength) {
      setLoading(false);
      return {
        code: "name-too-large",
        message: `o nome da imagem é muito grande não pode exceder ${maxLength} caracteres`,
      };
    }
    setLoading(true);
    return null;
  };

  const { getRootProps, getInputProps, fileRejections, isDragActive } =
    useDropzone({
      onDrop,
      validator: validatorFile,
      multiple,
      accept: ".jpeg,.jpg,.png,.webp",
      maxFiles: 10,
      disabled,
    });

  const fileRejectionItems = fileRejections.map(({ file, errors }: any) => (
    <li key={file.path}>
      {file.path}
      <ul>
        {errors.map((e) => (
          <li key={e.code}>{e.message}</li>
        ))}
      </ul>
    </li>
  ));

  const removeImage = (index) => {
    const image = [...imgs];
    image.splice(index, 1);

    setFieldValue("image", image);
  };

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
        padding={16}
        marginBottom={16}
        bg={isDragActive && "gray.200"}
        transition="all 250ms ease-in-out"
        style={{ outline: "none" }}
        className={`${disabled ? "disabled" : ""}`}
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
          <Spinner />
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

        <Small color="text.muted">Carregar imagem 480*480</Small>
        <aside>
          <ul className="error-input">{fileRejectionItems}</ul>
        </aside>
      </Box>
      <FlexBox display="flex" gap={16} flexWrap={"wrap"}>
        {imgs?.length > 0
          ? imgs.map((item, index) => {
            return (
              <Box
                display={"flex"}
                flexDirection={"column"}
                alignItems="flex-end"
                gap={4}
                key={index}
              >
                {notEdit ? null : (
                  <IconButton
                    size="small"
                    variant="contained"
                    type="button"
                    bg="gray.400"
                    p="0.15rem"
                    mr="0.15rem"
                    color={"gray.700"}
                    marginRight="-4px"
                  >
                    <Icon
                      variant="small"
                      defaultcolor="currentColor"
                      onClick={() => removeImage(index)}
                    >
                      x
                    </Icon>
                  </IconButton>
                )}

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
                  <LazyImage src={item} width="100px" height="100px" layout="responsive" />
                </Box>
              </Box>
            );
          })
          : null}
      </FlexBox>
    </>
  );
};

DropZone.defaultProps = {
  title: "Arraste ou solte o arquivo aqui",
  imgs: [],
  multiple: false,
  notEdit: false,
  disabled: false,
};
export default DropZone;
