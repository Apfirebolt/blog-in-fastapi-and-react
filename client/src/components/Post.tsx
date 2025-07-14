import React from 'react';
import { Form, Input, Button, Card } from 'antd';

const { TextArea } = Input;

interface PostFormData {
    title: string;
    content: string;
    author: string;
}

const PostForm: React.FC = () => {
    const [form] = Form.useForm();

    const onFinish = (values: PostFormData) => {
        // Handle form submission here
        console.log('Form submitted:', values);
    };

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
                    label="Author"
                    name="author"
                    rules={[{ required: true, message: 'Please input the author!' }]}
                >
                    <Input placeholder="Enter author name" />
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
                        Create Post
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default PostForm;
