import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getSinglePost,
  postComment,
  updateComment,
  deleteComment,
} from "../features/blog/blogSlice";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  Button,
  Typography,
  Space,
  Divider,
  Spin,
  Alert,
  Input,
} from "antd";
import {
  ArrowLeftOutlined,
  UserOutlined,
  CalendarOutlined,
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;

interface Blog {
  id: number;
  title: string;
  content: string;
  author: string;
  created_at: string;
  updated_at: string;
}

const BlogDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { post, loading, error } = useSelector((state: any) => state.blog);
  const [commentContent, setCommentContent] = useState("");
  const [selectedComment, setSelectedComment] = useState(null);

  const handleCommentSubmit = async () => {
    if (!commentContent.trim()) return;

    const commentData = {
      content: commentContent,
    };

    await dispatch(postComment({ postId: id, commentData }));
    setCommentContent("");
    await dispatch(getSinglePost(id));
  };

  const handleCommentUpdate = async (
    postId: string,
    commentId: string,
    commentData: any
  ) => {
    await dispatch(updateComment({ postId, commentId, commentData }));
    await dispatch(getPosts());
    setSelectedComment(null);
  };

  const handleCommentDelete = async (postId: string, commentId: string) => {
    await dispatch(deleteComment({ postId, commentId }));
    await dispatch(getPosts());
  };

  useEffect(() => {
    if (id) {
      console.log("Fetching post with ID:", id);
      dispatch(getSinglePost(id));
    }
  }, [id, dispatch]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "20px" }}>
        <Alert message="Error" description={error} type="error" showIcon />
      </div>
    );
  }

  if (!post) {
    return (
      <div style={{ padding: "20px" }}>
        <Alert
          message="Not Found"
          description="Blog not found"
          type="warning"
          showIcon
        />
      </div>
    );
  }

  return (
    <div style={{ margin: "0 auto", padding: "20px" }}>
      <Button
        type="default"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate(-1)}
        style={{ marginBottom: "20px" }}
      >
        Back
      </Button>

      <Card>
        <Title level={1}>{post.title}</Title>

        <Space
          direction="vertical"
          size="small"
          style={{ marginBottom: "24px" }}
        >
          <Space>
            <UserOutlined />
            <Text>By {post.owner.username}</Text>
          </Space>
          <Space>
            <CalendarOutlined />
            <Text>
              Published: {new Date(post.createdDate).toLocaleDateString()}
            </Text>
          </Space>
          {post.updated_at !== post.created_at && (
            <Space>
              <CalendarOutlined />
              <Text>
                Updated: {new Date(post.updated_at).toLocaleDateString()}
              </Text>
            </Space>
          )}
        </Space>

        <Divider />

        <Paragraph style={{ fontSize: "16px", lineHeight: "1.6" }}>
          {post.content}
        </Paragraph>

        <Divider />

        <div style={{ marginTop: "32px" }}>
          <Title level={3}>Comments</Title>

          {/* Comment form */}
          <Card style={{ marginBottom: "24px", backgroundColor: "#fafafa" }}>
            <Space direction="vertical" style={{ width: "100%" }}>
              <Text strong>Add a comment:</Text>
              <Input.TextArea
                rows={4}
                placeholder="Write your comment here..."
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                style={{ marginBottom: "12px" }}
              />
              <Button onClick={() => handleCommentSubmit()} type="primary">Post Comment</Button>
            </Space>
          </Card>

          {/* Comments list */}
          {post.comments && post.comments.length > 0 ? (
            <Space direction="vertical" style={{ width: "100%" }} size="middle">
              {post.comments.map((comment: any) => (
                <Card key={comment.id} size="small">
                  <Space
                    direction="vertical"
                    size="small"
                    style={{ width: "100%" }}
                  >
                    <Space>
                      <UserOutlined />
                      <Text strong>{comment.owner.username}</Text>
                      <Text type="secondary">
                        {new Date(comment.createdDate).toLocaleDateString()}
                      </Text>
                    </Space>
                    <Text>{comment.content}</Text>
                  </Space>
                </Card>
              ))}
            </Space>
          ) : (
            <Text type="secondary">No comments yet. Be the first to comment!</Text>
          )}
        </div>
      </Card>
    </div>
  );
};

export default BlogDetail;
