import { useMemo, useState } from 'react';
import { InboxOutlined } from '@ant-design/icons';
import { App, Button, Card, DatePicker, Descriptions, Drawer, Empty, Flex, Form, Input, InputNumber, Modal, Popconfirm, Select, Space, Table, Tag, Typography, Upload } from 'antd';
import type { TableColumnsType } from 'antd';
import { ListPageHeading, SearchField, SearchPanel } from '../../../shared/ui/ListPage';

export type OrderStatus = '待付款' | '已支付' | '已发货' | '已完成' | '退款中' | '已退款';
export interface Order { id: number; no: string; customer: string; phone: string; product: string; quantity: number; amount: number; status: OrderStatus; createdAt: string; address: string; carrier?: string; trackingNo?: string }
const initialOrders: Order[] = [
  { id: 1, no: 'SO202608150001', customer: '林晓', phone: '138****1028', product: '轻享保温杯 · 曜石黑 / 500ml', quantity: 2, amount: 258, status: '已支付', createdAt: '2026-08-15 10:32', address: '上海市浦东新区张江路 88 号' },
  { id: 2, no: 'SO202608150002', customer: '周宁', phone: '136****7712', product: '云感旅行枕 · 雾霾蓝', quantity: 1, amount: 89, status: '待付款', createdAt: '2026-08-15 11:08', address: '浙江省杭州市余杭区未来科技城' },
  { id: 3, no: 'SO202608140018', customer: '陈一', phone: '139****4266', product: '桌面收纳套装 · 暖白', quantity: 1, amount: 159, status: '已发货', createdAt: '2026-08-14 16:40', address: '广东省深圳市南山区科技园', carrier: '顺丰速运', trackingNo: 'SF1538027419' },
  { id: 4, no: 'SO202608130026', customer: '许安', phone: '137****3309', product: '轻享保温杯 · 云雾白 / 500ml', quantity: 1, amount: 129, status: '已完成', createdAt: '2026-08-13 09:18', address: '北京市朝阳区望京街道' },
  { id: 5, no: 'SO202608120011', customer: '苏然', phone: '135****9651', product: '云感旅行枕 · 深空灰', quantity: 2, amount: 178, status: '退款中', createdAt: '2026-08-12 14:25', address: '江苏省南京市建邺区奥体大街' },
];
const statusColor: Record<OrderStatus, string> = { 待付款: 'default', 已支付: 'processing', 已发货: 'cyan', 已完成: 'success', 退款中: 'warning', 已退款: 'default' };

