import React, { useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Button, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import backgroundImage from './2.jpg';
import userImage from './user.png';
import { AppstoreOutlined, MailOutlined, SettingOutlined ,UserOutlined,UserAddOutlined} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import axios from 'axios';
import { send } from 'process';

const API_ENDPOINT = 'http://localhost:5000';  // あなたのバックエンドのエンドポイント


const items: MenuProps['items'] = [
  {
    label: 'いいねされた人',
    key: 'mail',
    icon: <UserAddOutlined />,
  },
  {
    label: 'メッセージ',
    key: 'app',
    icon: <UserOutlined />,
    disabled: true,
  },
  {
    label: '設定',
    key: 'SubMenu',
    icon: <SettingOutlined />,
    children: [
      {
        type: 'group',
        label: 'Item 1',
        children: [
          {
            label: 'Option 1',
            key: 'setting:1',
          },
          {
            label: 'Option 2',
            key: 'setting:2',
          },
        ],
      },
      {
        type: 'group',
        label: 'Item 2',
        children: [
          {
            label: 'Option 3',
            key: 'setting:3',
          },
          {
            label: 'Option 4',
            key: 'setting:4',
          },
        ],
      },
    ],
  },
];


const bgStyle = {
  display: 'flex',
  height: '13vh',
  width: '28vw',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundImage: `url(${backgroundImage})`,
  backgroundSize: 'cover'
};


const bg2Style: React.CSSProperties = {
  backgroundImage: `url(${userImage})`,
  backgroundSize: 'cover', 
  backgroundPosition: 'left center', 
  zIndex: 10,
  width: '80px',
  height: '80px',
  position: 'fixed', 
  left: '30px',      
  top: '20px',
};

const bg3Style = {
  display: 'flex',
  height: '85vh',
  width: '28vw',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundSize: 'cover',
  borderRight: '1px solid #e1e1e1'
};
const bg4Style: React.CSSProperties = {
  display: 'flex',
  height: '100vh',
  width: '70vw',
  position: 'absolute',
  top: '1px',
  left: '540px',
  backgroundSize: 'cover',
  border: '1px solid #e1e1e1'
};

const Menu1: React.FC = () => {
    const navigate = useNavigate();
    const [current, setCurrent] = useState('mail');

    const onClick: MenuProps['onClick'] = (e) => {
      console.log('click ', e);
      setCurrent(e.key);
    };
  const search = (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log('Button clicked!');
    navigate('/tutorial');
  };
  const Friend = (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log('Button clicked!');
    navigate('/friend');
  };

  const userId = "uiku"

  async function sendUserIdToBackend(userId:string) {
    try {
      const response = await axios.post(`${API_ENDPOINT}/waiting`, { userId });
      if (response.data.success) {
        console.log('User added to waiting list');
      } else {
        console.log('Error:', response.data.message);
      }
    } catch (error) {
      console.error('Failed to send userId:', error);
    }
  }
  function connect() {
  sendUserIdToBackend(userId);
}




  return ( <><div style={bgStyle}><div style={bg2Style}></div> <div className="menuContainer whiteText gothicFont">fuji</div></div>

    <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />
    <div style={bg3Style}></div>
    <div style={bg4Style}>
        {/* 追加した接続ボタン */}
    <button onClick={connect}>Connect</button></div> 
  {/* <Button icon={<SearchOutlined />} onClick={search}>Search</Button>
      <Button icon={<SearchOutlined />} onClick={Friend}>Friend</Button> */}

  </>
  );
};

export default Menu1;