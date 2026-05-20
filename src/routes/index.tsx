import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
} from "recharts";
import {
  Plus, Search, ChevronDown, RotateCcw, ExternalLink, Box, AlertTriangle,
  CheckCircle2, Clock, BookOpen, GraduationCap, FileText, Shield, Activity,
} from "lucide-react";
import { PageHeader } from "@/components/aws/Primitives";
import { DashboardWidget } from "@/components/aws/DashboardWidget";
import { recentServices } from "@/data/services";
import { costData } from "@/data/cloudwatch";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Console Home | AWS Management Console" },
      { name: "description", content: "AWS Console Home dashboard with widgets for recently visited services, applications, cost, and health." },
    ],
  }),
  component: ConsoleHome,
});

function ConsoleHome() {
  return (
    <div className="p-6 max-w-[1600px]">
      <PageHeader
        title="Console Home"
        actions={
          <>
            <button className="aws-btn-secondary inline-flex items-center gap-1.5">
              <RotateCcw size={14} /> Reset to default layout
            </button>
            <button className="aws-btn-primary inline-flex items-center gap-1.5">
              <Plus size={14} /> Add widgets
            </button>
          </>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <RecentlyVisited />
        <Applications />
        <WelcomeWidget />
        <AwsHealth />
        <CostAndUsage />
        <TrustedAdvisor />
        <SecurityHub />
        <RecentActivity />
      </div>
    </div>
  );
}

function RecentlyVisited() {
  return (
    <DashboardWidget title="Recently visited" span={2}>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
        {recentServices.map((s) => {
          const tile = (
            <motion.div
              whileHover={{ y: -2 }}
              className="flex items-center gap-2.5 p-2.5 rounded-lg hover:bg-aws-surface cursor-pointer border border-transparent hover:border-aws-border"
            >
              <div className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0" style={{ background: `${s.color}15` }}>
                <s.icon size={18} style={{ color: s.color }} />
              </div>
              <div className="min-w-0">
                <div className="text-[13px] font-medium truncate">{s.name}</div>
                <div className="text-[11px] text-aws-text-muted truncate">{s.category}</div>
              </div>
            </motion.div>
          );
          return s.path ? <Link key={s.name} to={s.path}>{tile}</Link> : <div key={s.name}>{tile}</div>;
        })}
      </div>
      <div className="mt-3 pt-3 border-t border-aws-border flex items-center justify-between">
        <button className="text-[13px] aws-link">View all services</button>
        <button className="text-[13px] aws-link">Pinned services</button>
      </div>
    </DashboardWidget>
  );
}

function Applications() {
  const [region, setRegion] = useState("Asia Pacific (Mumbai)");
  return (
    <DashboardWidget
      title="Applications"
      span={2}
      action={
        <button className="aws-btn-primary text-[12px] inline-flex items-center gap-1">
          <Plus size={12} /> Create application
        </button>
      }
    >
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <div className="text-[13px] text-aws-text-muted">Region</div>
        <button className="aws-btn-secondary inline-flex items-center gap-1 text-[12px]">
          {region} <ChevronDown size={12} />
        </button>
        <div className="flex-1 min-w-[200px] flex items-center bg-white border border-aws-border rounded ml-auto max-w-xs">
          <Search size={14} className="ml-2 text-aws-text-muted" />
          <input placeholder="Find applications" className="flex-1 px-2 py-1.5 text-[13px] outline-none" />
        </div>
      </div>
      <table className="w-full text-[13px] border border-aws-border rounded">
        <thead className="bg-aws-surface">
          <tr>
            <th className="px-3 py-2 text-left font-semibold">Name</th>
            <th className="px-3 py-2 text-left font-semibold">Application source</th>
            <th className="px-3 py-2 text-left font-semibold">Description</th>
          </tr>
        </thead>
        <tbody>
          <tr><td colSpan={3} className="py-12 text-center text-aws-text-muted">
            <Box size={36} className="mx-auto mb-2" />
            <div className="font-semibold text-aws-text">No applications</div>
            <div className="text-[12px] mt-1">Get started by creating your first application.</div>
          </td></tr>
        </tbody>
      </table>
      <div className="flex justify-between items-center mt-2 text-[12px] text-aws-text-muted">
        <span>0 applications</span>
        <div className="flex items-center gap-1">
          <button disabled className="px-2 py-0.5 disabled:opacity-40">‹</button>
          <span>1</span>
          <button disabled className="px-2 py-0.5 disabled:opacity-40">›</button>
        </div>
      </div>
    </DashboardWidget>
  );
}

function WelcomeWidget() {
  const links = [
    { icon: BookOpen, title: "Getting started with AWS", desc: "Learn the fundamentals to get started." },
    { icon: GraduationCap, title: "Training and certification", desc: "Learn from AWS experts and advance your skills." },
    { icon: FileText, title: "What's new with AWS?", desc: "Discover new AWS services, features, and Regions." },
  ];
  return (
    <DashboardWidget title="Welcome to AWS">
      <div className="space-y-3">
        {links.map((l) => (
          <a key={l.title} className="flex items-start gap-3 p-2 rounded hover:bg-aws-surface cursor-pointer">
            <l.icon size={18} className="text-aws-blue mt-0.5" />
            <div>
              <div className="text-[13px] font-medium aws-link inline-flex items-center gap-1">
                {l.title} <ExternalLink size={11} />
              </div>
              <div className="text-[12px] text-aws-text-muted">{l.desc}</div>
            </div>
          </a>
        ))}
      </div>
    </DashboardWidget>
  );
}

function AwsHealth() {
  return (
    <DashboardWidget title="AWS Health">
      <div className="space-y-2">
        <div className="flex items-center gap-3 p-2 rounded hover:bg-aws-surface">
          <AlertTriangle size={16} className="text-aws-warning" />
          <div className="flex-1">
            <div className="text-[13px] font-medium">Open issues</div>
          </div>
          <div className="text-[16px] font-semibold">0</div>
        </div>
        <div className="flex items-center gap-3 p-2 rounded hover:bg-aws-surface">
          <Clock size={16} className="text-aws-blue" />
          <div className="flex-1"><div className="text-[13px] font-medium">Scheduled changes</div></div>
          <div className="text-[16px] font-semibold">2</div>
        </div>
        <div className="flex items-center gap-3 p-2 rounded hover:bg-aws-surface">
          <CheckCircle2 size={16} className="text-aws-success" />
          <div className="flex-1"><div className="text-[13px] font-medium">Other notifications</div></div>
          <div className="text-[16px] font-semibold">5</div>
        </div>
      </div>
      <a className="text-[13px] aws-link mt-3 inline-block">Go to AWS Health dashboard</a>
    </DashboardWidget>
  );
}

function CostAndUsage() {
  return (
    <DashboardWidget title="Cost and usage" span={2}>
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <div className="text-[12px] text-aws-text-muted">Current month</div>
          <div className="text-[22px] font-semibold mt-1">$847.42</div>
        </div>
        <div>
          <div className="text-[12px] text-aws-text-muted">Forecasted month end</div>
          <div className="text-[22px] font-semibold mt-1">$1,284.10</div>
        </div>
        <div>
          <div className="text-[12px] text-aws-text-muted">Savings opportunities</div>
          <div className="text-[22px] font-semibold mt-1 text-aws-success">$184.20</div>
        </div>
      </div>
      <div className="h-56">
        <ResponsiveContainer>
          <BarChart data={costData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e9ecef" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `$${v}`} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="EC2" stackId="a" fill="#ff9900" />
            <Bar dataKey="S3" stackId="a" fill="#7aa116" />
            <Bar dataKey="Lambda" stackId="a" fill="#ed7100" />
            <Bar dataKey="DynamoDB" stackId="a" fill="#3b48cc" />
            <Bar dataKey="Other" stackId="a" fill="#8c4fff" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </DashboardWidget>
  );
}

function TrustedAdvisor() {
  const items = [
    { label: "Cost optimization", count: 12, color: "text-aws-blue" },
    { label: "Security", count: 4, color: "text-aws-error" },
    { label: "Fault tolerance", count: 2, color: "text-aws-warning" },
    { label: "Performance", count: 1, color: "text-aws-warning" },
  ];
  return (
    <DashboardWidget title="Trusted Advisor">
      <div className="space-y-2">
        {items.map((i) => (
          <div key={i.label} className="flex items-center justify-between p-2 hover:bg-aws-surface rounded">
            <span className="text-[13px]">{i.label}</span>
            <span className={`text-[14px] font-semibold ${i.color}`}>{i.count}</span>
          </div>
        ))}
      </div>
    </DashboardWidget>
  );
}

function SecurityHub() {
  return (
    <DashboardWidget title="Security Hub">
      <div className="flex items-start gap-3">
        <Shield size={22} className="text-aws-blue mt-1" />
        <div className="flex-1">
          <div className="text-[13px]">Security score</div>
          <div className="text-[32px] font-bold leading-tight">84%</div>
          <div className="text-[12px] text-aws-text-muted">Based on 248 controls</div>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 text-center">
        <div className="p-2 bg-red-50 rounded">
          <div className="text-[18px] font-semibold text-red-700">3</div>
          <div className="text-[11px] text-aws-text-muted">Critical</div>
        </div>
        <div className="p-2 bg-orange-50 rounded">
          <div className="text-[18px] font-semibold text-orange-700">12</div>
          <div className="text-[11px] text-aws-text-muted">High</div>
        </div>
        <div className="p-2 bg-yellow-50 rounded">
          <div className="text-[18px] font-semibold text-yellow-700">28</div>
          <div className="text-[11px] text-aws-text-muted">Medium</div>
        </div>
      </div>
    </DashboardWidget>
  );
}

function RecentActivity() {
  const activity = [
    { who: "burhan", what: "Started instance i-0a12b34c56d789ef0", when: "12 minutes ago" },
    { who: "burhan", what: "Created S3 bucket ml-training-checkpoints", when: "2 hours ago" },
    { who: "ci-deploy", what: "Updated Lambda processOrders", when: "Yesterday" },
    { who: "burhan", what: "Modified IAM policy DataScienceRole", when: "Yesterday" },
  ];
  return (
    <DashboardWidget title="Recent activity">
      <div className="space-y-3">
        {activity.map((a, i) => (
          <div key={i} className="flex items-start gap-3">
            <Activity size={14} className="text-aws-text-muted mt-1" />
            <div className="flex-1">
              <div className="text-[13px]"><span className="font-medium">{a.who}</span> {a.what}</div>
              <div className="text-[11px] text-aws-text-muted">{a.when}</div>
            </div>
          </div>
        ))}
      </div>
    </DashboardWidget>
  );
}
