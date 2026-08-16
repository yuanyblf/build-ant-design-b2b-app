import { CheckCircleFilled, CopyOutlined, PrinterOutlined } from '@ant-design/icons';
import { App, Breadcrumb, Button, Card, Col, Descriptions, Flex, Row, Space, Steps, Table, Tag, Timeline, Typography } from 'antd';
import type { Order } from './OrderPage';

export function OrderDetailPage({ order, onBack }: { order: Order; onBack: () => void }) {
  const { message } = App.useApp();
  const current = order.status === '待付款' ? 0 : order.status === '已支付' ? 1 : order.status === '已发货' ? 2 : 3;
  return <div className="page-stack order-detail-page">
    <Breadcrumb className="detail-breadcrumb" separator=">" items={[{ title: '订单管理' }, { title: <Button type="link" size="small" className="breadcrumb-link" onClick={onBack}>订单列表</Button> }, { title: `订单 ${order.no}` }]} />
    <Flex className="detail-title-row" justify="space-between" align="center" gap={16} wrap="wrap"><div><Flex align="center" gap={12} wrap="wrap"><Typography.Title level={1}>订单 {order.no}</Typography.Title><Tag color={order.status === '已支付' ? 'processing' : order.status === '已发货' ? 'cyan' : 'success'}>{order.status}</Tag></Flex><Typography.Text type="secondary">创建于 {order.createdAt} · 最近更新于 2 分钟前</Typography.Text></div><Space><Button type="primary">处理订单</Button><Button icon={<CopyOutlined />} onClick={() => message.success('订单链接已复制')}>复制链接</Button><Button icon={<PrinterOutlined />} onClick={() => message.info('Demo：打印任务已创建')}>打印订单</Button></Space></Flex>
    <Card><Steps current={current} items={[{ title: '提交订单', description: order.createdAt }, { title: '支付成功', description: current >= 1 ? '2026-08-15 10:35' : '等待客户支付' }, { title: '商品发货', description: current >= 2 ? '2026-08-15 15:20' : '等待仓库处理' }, { title: '交易完成', description: current >= 3 ? '2026-08-16 18:30' : '等待客户收货' }]}/></Card>
    <Row gutter={[16, 16]}>
      <Col xs={24} xl={16}><Space direction="vertical" size={16} style={{ width: '100%' }}>
        <Card title="商品明细"><Table rowKey="sku" pagination={false} dataSource={[{ sku: 'SKU-BOTTLE-BK-500', product: order.product, price: order.amount / order.quantity, quantity: order.quantity, subtotal: order.amount }]} columns={[{ title: '商品', dataIndex: 'product' }, { title: 'SKU', dataIndex: 'sku' }, { title: '单价', dataIndex: 'price', align: 'right', render: value => `¥${value.toFixed(2)}` }, { title: '数量', dataIndex: 'quantity', align: 'right' }, { title: '小计', dataIndex: 'subtotal', align: 'right', render: value => <strong>¥{value.toFixed(2)}</strong> }]}/><div className="order-total"><span>商品金额</span><span>¥{order.amount.toFixed(2)}</span><span>运费</span><span>¥0.00</span><strong>实付金额</strong><Typography.Title level={4}>¥{order.amount.toFixed(2)}</Typography.Title></div></Card>
        <Card title="支付与退款"><Descriptions column={2} items={[{ label: '支付方式', children: '微信支付' }, { label: '支付流水号', children: 'WX20260815103589271' }, { label: '支付时间', children: '2026-08-15 10:35:22' }, { label: '支付状态', children: <Tag icon={<CheckCircleFilled />} color="success">支付成功</Tag> }, { label: '退款金额', children: '¥0.00' }, { label: '开票状态', children: '未申请' }]}/></Card>
        <Card title="操作记录"><Timeline items={[{ color: 'blue', children: <><strong>订单支付成功</strong><br/><Typography.Text type="secondary">系统 · 2026-08-15 10:35:22</Typography.Text></> }, { children: <><strong>客户提交订单</strong><br/><Typography.Text type="secondary">小程序 · 2026-08-15 10:32:08</Typography.Text></> }, { color: 'gray', children: <><strong>订单创建</strong><br/><Typography.Text type="secondary">系统 · 2026-08-15 10:32:07</Typography.Text></> }]}/></Card>
      </Space></Col>
      <Col xs={24} xl={8}><Space direction="vertical" size={16} style={{ width: '100%' }}>
        <Card title="客户信息"><Descriptions column={1} items={[{ label: '客户姓名', children: order.customer }, { label: '联系电话', children: order.phone }, { label: '客户编号', children: 'C2025041826' }, { label: '历史订单', children: <Button type="link" className="inline-link">共 6 笔订单</Button> }]}/></Card>
        <Card title="收货信息"><Descriptions column={1} items={[{ label: '收货人', children: order.customer }, { label: '联系电话', children: order.phone }, { label: '收货地址', children: order.address }, { label: '买家留言', children: '工作日送达，送货前请电话联系。' }]}/></Card>
        <Card title="物流信息"><Descriptions column={1} items={[{ label: '配送方式', children: order.carrier ?? '普通快递' }, { label: '快递单号', children: order.trackingNo ?? '待发货后生成' }, { label: '仓库', children: '华东一号仓' }, { label: '包裹状态', children: order.trackingNo ? <Tag color="cyan">运输中</Tag> : <Tag>待发货</Tag> }]}/></Card>
        <Card title="订单备注"><Typography.Paragraph>重点客户订单，出库前请检查商品外包装。</Typography.Paragraph><Button block>编辑备注</Button></Card>
      </Space></Col>
    </Row>
  </div>;
}
