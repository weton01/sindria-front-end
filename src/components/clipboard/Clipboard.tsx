import { success } from "@component/notification/notifcate";
import React, { ReactElement } from "react";

export interface ClipboardProps {
  children: ReactElement<ClipboardProps>[] | any;
  copy: string;
  message?: string;
}

const Clipboard: React.FC<ClipboardProps> = ({ children, copy, message }) => {
  const copyText = async () => {
    try {
      if ("clipboard" in navigator) {
        await navigator.clipboard.writeText(copy);
      } else {
        const el = document.createElement("textarea");
        el.value = copy;
        el.setAttribute("readonly", "");
        el.style.position = "absolute";
        el.style.left = "-9999px";
        document.body.appendChild(el);
        el.select();
        el.setSelectionRange(0, 99999);
        document.execCommand("copy");
        document.body.removeChild(el);  
      }
      success(message);
    } catch (error) {
      success("Error ao copiar");
    }
  };

  return (
    <div onClick={copyText} style={{ cursor: "pointer" }}>
      {children}
    </div>
  );
};

Clipboard.defaultProps = {
  copy: "",
  message: "Copiado com sucesso!"
};

export default Clipboard;
