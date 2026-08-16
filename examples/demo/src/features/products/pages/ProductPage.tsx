import { useMemo, useState, type Key } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { App, Button, Card, Descriptions, Drawer, Empty, Flex, Form, Input, InputNumber, Modal, Popconfirm, Select, Space, Table, Tag, Typography } from 'antd';
import type { TableColumnsType } from 'antd';
import { ListPageHeading, SearchField, SearchPanel } from '../../../shared/ui/ListPage';

type ProductStatus = '销售中' | '已下架';
interface Product { id: number; name: string; code: string; category: string; specification: string; price: number; stock: number; status: ProductStatus; updatedAt: string }
const initialProducts: Product[] = [
  { id: 1, name: '轻享保温杯', code: 'SPU-2026001', category: '生活用品', specification: '曜石黑 / 500ml', price: 129, stock: 286, status: '销售中', updatedAt: '2026-08-15 10:24' },
  { id: 2, name: '云感旅行枕', code: 'SPU-2026002', category: '旅行用品', specification: '雾霾蓝 / 标准款', price: 89, stock: 64, status: '销售中', updatedAt: '2026-08-14 16:10' },
  { id: 3, name: '桌面收纳套装', code: 'SPU-2026003', category: '办公用品', specification: '暖白 / 4件套', price: 159, stock: 0, status: '已下架', updatedAt: '2026-08-12 09:32' },
];

