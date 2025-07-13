import React from 'react';
import { useDispatch } from 'react-redux'
import { login } from '../features/auth/AuthSlice'
import { Form, Input, Button, Card } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

interface LoginFormValues {
    username: string;
    password: string;
}

const Login: React.FC = () => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();

    const onFinish = (values: LoginFormValues) => {
    
        dispatch(login(values));
        form.resetFields();
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
            <Card title="Login" style={{ width: 400 }}>
                <Form
                    form={form}
                    name="login"
                    onFinish={onFinish}
                    layout="vertical"
                    requiredMark={false}
                >
                    <Form.Item
                        label="Email"
                        name="username"
                        rules={[
                            { required: true, message: 'Please input your email!' },
                            { type: 'email', message: 'Please enter a valid email!' }
                        ]}
                    >
                        <Input 
                            prefix={<UserOutlined />} 
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
                            Login
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default Login;