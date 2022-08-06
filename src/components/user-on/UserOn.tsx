import { useAppSelector } from "@hook/hooks";
import React from "react";

export interface UserOnProps {
  child?: any,
  notConnect?: any
}

const UserOn: React.FC<UserOnProps> = ({notConnect, children}) => {
  const user = useAppSelector((state) => state?.user); 
  
  return user.isLogged? children : notConnect;
};

export default UserOn;
