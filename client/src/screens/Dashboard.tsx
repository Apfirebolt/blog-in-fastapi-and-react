import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createPost, getPosts, deletePost } from "../features/blog/BlogSlice";
import { Layout, Typography, Button, Modal, Card, Row, Col } from "antd";
import PostForm from "../components/Post";
import Confirm from "../components/Confirm";

const { Content } = Layout;
const { Title, Paragraph } = Typography;

const Dashboard: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [confirmTitle, setConfirmTitle] = useState("Confirm Deletion");
  const [selectedPost, setSelectedPost] = useState(null);
  const posts = useSelector((state: any) => state.blog.posts);
  const user = useSelector((state: any) => state.auth.user);
  const dispatch = useDispatch();

  const showModal = () => {
    setSelectedPost(null);
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

  const handleEditPost = (post: any) => {
    // Logic to handle post editing
    console.log("Editing post:", post);
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const openDeletePostModal = (post: any) => {
    setSelectedPost(post);
    setConfirmMessage(
      `Are you sure you want to delete the post titled "${post.title}"?`
    );
    setIsDeleteModalOpen(true);
  };

  const cancelDeletePost = () => {
    setIsDeleteModalOpen(false);
    setSelectedPost(null);
  };

  const handleDeletePost = async (postId: number) => {
    // Logic to handle post deletion
    console.log("Deleting post with ID:", postId);
    // You would typically dispatch a delete action here
    await dispatch(deletePost(postId));
    await dispatch(getPosts());
    setIsDeleteModalOpen(false);
    setSelectedPost(null);
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
                    {post.owner && post.owner.username === user?.username && (
                      <div
                        style={{
                          marginTop: "12px",
                          display: "flex",
                          gap: "8px",
                        }}
                      >
                        <Button
                          size="small"
                          onClick={() => handleEditPost(post)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="small"
                          danger
                          onClick={() => openDeletePostModal(post)}
                        >
                          Delete
                        </Button>
                      </div>
                    )}
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        )}
      </Content>
      <Confirm
        isOpen={isDeleteModalOpen}
        title={confirmTitle}
        message={confirmMessage}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={() => {
          handleDeletePost(selectedPost.id);
          setIsDeleteModalOpen(false);
        }}
        onCancel={() => cancelDeletePost(false)}
      />

      <Modal
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        width={800}
      >
        <PostForm
          createPost={handleCreatePost}
          closeForm={handleCancel}
          post={selectedPost}
        />
      </Modal>
    </Layout>
  );
};

export default Dashboard;
