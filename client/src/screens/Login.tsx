import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login, resetSuccess } from "../features/auth/AuthSlice";
import { Form, Input, Button, Card } from "antd";
import type { LoginFormValues } from "../types/User.ts";
import { UserOutlined, LockOutlined } from "@ant-design/icons";

// redirect using react-router-dom


const Login: React.FC = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isSuccess } = useSelector((state: any) => state.auth);


  const onFinish = (values: LoginFormValues) => {
    dispatch(login(values));
    form.resetFields();
  };

  // if isSuccess is true, redirect to home page and reset success state
  useEffect(() => {
    if (isSuccess) {
      navigate("/dashboard");
      dispatch(resetSuccess()); 
    }
  }, [isSuccess, dispatch, navigate]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
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
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Please enter a valid email!" },
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
              { required: true, message: "Please input your password!" },
              { min: 6, message: "Password must be at least 6 characters!" },
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
