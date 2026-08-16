import { useMemo, useState } from 'react';
import { BookOutlined, EyeOutlined, LikeOutlined, PlusOutlined } from '@ant-design/icons';
import { App, Avatar, Button, Card, Col, Empty, Flex, Input, Modal, Row, Select, Space, Tag, Typography } from 'antd';
import { ListPageHeading, SearchField, SearchPanel } from '../../../shared/ui/ListPage';

interface Article { id: number; title: string; summary: string; category: string; author: string; status: '已发布' | '草稿' | '审核中'; views: number; likes: number; color: string }
const articles: Article[] = [
  { id: 1, title: '把工作日过成有能量的一天', summary: '从午间散步、专注休息到下班运动，分享可持续的职场活力习惯。', category: '健康生活', author: '林晓', status: '已发布', views: 3280, likes: 186, color: '#1677ff' },
  { id: 2, title: '新员工的第一个 30 天', summary: '一份来自同事的入职地图，帮助新伙伴更快认识组织与协作方式。', category: '成长学习', author: '陈一', status: '审核中', views: 860, likes: 42, color: '#722ed1' },
  { id: 3, title: '城市周末骑行路线推荐', summary: '精选三条不同强度的城市骑行路线，适合兴趣小组周末组队体验。', category: '兴趣社群', author: '周宁', status: '草稿', views: 0, likes: 0, color: '#13c2c2' },
  { id: 4, title: '本月员工福利使用指南', summary: '餐饮、运动、学习福利一站式说明，让每位员工都能快速找到所需权益。', category: '福利指南', author: '苏然', status: '已发布', views: 5190, likes: 264, color: '#fa8c16' },
];

export function ArticlePage() {
  const { message } = App.useApp();
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState<string>();
  const [status, setStatus] = useState<string>();
  const [preview, setPreview] = useState<Article>();
  const filtered = useMemo(() => articles.filter(item => (!keyword || `${item.title}${item.author}`.includes(keyword)) && (!category || item.category === category) && (!status || item.status === status)), [keyword, category, status]);
  return <div className="page-stack">
    <ListPageHeading paths={['员工体验', '内容运营', '文章管理']} title="文章管理" subtitle="以卡片形式运营员工内容、知识与福利资讯。" />
    <SearchPanel fieldCount={3} onSearch={() => message.success('查询完成')} onReset={() => { setKeyword(''); setCategory(undefined); setStatus(undefined); }}><SearchField label="文章标题"><Input allowClear value={keyword} onChange={event => setKeyword(event.target.value)} placeholder="请输入标题或作者" /></SearchField><SearchField label="内容分类"><Select allowClear value={category} onChange={setCategory} placeholder="全部分类" options={['健康生活','成长学习','兴趣社群','福利指南'].map(value => ({ value, label: value }))}/></SearchField><SearchField label="发布状态"><Select allowClear value={status} onChange={setStatus} placeholder="全部状态" options={['已发布','草稿','审核中'].map(value => ({ value, label: value }))}/></SearchField></SearchPanel>
    <Card><div className="table-toolbar"><Space><Button type="primary" icon={<PlusOutlined />} onClick={() => message.info('Demo：打开文章编辑器')}>新建文章</Button><Button onClick={() => message.info('Demo：已切换排序')}>最近更新</Button></Space></div>{filtered.length ? <Row gutter={[16,16]}>{filtered.map(item => <Col xs={24} md={12} xl={8} key={item.id}><Card hoverable className="article-card" cover={<div className="article-cover" style={{ background: `linear-gradient(135deg, ${item.color}, ${item.color}99)` }}><BookOutlined /><span>{item.category}</span></div>}><Flex className="article-title-row" justify="space-between" align="center" gap={8}><Typography.Title level={4} title={item.title}>{item.title}</Typography.Title><Tag color={item.status === '已发布' ? 'success' : item.status === '审核中' ? 'processing' : 'default'}>{item.status}</Tag></Flex><Typography.Paragraph className="article-summary" type="secondary" title={item.summary}>{item.summary}</Typography.Paragraph><Flex className="article-meta" justify="space-between" align="center"><Space size={6}><Avatar size={20}>{item.author[0]}</Avatar><Typography.Text type="secondary">{item.author}</Typography.Text></Space><Space size={10}><span><EyeOutlined /> {item.views}</span><span><LikeOutlined /> {item.likes}</span><Button type="link" size="small" onClick={() => setPreview(item)}>预览</Button></Space></Flex></Card></Col>)}</Row> : <Empty description="没有符合条件的文章" />}</Card>
    <Modal title="文章预览" open={Boolean(preview)} onCancel={() => setPreview(undefined)} footer={<><Button type="primary" onClick={() => message.success('文章已发布')}>发布文章</Button><Button onClick={() => setPreview(undefined)}>关闭</Button></>} width={720}>{preview && <><Tag color="blue">{preview.category}</Tag><Typography.Title level={2}>{preview.title}</Typography.Title><Typography.Paragraph type="secondary">作者：{preview.author}</Typography.Paragraph><Typography.Paragraph>{preview.summary}</Typography.Paragraph><Typography.Paragraph>这里展示文章正文预览区域，可承载富文本、图片、附件与关联活动。</Typography.Paragraph></>}</Modal>
  </div>;
}
