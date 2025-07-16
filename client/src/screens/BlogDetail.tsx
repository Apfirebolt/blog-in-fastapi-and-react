import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSinglePost } from "../features/blog/BlogSlice";
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Typography, Space, Divider, Spin, Alert } from 'antd';
import { ArrowLeftOutlined, UserOutlined, CalendarOutlined } from '@ant-design/icons';

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

    useEffect(() => {
        if (id) {
            console.log("Fetching post with ID:", id);
            dispatch(getSinglePost(id));
        }
    }, [id, dispatch]);

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <Spin size="large" />
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ padding: '20px' }}>
                <Alert message="Error" description={error} type="error" showIcon />
            </div>
        );
    }

    if (!post) {
        return (
            <div style={{ padding: '20px' }}>
                <Alert message="Not Found" description="Blog not found" type="warning" showIcon />
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
            <Button 
                type="default" 
                icon={<ArrowLeftOutlined />} 
                onClick={() => navigate(-1)}
                style={{ marginBottom: '20px' }}
            >
                Back
            </Button>
            
            <Card>
                <Title level={1}>{post.title}</Title>
                
                <Space direction="vertical" size="small" style={{ marginBottom: '24px' }}>
                    <Space>
                        <UserOutlined />
                        <Text>By {post.owner.username}</Text>
                    </Space>
                    <Space>
                        <CalendarOutlined />
                        <Text>Published: {new Date(post.createdDate).toLocaleDateString()}</Text>
                    </Space>
                    {post.updated_at !== post.created_at && (
                        <Space>
                            <CalendarOutlined />
                            <Text>Updated: {new Date(post.updated_at).toLocaleDateString()}</Text>
                        </Space>
                    )}
                </Space>
                
                <Divider />
                
                <Paragraph style={{ fontSize: '16px', lineHeight: '1.6' }}>
                    {post.content}
                </Paragraph>
            </Card>
        </div>
    );
};

export default BlogDetail;