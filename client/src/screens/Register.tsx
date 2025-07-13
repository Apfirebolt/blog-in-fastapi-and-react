import React from 'react';
import { Form, Input, Button, Card } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';

interface RegisterFormValues {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
}

const Register: React.FC = () => {
    const [form] = Form.useForm();

    const onFinish = (values: RegisterFormValues) => {
        console.log('Register form values:', values);
        // Handle register logic here
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
            <Card title="Register" style={{ width: 400 }}>
                <Form
                    form={form}
                    name="register"
                    onFinish={onFinish}
                    layout="vertical"
                    requiredMark={false}
                >
                    <Form.Item
                        label="First Name"
                        name="firstName"
                        rules={[
                            { required: true, message: 'Please input your first name!' }
                        ]}
                    >
                        <Input 
                            prefix={<UserOutlined />} 
                            placeholder="Enter your first name" 
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Last Name"
                        name="lastName"
                        rules={[
                            { required: true, message: 'Please input your last name!' }
                        ]}
                    >
                        <Input 
                            prefix={<UserOutlined />} 
                            placeholder="Enter your last name" 
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Username"
                        name="username"
                        rules={[
                            { required: true, message: 'Please input your username!' },
                            { min: 3, message: 'Username must be at least 3 characters!' }
                        ]}
                    >
                        <Input 
                            prefix={<UserOutlined />} 
                            placeholder="Enter your username" 
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: 'Please input your email!' },
                            { type: 'email', message: 'Please enter a valid email!' }
                        ]}
                    >
                        <Input 
                            prefix={<MailOutlined />} 
                            placeholder="Enter your email" 
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[
                            { required: true, message: 'Please input your password!' },
                            { min: 6, message: 'Password must be at least 6 characters!' }
                        ]}
                    >
                        <Input.Password 
                            prefix={<LockOutlined />} 
                            placeholder="Enter your password" 
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" size="large" block>
                            Register
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default Register;