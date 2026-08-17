import { useMemo, useState } from 'react';
import { BookOutlined, CalendarOutlined, CheckCircleOutlined, ClockCircleOutlined, FileAddOutlined, PlayCircleOutlined, PlusOutlined, ReadOutlined, TeamOutlined, UploadOutlined } from '@ant-design/icons';
import { App, Breadcrumb, Button, Card, Col, DatePicker, Descriptions, Flex, Form, Input, InputNumber, Progress, Row, Select, Space, Statistic, Table, Tag, Timeline, Tree, Typography, Upload } from 'antd';
import { ListPageHeading, SearchField, SearchPanel } from '../../../shared/ui/ListPage';

type TrainingPageMode = 'courses' | 'course-detail' | 'course-create' | 'course-categories' | 'training-plans' | 'learning-records';
interface Course { id: number; title: string; summary: string; category: string; lecturer: string; status: '已发布' | '草稿' | '已下架'; learners: number; lessons: number; progress: number; color: string }

const courses: Course[] = [
  { id: 1, title: '高效沟通与跨部门协作', summary: '通过真实协作案例掌握倾听、反馈和冲突处理方法。', category: '通用能力', lecturer: '林晓', status: '已发布', learners: 328, lessons: 8, progress: 76, color: '#1677ff' },
  { id: 2, title: '新任管理者成长训练营', summary: '从角色转变到目标管理，帮助新任管理者完成能力跃迁。', category: '领导力', lecturer: '周宁', status: '已发布', learners: 186, lessons: 12, progress: 61, color: '#722ed1' },
  { id: 3, title: '信息安全与数据保护必修课', summary: '覆盖账号安全、敏感数据和常见办公风险的基础课程。', category: '合规必修', lecturer: '安全团队', status: '草稿', learners: 0, lessons: 6, progress: 0, color: '#13c2c2' },
  { id: 4, title: '客户体验设计基础', summary: '从用户旅程出发识别关键触点，持续优化服务体验。', category: '专业技能', lecturer: '陈一', status: '已下架', learners: 95, lessons: 7, progress: 88, color: '#fa8c16' },
];

export function TrainingPages({ mode, onNavigate }: { mode: TrainingPageMode; onNavigate: (page: string) => void }) {
  if (mode === 'course-detail') return <CourseDetail onBack={() => onNavigate('training-courses')} />;
  if (mode === 'course-create') return <CourseForm onBack={() => onNavigate('training-courses')} />;
  if (mode === 'training-plans') return <TrainingPlanPage />;
  if (mode === 'learning-records') return <LearningRecordPage />;
  if (mode === 'course-categories') return <CourseCategoryPage />;
  return <CourseList onNavigate={onNavigate} />;
}

function CourseList({ onNavigate }: { onNavigate: (page: string) => void }) {
  const { message } = App.useApp();
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState<string>();
  const [status, setStatus] = useState<string>();
  const filtered = useMemo(() => courses.filter(item => (!keyword || `${item.title}${item.lecturer}`.includes(keyword)) && (!category || item.category === category) && (!status || item.status === status)), [keyword, category, status]);
  return <div className="page-stack">
    <ListPageHeading paths={['培训课程', '课程运营', '课程管理']} title="课程管理" subtitle="建设企业课程内容并管理课程发布状态。" />
    <SearchPanel onSearch={() => message.success(`找到 ${filtered.length} 门课程`)} onReset={() => { setKeyword(''); setCategory(undefined); setStatus(undefined); }}>
      <SearchField label="课程名称"><Input allowClear value={keyword} onChange={event => setKeyword(event.target.value)} placeholder="请输入课程或讲师" /></SearchField>
      <SearchField label="课程分类"><Select allowClear value={category} onChange={setCategory} placeholder="全部分类" options={['通用能力','领导力','合规必修','专业技能'].map(value => ({ value, label: value }))} /></SearchField>
      <SearchField label="课程状态"><Select allowClear value={status} onChange={setStatus} placeholder="全部状态" options={['已发布','草稿','已下架'].map(value => ({ value, label: value }))} /></SearchField>
      <SearchField label="发布时间"><DatePicker.RangePicker style={{ width: '100%' }} /></SearchField>
    </SearchPanel>
    <Card><div className="table-toolbar"><Space><Button type="primary" icon={<PlusOutlined />} onClick={() => onNavigate('training-course-create')}>新建课程</Button><Button onClick={() => message.info('已进入批量分类模式')}>批量调整分类</Button></Space></div>
      <Row gutter={[16,16]}>{filtered.map(course => <Col xs={24} md={12} xl={8} key={course.id}><Card hoverable className="article-card training-card" cover={<div className="article-cover" style={{ background: `linear-gradient(135deg, ${course.color}, ${course.color}99)` }}><PlayCircleOutlined /><span>{course.category}</span></div>} onClick={() => onNavigate('training-course-detail')}><Flex className="article-title-row" justify="space-between" align="center" gap={8}><Typography.Title level={4} title={course.title}>{course.title}</Typography.Title><Tag color={course.status === '已发布' ? 'success' : course.status === '草稿' ? 'default' : 'warning'}>{course.status}</Tag></Flex><Typography.Paragraph className="article-summary" type="secondary" title={course.summary}>{course.summary}</Typography.Paragraph><Flex className="article-meta" justify="space-between"><span>{course.lecturer} · {course.lessons} 课时</span><Button type="link" size="small">查看详情</Button></Flex></Card></Col>)}</Row>
    </Card>
  </div>;
}

