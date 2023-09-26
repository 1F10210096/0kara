
import React, { useEffect, useState } from 'react';
import {
  Button,
  Cascader,
  Checkbox,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Radio,
  Select,
  Slider,
  Switch,
  TreeSelect,
  Upload,
  UploadFile,
} from 'antd';
import { Link } from 'react-router-dom';
import { PlusOutlined,SendOutlined } from '@ant-design/icons'
import { getAuth, onAuthStateChanged } from "firebase/auth";


import type { RcFile, UploadProps } from 'antd/es/upload';
const { RangePicker } = DatePicker;
const { TextArea } = Input;

const normFile = (e: any) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

export default function Myprofile() {
  const [componentDisabled, setComponentDisabled] = useState<boolean>(true);
  const [formData, setFormData] = useState({
    ok: "",
    nickname: "",
    gender: "",
    age: "",
    comment: "",
    photo: null as RcFile | null  // Type modification here
});
  const [user, setUserID] = useState('');

  const auth = getAuth();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        setUserID(uid);
        setFormData(prev => ({ ...prev, ok: uid }));
      } else {
        // User is signed out
        // ...
      }
    });
  
    // コンポーネントがアンマウントされるときにリスナーを解除します。
    return () => unsubscribe();
  
  }, [auth]);


  function isRcFile(obj: any): obj is RcFile {
    return obj && obj.originFileObj && typeof obj.name === "string";
  }

  const handleSubmit = async () => {
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null) { // Check if the value is not null
          if (key === "photo" && isRcFile(value)) {
            // Append the blob data if value is RcFile
            data.append(key, (value as any).originFileObj, value.name);
          } else if (typeof value === "string") {
            data.append(key, value);
          }
        }
      });
  
      const response = await fetch('http://localhost:5000/api/profile', {
        method: 'POST',
        body: data,  // Sending FormData instead of JSON
      });
  
      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }
  
      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.error("There was an error sending the data:", error);
    }
  };

  return (
    <div style={{ backgroundColor: "pink", height: "100vh", display: "flex", justifyContent: "center" }}>
      <div style={{ marginTop: "80px", marginBottom: "80px", backgroundColor: "white", padding: "20px", borderRadius: "10px", width: "500px", display: 'inline-block' }}>
        <div style={{ textAlign: "center", fontSize: "30px", fontWeight: "bold", marginBottom: "10px" }}>プロフィール入力欄</div>
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 14 }}
          layout="horizontal"
          style={{ maxWidth: 600 }}
        >
          <Form.Item label="ニックネーム" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
            <Input
              value={formData.nickname}
              onChange={e => setFormData(prev => ({ ...prev, nickname: e.target.value }))}
            />
          </Form.Item>

          <Form.Item label="性別">
            <Radio.Group
              value={formData.gender}
              onChange={e => setFormData(prev => ({ ...prev, gender: e.target.value }))}
            >
              <Radio value="男">男</Radio>
              <Radio value="女">女</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item label="年齢">
            <Select
              value={formData.age}
              onChange={value => setFormData(prev => ({ ...prev, age: value }))}
            >
          <Select.Option value="20-25">20~25</Select.Option>
          <Select.Option value="26-30">26~30</Select.Option>
          <Select.Option value="31-35">31~35</Select.Option>
          <Select.Option value="36-40">36~40</Select.Option>
          <Select.Option value="41-45">41~45</Select.Option>
          <Select.Option value="46-50">46~50</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="ひと言">
            <TextArea
              rows={4}
              value={formData.comment}
              onChange={e => setFormData(prev => ({ ...prev, message: e.target.value }))}
            />
          </Form.Item>

          <Form.Item label="Profile Photo">
  <Upload
    beforeUpload={(file: RcFile) => {
      setFormData(prev => ({ ...prev, photo: file }));
      return false; // Prevent automatic upload
    }}
  >
    <Button icon={<PlusOutlined />}>Upload</Button>
  </Upload>
</Form.Item>

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
 <Button type="primary" icon={<SendOutlined />} onClick={handleSubmit}>
          Send
        </Button>
            <Link to="/Menu">
              戻る
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
}