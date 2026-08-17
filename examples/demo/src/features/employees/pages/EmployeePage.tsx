import { useMemo, useState, type Key } from 'react';
import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import { App, Button, Card, Descriptions, Drawer, Dropdown, Empty, Flex, Form, Input, Modal, Popconfirm, Select, Space, Table, Tag, Tooltip, Typography } from 'antd';
import type { TableColumnsType } from 'antd';
import { ListPageHeading, SearchField, SearchPanel } from '../../../shared/ui/ListPage';

type Status = '在职' | '试用期' | '停用';
interface Employee { id: number; name: string; code: string; department: string; position: string; phone: string; joinedAt: string; status: Status }
const seed: Employee[] = [
  { id: 1, name: '张悦', code: 'E2024018', department: '研发中心', position: '产品经理', phone: '138 0000 1234', joinedAt: '2024-03-18', status: '在职' },
  { id: 2, name: '李明', code: 'E2024062', department: '研发中心', position: '前端工程师', phone: '139 0000 8821', joinedAt: '2024-06-12', status: '试用期' },
  { id: 3, name: '王芳', code: 'E2023087', department: '人力资源部', position: '招聘专员', phone: '136 0000 5532', joinedAt: '2023-09-04', status: '在职' },
  { id: 4, name: '赵磊', code: 'E2022115', department: '营销中心', position: '客户经理', phone: '137 0000 7631', joinedAt: '2022-11-21', status: '停用' },
  { id: 5, name: '陈晨', code: 'E2025012', department: '生产中心', position: '质量工程师', phone: '135 0000 4810', joinedAt: '2025-02-10', status: '在职' },
];

