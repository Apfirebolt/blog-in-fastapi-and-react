import React from "react";
import { Layout, Typography, Button } from "antd";

const { Content } = Layout;
const { Title, Paragraph } = Typography;

const Home: React.FC = () => {
  return (
    <Layout>
      <Content style={{ padding: "50px", marginTop: 64 }}>
        <div
          className="site-layout-content"
          style={{ background: "#fff", padding: 24, minHeight: 380, textAlign: "center" }}
        >
          <Title level={1}>Welcome to Our Blog</Title>
          <Paragraph style={{ fontSize: "18px", marginBottom: "30px" }}>
            Discover amazing articles and insights from our community of writers.
          </Paragraph>
          <Button type="primary" size="large">
            Start Reading
          </Button>
        </div>
      </Content>
    </Layout>
  );
};

export default Home;
