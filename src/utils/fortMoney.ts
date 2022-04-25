export function formatReal(value) {
  if (typeof value === "number") {
    const formatter = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

    return formatter.format(value);
  }

  if (typeof value === "string") {
    const auxValueLast = ["0", "0"];

    value = value
      .replace("R$", "")
      .replace(" ", "")
      .replace(/\./g, "")
      .replace(/\,/g, "");
    value = Array.from(value);

    value = value.filter((item) => item !== " ");

    if (value.length < 2) value = [...value, ...auxValueLast];

    const valueAux = value.slice(value.length - 2, value.length);

    value = value.filter((item, index) => index < value.length - 2);

    value.push(".");
    value = [...value, ...valueAux];
    value = value.toString().replace(/\,/g, "");
    value = parseFloat(value);

    if (!value || value === "") value = 0.0;

    const formatter = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

    return formatter.format(value).replace("R$", "").replace(" ", "");
  }
}

export function formatNumber(value) {
  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string") {
    return value.replace(/[^0-9\\.]+/g, "").replace(/\./g, "");
  }
}
