import { useState } from 'react';
import { ApartmentOutlined, AppstoreOutlined, BarChartOutlined, BellOutlined, BookOutlined, CalendarOutlined, CheckCircleOutlined, CheckSquareOutlined, ClockCircleOutlined, DashboardOutlined, FileTextOutlined, GiftOutlined, HeartOutlined, ReadOutlined, RocketOutlined, ShoppingCartOutlined, ShoppingOutlined, SyncOutlined, TagsOutlined, TeamOutlined, UnorderedListOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Badge, Button, Flex, Layout, Menu, Popover, Space, Typography } from 'antd';
import type { CSSProperties } from 'react';
import { DashboardPage } from '../features/employees/pages/DashboardPage';
import { EmployeePage } from '../features/employees/pages/EmployeePage';
import { ActivityPage } from '../features/experience/pages/ActivityPage';
import { ArticlePage } from '../features/experience/pages/ArticlePage';
import { InterestGroupPage } from '../features/experience/pages/InterestGroupPage';
import { OrderPage, type Order, type OrderStatus } from '../features/orders/pages/OrderPage';
import { OrderDetailPage } from '../features/orders/pages/OrderDetailPage';
import { ProductPage } from '../features/products/pages/ProductPage';
import { ProductSettingsPage } from '../features/products/pages/ProductSettingsPage';
import { TrainingPages } from '../features/training/pages/TrainingPages';
import { CarePages } from '../features/care/pages/CarePages';
import { b2bStandards } from '../shared/design-system/generated/b2b-standards.generated';

const { Header, Sider, Content } = Layout;

