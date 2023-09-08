import React, { useState, useEffect } from 'react';
import { Descriptions, Pagination, Badge, DescriptionsProps } from 'antd';

const RandomMatch: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [items, setItems] = useState([]);

  useEffect(() => {
    // ページ番号に基づいてデータをフェッチまたは計算
    function fetchDataForPage(currentPage: number) {
        const items: DescriptionsProps['items'] = [
            {
              key: '1',
              label: 'Product',
              children: 'Cloud Database',
            },
            {
              key: '2',
              label: 'Billing Mode',
              children: 'Prepaid',
            },
            {
              key: '3',
              label: 'Automatic Renewal',
              children: 'YES',
            },
            {
              key: '4',
              label: 'Order time',
              children: '2018-04-24 18:00:00',
            },
            {
              key: '5',
              label: 'Usage Time',
              children: '2019-04-24 18:00:00',
              span: 2,
            },
            {
              key: '6',
              label: 'Status',
              children: <Badge status="processing" text="Running" />,
              span: 3,
            },
            {
              key: '7',
              label: 'Negotiated Amount',
              children: '$80.00',
            },
            {
              key: '8',
              label: 'Discount',
              children: '$20.00',
            },
            {
              key: '9',
              label: 'Official Receipts',
              children: '$60.00',
            },
            {
              key: '10',
              label: 'Config Info',
              children: (
                <>
                  Data disk type: MongoDB
                  <br />
                  Database version: 3.4
                  <br />
                  Package: dds.mongo.mid
                  <br />
                  Storage space: 10 GB
                  <br />
                  Replication factor: 3
                  <br />
                  Region: East China 1
                  <br />
                </>
              ),
            },
          ];
          return items;
        
    }
    const fetchedItems = fetchDataForPage(currentPage); // この関数は実装が必要です
    // setItems(fetchedItems);
  }, [currentPage]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '35%' }}>
      <Descriptions title="User Info" bordered items={items} style={{ marginTop: '-30%' }}/>
      <Pagination defaultCurrent={1} total={50} onChange={(page) => setCurrentPage(page)} style={{ marginTop: '30%' }}/>
    </div>
  );
};

export default RandomMatch;


