import { ArrowRightOutlined, CheckCircleOutlined, ClockCircleOutlined, TeamOutlined, UserAddOutlined } from '@ant-design/icons';
import { Button, Card, Col, Flex, Progress, Row, Statistic, Tag, Typography } from 'antd';

export function DashboardPage({ onOpenEmployees }: { onOpenEmployees: () => void }) {
  const stats = [
    { title: '员工总数', value: 1286, suffix: '人', icon: <TeamOutlined />, color: '#2A56DE' },
    { title: '本月入职', value: 36, suffix: '人', icon: <UserAddOutlined />, color: '#52c41a' },
    { title: '待完善资料', value: 18, suffix: '项', icon: <ClockCircleOutlined />, color: '#faad14' },
    { title: '资料完整率', value: 96.8, suffix: '%', icon: <CheckCircleOutlined />, color: '#722ed1' },
  ];
  return <div className="page-stack">
    <Flex justify="space-between" align="end"><div><Typography.Title level={1}>工作台</Typography.Title><Typography.Text type="secondary">下午好，陈产品。这里是组织数据概览。</Typography.Text></div><Button type="primary" onClick={onOpenEmployees}>进入员工管理 <ArrowRightOutlined /></Button></Flex>
    <Row gutter={[16, 16]}>{stats.map(item => <Col xs={24} sm={12} xl={6} key={item.title}><Card className="compact-stat-card"><Flex align="center" justify="space-between" gap={14}><Statistic title={item.title} value={item.value} suffix={item.suffix} precision={item.title === '资料完整率' ? 1 : 0} /><div className="metric-icon" style={{ color: item.color, background: `${item.color}12` }}>{item.icon}</div></Flex></Card></Col>)}</Row>
    <Row gutter={[16, 16]}>
      <Col xs={24} xl={16}><Card title="部门人数分布" extra={<Button type="link">查看详情</Button>}><div className="chart-placeholder">{[['研发中心',82],['生产中心',68],['营销中心',54],['职能中心',38]].map(([name, percent]) => <div className="chart-row" key={name}><span>{name}</span><Progress percent={Number(percent)} showInfo={false}/><strong>{Math.round(Number(percent) * 3.2)} 人</strong></div>)}</div></Card></Col>
      <Col xs={24} xl={8}><Card title="最新动态"><div className="activity-list">{['张悦完成员工资料认证','李明加入研发中心','市场部完成组织调整','王芳提交转正申请'].map((item, index) => <Flex className="activity-item" align="center" justify="space-between" gap={12} key={item}><span className="activity-dot" /><div className="activity-copy"><Typography.Text>{item}</Typography.Text><Typography.Text type="secondary">{index + 1} 小时前</Typography.Text></div><Tag color={index === 0 ? 'success' : 'blue'}>{index === 0 ? '已完成' : '已更新'}</Tag></Flex>)}</div></Card></Col>
    </Row>
  </div>;
}
