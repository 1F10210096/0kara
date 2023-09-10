import React from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import {useNavigation} from 'react-router-dom';
import backgroundImage from './back.jpg';
import axios from 'axios';
const bgStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundImage: `url(${backgroundImage})`,
  height: '100vh',
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover'
};

const squareStyle = {
  width: '400px',
  height: '340px',
  backgroundColor: 'white',
  padding: '20px',
};

const PageA: React.FC = () => {
  const navigate = useNavigate();
  const onFinish = (values: any) => {
    axios.post('http://localhost:5000/page_a', values)
    .then(response => {
      console.log(response.data);
      if (response.data.success) {
        console.log("a")
        navigate('/Menu');
      } else {
        // ログインが失敗した場合の処理をここに追加します。
        console.error(response.data.message);
      }
    })
    .catch(error => {
      console.error("Error logging in:", error);
    });
  };
  return (
    <div style={bgStyle}>
        <div style={squareStyle}>
    <Form
      name="normal_login"
      className="login-form"
      initialValues={{ remember: true }}
      onFinish={onFinish}
    >
      <Form.Item
        name="username"
        rules={[{ required: true, message: 'Please input your Username!' }]}
      >
        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[{ required: true, message: 'Please input your Password!' }]}
      >
        <Input
          prefix={<LockOutlined className="site-form-item-icon" />}
          type="password"
          placeholder="Password"
        />
      </Form.Item>
      <Form.Item>
        <Form.Item name="remember" valuePropName="checked" noStyle>
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <a className="login-form-forgot" href="">
          Forgot password
        </a>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" className="login-form-button">
          Log in
        </Button>

      </Form.Item>
      <Link to="/register">register now!</Link>
      <br /> 
      <br /> 
      <Link to="/">back Home</Link>
    </Form>
    </div>
    </div>
  );
};

export default PageA;