function CourseDetail({ onBack }: { onBack: () => void }) {
  const { message } = App.useApp();
  return <div className="page-stack order-detail-page">
    <Breadcrumb className="detail-breadcrumb" separator=">" items={[{ title: '培训课程' }, { title: <Button type="link" className="breadcrumb-link" onClick={onBack}>课程管理</Button> }, { title: '高效沟通与跨部门协作' }]} />
    <Flex className="detail-title-row" justify="space-between" align="center" wrap="wrap" gap={16}><div><Flex align="center" gap={12}><Typography.Title level={1}>高效沟通与跨部门协作</Typography.Title><Tag color="success">已发布</Tag></Flex><Typography.Text type="secondary">课程编号 KC-2026-008 · 最近更新于 2026-08-15</Typography.Text></div><Space><Button type="primary" onClick={() => message.success('已发布最新版本')}>发布新版本</Button><Button>编辑课程</Button><Button>下架课程</Button></Space></Flex>
    <Row gutter={[16,16]}>{[{ title:'报名人数',value:328,icon:<TeamOutlined/>},{ title:'完成人数',value:249,icon:<CheckCircleOutlined/>},{ title:'平均学习时长',value:96,suffix:'分钟',icon:<ClockCircleOutlined/>},{ title:'完成率',value:76,suffix:'%',icon:<ReadOutlined/>}].map(item => <Col xs={24} sm={12} xl={6} key={item.title}><Card className="compact-stat-card"><Flex justify="space-between" align="center"><Statistic title={item.title} value={item.value} suffix={item.suffix} valueStyle={{ fontWeight: 400 }} /><div className="compact-stat-logo blue">{item.icon}</div></Flex></Card></Col>)}</Row>
    <Row gutter={[16,16]}><Col xs={24} xl={16}><Space direction="vertical" size={16} style={{width:'100%'}}><Card title="课程信息"><Descriptions column={3} items={[{label:'课程分类',children:'通用能力'},{label:'课程讲师',children:'林晓'},{label:'课程课时',children:'8 课时'},{label:'学习方式',children:'线上自学'},{label:'适用对象',children:'全体员工'},{label:'有效期',children:'长期有效'}]} /><Typography.Paragraph>通过案例练习掌握结构化表达、积极倾听、有效反馈与冲突处理方法。</Typography.Paragraph></Card><Card title="章节目录"><Tree defaultExpandAll treeData={[{title:'第一章：建立共同目标',key:'1',children:[{title:'1.1 协作中的目标对齐（12 分钟）',key:'1-1'},{title:'1.2 识别沟通障碍（15 分钟）',key:'1-2'}]},{title:'第二章：倾听与反馈',key:'2',children:[{title:'2.1 积极倾听练习（18 分钟）',key:'2-1'},{title:'2.2 SBI 反馈模型（20 分钟）',key:'2-2'}]},{title:'第三章：冲突处理实战',key:'3'}]} /></Card><Card title="学员学习情况"><Table rowKey="name" pagination={false} dataSource={[{name:'张悦',department:'产品中心',progress:100,status:'已完成'},{name:'李明',department:'研发中心',progress:72,status:'学习中'},{name:'王芳',department:'营销中心',progress:35,status:'学习中'}]} columns={[{title:'员工',dataIndex:'name'},{title:'部门',dataIndex:'department'},{title:'学习进度',dataIndex:'progress',render:value=><Progress percent={value} size="small"/>},{title:'状态',dataIndex:'status',render:value=><Tag color={value==='已完成'?'success':'processing'}>{value}</Tag>}]} /></Card></Space></Col><Col xs={24} xl={8}><Space direction="vertical" size={16} style={{width:'100%'}}><Card title="总体学习进度"><Progress type="circle" percent={76}/><Typography.Paragraph type="secondary" style={{marginTop:16}}>249 人已完成，79 人仍在学习。</Typography.Paragraph></Card><Card title="操作记录"><Timeline items={[{children:'林晓发布课程新版本 · 08-15 10:20'},{children:'系统完成视频转码 · 08-15 09:48'},{children:'陈产品创建课程 · 08-12 16:30'}]} /></Card></Space></Col></Row>
  </div>;
}

