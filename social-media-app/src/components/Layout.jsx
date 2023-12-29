import React, { useState, useMemo, createContext } from "react";
import Navigationbar from "./Navbar";
import Toaster from "./Toaster";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
// so if we wrap any component inside Layout
// they will be displayed inside the div below the Navigation Bar
// this will help us include the Navigation Bar without repeating code everywhere
/*
<Layout>
    <Home />
</Layout>
 */
export const Context = createContext("unknown");
const Layout = (props) => {
  const [toaster, setToaster] = useState({
    title: "",
    show: false,
    message: "",
    type: "",
  });
  // useMemo will memorize a value in memory and only recompute it
  // when one of its dependencies changes
  const value = useMemo(() => ({ toaster, setToaster }), [toaster]);
  const { hasNavigationBack } = props;
  const navigate=useNavigate()
  return (
    <Context.Provider value={value}>
      <div>
        <Navigationbar />
        {hasNavigationBack && (
          <ArrowLeftOutlined
            style={{
              color: "#0D6EFD",
              fontSize: "24px",
              marginLeft: "5%",
              marginTop: "1%",
            }}
            // navigate(-1) means go back
            onClick={() => navigate(-1)}
          />
        )}
        <div className="container m-5">{props.children}</div>
      </div>
      <Toaster
       title={toaster.title}
       message={toaster.message}
       type={toaster.type}
       showToast={toaster.show}
       onClose={() => setToaster({ ...toaster, show: false
         })}
     />
    </Context.Provider>
    
  );
};

export default Layout;
