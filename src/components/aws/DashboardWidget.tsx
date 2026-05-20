import { useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { GripVertical, MoreVertical, X } from "lucide-react";

export function DashboardWidget({
  title, children, action, span = 1, removable = true,
}: { title: string; children: ReactNode; action?: ReactNode; span?: 1 | 2; removable?: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  if (hidden) return null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`aws-card flex flex-col ${span === 2 ? "md:col-span-2" : ""}`}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-aws-border">
        <div className="flex items-center gap-2">
          <GripVertical size={14} className="text-aws-text-muted cursor-grab" />
          <h3 className="font-semibold text-[15px]">{title}</h3>
        </div>
        <div className="flex items-center gap-1">
          {action}
          <div className="relative">
            <button onClick={() => setMenuOpen(!menuOpen)} className="p-1 hover:bg-aws-surface rounded">
              <MoreVertical size={14} />
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-full mt-1 bg-white border border-aws-border rounded shadow-lg w-44 z-10 text-[13px]">
                <button className="w-full text-left px-3 py-2 hover:bg-aws-surface">Edit widget</button>
                <button className="w-full text-left px-3 py-2 hover:bg-aws-surface">Refresh</button>
                {removable && (
                  <button onClick={() => setHidden(true)} className="w-full text-left px-3 py-2 hover:bg-aws-surface text-aws-error">Remove widget</button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="p-4 flex-1">{children}</div>
      <div className="h-2 cursor-se-resize" />
    </motion.div>
  );
}
