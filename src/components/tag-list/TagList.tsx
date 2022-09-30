import React, { InputHTMLAttributes } from "react";
import { StyledTagList, StyledTagListItem } from "./TagListStyle";
import Icon from "../icon/Icon";

export interface Tag {
  title: string;
  id: string;
}

export interface TagListProps {
  data: Tag[];
  onChange?: any;
}

const TagList: React.FC<InputHTMLAttributes<HTMLInputElement> & TagListProps> =
  ({ id, ...props }) => {
    const [data, setData] = React.useState([]);

    React.useEffect(() => {
      setData([...props.data]);
    }, []);

    React.useEffect(() => {
      props.onChange(data);
    }, [data]);

    const onDelete = (id) => {
      setData([...data.filter((item) => item.id !== id)]);
    };

    return (
      <StyledTagList>
        {data?.map((item) => {
          return (
            <StyledTagListItem key={item.id}>
              {item.title}{" "}
              <Icon
                style={{ cursor: "pointer" }}
                size="14px"
                onClick={() => {
                  onDelete(item.id);
                }}
              >
                Close
              </Icon>
            </StyledTagListItem>
          );
        })}
      </StyledTagList>
    );
  };

TagList.defaultProps = {
  data: [],
  onChange: () => null,
};

export default TagList;