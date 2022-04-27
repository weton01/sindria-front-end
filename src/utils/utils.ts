import { themeGet } from "@styled-system/theme-get";
import { differenceInMinutes } from "date-fns";
import { ceil } from "lodash";

export const getTheme = (query: string, fallback?: string) =>
  themeGet(query, fallback);

export const convertHexToRGB = (hex) => {
  // check if it's a rgba
  if (hex.match("rgba")) {
    let triplet = hex.slice(5).split(",").slice(0, -1).join(",");
    return triplet;
  }

  let c;

  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    c = hex.substring(1).split("");
    if (c.length === 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    c = "0x" + c.join("");

    return [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(",");
  }
};

export const getDateDifference = (date) => {
  let diff = differenceInMinutes(new Date(), new Date(date));
  if (diff < 60) return diff + " minutes ago";

  diff = ceil(diff / 60);
  if (diff < 24) return `${diff} hour${diff === 0 ? "" : "s"} ago`;

  diff = ceil(diff / 24);
  if (diff < 30) return `${diff} day${diff === 0 ? "" : "s"} ago`;

  diff = ceil(diff / 30);
  if (diff < 12) return `${diff} month${diff === 0 ? "" : "s"} ago`;

  diff = diff / 12;
  return `${diff.toFixed(1)} year${ceil(diff) === 0 ? "" : "s"} ago`;
};

export const getHourMinute = (d) => {
  let datetext = d.toTimeString();
  datetext = datetext.split(" ")[0];
  return datetext;
};

export const toBase64 = async (url) => {
  return fetch(url)
    .then((response) => response.blob())
    .then(
      (blob) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        })
    );
};

export const processFile = (file) => {
  if (!file) {
    return;
  }

  return new Promise(function (resolve, reject) {
    let rawImage = new Image();

    rawImage.addEventListener("load", function () {
      resolve(rawImage);
    });

    rawImage.src = URL.createObjectURL(file);
  }).then(function (rawImage: any) {
    // Convert image to webp ObjectURL via a canvas blob
    return new Promise(function (resolve, reject) {
      let canvas = document.createElement("canvas");
      let ctx = canvas.getContext("2d");

      canvas.width = rawImage.width;
      canvas.height = rawImage.height;
      ctx.drawImage(rawImage, 0, 0);

      canvas.toBlob(function (blob) {
        resolve(URL.createObjectURL(blob));
      }, "image/webp");
    });
  });
}; 