export function EmployeePage() {
  const { message } = App.useApp();
  const [data, setData] = useState(seed);
  const [keyword, setKeyword] = useState('');
  const [department, setDepartment] = useState<string>();
  const [status, setStatus] = useState<Status>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [detail, setDetail] = useState<Employee>();
  const [form] = Form.useForm<Omit<Employee, 'id'>>();
  const filtered = useMemo(() => data.filter(item => (!keyword || `${item.name}${item.code}${item.phone}`.includes(keyword)) && (!department || item.department === department) && (!status || item.status === status)), [data, keyword, department, status]);
  const columns: TableColumnsType<Employee> = [
    { title: '姓名', dataIndex: 'name', fixed: 'left', width: 110, render: (name, record) => <Button type="link" className="table-link" onClick={() => setDetail(record)}>{name}</Button> },
    { title: '工号', dataIndex: 'code', width: 120 }, { title: '部门', dataIndex: 'department', width: 140 }, { title: '岗位', dataIndex: 'position', width: 150 },
    { title: '手机号', dataIndex: 'phone', width: 150 }, { title: '入职日期', dataIndex: 'joinedAt', width: 120 },
    { title: '状态', dataIndex: 'status', width: 100, render: value => <Tag color={value === '在职' ? 'success' : value === '试用期' ? 'processing' : 'default'}>{value}</Tag> },
    { title: '操作', key: 'action', fixed: 'right', width: 170, render: (_, record) => <Space><Button type="link" onClick={() => setDetail(record)}>查看</Button><Button type="link" onClick={() => { form.setFieldsValue(record); setDrawerOpen(true); }}>编辑</Button><Popconfirm title={`确认停用“${record.name}”？`} description="停用后该员工将无法登录系统。" onConfirm={() => { setData(list => list.map(x => x.id === record.id ? { ...x, status: '停用' } : x)); message.success('员工已停用'); }}><Button type="link" danger disabled={record.status === '停用'}>停用</Button></Popconfirm></Space> },
  ];
  const submit = async () => { const values = await form.validateFields(); setData(list => [{ ...values, id: Date.now() }, ...list]); setDrawerOpen(false); form.resetFields(); message.success('员工信息已保存'); };
  const batchDisable = () => {
    setData(list => list.map(item => selectedRowKeys.includes(item.id) ? { ...item, status: '停用' } : item));
    message.success(`已停用 ${selectedRowKeys.length} 名员工`);
    setSelectedRowKeys([]);
  };
  return <div className="page-stack">
    <ListPageHeading paths={['组织管理', '员工管理']} title="员工管理" subtitle="维护组织成员、岗位与任职状态。" />
    <SearchPanel fieldCount={3} onSearch={() => message.success('查询完成')} onReset={() => { setKeyword(''); setDepartment(undefined); setStatus(undefined); }}><SearchField label="姓名/工号"><Input allowClear placeholder="请输入姓名、工号或手机号" value={keyword} onChange={e => setKeyword(e.target.value)} /></SearchField><SearchField label="部门"><Select allowClear placeholder="全部部门" value={department} onChange={setDepartment} options={['研发中心','生产中心','营销中心','人力资源部'].map(value => ({ value, label: value }))}/></SearchField><SearchField label="状态"><Select allowClear placeholder="全部状态" value={status} onChange={setStatus} options={['在职','试用期','停用'].map(value => ({ value, label: value }))}/></SearchField></SearchPanel>
    <Card><div className="table-toolbar"><Space><Button type="primary" icon={<PlusOutlined />} onClick={() => { form.resetFields(); setDrawerOpen(true); }}>新增员工</Button><Dropdown menu={{ items: [{ key: 'current', label: '导出当前结果' }, { key: 'all', label: '导出全部员工' }], onClick: () => message.info('Demo：导出任务已创建') }}><Button>导出 <DownOutlined /></Button></Dropdown></Space></div>
      {selectedRowKeys.length > 0 && <Flex className="batch-toolbar" align="center" justify="space-between"><Typography.Text>已选择 <strong>{selectedRowKeys.length}</strong> 项</Typography.Text><Space><Popconfirm title={`确认批量停用 ${selectedRowKeys.length} 名员工？`} description="停用后这些员工将无法登录系统。" onConfirm={batchDisable}><Button danger>批量停用</Button></Popconfirm><Button onClick={() => setSelectedRowKeys([])}>取消选择</Button></Space></Flex>}
      {filtered.length ? <Table rowKey="id" rowSelection={{ selectedRowKeys, preserveSelectedRowKeys: true, onChange: setSelectedRowKeys }} columns={columns} dataSource={filtered} scroll={{ x: 1050 }} pagination={{ pageSize: 5, showSizeChanger: true, showTotal: total => `共 ${total} 条` }} /> : <Empty description="没有符合条件的员工"><Button onClick={() => { setKeyword(''); setDepartment(undefined); setStatus(undefined); }}>清除筛选</Button></Empty>}
    </Card>
    <Drawer title="新增／编辑员工" size={560} open={drawerOpen} onClose={() => setDrawerOpen(false)} extra={<Space><Button type="primary" onClick={submit}>保存</Button><Button onClick={() => setDrawerOpen(false)}>取消</Button></Space>}>
      <Form form={form} layout="horizontal" className="edit-form" requiredMark><Form.Item name="name" label="姓名" rules={[{ required: true, message: '请输入员工姓名' }]}><Input placeholder="请输入真实姓名" /></Form.Item><Form.Item name="code" label="工号" rules={[{ required: true, message: '请输入工号' }]}><Input placeholder="例如 E2025018" /></Form.Item><Form.Item name="department" label="部门" rules={[{ required: true, message: '请选择部门' }]}><Select options={['研发中心','生产中心','营销中心','人力资源部'].map(value => ({ value, label: value }))}/></Form.Item><Form.Item name="position" label="岗位" rules={[{ required: true, message: '请输入岗位' }]}><Input /></Form.Item><Form.Item name="phone" label="手机号" rules={[{ required: true, pattern: /^1\d{10}$/, message: '请输入 11 位手机号，不含空格' }]}><Input /></Form.Item><Form.Item name="joinedAt" label="入职日期" rules={[{ required: true, message: '请输入入职日期' }]}><Input placeholder="YYYY-MM-DD" /></Form.Item><Form.Item name="status" label="员工状态" initialValue="在职" rules={[{ required: true }]}><Select options={['在职','试用期','停用'].map(value => ({ value, label: value }))}/></Form.Item></Form>
    </Drawer>
    <Modal title="员工详情" open={Boolean(detail)} onCancel={() => setDetail(undefined)} footer={<Button type="primary" onClick={() => setDetail(undefined)}>关闭</Button>} width={720}>{detail && <Descriptions column={2} bordered items={[{ label: '姓名', children: detail.name },{ label: '状态', children: <Tag color={detail.status === '在职' ? 'success' : 'processing'}>{detail.status}</Tag> },{ label: '工号', children: detail.code },{ label: '部门', children: detail.department },{ label: '岗位', children: detail.position },{ label: '手机号', children: detail.phone },{ label: '入职日期', children: detail.joinedAt },{ label: '数据权限', children: '仅组织管理员可编辑' }]}/>}</Modal>
  </div>;
}
