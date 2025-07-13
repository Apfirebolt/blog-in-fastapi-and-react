import React, { use } from "react";
import { Layout, Typography, Row, Col, Card, Button } from "antd";
import { useAtom } from "jotai";
import { randomDinosaur } from "../atoms";
import { UserContext } from "../App";

const { Content } = Layout;
const { Title, Paragraph } = Typography;

const About: React.FC = () => {
  const [dinosaur] = useAtom(randomDinosaur);
  const { user, setUser } = use(UserContext);

  const setUserData = () => {
    setUser({ name: "Dino Enthusiast", age: 5 });
  };

  return (
    <Layout>
      <Content style={{ padding: "50px", marginTop: 64 }}>
        <div
          className="site-layout-content"
          style={{ background: "#fff", padding: 24, minHeight: 380 }}
        >
          <Title level={2}>About DinoWorld</Title>
          <Paragraph>
            DinoWorld is a web application designed to bring the fascinating
            world of dinosaurs to life. Our goal is to educate and entertain
            users by providing detailed information about various dinosaur
            species, their history, and much more.
          </Paragraph>
          <Title level={3}>Tech Stack</Title>
          <Row gutter={[16, 16]}>
            <Col span={8}>
              <Card title="React" bordered={false}>
                A JavaScript library for building user interfaces.
              </Card>
            </Col>
            <Col span={8}>
              <Card title="TypeScript" bordered={false}>
                A strongly typed programming language that builds on JavaScript.
              </Card>
            </Col>
            <Col span={8}>
              <Card title="Ant Design" bordered={false}>
                A modern UI library for building responsive and elegant web
                applications.
              </Card>
            </Col>
          </Row>
          <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
            <Col span={8}>
              <Card title="Node.js" bordered={false}>
                A JavaScript runtime built on Chrome's V8 JavaScript engine.
              </Card>
            </Col>
            <Col span={8}>
              <Card title="Webpack" bordered={false}>
                A static module bundler for modern JavaScript applications.
              </Card>
            </Col>
            <Col span={8}>
              <Card title="CSS-in-JS" bordered={false}>
                Styling approach used for dynamic and scoped styles.
              </Card>
            </Col>
          </Row>
        </div>
        <Button onClick={() => setUser({ name: 'Jane Doe', age: 30 })}>
          Update User
        </Button>
      </Content>
    </Layout>
  );
};

export default About;