export function ProductPage() {
  const { message } = App.useApp();
  const [data, setData] = useState(initialProducts);
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState<string>();
  const [status, setStatus] = useState<ProductStatus>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [editing, setEditing] = useState<Product>();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [detail, setDetail] = useState<Product>();
  const [form] = Form.useForm<Omit<Product, 'id' | 'updatedAt'>>();
  const filtered = useMemo(() => data.filter(item => (!keyword || `${item.name}${item.code}`.includes(keyword)) && (!category || item.category === category) && (!status || item.status === status)), [data, keyword, category, status]);
  const openEditor = (record?: Product) => { setEditing(record); form.resetFields(); if (record) form.setFieldsValue(record); else form.setFieldsValue({ status: '销售中' }); setDrawerOpen(true); };
  const save = async () => { const values = await form.validateFields(); setData(list => editing ? list.map(item => item.id === editing.id ? { ...item, ...values, updatedAt: '刚刚' } : item) : [{ ...values, id: Date.now(), updatedAt: '刚刚' }, ...list]); setDrawerOpen(false); message.success(editing ? '商品信息已更新' : '商品已创建'); };
  const batchOff = () => { setData(list => list.map(item => selectedRowKeys.includes(item.id) ? { ...item, status: '已下架' } : item)); message.success(`已下架 ${selectedRowKeys.length} 个商品`); setSelectedRowKeys([]); };
  const columns: TableColumnsType<Product> = [
    { title: '商品名称', dataIndex: 'name', fixed: 'left', width: 180, render: (value, record) => <Button type="link" className="table-link" onClick={() => setDetail(record)}>{value}</Button> },
    { title: '商品编码', dataIndex: 'code', width: 140 }, { title: '品类', dataIndex: 'category', width: 120 }, { title: '默认规格', dataIndex: 'specification', width: 170 },
    { title: '售价', dataIndex: 'price', width: 100, align: 'right', render: value => `¥${value.toFixed(2)}` }, { title: '库存', dataIndex: 'stock', width: 90, align: 'right' },
    { title: '状态', dataIndex: 'status', width: 100, render: value => <Tag color={value === '销售中' ? 'success' : 'default'}>{value}</Tag> }, { title: '更新时间', dataIndex: 'updatedAt', width: 150 },
    { title: '操作', key: 'action', fixed: 'right', width: 160, render: (_, record) => <Space><Button type="link" onClick={() => setDetail(record)}>查看</Button><Button type="link" onClick={() => openEditor(record)}>编辑</Button><Popconfirm title={`确认${record.status === '销售中' ? '下架' : '上架'}“${record.name}”？`} onConfirm={() => { setData(list => list.map(item => item.id === record.id ? { ...item, status: record.status === '销售中' ? '已下架' : '销售中' } : item)); message.success('商品状态已更新'); }}><Button type="link">{record.status === '销售中' ? '下架' : '上架'}</Button></Popconfirm></Space> },
  ];
  return <div className="page-stack">
    <ListPageHeading paths={['商品管理', '商品信息']} title="商品信息" subtitle="统一维护商品基础信息、售价、库存和销售状态。" />
    <SearchPanel fieldCount={3} onSearch={() => message.success('查询完成')} onReset={() => { setKeyword(''); setCategory(undefined); setStatus(undefined); }}><SearchField label="商品名称"><Input allowClear placeholder="请输入商品名称或编码" value={keyword} onChange={e => setKeyword(e.target.value)} /></SearchField><SearchField label="品类"><Select allowClear placeholder="全部品类" value={category} onChange={setCategory} options={['生活用品','旅行用品','办公用品'].map(value => ({ value, label: value }))}/></SearchField><SearchField label="状态"><Select allowClear placeholder="全部状态" value={status} onChange={setStatus} options={['销售中','已下架'].map(value => ({ value, label: value }))}/></SearchField></SearchPanel>
    <Card><div className="table-toolbar"><Button type="primary" icon={<PlusOutlined />} onClick={() => openEditor()}>新增商品</Button></div>
      {selectedRowKeys.length > 0 && <Flex className="batch-toolbar" justify="space-between" align="center"><Typography.Text>已选择 <strong>{selectedRowKeys.length}</strong> 项</Typography.Text><Space><Popconfirm title={`确认批量下架 ${selectedRowKeys.length} 个商品？`} description="下架后商品将不再对外销售。" onConfirm={batchOff}><Button danger>批量下架</Button></Popconfirm><Button onClick={() => setSelectedRowKeys([])}>取消选择</Button></Space></Flex>}
      {filtered.length ? <Table rowKey="id" rowSelection={{ selectedRowKeys, onChange: setSelectedRowKeys }} columns={columns} dataSource={filtered} scroll={{ x: 1210 }} pagination={{ pageSize: 5, showSizeChanger: true, showTotal: total => `共 ${total} 条` }} /> : <Empty description="没有符合条件的商品" />}
    </Card>
    <Drawer title={editing ? '编辑商品' : '新增商品'} size={560} open={drawerOpen} onClose={() => setDrawerOpen(false)} extra={<Space><Button onClick={() => setDrawerOpen(false)}>取消</Button><Button type="primary" onClick={save}>保存</Button></Space>}><Form form={form} layout="vertical"><Form.Item name="name" label="商品名称" rules={[{ required: true, message: '请输入商品名称' }]}><Input /></Form.Item><Form.Item name="code" label="商品编码" rules={[{ required: true, message: '请输入商品编码' }]}><Input placeholder="例如 SPU-2026004" /></Form.Item><Form.Item name="category" label="所属品类" rules={[{ required: true, message: '请选择品类' }]}><Select options={['生活用品','旅行用品','办公用品'].map(value => ({ value, label: value }))}/></Form.Item><Form.Item name="specification" label="默认规格" rules={[{ required: true, message: '请输入默认规格' }]}><Input placeholder="例如 曜石黑 / 500ml" /></Form.Item><Form.Item name="price" label="销售价格（元）" rules={[{ required: true, message: '请输入销售价格' }]}><InputNumber min={0.01} precision={2} style={{ width: '100%' }} /></Form.Item><Form.Item name="stock" label="可售库存" rules={[{ required: true, message: '请输入库存' }]}><InputNumber min={0} precision={0} style={{ width: '100%' }} /></Form.Item><Form.Item name="status" label="销售状态" rules={[{ required: true }]}><Select options={['销售中','已下架'].map(value => ({ value, label: value }))}/></Form.Item></Form></Drawer>
    <Modal title="商品详情" open={Boolean(detail)} onCancel={() => setDetail(undefined)} footer={<Button type="primary" onClick={() => setDetail(undefined)}>关闭</Button>} width={720}>{detail && <Descriptions column={2} bordered items={[{ label: '商品名称', children: detail.name }, { label: '状态', children: <Tag color={detail.status === '销售中' ? 'success' : 'default'}>{detail.status}</Tag> }, { label: '商品编码', children: detail.code }, { label: '所属品类', children: detail.category }, { label: '默认规格', children: detail.specification }, { label: '销售价格', children: `¥${detail.price.toFixed(2)}` }, { label: '可售库存', children: `${detail.stock} 件` }, { label: '更新时间', children: detail.updatedAt }]}/>}</Modal>
  </div>;
}
