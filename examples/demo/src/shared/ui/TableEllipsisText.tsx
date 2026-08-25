import { useLayoutEffect, useRef, useState } from 'react';
import { Tooltip } from 'antd';

export function TableEllipsisText({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [overflowing, setOverflowing] = useState(false);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    const measure = () => setOverflowing(element.scrollWidth > element.clientWidth + 1);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, [text]);

  return <Tooltip title={overflowing ? text : undefined}>
    <span ref={ref} className="table-ellipsis-text" tabIndex={overflowing ? 0 : undefined}>{text}</span>
  </Tooltip>;
}
