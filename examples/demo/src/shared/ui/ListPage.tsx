import { Children, useState, type CSSProperties, type ReactNode } from 'react';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Card, Flex, Space, Typography } from 'antd';

export function ListPageHeading({ paths, title, subtitle }: { paths: string[]; title: string; subtitle: string }) {
  return <div className="list-page-heading">
    <Breadcrumb separator=">" items={paths.map(item => ({ title: item }))} />
    <Flex align="baseline" gap={16} wrap="wrap"><Typography.Title level={1}>{title}</Typography.Title><Typography.Text type="secondary">{subtitle}</Typography.Text></Flex>
  </div>;
}

export function SearchField({ label, children }: { label: string; children: ReactNode }) {
  return <div className="search-field"><Typography.Text className="search-field-label">{label}</Typography.Text>{children}</div>;
}

export function SearchPanel({ children, onSearch, onReset }: { children: ReactNode; onSearch: () => void; onReset: () => void }) {
  const fields = Children.toArray(children);
  const collapsible = fields.length > 3;
  const [expanded, setExpanded] = useState(false);
  const visibleFields = collapsible && !expanded ? fields.slice(0, 3) : fields;
  const actionRows = {
    '--search-action-row-4': Math.floor(visibleFields.length / 4) + 1,
    '--search-action-row-2': Math.floor(visibleFields.length / 2) + 1,
    '--search-action-row-1': visibleFields.length + 1,
  } as CSSProperties;
  return <Card className="search-card"><div className="search-fields" style={actionRows}>{visibleFields}<div className="search-actions"><Space wrap={false}><Button type="primary" onClick={onSearch}>查询</Button><Button onClick={onReset}>重置</Button>{collapsible && <Button type="link" icon={expanded ? <UpOutlined /> : <DownOutlined />} onClick={() => setExpanded(value => !value)}>{expanded ? '收起' : '展开'}</Button>}</Space></div></div></Card>;
}
