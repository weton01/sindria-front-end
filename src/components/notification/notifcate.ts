import { toast } from "react-nextjs-toast";

export const success = (desc) => {
  return toast.notify(desc, {
    title: "Sucesso!",
    duration: 5,
    type: "success",
  });
}

export const fail = (desc) => {
  return toast.notify(desc, {
    title: "Erro!",
    duration: 5,
    type: "error",
  });
}