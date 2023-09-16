
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
} from 'antd';
import { Link } from 'react-router-dom';
import { PlusOutlined,SendOutlined } from '@ant-design/icons'
import { getAuth, onAuthStateChanged } from "firebase/auth";

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
    photo: null // 画像アップロードの場合は適切に管理する必要があります
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

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      // レスポンスをチェック
      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const result = await response.json();
      console.log(result);
      // ここで必要に応じて処理を追加（例: レスポンスに基づくメッセージの表示）
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

          <Form.Item label="写真" valuePropName="fileList" getValueFromEvent={normFile}>
            <Upload
              action="/upload.do"
              listType="picture-card"
              // fileList={formData.photo}
              // onChange={info => setFormData(prev => ({ ...prev, photo: info.fileList }))}
            >
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
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