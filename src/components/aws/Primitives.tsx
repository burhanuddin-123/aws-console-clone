import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

export function Breadcrumbs({ items }: { items: { label: string; to?: string }[] }) {
  return (
    <nav className="flex items-center gap-1 text-[13px] text-aws-text-muted mb-3 flex-wrap">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-1">
          {i > 0 && <ChevronRight size={12} />}
          {item.to ? (
            <Link to={item.to} className="aws-link">{item.label}</Link>
          ) : (
            <span className={i === items.length - 1 ? "text-aws-text" : ""}>{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}

export function PageHeader({
  title, description, actions, breadcrumbs,
}: {
  title: string; description?: string; actions?: ReactNode; breadcrumbs?: { label: string; to?: string }[];
}) {
  return (
    <div className="mb-5">
      {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-[24px] font-bold text-aws-text leading-tight">{title}</h1>
          {description && <p className="text-[14px] text-aws-text-muted mt-1">{description}</p>}
        </div>
        {actions && <div className="flex items-center gap-2 flex-wrap">{actions}</div>}
      </div>
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const lower = status.toLowerCase();
  const cls =
    lower === "active" || lower === "running" || lower === "ok"
      ? "bg-green-50 text-green-700 border-green-200"
      : lower === "alarm" || lower === "failed" || lower === "terminated" || lower === "error"
      ? "bg-red-50 text-red-700 border-red-200"
      : lower === "stopped" || lower === "inactive"
      ? "bg-gray-100 text-gray-700 border-gray-200"
      : lower === "pending" || lower === "creating" || lower === "stopping"
      ? "bg-blue-50 text-blue-700 border-blue-200"
      : "bg-yellow-50 text-yellow-700 border-yellow-200";

  const dot =
    lower === "active" || lower === "running" || lower === "ok"
      ? "bg-green-500"
      : lower === "alarm" || lower === "failed" || lower === "terminated"
      ? "bg-red-500"
      : lower === "stopped" || lower === "inactive"
      ? "bg-gray-400"
      : "bg-blue-500";

  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[12px] border ${cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {status}
    </span>
  );
}

export function EmptyState({ icon: Icon, title, description, action }: { icon: any; title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Icon size={40} className="text-aws-text-muted mb-3" />
      <div className="font-semibold text-aws-text">{title}</div>
      {description && <p className="text-[13px] text-aws-text-muted mt-1 max-w-md">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
