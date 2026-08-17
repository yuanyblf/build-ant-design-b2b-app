import { useMemo, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { App, Button, Card, Form, Input, Modal, Popconfirm, Space, Table, Tag } from 'antd';
import { ListPageHeading, SearchField, SearchPanel } from '../../../shared/ui/ListPage';

interface SettingItem { id: number; name: string; code: string; count: number; status: '启用' | '停用' }
const categorySeed: SettingItem[] = [{ id: 1, name: '生活用品', code: 'CAT-LIFE', count: 18, status: '启用' }, { id: 2, name: '旅行用品', code: 'CAT-TRAVEL', count: 9, status: '启用' }, { id: 3, name: '办公用品', code: 'CAT-OFFICE', count: 12, status: '启用' }];
const specSeed: SettingItem[] = [{ id: 1, name: '颜色', code: 'SPEC-COLOR', count: 8, status: '启用' }, { id: 2, name: '容量', code: 'SPEC-VOLUME', count: 4, status: '启用' }, { id: 3, name: '尺寸', code: 'SPEC-SIZE', count: 5, status: '启用' }];

export function ProductSettingsPage({ mode }: { mode: 'category' | 'specification' }) {
  const noun = mode === 'category' ? '品类' : '规格';
  const { message } = App.useApp();
  const [data, setData] = useState(mode === 'category' ? categorySeed : specSeed);
  const [keyword, setKeyword] = useState('');
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<SettingItem>();
  const [form] = Form.useForm<Pick<SettingItem, 'name' | 'code'>>();
  const filtered = useMemo(() => data.filter(item => !keyword || `${item.name}${item.code}`.includes(keyword)), [data, keyword]);
  const edit = (item?: SettingItem) => { setEditing(item); form.resetFields(); if (item) form.setFieldsValue(item); setOpen(true); };
  const save = async () => { const values = await form.validateFields(); setData(list => editing ? list.map(item => item.id === editing.id ? { ...item, ...values } : item) : [...list, { ...values, id: Date.now(), count: 0, status: '启用' }]); setOpen(false); message.success(`${noun}已保存`); };
  return <div className="page-stack">
    <ListPageHeading paths={['商品管理', `${noun}维护`]} title={`${noun}维护`} subtitle={`维护商品可选的${noun}及其使用状态。`} />
    <SearchPanel fieldCount={1} onSearch={() => message.success('查询完成')} onReset={() => setKeyword('')}><SearchField label={`${noun}名称`}><Input allowClear placeholder={`请输入${noun}名称或编码`} value={keyword} onChange={event => setKeyword(event.target.value)} /></SearchField></SearchPanel>
    <Card><div className="table-toolbar"><Button type="primary" icon={<PlusOutlined />} onClick={() => edit()}>新增{noun}</Button></div><Table rowKey="id" dataSource={filtered} pagination={false} columns={[{ title: `${noun}名称`, dataIndex: 'name' }, { title: `${noun}编码`, dataIndex: 'code' }, { title: '关联商品数', dataIndex: 'count', align: 'right' }, { title: '状态', dataIndex: 'status', render: value => <Tag color={value === '启用' ? 'success' : 'default'}>{value}</Tag> }, { title: '操作', render: (_, record: SettingItem) => <Space><Button type="link" onClick={() => edit(record)}>编辑</Button><Popconfirm title={`确认${record.status === '启用' ? '停用' : '启用'}“${record.name}”？`} description={record.count ? `当前关联 ${record.count} 个商品，已有商品数据不会被删除。` : undefined} onConfirm={() => { setData(list => list.map(item => item.id === record.id ? { ...item, status: record.status === '启用' ? '停用' : '启用' } : item)); message.success('状态已更新'); }}><Button type="link">{record.status === '启用' ? '停用' : '启用'}</Button></Popconfirm></Space> }]}/></Card>
    <Modal title={`${editing ? '编辑' : '新增'}${noun}`} open={open} onCancel={() => setOpen(false)} onOk={save} okText="确认" cancelText="取消"><Form form={form} layout="horizontal" className="edit-form"><Form.Item name="name" label={`${noun}名称`} extra={`用于商品维护时识别该${noun}。`} rules={[{ required: true, message: `请输入${noun}名称` }]}><Input /></Form.Item><Form.Item name="code" label={`${noun}编码`} extra="编码保存后用于数据关联，请保持唯一。" rules={[{ required: true, message: `请输入${noun}编码` }]}><Input /></Form.Item></Form></Modal>
  </div>;
}
