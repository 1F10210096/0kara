import React from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Button, Space } from 'antd';
import { useNavigate } from 'react-router-dom';

const Menu: React.FC = () => {
    const navigate = useNavigate();
  const search = (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log('Button clicked!');
    navigate('/tutorial');
  };
  const Friend = (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log('Button clicked!');
    navigate('/friend');
  };

  return (
    <Space direction="vertical">
      <Space wrap>
        <Button icon={<SearchOutlined />} onClick={search}>Search</Button>
        <Button icon={<SearchOutlined />} onClick={Friend}>Friend</Button>
      </Space>
    </Space>
  );
};

export default Menu;