export function App() {
  const [application, setApplication] = useState('workbench');
  const [applicationCardOpen, setApplicationCardOpen] = useState(false);
  const [page, setPage] = useState('dashboard');
  const [detailOrder, setDetailOrder] = useState<Order>();
  const layoutStyle = {
    '--header-height': `${b2bStandards.theme.components.Layout.headerHeight}px`,
    '--content-max-width': `${b2bStandards.product.contentMaxWidth}px`,
    '--page-gutter': `${b2bStandards.product.pageGutter}px`,
    '--page-gutter-compact': `${b2bStandards.product.pageGutterCompact}px`,
    '--logo-width': `${b2bStandards.layout.logoWidth}px`,
    '--border-color': b2bStandards.border.color,
    '--spacing-md': `${b2bStandards.spacing.md}px`,
  } as CSSProperties;
  const applications = [
    { key: 'workbench', label: '工作台', category: '通用', icon: <DashboardOutlined />, defaultPage: 'dashboard' },
    { key: 'organization', label: '组织管理', category: '员工与组织', icon: <TeamOutlined />, defaultPage: 'employees' },
    { key: 'products', label: '商品管理', category: '业务经营', icon: <TagsOutlined />, defaultPage: 'products' },
    { key: 'orders', label: '订单管理', category: '业务经营', icon: <ShoppingCartOutlined />, defaultPage: 'orders-all' },
    { key: 'experience', label: '员工体验', category: '员工与组织', icon: <HeartOutlined />, defaultPage: 'experience-articles' },
    { key: 'training', label: '培训课程', category: '员工与组织', icon: <BookOutlined />, defaultPage: 'training-courses' },
    { key: 'care', label: '人文关怀', category: '员工与组织', icon: <GiftOutlined />, defaultPage: 'care-plans' },
    { key: 'operations', label: '业务运营', category: '平台能力', icon: <AppstoreOutlined />, defaultPage: 'dashboard' },
  ];
  const directApplications = applications.slice(0, b2bStandards.layout.applicationDirectVisibleMax);
  const applicationCategories = ['通用', '员工与组织', '业务经营', '平台能力'];
  const sideItems = application === 'organization' ? [
    { key: 'organization-members', icon: <TeamOutlined />, label: '成员管理', children: [
      { key: 'employees', icon: <UserOutlined />, label: '员工管理' },
      { key: 'departments', icon: <ApartmentOutlined />, label: '部门管理', disabled: true },
    ] },
    { key: 'organization-files', icon: <FileTextOutlined />, label: '组织档案', disabled: true },
  ] : application === 'products' ? [
    { key: 'product-center', icon: <ShoppingOutlined />, label: '商品中心', children: [
      { key: 'products', icon: <ShoppingOutlined />, label: '商品信息' },
      { key: 'categories', icon: <AppstoreOutlined />, label: '品类维护' },
      { key: 'specifications', icon: <TagsOutlined />, label: '规格维护' },
    ] },
  ] : application === 'orders' ? [
    { key: 'order-center', icon: <ShoppingCartOutlined />, label: '订单中心', children: [
      { key: 'orders-all', icon: <UnorderedListOutlined />, label: '全部订单' },
      { key: 'orders-unpaid', icon: <ClockCircleOutlined />, label: '待付款' },
      { key: 'orders-paid', icon: <CheckCircleOutlined />, label: '已支付' },
      { key: 'orders-shipped', icon: <RocketOutlined />, label: '已发货' },
      { key: 'orders-completed', icon: <CheckSquareOutlined />, label: '已完成' },
      { key: 'orders-refunding', icon: <SyncOutlined />, label: '退款中' },
    ] },
  ] : application === 'experience' ? [
    { key: 'experience-content', icon: <ReadOutlined />, label: '内容运营', children: [
      { key: 'experience-articles', icon: <FileTextOutlined />, label: '文章管理' },
    ] },
    { key: 'experience-activities', icon: <CalendarOutlined />, label: '活动运营', children: [
      { key: 'experience-activity-list', icon: <CalendarOutlined />, label: '活动管理' },
    ] },
    { key: 'experience-groups', icon: <TeamOutlined />, label: '社群运营', children: [
      { key: 'experience-interest-groups', icon: <TeamOutlined />, label: '兴趣小组' },
    ] },
  ] : application === 'training' ? [
    { key: 'training-course-operation', icon: <BookOutlined />, label: '课程运营', children: [
      { key: 'training-courses', icon: <BookOutlined />, label: '课程管理' },
      { key: 'training-categories', icon: <AppstoreOutlined />, label: '课程分类' },
    ] },
    { key: 'training-learning-operation', icon: <ReadOutlined />, label: '学习运营', children: [
      { key: 'training-plans', icon: <CalendarOutlined />, label: '培训计划' },
      { key: 'training-records', icon: <CheckCircleOutlined />, label: '学习记录' },
    ] },
  ] : application === 'care' ? [
    { key: 'care-operation', icon: <HeartOutlined />, label: '关怀运营', children: [
      { key: 'care-plans', icon: <CalendarOutlined />, label: '关怀计划' },
      { key: 'care-records', icon: <CheckCircleOutlined />, label: '关怀记录' },
    ] },
    { key: 'care-content', icon: <GiftOutlined />, label: '内容配置', children: [
      { key: 'care-templates', icon: <FileTextOutlined />, label: '关怀模板' },
      { key: 'care-types', icon: <TagsOutlined />, label: '关怀类型' },
    ] },
  ] : application === 'operations' ? [
    { key: 'operation-apps', icon: <AppstoreOutlined />, label: '应用运营', children: [
      { key: 'application-list', icon: <AppstoreOutlined />, label: '应用列表', disabled: true },
      { key: 'operation-analysis', icon: <BarChartOutlined />, label: '运营分析', disabled: true },
    ] },
  ] : [
    { key: 'workbench-overview', icon: <DashboardOutlined />, label: '概览', children: [
      { key: 'dashboard', icon: <DashboardOutlined />, label: '数据看板' },
      { key: 'my-tasks', icon: <CheckSquareOutlined />, label: '我的待办', disabled: true },
    ] },
  ];
  const changeApplication = (key: string) => {
    const nextApplication = applications.find(item => item.key === key);
    if (!nextApplication) return;
    setApplication(key);
    setPage(nextApplication.defaultPage);
    setApplicationCardOpen(false);
  };
  const orderStatusByPage: Record<string, OrderStatus | undefined> = { 'orders-all': undefined, 'orders-unpaid': '待付款', 'orders-paid': '已支付', 'orders-shipped': '已发货', 'orders-completed': '已完成', 'orders-refunding': '退款中' };
  const renderPage = () => {
    if (page === 'employees') return <EmployeePage />;
    if (page === 'products') return <ProductPage />;
    if (page === 'categories') return <ProductSettingsPage mode="category" />;
    if (page === 'specifications') return <ProductSettingsPage mode="specification" />;
    if (page === 'experience-articles') return <ArticlePage />;
    if (page === 'experience-activity-list') return <ActivityPage />;
    if (page === 'experience-interest-groups') return <InterestGroupPage />;
    if (page === 'training-courses') return <TrainingPages mode="courses" onNavigate={setPage} />;
    if (page === 'training-course-detail') return <TrainingPages mode="course-detail" onNavigate={setPage} />;
    if (page === 'training-course-create') return <TrainingPages mode="course-create" onNavigate={setPage} />;
    if (page === 'training-categories') return <TrainingPages mode="course-categories" onNavigate={setPage} />;
    if (page === 'training-plans') return <TrainingPages mode="training-plans" onNavigate={setPage} />;
    if (page === 'training-records') return <TrainingPages mode="learning-records" onNavigate={setPage} />;
    if (page === 'care-plans') return <CarePages mode="plans" onNavigate={setPage} />;
    if (page === 'care-plan-create') return <CarePages mode="plan-create" onNavigate={setPage} />;
    if (page === 'care-plan-detail') return <CarePages mode="plan-detail" onNavigate={setPage} />;
    if (page === 'care-records') return <CarePages mode="records" onNavigate={setPage} />;
    if (page === 'care-templates') return <CarePages mode="templates" onNavigate={setPage} />;
    if (page === 'care-types') return <CarePages mode="types" onNavigate={setPage} />;
    if (page === 'order-detail' && detailOrder) return <OrderDetailPage order={detailOrder} onBack={() => setPage('orders-all')} />;
    if (page.startsWith('orders-')) return <OrderPage statusFilter={orderStatusByPage[page]} onOpenDetail={order => { setDetailOrder(order); setPage('order-detail'); }} />;
    return <DashboardPage onOpenEmployees={() => { setApplication('organization'); setPage('employees'); }} />;
  };
  const applicationCard = (
    <div className="application-card" aria-label="全部应用">
      <div className="application-card-heading">全部应用</div>
      {applicationCategories.map(category => (
        <section className="application-group" key={category}>
          <Typography.Text type="secondary" className="application-group-title">{category}</Typography.Text>
          <div className="application-grid">
            {applications.filter(item => item.category === category).map(item => (
              <button className={`application-item ${application === item.key ? 'is-active' : ''}`} key={item.key} type="button" onClick={() => changeApplication(item.key)}>
                <span className="application-item-icon">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
  return (
    <Layout className="app-shell" style={layoutStyle}>
      <Header className="app-header">
        <div className="brand"><img className="brand-logo" src="/assets/default-logo.png" alt="云悦 CLOUDJOY" /></div>
        <nav className="application-nav" aria-label="应用切换">
          <Menu className="application-menu" mode="horizontal" selectedKeys={[application]} onClick={({ key }) => changeApplication(key)} items={directApplications} />
          <Popover content={applicationCard} trigger={['hover', 'click']} placement="bottom" open={applicationCardOpen} onOpenChange={setApplicationCardOpen} overlayClassName="application-popover">
            <Button className={`application-switcher ${!directApplications.some(item => item.key === application) ? 'is-active' : ''}`} type="text" icon={<AppstoreOutlined />}>全部应用</Button>
          </Popover>
        </nav>
        <div className="header-user">
          <Flex align="center" gap={18}>
            <Badge dot><BellOutlined className="header-icon" /></Badge>
            <Space><Avatar size={32} icon={<UserOutlined />} /><div className="user-copy"><Typography.Text strong>陈产品</Typography.Text><Typography.Text type="secondary">产品管理员</Typography.Text></div></Space>
          </Flex>
        </div>
      </Header>
      <Layout className="app-body">
        <Sider width={b2bStandards.layout.sidebarWidth} collapsedWidth={b2bStandards.layout.sidebarCollapsedWidth} theme="light" className="app-sider">
          <Menu mode="inline" selectedKeys={[page]} defaultOpenKeys={['workbench-overview','organization-members','product-center','order-center','experience-content','experience-activities','experience-groups','training-course-operation','training-learning-operation','care-operation','care-content','operation-apps']} onClick={({ key }) => setPage(key)} items={sideItems} />
        </Sider>
        <Content className="app-content">{renderPage()}</Content>
      </Layout>
    </Layout>
  );
}