export function OrderPage({ statusFilter, onOpenDetail }: { statusFilter?: OrderStatus; onOpenDetail?: (order: Order) => void }) {
  const { message } = App.useApp();
  const [data, setData] = useState(initialOrders);
  const [keyword, setKeyword] = useState('');
  const [detail, setDetail] = useState<Order>();
  const [shipping, setShipping] = useState<Order>();
  const [refunding, setRefunding] = useState<Order>();
  const [shipForm] = Form.useForm<{ carrier: string; trackingNo: string }>();
  const [refundForm] = Form.useForm<{ amount: number; reason: string }>();
  const filtered = useMemo(() => data.filter(item => (!statusFilter || item.status === statusFilter) && (!keyword || `${item.no}${item.customer}${item.product}`.includes(keyword))), [data, keyword, statusFilter]);
  const ship = async () => { const values = await shipForm.validateFields(); if (!shipping) return; setData(list => list.map(item => item.id === shipping.id ? { ...item, ...values, status: '已发货' } : item)); setShipping(undefined); shipForm.resetFields(); message.success('发货成功，快递信息已保存'); };
  const refund = async () => { const values = await refundForm.validateFields(); if (!refunding) return; setData(list => list.map(item => item.id === refunding.id ? { ...item, status: '退款中' } : item)); setRefunding(undefined); refundForm.resetFields(); message.success(`退款申请已提交：¥${values.amount.toFixed(2)}`); };
  const columns: TableColumnsType<Order> = [
    { title: '订单号', dataIndex: 'no', fixed: 'left', width: 165, render: (value, record) => <Button type="link" className="table-link" onClick={() => onOpenDetail ? onOpenDetail(record) : setDetail(record)}>{value}</Button> },
    { title: '客户', dataIndex: 'customer', width: 100 }, { title: '商品', dataIndex: 'product', width: 230 }, { title: '数量', dataIndex: 'quantity', width: 80, align: 'right' },
    { title: '实付金额', dataIndex: 'amount', width: 110, align: 'right', render: value => `¥${value.toFixed(2)}` }, { title: '状态', dataIndex: 'status', width: 100, render: value => <Tag color={statusColor[value as OrderStatus]}>{value}</Tag> },
    { title: '下单时间', dataIndex: 'createdAt', width: 155 },
    { title: '操作', key: 'action', fixed: 'right', width: 210, render: (_, record) => <Space><Button type="link" onClick={() => setDetail(record)}>详情</Button>{record.status === '已支付' && <Button type="link" onClick={() => { shipForm.resetFields(); setShipping(record); }}>发货</Button>}{(['已支付','已发货'] as OrderStatus[]).includes(record.status) && <Button type="link" danger onClick={() => { refundForm.setFieldsValue({ amount: record.amount }); setRefunding(record); }}>退款</Button>}{record.status === '退款中' && <Popconfirm title={`确认完成订单 ${record.no} 的退款？`} description={`将原路退回 ¥${record.amount.toFixed(2)}，完成后不可撤销。`} onConfirm={() => { setData(list => list.map(item => item.id === record.id ? { ...item, status: '已退款' } : item)); message.success('退款处理完成'); }}><Button type="link" danger>退款处理</Button></Popconfirm>}</Space> },
  ];
  const title = statusFilter ? `${statusFilter}订单` : '全部订单';
  return <div className="page-stack">
    <ListPageHeading paths={['订单管理', title]} title={title} subtitle="按订单状态查询，并处理发货与退款业务。" />
    <SearchPanel fieldCount={5} onSearch={() => message.success('查询完成')} onReset={() => setKeyword('')}><SearchField label="订单号"><Input allowClear placeholder="请输入订单号" value={keyword} onChange={e => setKeyword(e.target.value)} /></SearchField><SearchField label="客户"><Input allowClear placeholder="请输入客户姓名" /></SearchField><SearchField label="商品"><Input allowClear placeholder="请输入商品名称" /></SearchField><SearchField label="实付金额"><InputNumber min={0} precision={2} placeholder="最低金额" style={{ width: '100%' }} /></SearchField><SearchField label="下单时间"><DatePicker.RangePicker style={{ width: '100%' }} /></SearchField></SearchPanel>
    <Card><div className="table-toolbar"><Button onClick={() => message.info('Demo：导出任务已创建')}>导出订单</Button></div>{filtered.length ? <Table rowKey="id" columns={columns} dataSource={filtered} scroll={{ x: 1150 }} pagination={{ pageSize: 6, showSizeChanger: true, showTotal: total => `共 ${total} 条` }} /> : <Empty description={`暂无${title}`} />}</Card>
    <Drawer title="订单详情" size={640} open={Boolean(detail)} onClose={() => setDetail(undefined)} extra={<Button onClick={() => setDetail(undefined)}>关闭</Button>}>{detail && <><Descriptions column={2} bordered items={[{ label: '订单号', children: detail.no, span: 2 }, { label: '订单状态', children: <Tag color={statusColor[detail.status]}>{detail.status}</Tag> }, { label: '下单时间', children: detail.createdAt }, { label: '客户姓名', children: detail.customer }, { label: '联系电话', children: detail.phone }, { label: '商品', children: detail.product, span: 2 }, { label: '数量', children: `${detail.quantity} 件` }, { label: '实付金额', children: `¥${detail.amount.toFixed(2)}` }, { label: '收货地址', children: detail.address, span: 2 }, ...(detail.trackingNo ? [{ label: '物流信息', children: `${detail.carrier} / ${detail.trackingNo}`, span: 2 }] : []) ]}/></>}</Drawer>
    <Modal title={`订单发货 · ${shipping?.no ?? ''}`} open={Boolean(shipping)} onCancel={() => setShipping(undefined)} onOk={ship} okText="确认发货" width={600}><Typography.Paragraph type="secondary">请核对收货地址并上传快递信息。确认后订单状态将变为“已发货”。</Typography.Paragraph>{shipping && <Card size="small" className="modal-summary">{shipping.customer} · {shipping.phone}<br />{shipping.address}</Card>}<Form form={shipForm} layout="horizontal" className="edit-form"><Form.Item name="carrier" label="快递公司" rules={[{ required: true, message: '请选择快递公司' }]}><Select options={['顺丰速运','京东物流','中通快递','圆通速递','申通快递'].map(value => ({ value, label: value }))}/></Form.Item><Form.Item name="trackingNo" label="快递单号" rules={[{ required: true, message: '请输入快递单号' }, { min: 8, message: '快递单号至少 8 位' }]}><Input /></Form.Item><Form.Item label="快递凭证（选填）" extra="支持上传面单照片；Demo 不会上传至服务器。"><Upload.Dragger beforeUpload={() => false} maxCount={1} accept="image/*,.pdf"><p className="ant-upload-drag-icon"><InboxOutlined /></p><p>点击或拖拽上传快递面单</p></Upload.Dragger></Form.Item></Form></Modal>
    <Modal title={`发起退款 · ${refunding?.no ?? ''}`} open={Boolean(refunding)} onCancel={() => setRefunding(undefined)} onOk={refund} okText="确认提交退款" okButtonProps={{ danger: true }}><Typography.Paragraph type="secondary">提交后订单进入“退款中”，需由有权限的人员完成最终退款。</Typography.Paragraph><Form form={refundForm} layout="horizontal" className="edit-form"><Form.Item name="amount" label="退款金额（元）" rules={[{ required: true, message: '请输入退款金额' }]}><InputNumber min={0.01} max={refunding?.amount} precision={2} style={{ width: '100%' }} /></Form.Item><Form.Item name="reason" label="退款原因" rules={[{ required: true, message: '请输入退款原因' }]}><Input.TextArea rows={4} maxLength={200} showCount /></Form.Item></Form></Modal>
  </div>;
}
