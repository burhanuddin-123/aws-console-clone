import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Search, Bell, HelpCircle, Settings, ChevronDown, Menu } from "lucide-react";
import { regions } from "@/data/services";

export function AwsTopNav({ onToggleSidebar }: { onToggleSidebar: () => void }) {
  const [region, setRegion] = useState("Asia Pacific (Mumbai)");
  const [regionOpen, setRegionOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  return (
    <header className="h-[40px] bg-aws-nav text-white flex items-center px-3 sticky top-0 z-50 text-[14px]">
      <button
        onClick={onToggleSidebar}
        className="p-2 hover:bg-aws-nav-hover rounded mr-1"
        aria-label="Toggle sidebar"
      >
        <Menu size={18} />
      </button>

      <Link to="/" className="flex items-center gap-2 px-2 hover:bg-aws-nav-hover rounded h-[32px]">
        <svg width="32" height="20" viewBox="0 0 100 60" fill="none">
          <path d="M28 35.5c0 1.5.2 2.7.5 3.6.4.9.9 1.8 1.5 2.8.2.4.3.7.3 1 0 .4-.3.9-.9 1.3l-3 2c-.4.3-.9.4-1.3.4-.5 0-1-.2-1.5-.7-.7-.7-1.3-1.5-1.8-2.3-.5-.9-1-1.9-1.5-3.1-3.5 4.1-7.9 6.2-13.2 6.2-3.8 0-6.8-1.1-9-3.2-2.2-2.2-3.3-5.1-3.3-8.7 0-3.8 1.3-6.9 4-9.2 2.7-2.4 6.3-3.5 10.9-3.5 1.5 0 3.1.1 4.7.4 1.7.2 3.4.6 5.2 1v-3.3c0-3.4-.7-5.8-2.1-7.2-1.4-1.4-3.9-2.1-7.4-2.1-1.6 0-3.2.2-4.9.6-1.7.4-3.3.9-4.9 1.5-.7.3-1.3.5-1.6.6-.3.1-.6.1-.8.1-.7 0-1-.5-1-1.5v-2.3c0-.8.1-1.4.4-1.7.3-.4.7-.7 1.4-1.1 1.6-.8 3.5-1.5 5.7-2.1 2.2-.6 4.5-.9 7-.9 5.3 0 9.2 1.2 11.7 3.6 2.5 2.4 3.7 6.1 3.7 11v14.5h.1zm-18.2 6.8c1.5 0 3.1-.3 4.7-.8 1.6-.6 3.1-1.6 4.3-3 .7-.9 1.3-1.8 1.6-2.9.3-1.1.5-2.4.5-3.9v-1.9c-1.3-.3-2.6-.6-4-.7-1.4-.2-2.8-.3-4.1-.3-2.9 0-5.1.6-6.5 1.8-1.4 1.2-2.1 2.9-2.1 5.1 0 2.1.5 3.6 1.6 4.7 1 1.1 2.6 1.6 4.7 1.6h-.7zm36.1 4.8c-.9 0-1.5-.2-1.9-.5-.4-.3-.8-.9-1.1-1.8L31.6 12.2c-.3-.9-.5-1.5-.5-1.9 0-.7.4-1.1 1.1-1.1h4.7c.9 0 1.6.2 1.9.5.4.3.8.9 1.1 1.8l8 31.3 7.4-31.3c.2-.9.5-1.5.9-1.8.4-.3 1.1-.5 2-.5h3.8c.9 0 1.6.2 2 .5.4.3.8.9 1 1.8l7.5 31.6 8.2-31.6c.3-.9.6-1.5 1-1.8.4-.3 1.1-.5 1.9-.5h4.4c.7 0 1.1.4 1.1 1.1 0 .2 0 .4-.1.7s-.2.6-.4 1.1l-11.5 32.6c-.3.9-.7 1.5-1.1 1.8-.4.3-1 .5-1.9.5h-4.1c-.9 0-1.6-.2-2-.5-.4-.4-.8-.9-1-1.9l-7.4-30.5-7.3 30.5c-.2.9-.6 1.5-1 1.9-.4.4-1.1.5-2 .5h-4.1z" fill="#fff"/>
          <path d="M89.4 53.4c-7.4 0-13.5-1.3-18.5-3.9-1-.6-1.7-1.1-1.9-1.5-.2-.4-.3-.9-.3-1.3v-1.5c0-.8.4-1.2 1.2-1.2.3 0 .6.1 1 .2.4.1.9.3 1.5.5 3.7 1.6 7.6 2.4 11.6 2.4 5.6 0 10-1.1 12.9-3.3.4 1.9-.4 2.8-1.5 2.8-1.4 0-3.5-.4-5.5-1.1l5 6.9z" fill="#FF9900"/>
          <path d="M96.4 47.9c-.5-.5-3.7-1.1-6.4-1.4-.8-.1-1-.5-.3-1 2.5-1.8 6.7-2.4 7.3-1.3.6 1.2-.2 5.1-.6 5.4-.4.3-1.1.1-1.3-.4-.2-.5-1-1.7-1-1.7l2.3-.6c-.1-.3 0 1 0 1z" fill="#FF9900"/>
        </svg>
      </Link>

      <div className="flex-1 max-w-2xl mx-4 relative">
        <div className="flex items-center bg-white rounded text-aws-text">
          <Search size={16} className="ml-3 text-aws-text-muted" />
          <input
            type="text"
            placeholder="Search for services, features, blogs, docs, and more"
            className="flex-1 px-2 py-1.5 text-[13px] bg-transparent outline-none"
          />
          <span className="text-[11px] text-aws-text-muted px-2 border border-aws-border rounded mr-2">[Alt+S]</span>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button className="relative p-2 hover:bg-aws-nav-hover rounded" aria-label="Notifications">
          <Bell size={16} />
          <span className="absolute top-1 right-1 bg-aws-orange text-aws-text text-[9px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center">3</span>
        </button>
        <button className="p-2 hover:bg-aws-nav-hover rounded" aria-label="Help">
          <HelpCircle size={16} />
        </button>
        <button className="p-2 hover:bg-aws-nav-hover rounded" aria-label="Settings">
          <Settings size={16} />
        </button>

        <div className="relative">
          <button
            onClick={() => { setRegionOpen(!regionOpen); setAccountOpen(false); }}
            className="flex items-center gap-1 px-3 py-1.5 hover:bg-aws-nav-hover rounded text-[13px]"
          >
            {region}
            <ChevronDown size={14} />
          </button>
          {regionOpen && (
            <div className="absolute right-0 top-full mt-1 bg-white text-aws-text border border-aws-border rounded shadow-lg w-72 max-h-96 overflow-auto z-50">
              <div className="px-3 py-2 border-b border-aws-border font-semibold text-[12px]">Select a Region</div>
              {regions.map(r => (
                <button
                  key={r.id}
                  onClick={() => { setRegion(r.name); setRegionOpen(false); }}
                  className="w-full text-left px-3 py-2 hover:bg-aws-surface text-[13px] flex justify-between"
                >
                  <span>{r.name}</span>
                  <span className="text-aws-text-muted text-[11px]">{r.id}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => { setAccountOpen(!accountOpen); setRegionOpen(false); }}
            className="flex flex-col items-end px-3 py-1 hover:bg-aws-nav-hover rounded leading-tight"
          >
            <span className="text-[12px]">mentorskool/burhan</span>
            <span className="text-[10px] text-white/70">512357470856</span>
          </button>
          {accountOpen && (
            <div className="absolute right-0 top-full mt-1 bg-white text-aws-text border border-aws-border rounded shadow-lg w-72 z-50">
              <div className="px-4 py-3 border-b border-aws-border">
                <div className="font-semibold">mentorskool</div>
                <div className="text-[12px] text-aws-text-muted">Account ID: 512357470856</div>
                <div className="text-[12px] text-aws-text-muted mt-1">AdministratorAccess/burhan</div>
              </div>
              <button className="w-full text-left px-4 py-2 hover:bg-aws-surface text-[13px]">Account</button>
              <button className="w-full text-left px-4 py-2 hover:bg-aws-surface text-[13px]">Organization</button>
              <button className="w-full text-left px-4 py-2 hover:bg-aws-surface text-[13px]">Service Quotas</button>
              <button className="w-full text-left px-4 py-2 hover:bg-aws-surface text-[13px]">Billing and Cost Management</button>
              <button className="w-full text-left px-4 py-2 hover:bg-aws-surface text-[13px] border-t border-aws-border">Sign out</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
