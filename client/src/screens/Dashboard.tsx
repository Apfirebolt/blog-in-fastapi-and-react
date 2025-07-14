import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createPost, getPosts } from "../features/blog/BlogSlice";
import { Layout, Typography, Button, Modal, Card, Row, Col } from "antd";
import PostForm from "../components/Post";

const { Content } = Layout;
const { Title, Paragraph } = Typography;

const Dashboard: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const posts = useSelector((state: any) => state.blog.posts);
  const dispatch = useDispatch();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleCreatePost = async (postData: any) => {
    await dispatch(createPost(postData));
    await dispatch(getPosts());
    setIsModalOpen(false);
  };

  console.log("Posts in Dashboard:", posts);

  useEffect(() => {
    dispatch(getPosts());
  }, [dispatch]);

  return (
    <Layout>
      <Content style={{ padding: "50px", marginTop: 64 }}>
        <div
          className="site-layout-content"
          style={{
            background: "#fff",
            padding: 24,
            minHeight: 380,
            textAlign: "center",
          }}
        >
          <Title level={1}>Welcome to Our Blog</Title>
          <Paragraph style={{ fontSize: "18px", marginBottom: "30px" }}>
            Discover amazing articles and insights from our community of
            writers.
          </Paragraph>
          <Button type="primary" size="large" onClick={showModal}>
            Create Post
          </Button>
        </div>

        {posts && posts.length > 0 && (
          <div style={{ padding: "24px" }}>
            <Title
              level={2}
              style={{ textAlign: "center", marginBottom: "30px" }}
            >
              Latest Posts
            </Title>
            <Row gutter={[16, 16]}>
              {posts.map((post: any, index: number) => (
                <Col xs={24} sm={12} md={8} lg={6} key={post.id || index}>
                  <Card title={post.title} hoverable style={{ height: "100%" }}>
                    <Paragraph ellipsis={{ rows: 3 }}>{post.content}</Paragraph>
                    {post.owner && (
                      <Paragraph
                        style={{ marginBottom: 0, fontStyle: "italic" }}
                      >
                        By: {post.owner ? post.owner.username : "Unknown"}
                      </Paragraph>
                    )}
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        )}
      </Content>

      <Modal
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        width={800}
      >
        <PostForm createPost={handleCreatePost} closeForm={handleCancel} />
      </Modal>
    </Layout>
  );
};

export default Dashboard;
