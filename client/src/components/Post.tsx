import React, { useEffect } from 'react';
import { Form, Input, Button, Card } from 'antd';

const { TextArea } = Input;

interface PostFormData {
    title: string;
    content: string;
}

interface PostFormProps {
    closeForm: () => void;
    createPost: (data: PostFormData) => void;
    updatePost?: (postId: string, data: PostFormData) => void;
    post?: PostFormData;
}

const PostForm: React.FC<PostFormProps> = ({ closeForm, createPost, updatePost, post }) =>  {
    const [form] = Form.useForm();

    const onFinish = (values: PostFormData) => {
        if (post && updatePost) {
            updatePost(post.id, values);
        } else {
            createPost(values);
        }
        form.resetFields();
    };

    useEffect(() => {
        if (post) {
            form.setFieldsValue(post);
        } else {
            form.resetFields();
        }
    }, [post, form]);

    return (
        <Card 
            title="Create New Blog Post" 
            style={{ maxWidth: 600, margin: '0 auto' }}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                autoComplete="off"
            >
                <Form.Item
                    label="Title"
                    name="title"
                    rules={[{ required: true, message: 'Please input the title!' }]}
                >
                    <Input placeholder="Enter post title" />
                </Form.Item>

                <Form.Item
                    label="Content"
                    name="content"
                    rules={[{ required: true, message: 'Please input the content!' }]}
                >
                    <TextArea 
                        rows={6} 
                        placeholder="Enter post content"
                    />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" block>
                        {post ? 'Update Post' : 'Create Post'}
                    </Button>

                    <Button 
                        style={{ marginTop: '10px' }} 
                        onClick={() => closeForm()} 
                        block
                    >
                        Cancel
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default PostForm;
