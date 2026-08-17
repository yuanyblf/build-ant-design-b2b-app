import { useState } from 'react';
import { PlusOutlined, TeamOutlined } from '@ant-design/icons';
import { App, Avatar, Button, Card, Col, Descriptions, Flex, Form, Input, Modal, Progress, Row, Select, Space, Table, Tag, Tree, Typography } from 'antd';
import type { DataNode } from 'antd/es/tree';
import { ListPageHeading } from '../../../shared/ui/ListPage';

interface GroupInfo { key: string; name: string; category: string; owner: string; members: number; target: number; status: '活跃' | '招募中' | '筹备中'; description: string }
const groups: Record<string, GroupInfo> = {
  run: { key: 'run', name: '城市跑团', category: '运动健康', owner: '陈一', members: 86, target: 100, status: '活跃', description: '每周组织夜跑和月度挑战赛。' },
  badminton: { key: 'badminton', name: '羽毛球社', category: '运动健康', owner: '李明', members: 58, target: 80, status: '招募中', description: '固定场地约球，新手友好。' },
  photo: { key: 'photo', name: '光影摄影社', category: '文化艺术', owner: '林晓', members: 42, target: 60, status: '活跃', description: '城市扫街、主题创作与作品分享。' },
  reading: { key: 'reading', name: '非虚构读书会', category: '成长学习', owner: '周宁', members: 28, target: 50, status: '筹备中', description: '每月共读一本非虚构作品。' },
};
const treeData: DataNode[] = [
  { key: 'sports', title: '运动健康（2）', children: [{ key: 'run', title: '城市跑团' }, { key: 'badminton', title: '羽毛球社' }] },
  { key: 'culture', title: '文化艺术（1）', children: [{ key: 'photo', title: '光影摄影社' }] },
  { key: 'growth', title: '成长学习（1）', children: [{ key: 'reading', title: '非虚构读书会' }] },
];
const memberData = [{ id: 1, name: '陈一', department: '研发中心', role: '组长', joinedAt: '2025-03-18', contribution: 96 }, { id: 2, name: '林晓', department: '产品中心', role: '活动官', joinedAt: '2025-05-12', contribution: 82 }, { id: 3, name: '周宁', department: '营销中心', role: '成员', joinedAt: '2026-01-08', contribution: 68 }];

export function InterestGroupPage() {
  const { message } = App.useApp();
  const [selectedKey, setSelectedKey] = useState('run');
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const selected = groups[selectedKey] ?? groups.run;
  const create = async () => { await form.validateFields(); setOpen(false); message.success('兴趣小组已创建'); form.resetFields(); };
  return <div className="page-stack">
    <ListPageHeading paths={['员工体验', '社群运营', '兴趣小组']} title="兴趣小组" subtitle="通过分类树管理社群、成员与招募进度。" />
    <Card><div className="table-toolbar"><Space><Button type="primary" icon={<PlusOutlined />} onClick={() => setOpen(true)}>创建小组</Button><Button onClick={() => message.info('Demo：分类管理')}>管理分类</Button></Space></div><Row gutter={[20,20]}>
      <Col xs={24} lg={7}><Card size="small" title="小组分类树" className="group-tree-card"><Input.Search placeholder="搜索小组" allowClear className="tree-search" /><Tree showLine blockNode defaultExpandAll selectedKeys={[selectedKey]} treeData={treeData} onSelect={keys => { const key = String(keys[0] ?? ''); if (groups[key]) setSelectedKey(key); }} /></Card></Col>
      <Col xs={24} lg={17}><Space direction="vertical" size={16} style={{ width: '100%' }}><Card><Flex justify="space-between" align="start" gap={16}><div><Flex align="center" gap={10}><Avatar size={48} icon={<TeamOutlined />} /><div><Typography.Title level={3}>{selected.name}</Typography.Title><Typography.Text type="secondary">{selected.category} · 组长 {selected.owner}</Typography.Text></div></Flex></div><Tag color={selected.status === '活跃' ? 'success' : selected.status === '招募中' ? 'processing' : 'warning'}>{selected.status}</Tag></Flex><Typography.Paragraph className="group-description">{selected.description}</Typography.Paragraph><Descriptions column={3} items={[{ label: '当前成员', children: `${selected.members} 人` }, { label: '目标人数', children: `${selected.target} 人` }, { label: '本月活动', children: '4 场' }]}/><Typography.Text type="secondary">招募进度</Typography.Text><Progress percent={Math.round(selected.members / selected.target * 100)} status="active" /></Card>
        <Card title="核心成员"><Table rowKey="id" dataSource={memberData} pagination={false} size="small" columns={[{ title: '成员', dataIndex: 'name', render: value => <Space><Avatar size="small">{value[0]}</Avatar><Button type="link" className="table-link">{value}</Button></Space> }, { title: '部门', dataIndex: 'department' }, { title: '角色', dataIndex: 'role', render: value => <Tag color={value === '组长' ? 'blue' : 'default'}>{value}</Tag> }, { title: '加入时间', dataIndex: 'joinedAt' }, { title: '贡献度', dataIndex: 'contribution', render: value => <Progress percent={value} size="small" /> }, { title: '操作', render: () => <Button type="link">查看</Button> }]}/></Card></Space></Col>
    </Row></Card>
    <Modal title="创建兴趣小组" open={open} onCancel={() => setOpen(false)} onOk={create} okText="确认" cancelText="取消" footer={(_, { OkBtn, CancelBtn }) => <Space><OkBtn /><CancelBtn /></Space>}><Form form={form} layout="horizontal" className="edit-form"><Form.Item name="name" label="小组名称" extra="建议使用清晰、便于员工搜索的名称。" rules={[{ required: true, message: '请输入小组名称' }]}><Input /></Form.Item><Form.Item name="category" label="所属分类" extra="分类决定小组在左侧树中的位置。" rules={[{ required: true, message: '请选择分类' }]}><Select options={['运动健康','文化艺术','成长学习'].map(value => ({ value, label: value }))}/></Form.Item><Form.Item name="description" label="小组简介" extra="用于向员工说明小组主题和参与方式。" rules={[{ required: true, message: '请输入小组简介' }]}><Input.TextArea rows={3} maxLength={120} showCount /></Form.Item></Form></Modal>
  </div>;
}
