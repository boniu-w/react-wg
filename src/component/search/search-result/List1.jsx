import React, {useEffect, useState} from 'react';
import { Button, Flex, Table } from 'antd';

// 表格列配置
const columns = [
    { title: 'Name', dataIndex: 'name' },
    { title: 'Age', dataIndex: 'age' },
    { title: 'Address', dataIndex: 'address' },
];

// 生成示例数据
const dataSource = Array.from({ length: 46 }).map((_, i) => ({
    key: i,
    name: `Edward King ${i}`,
    age: 32,
    address: `London, Park Lane no. ${i}`,
}));

const List1 = () => {
    // 模拟 componentDidMount：组件挂载时执行一次
    useEffect(() => {
        console.log('组件挂载完成（相当于componentDidMount）');

        // 这里可以写需要在组件挂载后执行的逻辑
        // 比如发起接口请求、初始化数据、绑定事件等
        const fetchData = async () => {
            try {
                const response = await fetch('https://api.example.com/data');
                const data = await response.json();
                console.log('获取到数据：', data);
            } catch (error) {
                console.error('请求失败：', error);
            }
        };

        fetchData();

        // 可选：返回一个清理函数，相当于 componentWillUnmount
        return () => {
            console.log('组件即将卸载（相当于componentWillUnmount）');
            // 这里可以写清理逻辑，比如取消请求、移除事件监听等
        };
    }, []); // 空依赖数组：只在挂载和卸载时执行

    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [loading, setLoading] = useState(false);

    const start = () => {
        setLoading(true);
        // 模拟 AJAX 请求完成后清空选择
        setTimeout(() => {
            setSelectedRowKeys([]);
            setLoading(false);
        }, 1000);
    };

    const onSelectChange = (newSelectedRowKeys) => {
        console.log('selectedRowKeys changed: ', newSelectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    const hasSelected = selectedRowKeys.length > 0;

    return (
        <Flex gap="middle" vertical>
            <Flex align="center" gap="middle">
                <Button
                    type="primary"
                    onClick={start}
                    disabled={!hasSelected}
                    loading={loading}
                >
                    Reload
                </Button>
                {hasSelected ? `Selected ${selectedRowKeys.length} items` : null}
            </Flex>
            <Table
                rowSelection={rowSelection}
                columns={columns}
                dataSource={dataSource}
            />
        </Flex>
    );
};

export default List1;
