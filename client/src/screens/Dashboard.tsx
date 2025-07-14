import React, { useState } from "react";
import { Layout, Typography, Button, Modal } from "antd";
import PostForm from "../components/Post";

const { Content } = Layout;
const { Title, Paragraph } = Typography;

const Dashboard: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

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
                    <Button type="primary" size="large" onClick={showModal}>
                        Create Post
                    </Button>
                </div>
            </Content>
            
            <Modal
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
                width={800}
            >
                <PostForm />
            </Modal>
        </Layout>
    );
};

export default Dashboard;