function CourseForm({ onBack }: { onBack: () => void }) {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const publish = async () => { try { await form.validateFields(); message.success('课程已保存并发布'); } catch { message.error('请先完成必填信息'); } };
  return <div className="page-stack advanced-form-page"><Breadcrumb separator=">" items={[{title:'培训课程'},{title:'课程管理'},{title:'新建课程'}]} /><Flex align="baseline" gap={16}><Typography.Title level={1}>新建课程</Typography.Title><Typography.Text type="secondary">配置课程内容、章节和学习规则。</Typography.Text></Flex><Form form={form} layout="horizontal" className="edit-form" requiredMark initialValues={{category:'通用能力',method:'线上自学',scope:'全体员工'}}><Card title="基础信息"><Row gutter={16}><Col span={12}><Form.Item label="课程名称" name="name" rules={[{required:true,message:'请输入课程名称'}]} extra="建议不超过 30 个字"><Input placeholder="请输入课程名称" /></Form.Item></Col><Col span={12}><Form.Item label="课程分类" name="category" rules={[{required:true}]}><Select options={['通用能力','领导力','合规必修','专业技能'].map(value=>({value,label:value}))}/></Form.Item></Col><Col span={12}><Form.Item label="课程讲师" name="lecturer" rules={[{required:true,message:'请选择课程讲师'}]}><Select placeholder="请选择讲师" options={[{value:'林晓',label:'林晓'},{value:'周宁',label:'周宁'}]}/></Form.Item></Col><Col span={12}><Form.Item label="学习方式" name="method"><Select options={[{value:'线上自学',label:'线上自学'},{value:'线上直播',label:'线上直播'},{value:'线下培训',label:'线下培训'}]}/></Form.Item><Form.Item label="课程摘要" name="summary" rules={[{required:true,message:'请输入课程摘要'},{max:120}]} extra="用于课程卡片展示，最多 120 字"><Input.TextArea rows={3}/></Form.Item></Col></Row></Card><Card title="封面与课程内容"><Form.Item label="课程封面" name="cover" rules={[{required:true,message:'请上传课程封面'}]} extra="建议尺寸 1200×800，支持 JPG、PNG"><Upload.Dragger maxCount={1} beforeUpload={()=>false}><UploadOutlined style={{fontSize:24}}/><p>点击或拖拽上传课程封面</p></Upload.Dragger></Form.Item><Form.Item label="章节资料" name="files" extra="支持视频、PDF、PPT，发布前需要完成转码"><Upload beforeUpload={()=>false} multiple><Button icon={<FileAddOutlined/>}>添加章节资料</Button></Upload></Form.Item></Card><Card title="学习规则"><Row gutter={16}><Col span={8}><Form.Item label="适用对象" name="scope"><Select options={[{value:'全体员工',label:'全体员工'},{value:'指定部门',label:'指定部门'},{value:'指定员工',label:'指定员工'}]}/></Form.Item></Col><Col span={8}><Form.Item label="课程有效期" name="validity"><DatePicker.RangePicker style={{width:'100%'}}/></Form.Item></Col><Col span={8}><Form.Item label="通过分数" name="score" initialValue={80}><InputNumber min={0} max={100} style={{width:'100%'}} addonAfter="分"/></Form.Item></Col></Row></Card><div className="sticky-form-actions"><Space><Button type="primary" onClick={publish}>保存并发布</Button><Button onClick={() => message.success('草稿已保存')}>保存草稿</Button><Button onClick={onBack}>取消</Button></Space></div></Form></div>;
}

