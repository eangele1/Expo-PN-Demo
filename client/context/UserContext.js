import React, { useState, useContext, useEffect } from "react";

const userContext = React.createContext();
const UserProvider = (props) => {
  const [user, setUser] = useState({});

  return (
    <userContext.Provider value={{ user, setUser }}>
      {props.children}
    </userContext.Provider>
  );
};

export const useUserData = () => useContext(userContext);
export default UserProvider;
