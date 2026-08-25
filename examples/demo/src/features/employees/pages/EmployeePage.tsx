import { useCallback, useMemo, useState, type CSSProperties, type Key } from 'react';
import { DownOutlined, MenuUnfoldOutlined, PlusOutlined } from '@ant-design/icons';
import { App, Button, Card, Descriptions, Drawer, Dropdown, Empty, Flex, Form, Input, Popconfirm, Select, Space, Table, Tag, Tooltip, Typography, theme } from 'antd';
import type { TableColumnsType } from 'antd';
import { ListPageHeading, SearchField, SearchPanel } from '../../../shared/ui/ListPage';
import { TableEllipsisText } from '../../../shared/ui/TableEllipsisText';
import { b2bStandards } from '../../../shared/design-system/generated/b2b-standards.generated';
import { DepartmentTreeFilter, type DepartmentTreeNode } from '../components/DepartmentTreeFilter';

type Status = '在职' | '试用期' | '停用';
interface Employee { id: number; name: string; code: string; departmentId: string; department: string; position: string; phone: string; joinedAt: string; status: Status }
type EmployeeForm = Omit<Employee, 'id' | 'department'>;
const seed: Employee[] = [
  { id: 1, name: '张悦', code: 'E2024018', departmentId: 'research', department: '研发中心', position: '产品经理', phone: '138 0000 1234', joinedAt: '2024-03-18', status: '在职' },
  { id: 2, name: '李明', code: 'E2024062', departmentId: 'research', department: '研发中心', position: '前端工程师', phone: '139 0000 8821', joinedAt: '2024-06-12', status: '试用期' },
  { id: 3, name: '王芳', code: 'E2023087', departmentId: 'human-resources', department: '人力资源部', position: '招聘专员', phone: '136 0000 5532', joinedAt: '2023-09-04', status: '在职' },
  { id: 4, name: '赵磊', code: 'E2022115', departmentId: 'marketing', department: '营销中心', position: '客户经理', phone: '137 0000 7631', joinedAt: '2022-11-21', status: '停用' },
  { id: 5, name: '陈晨', code: 'E2025012', departmentId: 'production', department: '生产中心', position: '质量工程师', phone: '135 0000 4810', joinedAt: '2025-02-10', status: '在职' },
];

const initialDepartmentTree: DepartmentTreeNode[] = [
  { key: 'all', title: '全部', actions: false },
  {
    key: 'cloudjoy',
    title: '云悦科技',
    children: [
      {
        key: 'product-and-engineering',
        title: '产品与研发中心',
        children: [
          { key: 'research', title: '研发中心' },
          { key: 'product', title: '产品中心' },
        ],
      },
      {
        key: 'business',
        title: '经营中心',
        children: [
          { key: 'production', title: '生产中心' },
          { key: 'marketing', title: '营销中心' },
        ],
      },
      {
        key: 'corporate',
        title: '职能中心',
        children: [{ key: 'human-resources', title: '人力资源部' }],
      },
    ],
  },
];

function findDepartment(nodes: DepartmentTreeNode[], key: string): DepartmentTreeNode | undefined {
  for (const node of nodes) {
    if (node.key === key) return node;
    const child = findDepartment(node.children ?? [], key);
    if (child) return child;
  }
  return undefined;
}

function collectLeafDepartmentKeys(node: DepartmentTreeNode | undefined): string[] {
  if (!node) return [];
  if (!node.children?.length) return [node.key];
  return node.children.flatMap(collectLeafDepartmentKeys);
}

function collectDepartmentOptions(nodes: DepartmentTreeNode[]): Array<{ value: string; label: string }> {
  return nodes.flatMap((node) => node.children?.length
    ? collectDepartmentOptions(node.children)
    : node.key === 'all' ? [] : [{ value: node.key, label: node.title }]);
}