function TrainingPlanPage() {
  const { message } = App.useApp();
  return <div className="page-stack"><ListPageHeading paths={['培训课程','学习运营','培训计划']} title="培训计划" subtitle="组织课程、参与范围和培训周期。"/><SearchPanel onSearch={()=>message.success('查询完成')} onReset={()=>undefined}><SearchField label="计划名称"><Input placeholder="请输入计划名称"/></SearchField><SearchField label="关联课程"><Select placeholder="全部课程" options={courses.map(item=>({value:item.id,label:item.title}))}/></SearchField><SearchField label="计划状态"><Select placeholder="全部状态" options={['待开始','进行中','已结束'].map(value=>({value,label:value}))}/></SearchField><SearchField label="培训日期"><DatePicker.RangePicker style={{width:'100%'}}/></SearchField></SearchPanel><Card><div className="table-toolbar"><Space><Button type="primary" icon={<PlusOutlined/>}>新建计划</Button><Button>批量通知</Button></Space></div><Table rowKey="id" rowSelection={{}} dataSource={[{id:1,name:'2026 新任管理者训练营',course:'新任管理者成长训练营',scope:'新任经理 42 人',date:'08-20 至 09-20',status:'待开始'},{id:2,name:'第三季度信息安全必修',course:'信息安全与数据保护必修课',scope:'全体员工 1,286 人',date:'07-01 至 09-30',status:'进行中'}]} columns={[{title:'计划名称',dataIndex:'name',render:value=><Button type="link" className="inline-link">{value}</Button>},{title:'关联课程',dataIndex:'course'},{title:'参与范围',dataIndex:'scope'},{title:'培训周期',dataIndex:'date'},{title:'状态',dataIndex:'status',render:value=><Tag color={value==='进行中'?'processing':'default'}>{value}</Tag>},{title:'操作',render:()=><Space><Button type="link">详情</Button><Button type="link">复制</Button></Space>}]} /></Card></div>;
}

function CourseCategoryPage() { return <div className="page-stack"><ListPageHeading paths={['培训课程','课程运营','课程分类']} title="课程分类" subtitle="维护课程分类和展示顺序。"/><Card><Tree defaultExpandAll treeData={[{title:'通用能力（18）',key:'1',children:[{title:'沟通协作（6）',key:'1-1'},{title:'办公效率（12）',key:'1-2'}]},{title:'领导力（9）',key:'2'},{title:'专业技能（26）',key:'3'},{title:'合规必修（5）',key:'4'}]}/></Card></div> }
function LearningRecordPage() { return <div className="page-stack"><ListPageHeading paths={['培训课程','学习运营','学习记录']} title="学习记录" subtitle="查看员工课程学习与完成情况。"/><Card><Table rowKey="id" dataSource={[{id:1,name:'张悦',course:'高效沟通与跨部门协作',progress:100,time:'126 分钟',status:'已完成'},{id:2,name:'李明',course:'高效沟通与跨部门协作',progress:72,time:'81 分钟',status:'学习中'}]} columns={[{title:'员工',dataIndex:'name'},{title:'课程',dataIndex:'course'},{title:'进度',dataIndex:'progress',render:value=><Progress percent={value} size="small"/>},{title:'学习时长',dataIndex:'time'},{title:'状态',dataIndex:'status'}]}/></Card></div> }
