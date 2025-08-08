import React, {useEffect, useState} from 'react';
import {Button, Flex, Table} from 'antd';
import Pubsub from "pubsub-js";

// 表格列配置
const columns = [
    {title: 'Id', dataIndex: 'id'},
    {title: 'Name', dataIndex: 'name'},
    {title: 'Age', dataIndex: 'age'},
    {title: 'Address', dataIndex: 'address'},
];

const List1 = () => {
    // 使用 useState 管理表格数据，这样数据变化时会触发重新渲染
    // 初始化数据时，确保 key 唯一（这里用索引 i 作为 key，前提是数据不会重新排序）
    let users = Array.from({length: 46})
        .map((_, i) => ({
            key: i, // 唯一 key（必须）
            id: i,
            name: `Edward King ${i}`,
            age: 32,
            address: `London, Park Lane no. ${i}`,
        }));

    const [dataSource, setDataSource] = useState(users);

    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        console.log('组件挂载完成');

        // 订阅事件
        const topicToken = Pubsub.subscribe('searchGitHub', (topic, data) => {
            console.log(`收到 ${topic} 事件，数据：`, data);

            if (data?.data?.items) {
                // 处理远程数据：如果没有 key，手动添加（例如用 id 或索引）
                const newData = data.data.items.map((item, index) => ({
                    // 优先使用数据自带的唯一标识（如 id），没有则用索引
                    key: item.id || index,
                    ...item // 其他字段
                }));
                setDataSource(newData); // 更新状态
            }
        });

        // 清理函数：正确取消订阅的方式
        return () => {
            console.log('组件即将卸载');
            Pubsub.unsubscribe(topicToken); // 使用订阅时返回的 token 取消订阅
        };
    }, []);

    // 其他代码保持不变...
    const start = () => {
        setLoading(true);
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