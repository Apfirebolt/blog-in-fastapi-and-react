import React, { useEffect } from "react";
import { List, Card, Table, Switch } from "antd";
import { useSetAtom, useAtom } from "jotai";
import axios from "axios";
import { dinosaursAtom } from "../atoms";
import Loader from "../components/Loader";
import type { Dinosaur } from "../atoms";

const Dinosaurs: React.FC = () => {
  const setDinosaurs = useSetAtom(dinosaursAtom);
  const [isLoading, setIsLoading] = React.useState(true);
  const [viewMode, setViewMode] = React.useState<"grid" | "table">("grid");
  const [searchText, setSearchText] = React.useState("");
  const [dinosaurs] = useAtom(dinosaursAtom);

  const filteredDinosaurs = dinosaurs.filter((dinosaur) =>
    dinosaur.Name.toLowerCase().includes(searchText.toLowerCase())
  );

  useEffect(() => {
    const fetchDinosaurs = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get<Dinosaur[]>(
          "https://dinosaur-facts-api.shultzlab.com/dinosaurs"
        );
        setDinosaurs(response.data);
      } catch (error) {
        console.error("Error fetching dinosaurs:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDinosaurs();
  }, [setDinosaurs]);

  if (isLoading) {
    return <Loader />;
  }

  const columns = [
    {
      title: "Name",
      dataIndex: "Name",
      key: "name",
    },
    {
      title: "Description",
      dataIndex: "Description",
      key: "description",
    },
  ];

  return (
    <div style={{ padding: "0.5rem 1rem" }}>
      <h1 style={{ textAlign: "center" }}>Dinosaurs</h1>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <input
          type="text"
          placeholder="Search Dinosaurs"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{
            width: "90%",
            padding: "16px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            marginBottom: "16px",
          }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span>Grid View</span>
          <Switch
            checked={viewMode === "table"}
            onChange={(checked) => setViewMode(checked ? "table" : "grid")}
          />
          <span>Table View</span>
        </div>
      </div>
      {viewMode === "grid" ? (
        <List
          grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 5, xxl: 6 }}
          dataSource={filteredDinosaurs}
          renderItem={(dinosaur) => (
            <List.Item key={dinosaur.Name}>
              <Card
                title={
                  <div
                    style={{
                      textAlign: "center",
                      backgroundColor: "white",
                      padding: "8px",
                      borderRadius: "4px",
                    }}
                  >
                    {dinosaur.Name}
                  </div>
                }
                style={{ backgroundColor: "#FAF6E9" }}
              >
                <p>Description: {dinosaur.Description}</p>
              </Card>
            </List.Item>
          )}
        />
      ) : (
        <Table
          dataSource={filteredDinosaurs}
          columns={columns}
          rowKey="Name"
          pagination={{ pageSize: 10 }}
        />
      )}
    </div>
  );
};

export default Dinosaurs;
