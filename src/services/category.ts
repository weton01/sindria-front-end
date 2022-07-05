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
          href: `/product/search?skip=0&take=10&findBy=${item.name}&p.category=${item.id}&orderBy=netAmount=DESC  `,
          menuComponent: "MegaMenu1",
          menuData: {
            categories: newCategories.map((aux: any) => ({
              title: aux,
              subCategories: item.subCategories
                .filter((subs) => subs.groupName === aux)
                .map((subs) => ({
                  title: subs.name,
                  href: `/product/search?skip=0&take=10&findBy=${subs.name}&p.category=${subs.id}&orderBy=netAmount=DESC`,
                })),
              href: `/product/search?skip=0&take=10&findBy=${item.name}&p.category=${item.id}&orderBy=netAmount=DESC`,
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
