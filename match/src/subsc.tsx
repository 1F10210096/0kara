import React, { useEffect, useRef } from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import {useNavigation} from 'react-router-dom';
import backgroundImage from './back.jpg';
import axios from 'axios';
import './Home.css';
import 'particles.js';
import firebase from 'firebase/app';
import 'firebase/auth';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
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
  width: '500px',
  height: '500px',
  backgroundColor: 'white',
  padding: '20px',
  zIndex: 1 
};
const h1 = {
  width: '700px',
  height: '30px',
  backgroundColor: 'white',
  padding: '40px',
};



const Register: React.FC = () => {
  const navigate = useNavigate();
  const particleRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  const onFinish = (values: any) => {
    const auth = getAuth();
    console.log("Received values of form: ", values);
    const email = values.email;
    const password = values.password;
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log("User registered:", userCredential.user);
        
      })
      .catch((error) => {
        console.error("Error registering:", error.message);
      });
  };

  useEffect(() => {

    if ((window as any).particlesJS) {
        (window as any).particlesJS("particles-js", {
            particles: {
                number: {
                    value: 30,
                    density: {
                        enable: true,
                        value_area: 1121.6780303333778
                    }
                },
                color: {
                    value: "#fff"
                },
                shape: {
                    type: "image",
                    stroke: {
                        width: 0,
                    },
                    image: {
                        src: "http://coco-factory.jp/ugokuweb/wp-content/themes/ugokuweb/data/move02/5-6/img/flower.png",
                        width: 120,
                        height: 120
                    }
                },
                opacity: {
                    value: 0.06409588744762158,
                    random: true,
                    anim: {
                        enable: false,
                        speed: 1,
                        opacity_min: 0.1,
                        sync: false
                    }
                },
                size: {
                    value: 8.011985930952697,
                    random: true,
                    anim: {
                        enable: false,
                        speed: 4,
                        size_min: 0.1,
                        sync: false
                    }
                },
                line_linked: {
                    enable: false,
                },
                move: {
                    enable: true,
                    speed: 7,
                    direction: "bottom-right",
                    random: false,
                    straight: false,
                    out_mode: "out",
                    bounce: false,
                    attract: {
                        enable: false,
                        rotateX: 281.9177489524316,
                        rotateY: 127.670995809726
                    }
                }
            },
            interactivity: {
                detect_on: "canvas",
                events: {
                    onhover: {
                        enable: false,
                    },
                    onclick: {
                        enable: false,
                    },
                    resize: true
                }
            },
            retina_detect: false
        });
    }
}, []);
  
  return (
    <div style={bgStyle}>
          <div ref={particlesRef} id="particles-js" style={{ height: '70vh' }}></div>
      <div id="particle" ref={particleRef}></div>;
        <div style={squareStyle}>
        <p className="fuchidori" style={{ fontSize: '30px' }}>アカウント作成</p>
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
  name="email"

        rules={[{ required: true, message: 'Please input your Email!' }]}
      >
        <Input
          prefix={<LockOutlined className="site-form-item-icon" />}
          type='email'
          placeholder='Email'
        />
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
          登録
        </Button>

      </Form.Item>

      <Link to="/">back Home</Link>
    </Form>

    </div>
    </div>
  );
};

export default Register;