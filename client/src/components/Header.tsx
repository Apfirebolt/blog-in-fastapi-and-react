import React from "react";
import { Layout, Menu } from "antd";
import { Link } from "react-router-dom";

const { Header } = Layout;

const menuItems = [
  { key: "1", label: "Home", path: "/" },
  { key: "2", label: "Dinosaurs", path: "/dinosaurs" },
  { key: "3", label: "About", path: "/about" },
  { key: "4", label: "Dashboard", path: "/dashboard" },
  { key: "5", label: "Editor", path: "/editor" }, // Added Editor link
];

const AppHeader: React.FC = () => {
  return (
    <Header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#670D2F", // New background color
      }}
    >
      <Menu
        theme="light" // Changed theme to light
        mode="horizontal"
        defaultSelectedKeys={["1"]}
        style={{
          flex: 1,
          backgroundColor: "#670D2F", // Match header background
          color: "white", // Text color
        }}
      >
        {menuItems.map((item) => (
          <Menu.Item key={item.key} style={{ color: "white" }}>
            <Link to={item.path} style={{ color: "white" }}>
              {item.label}
            </Link>
          </Menu.Item>
        ))}
      </Menu>
      <div
        className="logo"
        style={{
          color: "white",
          fontSize: "32px",
          fontWeight: "bold",
        }}
      >
        Dino App
      </div>
    </Header>
  );
};

export default AppHeader;
