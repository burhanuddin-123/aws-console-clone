import { useState, useMemo, type ReactNode } from "react";
import { ChevronUp, ChevronDown, Search, RefreshCw, Settings2 } from "lucide-react";

export type Column<T> = {
  key: string;
  header: string;
  render?: (row: T) => ReactNode;
  sortable?: boolean;
  width?: string;
};

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  searchable = true,
  searchKeys,
  rowKey,
  onRowClick,
  toolbar,
  selectable = false,
  emptyState,
}: {
  data: T[];
  columns: Column<T>[];
  searchable?: boolean;
  searchKeys?: (keyof T)[];
  rowKey: (row: T) => string;
  onRowClick?: (row: T) => void;
  toolbar?: ReactNode;
  selectable?: boolean;
  emptyState?: ReactNode;
}) {
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    if (!query) return data;
    const q = query.toLowerCase();
    const keys = searchKeys ?? (Object.keys(data[0] ?? {}) as (keyof T)[]);
    return data.filter((row) => keys.some((k) => String(row[k] ?? "").toLowerCase().includes(q)));
  }, [data, query, searchKeys]);

  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    return [...filtered].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (av === bv) return 0;
      const cmp = av > bv ? 1 : -1;
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [filtered, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const pageData = sorted.slice((page - 1) * pageSize, page * pageSize);

  function toggleSort(key: string) {
    if (sortKey === key) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  }

  function toggleSelect(id: string) {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  }

  return (
    <div className="aws-card overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-aws-border flex-wrap">
        {searchable && (
          <div className="flex-1 min-w-[200px] max-w-md flex items-center bg-white border border-aws-border rounded">
            <Search size={14} className="ml-2 text-aws-text-muted" />
            <input
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(1); }}
              placeholder="Find resources by property or value"
              className="flex-1 px-2 py-1.5 text-[13px] outline-none"
            />
          </div>
        )}
        <div className="flex items-center gap-2">{toolbar}</div>
        <div className="flex items-center gap-1 ml-auto">
          <button className="p-1.5 hover:bg-aws-surface rounded" aria-label="Refresh">
            <RefreshCw size={14} />
          </button>
          <button className="p-1.5 hover:bg-aws-surface rounded" aria-label="Settings">
            <Settings2 size={14} />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-[13px]">
          <thead className="bg-aws-surface sticky top-0 z-10">
            <tr>
              {selectable && (
                <th className="w-10 px-3 py-2.5 text-left">
                  <input
                    type="checkbox"
                    checked={pageData.length > 0 && pageData.every((r) => selected.has(rowKey(r)))}
                    onChange={(e) => {
                      const next = new Set(selected);
                      pageData.forEach((r) => e.target.checked ? next.add(rowKey(r)) : next.delete(rowKey(r)));
                      setSelected(next);
                    }}
                  />
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable !== false && toggleSort(col.key)}
                  className="px-3 py-2.5 text-left font-semibold text-aws-text border-b border-aws-border cursor-pointer select-none"
                  style={{ width: col.width }}
                >
                  <span className="inline-flex items-center gap-1">
                    {col.header}
                    {sortKey === col.key && (sortDir === "asc" ? <ChevronUp size={12} /> : <ChevronDown size={12} />)}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageData.length === 0 ? (
              <tr><td colSpan={columns.length + (selectable ? 1 : 0)} className="py-12">{emptyState ?? <div className="text-center text-aws-text-muted">No resources to display</div>}</td></tr>
            ) : pageData.map((row) => {
              const id = rowKey(row);
              return (
                <tr
                  key={id}
                  onClick={() => onRowClick?.(row)}
                  className={`border-b border-aws-border last:border-b-0 hover:bg-aws-surface ${onRowClick ? "cursor-pointer" : ""}`}
                >
                  {selectable && (
                    <td className="px-3 py-2.5" onClick={(e) => e.stopPropagation()}>
                      <input type="checkbox" checked={selected.has(id)} onChange={() => toggleSelect(id)} />
                    </td>
                  )}
                  {columns.map((col) => (
                    <td key={col.key} className="px-3 py-2.5">
                      {col.render ? col.render(row) : String(row[col.key] ?? "")}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between px-4 py-2.5 border-t border-aws-border text-[12px] text-aws-text-muted">
        <div>
          {sorted.length} {sorted.length === 1 ? "resource" : "resources"}
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            Page size:
            <select
              value={pageSize}
              onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
              className="border border-aws-border rounded px-1 py-0.5"
            >
              <option>10</option><option>25</option><option>50</option>
            </select>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="px-2 py-0.5 disabled:opacity-40 hover:bg-aws-surface rounded">‹</button>
            <span>{page} / {totalPages}</span>
            <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="px-2 py-0.5 disabled:opacity-40 hover:bg-aws-surface rounded">›</button>
          </div>
        </div>
      </div>
    </div>
  );
}
