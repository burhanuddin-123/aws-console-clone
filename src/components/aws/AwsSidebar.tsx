import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Clock, Grid3x3, Layers, DollarSign, Pin, X } from "lucide-react";
import { recentServices } from "@/data/services";

const sidebarItems = [
  { name: "Console Home", icon: Home, path: "/" },
  { name: "Recently visited", icon: Clock, path: null },
  { name: "All services", icon: Grid3x3, path: null },
  { name: "Resource Groups", icon: Layers, path: null },
  { name: "Cost Management", icon: DollarSign, path: null },
];

export function AwsSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-30 md:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`bg-white border-r border-aws-border transition-all duration-200 overflow-hidden flex-shrink-0
          ${open ? "w-[260px]" : "w-0"}
          fixed md:sticky top-[40px] h-[calc(100vh-40px)] z-40 md:z-auto`}
      >
        <div className="w-[260px] h-full flex flex-col overflow-y-auto">
          <div className="flex items-center justify-between px-4 py-3 border-b border-aws-border">
            <span className="font-semibold text-[14px]">AWS Console</span>
            <button onClick={onClose} className="md:hidden p-1 hover:bg-aws-surface rounded">
              <X size={16} />
            </button>
          </div>

          <nav className="py-2">
            {sidebarItems.map((item) => {
              const active = item.path === pathname;
              const Icon = item.icon;
              const content = (
                <div className={`flex items-center gap-3 px-4 py-2 text-[14px] cursor-pointer
                  ${active ? "bg-aws-surface border-l-[3px] border-aws-orange font-semibold" : "border-l-[3px] border-transparent hover:bg-aws-surface"}`}>
                  <Icon size={16} className="text-aws-text-muted" />
                  <span>{item.name}</span>
                </div>
              );
              return item.path ? (
                <Link key={item.name} to={item.path}>{content}</Link>
              ) : (
                <div key={item.name}>{content}</div>
              );
            })}
          </nav>

          <div className="px-4 py-2 mt-2 border-t border-aws-border">
            <div className="flex items-center justify-between text-[12px] text-aws-text-muted uppercase tracking-wider py-2">
              <span>Recently visited</span>
              <Pin size={12} />
            </div>
            <div className="space-y-0.5">
              {recentServices.slice(0, 10).map((s) => {
                const content = (
                  <div className="flex items-center gap-2 px-2 py-1.5 text-[13px] rounded hover:bg-aws-surface cursor-pointer">
                    <s.icon size={14} style={{ color: s.color }} />
                    <span>{s.name}</span>
                  </div>
                );
                return s.path ? (
                  <Link key={s.name} to={s.path}>{content}</Link>
                ) : (
                  <div key={s.name}>{content}</div>
                );
              })}
            </div>
            <button className="text-[12px] aws-link mt-2 px-2">View all services</button>
          </div>

          <div className="mt-auto px-4 py-3 border-t border-aws-border text-[11px] text-aws-text-muted">
            <div>© 2026, Amazon Web Services, Inc.</div>
            <div className="mt-1">Privacy · Terms · Cookies</div>
          </div>
        </div>
      </aside>
    </>
  );
}
