import React, { useContext } from "react";
import { GoogleLogin, googleLogout } from "@react-oauth/google";

import "../../utilities.css";
import "./Skeleton.css";
import { UserContext } from "../App";
import AccessibleKeyboard from "../AccessibleKeyboard";

const Skeleton = () => {
  const { userId, handleLogin, handleLogout } = useContext(UserContext);
  return (
    <>
      {/*{userId ? (
        <button
          onClick={() => {
            googleLogout();
            handleLogout();
          }}
        >
          Logout
        </button>
      ) : (
        <GoogleLogin onSuccess={handleLogin} onError={(err) => console.log(err)} />
      )*/}
      <AccessibleKeyboard />
    </>
  );
};

export default Skeleton;
