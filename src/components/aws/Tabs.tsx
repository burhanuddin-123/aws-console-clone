import { useState, type ReactNode } from "react";

export function Tabs({ tabs, defaultTab }: { tabs: { id: string; label: string; content: ReactNode }[]; defaultTab?: string }) {
  const [active, setActive] = useState(defaultTab ?? tabs[0]?.id);
  const activeTab = tabs.find((t) => t.id === active);

  return (
    <div>
      <div className="flex border-b border-aws-border overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActive(t.id)}
            className={`px-4 py-2.5 text-[14px] whitespace-nowrap border-b-2 -mb-px transition-colors
              ${active === t.id ? "border-aws-blue text-aws-blue font-semibold" : "border-transparent text-aws-text hover:bg-aws-surface"}`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="pt-4">{activeTab?.content}</div>
    </div>
  );
}
