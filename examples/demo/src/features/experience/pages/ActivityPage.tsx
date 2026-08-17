import { useMemo, useState } from 'react';
import { CalendarOutlined, PlusOutlined, TeamOutlined, TrophyOutlined } from '@ant-design/icons';
import { App, Button, Card, Col, DatePicker, Flex, Input, Progress, Row, Select, Space, Statistic, Table, Tag } from 'antd';
import { ListPageHeading, SearchField, SearchPanel } from '../../../shared/ui/ListPage';

interface Activity { id: number; name: string; type: string; date: string; capacity: number; enrolled: number; checkIn: number; status: '报名中' | '进行中' | '已结束' }
const activityData: Activity[] = [
  { id: 1, name: '城市夜跑挑战赛', type: '运动健康', date: '2026-08-22', capacity: 120, enrolled: 96, checkIn: 0, status: '报名中' },
  { id: 2, name: 'AI 效率工作坊', type: '成长学习', date: '2026-08-18', capacity: 60, enrolled: 60, checkIn: 48, status: '进行中' },
  { id: 3, name: '亲子自然探索日', type: '家庭关怀', date: '2026-08-10', capacity: 80, enrolled: 72, checkIn: 68, status: '已结束' },
];

export function ActivityPage() {
  const { message } = App.useApp();
  const [keyword, setKeyword] = useState('');
  const [status, setStatus] = useState<string>();
  const filtered = useMemo(() => activityData.filter(item => (!keyword || item.name.includes(keyword)) && (!status || item.status === status)), [keyword, status]);
  return <div className="page-stack">
    <ListPageHeading paths={['员工体验', '活动运营', '活动管理']} title="活动管理" subtitle="管理活动报名、容量、签到与完成进度。" />
    <Row gutter={[16,16]}><Col xs={24} md={8}><Card className="compact-stat-card"><Flex align="center" justify="space-between" gap={14}><Statistic title="本月活动" value={12} suffix="场" /><div className="compact-stat-logo blue"><CalendarOutlined /></div></Flex></Card></Col><Col xs={24} md={8}><Card className="compact-stat-card"><Flex align="center" justify="space-between" gap={14}><Statistic title="累计报名" value={628} suffix="人次" /><div className="compact-stat-logo purple"><TeamOutlined /></div></Flex></Card></Col><Col xs={24} md={8}><Card className="compact-stat-card"><Flex align="center" justify="space-between" gap={14}><Statistic title="平均参与率" value={86.4} precision={1} suffix="%" /><div className="compact-stat-logo orange"><TrophyOutlined /></div></Flex></Card></Col></Row>
    <SearchPanel onSearch={() => message.success('查询完成')} onReset={() => { setKeyword(''); setStatus(undefined); }}><SearchField label="活动名称"><Input allowClear value={keyword} onChange={event => setKeyword(event.target.value)} placeholder="请输入活动名称" /></SearchField><SearchField label="活动状态"><Select allowClear value={status} onChange={setStatus} placeholder="全部状态" options={['报名中','进行中','已结束'].map(value => ({ value, label: value }))}/></SearchField><SearchField label="活动日期"><DatePicker.RangePicker style={{ width: '100%' }} /></SearchField></SearchPanel>
    <Card><div className="table-toolbar"><Space><Button type="primary" icon={<PlusOutlined />} onClick={() => message.info('Demo：打开活动创建表单')}>创建活动</Button><Button>导出报名数据</Button></Space></div><Table rowKey="id" dataSource={filtered} pagination={false} columns={[{ title: '活动名称', dataIndex: 'name', render: value => <Button type="link" className="table-link">{value}</Button> }, { title: '类型', dataIndex: 'type' }, { title: '活动日期', dataIndex: 'date' }, { title: '报名进度', width: 220, render: (_, record) => <Flex align="center" gap={10}><Progress percent={Math.round(record.enrolled / record.capacity * 100)} size="small" style={{ width: 130 }} /><span>{record.enrolled}/{record.capacity}</span></Flex> }, { title: '签到人数', dataIndex: 'checkIn', align: 'right' }, { title: '状态', dataIndex: 'status', render: value => <Tag color={value === '报名中' ? 'processing' : value === '进行中' ? 'warning' : 'success'}>{value}</Tag> }, { title: '操作', fixed: 'right', render: (_, record) => <Space><Button type="link">详情</Button><Button type="link">{record.status === '报名中' ? '报名管理' : '数据复盘'}</Button></Space> }]}/></Card>
  </div>;
}