function includesDepartment(node: DepartmentTreeNode, key: string): boolean {
  return node.key === key || (node.children ?? []).some((child) => includesDepartment(child, key));
}

function removeDepartment(nodes: DepartmentTreeNode[], key: string): DepartmentTreeNode[] {
  return nodes
    .filter((node) => node.key !== key)
    .map((node) => ({ ...node, children: node.children ? removeDepartment(node.children, key) : undefined }));
}

export function EmployeePage() {
  const { message, modal } = App.useApp();
  const { token } = theme.useToken();
  const [data, setData] = useState(seed);
  const [departmentTree, setDepartmentTree] = useState(initialDepartmentTree);
  const [keyword, setKeyword] = useState('');
  const [selectedDepartmentKey, setSelectedDepartmentKey] = useState<string | undefined>(
    () => new URLSearchParams(window.location.search).get('department') ?? undefined,
  );
  const [treeCollapsed, setTreeCollapsed] = useState(false);
  const [status, setStatus] = useState<Status>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [page, setPage] = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [detail, setDetail] = useState<Employee>();
  const [form] = Form.useForm<EmployeeForm>();
  const selectedDepartment = selectedDepartmentKey ? findDepartment(departmentTree, selectedDepartmentKey) : undefined;
  const selectedDepartmentKeys = useMemo(() => new Set(collectLeafDepartmentKeys(selectedDepartment)), [selectedDepartment]);
  const departmentOptions = useMemo(() => collectDepartmentOptions(departmentTree), [departmentTree]);
  const filtered = useMemo(() => data.filter(item => (
    (!keyword || `${item.name}${item.code}${item.phone}`.includes(keyword))
    && (!selectedDepartmentKey || selectedDepartmentKeys.has(item.departmentId))
    && (!status || item.status === status)
  )), [data, keyword, selectedDepartmentKey, selectedDepartmentKeys, status]);
  const treeRules = b2bStandards.pagePatterns.list.leftTreeFilter;
  const treeLayoutStyle = {
    '--left-tree-filter-gap': `${treeRules.panel.gap}px`,
    '--left-tree-filter-background': token.colorBgContainer,
    '--left-tree-filter-active-color': token.colorPrimary,
    '--left-tree-filter-active-background': token.colorPrimaryBg,
  } as CSSProperties;

  const resetListContext = useCallback(() => {
    setSelectedRowKeys([]);
    setPage(1);
  }, []);

  const selectDepartment = useCallback((key: string | undefined) => {
    setSelectedDepartmentKey(key);
    resetListContext();
    const url = new URL(window.location.href);
    if (key) url.searchParams.set('department', key);
    else url.searchParams.delete('department');
    window.history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`);
  }, [resetListContext]);

  const resetFilters = () => {
    setKeyword('');
    setStatus(undefined);
    selectDepartment(undefined);
  };

  const deleteDepartment = (node: DepartmentTreeNode) => {
    modal.confirm({
      title: `确认删除“${node.title}”？`,
      content: '删除后该部门将不再出现在筛选树中，此操作不可撤销。',
      okText: '删除',
      cancelText: '取消',
      okButtonProps: { danger: true },
      footer: (_, { OkBtn, CancelBtn }) => <Space><CancelBtn /><OkBtn /></Space>,
      onOk: () => {
        setDepartmentTree((nodes) => removeDepartment(nodes, node.key));
        if (selectedDepartmentKey && includesDepartment(node, selectedDepartmentKey)) selectDepartment(undefined);
        message.success(`已删除部门“${node.title}”`);
      },
    });
  };
  const columns: TableColumnsType<Employee> = [
    { title: '姓名', dataIndex: 'name', fixed: 'left', width: 110, render: (name, record) => <Button type="link" className="table-link" onClick={() => setDetail(record)}>{name}</Button> },
    { title: '工号', dataIndex: 'code', width: 120 },
    { title: '部门', dataIndex: 'department', width: 140, render: value => <TableEllipsisText text={value} /> },
    { title: '岗位', dataIndex: 'position', width: 150, render: value => <TableEllipsisText text={value} /> },
    { title: '手机号', dataIndex: 'phone', width: 150 }, { title: '入职日期', dataIndex: 'joinedAt', width: 120 },
    { title: '状态', dataIndex: 'status', width: 100, render: value => <Tag color={value === '在职' ? 'success' : value === '试用期' ? 'processing' : 'default'}>{value}</Tag> },
    { title: '操作', key: 'action', fixed: 'right', align: 'right', width: 170, render: (_, record) => <Space><Button type="link" onClick={() => setDetail(record)}>详情</Button><Button type="link" onClick={() => { form.setFieldsValue(record); setDrawerOpen(true); }}>编辑</Button><Popconfirm title={`确认停用“${record.name}”？`} description="停用后该员工将无法登录系统。" onConfirm={() => { setData(list => list.map(x => x.id === record.id ? { ...x, status: '停用' } : x)); message.success('员工已停用'); }}><Button type="link" disabled={record.status === '停用'}>停用</Button></Popconfirm></Space> },
  ];
  const submit = async () => {
    const values = await form.validateFields();
    const departmentNode = findDepartment(departmentTree, values.departmentId);
    if (!departmentNode) {
      message.error('所选部门已失效，请重新选择');
      return;
    }
    setData(list => [{ ...values, department: departmentNode.title, id: Date.now() }, ...list]);
    setDrawerOpen(false);
    form.resetFields();
    message.success('员工信息已保存');
  };
  const batchDisable = () => {
    setData(list => list.map(item => selectedRowKeys.includes(item.id) ? { ...item, status: '停用' } : item));
    message.success(`已停用 ${selectedRowKeys.length} 名员工`);
    setSelectedRowKeys([]);
  };
  return (
    <div className="page-stack">
      <ListPageHeading paths={['组织管理', '员工管理']} title="员工管理" subtitle="维护组织成员、岗位与任职状态。" />
      <div className="left-tree-list-layout" style={treeLayoutStyle}>
        <DepartmentTreeFilter
          data={departmentTree}
          selectedKey={selectedDepartmentKey}
          hidden={treeCollapsed}
          onSelect={selectDepartment}
          onCollapse={() => setTreeCollapsed(true)}
          onEdit={(node) => message.info(`编辑部门：${node.title}`)}
          onAddChild={(node) => message.info(`在“${node.title}”下添加子部门`)}
          onDelete={deleteDepartment}
          onAddRoot={() => message.info('添加一级部门')}
        />
        <section className={`left-tree-list-main ${treeCollapsed ? 'is-filter-collapsed' : ''}`} aria-label="员工列表">
          <div className="left-tree-filter-query-row">
            {treeCollapsed && (
              <Tooltip title={selectedDepartment ? `已筛选「${selectedDepartment.title}」` : '展开筛选面板'}>
                <Button
                  className={`left-tree-filter-expand ${selectedDepartment ? 'is-active' : ''}`}
                  type="text"
                  icon={<MenuUnfoldOutlined />}
                  aria-label="展开部门筛选"
                  onClick={() => setTreeCollapsed(false)}
                />
              </Tooltip>
            )}
            <div className="left-tree-filter-query-content">
              <SearchPanel onSearch={() => { resetListContext(); message.success('查询完成'); }} onReset={resetFilters}>
                <SearchField label="姓名/工号">
                  <Input allowClear placeholder="请输入姓名、工号或手机号" value={keyword} onChange={(event) => { setKeyword(event.target.value); resetListContext(); }} />
                </SearchField>
                <SearchField label="状态">
                  <Select allowClear placeholder="全部状态" value={status} onChange={(value) => { setStatus(value); resetListContext(); }} options={['在职','试用期','停用'].map(value => ({ value, label: value }))} />
                </SearchField>
              </SearchPanel>
            </div>
          </div>
          <Card>
            <div className="table-toolbar"><Space><Dropdown menu={{ items: [{ key: 'current', label: '导出当前结果' }, { key: 'all', label: '导出全部员工' }], onClick: () => message.info('Demo：导出任务已创建') }}><Button>导出 <DownOutlined /></Button></Dropdown><Button type="primary" icon={<PlusOutlined />} onClick={() => { form.resetFields(); setDrawerOpen(true); }}>新增员工</Button></Space></div>
            {selectedRowKeys.length > 0 && <Flex className="batch-toolbar" align="center" justify="space-between"><Typography.Text>已选择 <strong>{selectedRowKeys.length}</strong> 项</Typography.Text><Space><Popconfirm title={`确认批量停用 ${selectedRowKeys.length} 名员工？`} description="停用后这些员工将无法登录系统。" onConfirm={batchDisable}><Button danger>批量停用</Button></Popconfirm><Button onClick={() => setSelectedRowKeys([])}>取消选择</Button></Space></Flex>}
            {filtered.length ? <Table rowKey="id" rowSelection={{ selectedRowKeys, preserveSelectedRowKeys: true, onChange: setSelectedRowKeys }} columns={columns} dataSource={filtered} scroll={{ x: 1050 }} pagination={{ current: page, pageSize: 5, showSizeChanger: true, showTotal: total => `共 ${total} 条`, onChange: setPage }} /> : <Empty description="没有符合条件的员工"><Button onClick={resetFilters}>清除筛选</Button></Empty>}
          </Card>
        </section>
      </div>
      <Drawer title="新增／编辑员工" size={560} open={drawerOpen} onClose={() => setDrawerOpen(false)} extra={<Space><Button onClick={() => setDrawerOpen(false)}>取消</Button><Button type="primary" onClick={submit}>保存</Button></Space>}>
        <Form form={form} layout="horizontal" className="edit-form" requiredMark><Form.Item name="name" label="姓名" rules={[{ required: true, message: '请输入员工姓名' }]}><Input placeholder="请输入真实姓名" /></Form.Item><Form.Item name="code" label="工号" rules={[{ required: true, message: '请输入工号' }]}><Input placeholder="例如 E2025018" /></Form.Item><Form.Item name="departmentId" label="部门" rules={[{ required: true, message: '请选择部门' }]}><Select options={departmentOptions}/></Form.Item><Form.Item name="position" label="岗位" rules={[{ required: true, message: '请输入岗位' }]}><Input /></Form.Item><Form.Item name="phone" label="手机号" rules={[{ required: true, pattern: /^1\d{10}$/, message: '请输入 11 位手机号，不含空格' }]}><Input /></Form.Item><Form.Item name="joinedAt" label="入职日期" rules={[{ required: true, message: '请输入入职日期' }]}><Input placeholder="YYYY-MM-DD" /></Form.Item><Form.Item name="status" label="员工状态" initialValue="在职" rules={[{ required: true }]}><Select options={['在职','试用期','停用'].map(value => ({ value, label: value }))}/></Form.Item></Form>
      </Drawer>
      <Drawer title="员工详情" open={Boolean(detail)} onClose={() => setDetail(undefined)} footer={<Button type="primary" onClick={() => setDetail(undefined)}>关闭</Button>} width={720}>{detail && <Descriptions column={2} bordered items={[{ label: '姓名', children: detail.name },{ label: '状态', children: <Tag color={detail.status === '在职' ? 'success' : 'processing'}>{detail.status}</Tag> },{ label: '工号', children: detail.code },{ label: '部门', children: detail.department },{ label: '岗位', children: detail.position },{ label: '手机号', children: detail.phone },{ label: '入职日期', children: detail.joinedAt },{ label: '数据权限', children: '仅组织管理员可编辑' }]}/>}</Drawer>
    </div>
  );
}
