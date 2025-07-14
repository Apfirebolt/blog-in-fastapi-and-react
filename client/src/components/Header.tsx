import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/auth/AuthSlice";
import { Layout, Menu, Button } from "antd";
import { Link } from "react-router-dom";

const { Header } = Layout;

const AppHeader: React.FC = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.auth.user);

  const getMenuItems = () => {
    const baseItems = [
      { key: "1", label: "Home", path: "/" },
      { key: "2", label: "Dashboard", path: "/dashboard" },
    ];

    if (user) {
      return baseItems;
    } else {
      return [
        ...baseItems,
        { key: "4", label: "Login", path: "/login" },
        { key: "5", label: "Register", path: "/register" },
      ];
    }
  };

  const handleLogout = () => {
    // Dispatch the logout action
    console.log("Logging out user:", user);
    dispatch(logout());
  };

  return (
    <Header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#670D2F",
      }}
    >
      <Menu
        theme="light"
        mode="horizontal"
        defaultSelectedKeys={["1"]}
        style={{
          flex: 1,
          backgroundColor: "#670D2F",
          color: "white",
        }}
      >
        {getMenuItems().map((item) => (
          <Menu.Item key={item.key} style={{ color: "white" }}>
            <Link to={item.path} style={{ color: "white" }}>
              {item.label}
            </Link>
          </Menu.Item>
        ))}
      </Menu>
      
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        {user && (
          <>
        <span style={{ color: "white", marginRight: "8px" }}>
          Welcome, {user.username || user.name || "User"}
        </span>
        <Button 
          type="primary" 
          ghost 
          onClick={() => handleLogout()}
          style={{ borderColor: "white", color: "white" }}
        >
          Logout
        </Button>
          </>
        )}
        <div
          className="logo"
          style={{
        color: "white",
        fontSize: "32px",
        fontWeight: "bold",
          }}
        >
          Fast Blog
        </div>
      </div>
    </Header>
  );
};

export default AppHeader;
