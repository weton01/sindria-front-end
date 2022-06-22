import { request } from "./api";

export const getCategory = async () =>
  request.get({ route: `category/v1/` }).then((categories) => {
    return {
      formated: categories?.map((item) => {
        const groupNames = item.subCategories.map((aux) => aux.groupName);
        const newCategories = [...new Set(groupNames)];
  
        return {
          icon: item.image,
          title: item.name,
          href: `/${item.name}`,
          menuComponent: "MegaMenu1",
          menuData: {
            categories: newCategories.map((aux) => ({
              title: aux,
              subCategories: item.subCategories
                .filter((subs) => subs.groupName === aux)
                .map((subs) => ({
                  title: subs.name,
                  href: `/${item.name}/${subs.name}`,
                })),
              href: "/",
            })),
          },
        };
      }),
      clean: categories
    }
  });

export const getSubCategory = async (token) =>
  request.get({
    route: `category/v1/sub-category?take=10000&skip=0`,
    token,
  });
