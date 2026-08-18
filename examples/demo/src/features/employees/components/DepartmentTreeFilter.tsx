import {
  MenuFoldOutlined,
  MoreOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { Button, Dropdown, Empty, Input, Spin, Tooltip, Tree, Typography } from 'antd';
import type { MenuProps, TreeDataNode } from 'antd';
import { useEffect, useMemo, useRef, useState, type CSSProperties, type Key } from 'react';
import { b2bStandards } from '../../../shared/design-system/generated/b2b-standards.generated';

export interface DepartmentTreeNode {
  key: string;
  title: string;
  children?: DepartmentTreeNode[];
  actions?: boolean;
}

interface DepartmentTreeFilterProps {
  data: DepartmentTreeNode[];
  selectedKey?: string;
  allKey?: string;
  hidden?: boolean;
  loading?: boolean;
  error?: string;
  onRetry?: () => void;
  onSelect: (key: string | undefined, node: DepartmentTreeNode | undefined) => void;
  onCollapse: () => void;
  onEdit?: (node: DepartmentTreeNode) => void;
  onAddChild?: (node: DepartmentTreeNode) => void;
  onDelete?: (node: DepartmentTreeNode) => void;
  onAddRoot?: () => void;
}

const rules = b2bStandards.pagePatterns.list.leftTreeFilter;

function filterTree(nodes: DepartmentTreeNode[], keyword: string): DepartmentTreeNode[] {
  if (!keyword) return nodes;
  return nodes.reduce<DepartmentTreeNode[]>((result, node) => {
    const children = filterTree(node.children ?? [], keyword);
    if (node.title.toLocaleLowerCase().includes(keyword) || children.length > 0) {
      result.push({ ...node, children: children.length > 0 ? children : node.children });
    }
    return result;
  }, []);
}

function collectExpandableKeys(nodes: DepartmentTreeNode[], keys: string[] = []): string[] {
  nodes.forEach((node) => {
    if (node.children?.length) {
      keys.push(node.key);
      collectExpandableKeys(node.children, keys);
    }
  });
  return keys;
}

function findNode(nodes: DepartmentTreeNode[], key: string): DepartmentTreeNode | undefined {
  for (const node of nodes) {
    if (node.key === key) return node;
    const child = findNode(node.children ?? [], key);
    if (child) return child;
  }
  return undefined;
}

function findAncestorKeys(nodes: DepartmentTreeNode[], key: string, ancestors: string[] = []): string[] | undefined {
  for (const node of nodes) {
    if (node.key === key) return ancestors;
    const childAncestors = findAncestorKeys(node.children ?? [], key, [...ancestors, node.key]);
    if (childAncestors) return childAncestors;
  }
  return undefined;
}

function collectNodeKeys(nodes: DepartmentTreeNode[], keys = new Set<string>()): Set<string> {
  nodes.forEach((node) => {
    keys.add(node.key);
    collectNodeKeys(node.children ?? [], keys);
  });
  return keys;
}

export function DepartmentTreeFilter({
  data,
  selectedKey,
  allKey = 'all',
  hidden = false,
  loading = false,
  error,
  onRetry,
  onSelect,
  onCollapse,
  onEdit,
  onAddChild,
  onDelete,
  onAddRoot,
}: DepartmentTreeFilterProps) {
  const firstBusinessRoot = data.find((node) => node.key !== allKey && node.children?.length)?.key;
  const [searchValue, setSearchValue] = useState('');
  const [expandedKeys, setExpandedKeys] = useState<string[]>(() => Array.from(new Set([
    ...(firstBusinessRoot ? [firstBusinessRoot] : []),
    ...(selectedKey ? findAncestorKeys(data, selectedKey) ?? [] : []),
  ])));
  const hasInitializedRoot = useRef(Boolean(firstBusinessRoot));
  const expandedBeforeSearch = useRef<string[] | undefined>(undefined);
  const normalizedSearch = searchValue.trim().toLocaleLowerCase();
  const filteredData = useMemo(() => filterTree(data, normalizedSearch), [data, normalizedSearch]);
  const visibleExpandedKeys = normalizedSearch ? collectExpandableKeys(filteredData) : expandedKeys;
  const panelStyle = {
    '--left-tree-filter-width': `${rules.panel.width}px`,
    '--left-tree-filter-padding-block': `${rules.panel.paddingBlock}px`,
    '--left-tree-filter-padding-inline': `${rules.panel.paddingInline}px`,
    '--left-tree-filter-radius': `${rules.panel.borderRadius}px`,
    '--left-tree-filter-shadow': rules.panel.boxShadow,
    '--left-tree-filter-sticky-top': `${rules.panel.stickyTop}px`,
    '--left-tree-filter-viewport-offset': `${rules.panel.viewportOffset}px`,
  } as CSSProperties;

  useEffect(() => {
    const validKeys = collectNodeKeys(data);
    if (!loading && !error && selectedKey && !validKeys.has(selectedKey)) {
      onSelect(undefined, undefined);
      return;
    }
    const requiredKeys = selectedKey ? findAncestorKeys(data, selectedKey) ?? [] : [];
    if (!hasInitializedRoot.current && firstBusinessRoot) {
      requiredKeys.unshift(firstBusinessRoot);
      hasInitializedRoot.current = true;
    }
    setExpandedKeys((current) => {
      const next = Array.from(new Set([...current.filter((key) => validKeys.has(key)), ...requiredKeys]));
      return next.length === current.length && next.every((key, index) => key === current[index]) ? current : next;
    });
  }, [data, error, firstBusinessRoot, loading, onSelect, selectedKey]);

  const updateSearch = (value: string) => {
    if (!searchValue && value) expandedBeforeSearch.current = expandedKeys;
    if (searchValue && !value && expandedBeforeSearch.current) {
      const selectedAncestors = selectedKey ? findAncestorKeys(data, selectedKey) ?? [] : [];
      const validKeys = collectNodeKeys(data);
      setExpandedKeys(Array.from(new Set([
        ...expandedBeforeSearch.current.filter((key) => validKeys.has(key)),
        ...selectedAncestors,
      ])));
      expandedBeforeSearch.current = undefined;
    }
    setSearchValue(value);
  };

  const renderTitle = (node: DepartmentTreeNode) => {
    const items: NonNullable<MenuProps['items']> = [];
    if (onEdit) items.push({ key: 'edit', label: '编辑' });
    if (onAddChild) items.push({ key: 'add-child', label: '添加子级' });
    if (onDelete) items.push({ key: 'delete', label: '删除', danger: true });
    return (
      <div className="left-tree-filter-node">
        <Tooltip title={node.title} placement="right">
          <span className="left-tree-filter-node-title">{node.title}</span>
        </Tooltip>
        {node.actions !== false && items.length > 0 && (
          <Tooltip title={`更多操作：${node.title}`}>
            <Dropdown
              trigger={['click']}
              menu={{
                items,
                onClick: ({ key, domEvent }) => {
                  domEvent.stopPropagation();
                  if (key === 'edit') onEdit?.(node);
                  if (key === 'add-child') onAddChild?.(node);
                  if (key === 'delete') onDelete?.(node);
                },
              }}
            >
              <Button
                className="left-tree-filter-node-action"
                type="text"
                size="small"
                icon={<MoreOutlined />}
                aria-label={`更多操作：${node.title}`}
                onClick={(event) => event.stopPropagation()}
              />
            </Dropdown>
          </Tooltip>
        )}
      </div>
    );
  };

  const toTreeData = (nodes: DepartmentTreeNode[]): TreeDataNode[] => nodes.map((node) => ({
    key: node.key,
    title: renderTitle(node),
    children: node.children ? toTreeData(node.children) : undefined,
  }));

  return (
    <aside
      className="left-tree-filter"
      style={panelStyle}
      hidden={hidden}
      aria-label="部门筛选"
      data-b2b-left-tree-filter
    >
      <div className="left-tree-filter-header">
        <Input
          className="left-tree-filter-search"
          placeholder="请输入部门名称"
          prefix={<SearchOutlined style={{ color: b2bStandards.theme.token.colorTextQuaternary }} />}
          allowClear
          value={searchValue}
          onChange={(event) => updateSearch(event.target.value)}
          aria-label="搜索部门"
        />
        <Tooltip title="收起筛选面板">
          <Button type="text" icon={<MenuFoldOutlined />} aria-label="收起部门筛选" onClick={onCollapse} />
        </Tooltip>
      </div>
      <div className="left-tree-filter-body" aria-live="polite">
        {loading ? (
          <div className="left-tree-filter-state"><Spin size="small" /><Typography.Text type="secondary">正在加载部门</Typography.Text></div>
        ) : error ? (
          <div className="left-tree-filter-state"><Typography.Text type="danger">{error}</Typography.Text>{onRetry && <Button size="small" icon={<ReloadOutlined />} onClick={onRetry}>重试</Button>}</div>
        ) : filteredData.length === 0 ? (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={normalizedSearch ? '未找到匹配部门' : '暂无部门'} />
        ) : (
          <Tree
            showLine={rules.showLine ? { showLeafIcon: rules.showLeafIcon } : false}
            blockNode={rules.blockNode}
            multiple={rules.selectionMode !== 'single'}
            treeData={toTreeData(filteredData)}
            expandedKeys={visibleExpandedKeys}
            selectedKeys={selectedKey ? [selectedKey] : []}
            onExpand={(keys: Key[]) => setExpandedKeys(keys.map(String))}
            onSelect={(keys: Key[]) => {
              const key = String(keys[0] ?? '');
              if (!key || key === allKey) {
                onSelect(undefined, undefined);
                return;
              }
              onSelect(key, findNode(data, key));
            }}
          />
        )}
      </div>
      {onAddRoot && <Button className="left-tree-filter-create" type="dashed" icon={<PlusOutlined />} block onClick={onAddRoot}>添加部门</Button>}
    </aside>
  );
}
