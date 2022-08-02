const navbarNavigations = [
  {
    title: "Destaque",
    url: "/emphasis",
  },
  {
    title: "Ofertas",
    child: [
      {
        title: "Todas as ofertas",
        url: "/all-offers",
      },
      {
        title: "Ofertas do dia",
        url: "/deals-of-the-day",
      },
      {
        title: "Ofertas relâmpago",
        url: "/lightning-offers",
      },
      {
        title: "Super ofertas",
        url: "/super-deals",
      }, 
      {
        title: "Menos de R$80",
        url: "/under-80",
      },
    ],
  }, 
  {
    title: "Modas",
    url: "/fashions",
  },
  {
    title: "Seja Vendedor",
    url: "/sell",
  },
  {
    title: "Últimos acessos",
    url: "history",
  }, 
  {
    title: "Top lojas",
    url: "top-store",
  },  
  {
    title: "Nossos produtos",
    url: "our-products",
  }, 
  {
    title: "Frete grátis",
    url: "free-shipping",
  }, 
  // {
  //   title: "Documentation",
  //   url:
  //     "https://docs.google.com/document/d/13Bnyugzcty75hzi9GdbVh01YV75a7AhViZws0qGf5yo/edit?usp=sharing",
  //   extLink: true,
  // },
];

export default navbarNavigations;
