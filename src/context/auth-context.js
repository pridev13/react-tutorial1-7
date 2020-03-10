import React, { useState } from 'react';

export const AuthContext = React.createContext({
  isAuth: false,
  login: () => { }
});

const AuthContextProvider = (props) => {

  const [isAuth, setIsAuth] = useState(false);

  const logUserIn = () => {
    setIsAuth(true);
  };

  return (
    <AuthContext.Provider value={{
      login: logUserIn,
      isAuth: isAuth
    }}>
      {props.children}
    </AuthContext.Provider>
  );

}

export default AuthContextProvider;