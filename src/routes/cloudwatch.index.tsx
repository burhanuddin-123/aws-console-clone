import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar, AreaChart, Area } from "recharts";
import { Activity, FileSearch, Bell, LayoutDashboard, Sparkles } from "lucide-react";
import { PageHeader, StatusBadge } from "@/components/aws/Primitives";
import { alarms, logGroups, cpuMetric, invocationMetric, errorRateMetric, billingMetric } from "@/data/cloudwatch";

export const Route = createFileRoute("/cloudwatch/")({
  head: () => ({
    meta: [
      { title: "CloudWatch | Overview" },
      { name: "description", content: "Amazon CloudWatch — monitor resources, view logs, and manage alarms." },
    ],
  }),
  component: CloudWatch,
});

const subnav = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "metrics", label: "Metrics", icon: Activity },
  { id: "logs", label: "Logs", icon: FileSearch },
  { id: "alarms", label: "Alarms", icon: Bell },
  { id: "insights", label: "Insights", icon: Sparkles },
];

function CloudWatch() {
  const [tab, setTab] = useState("overview");

  return (
    <div className="p-6 max-w-[1600px]">
      <PageHeader
        title="CloudWatch"
        description="Observability of your AWS resources and applications"
        breadcrumbs={[{ label: "CloudWatch", to: "/cloudwatch" }]}
        actions={<button className="aws-btn-primary">Create dashboard</button>}
      />

      <div className="flex gap-1 border-b border-aws-border mb-5 overflow-x-auto">
        {subnav.map((s) => {
          const Icon = s.icon;
          return (
            <button
              key={s.id} onClick={() => setTab(s.id)}
              className={`px-4 py-2 text-[14px] inline-flex items-center gap-2 border-b-2 -mb-px whitespace-nowrap
                ${tab === s.id ? "border-aws-blue text-aws-blue font-semibold" : "border-transparent hover:bg-aws-surface"}`}
            >
              <Icon size={14} /> {s.label}
            </button>
          );
        })}
      </div>

      {tab === "overview" && (
        <div className="grid md:grid-cols-2 gap-4">
          <ChartCard title="EC2 CPU utilization (%)" data={cpuMetric} color="#0972d3" type="area" />
          <ChartCard title="Lambda invocations" data={invocationMetric} color="#ff9900" type="line" />
          <ChartCard title="Error rate" data={errorRateMetric} color="#dd344c" type="line" />
          <ChartCard title="Estimated charges (USD)" data={billingMetric} color="#7aa116" type="bar" xKey="day" />
        </div>
      )}

      {tab === "alarms" && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {alarms.map((a) => (
            <div key={a.name} className="aws-card p-5">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold">{a.name}</h3>
                <StatusBadge status={a.state} />
              </div>
              <dl className="space-y-1 text-[13px]">
                <div className="flex justify-between"><dt className="text-aws-text-muted">Metric</dt><dd className="font-mono text-[12px]">{a.metric}</dd></div>
                <div className="flex justify-between"><dt className="text-aws-text-muted">Threshold</dt><dd>{a.threshold}</dd></div>
                <div className="flex justify-between"><dt className="text-aws-text-muted">Updated</dt><dd>{new Date(a.lastUpdated).toLocaleString()}</dd></div>
              </dl>
            </div>
          ))}
        </div>
      )}

      {tab === "logs" && (
        <div className="aws-card overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead className="bg-aws-surface"><tr>
              <th className="px-3 py-2 text-left font-semibold">Log group</th>
              <th className="px-3 py-2 text-left font-semibold">Retention</th>
              <th className="px-3 py-2 text-left font-semibold">Stored</th>
              <th className="px-3 py-2 text-left font-semibold">Streams</th>
            </tr></thead>
            <tbody>
              {logGroups.map((g) => (
                <tr key={g.name} className="border-t border-aws-border hover:bg-aws-surface">
                  <td className="px-3 py-2 font-mono text-[12px] aws-link">{g.name}</td>
                  <td className="px-3 py-2">{g.retention}</td>
                  <td className="px-3 py-2">{g.stored}</td>
                  <td className="px-3 py-2">{g.streams}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "metrics" && (
        <div className="aws-card p-5">
          <h3 className="font-semibold mb-3">Browse metrics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {["EC2", "Lambda", "S3", "DynamoDB", "ApiGateway", "RDS", "CloudFront", "ECS"].map((ns) => (
              <button key={ns} className="aws-card p-4 text-left hover:bg-aws-surface">
                <div className="font-semibold">{ns}</div>
                <div className="text-[12px] text-aws-text-muted">{Math.floor(Math.random() * 50) + 10} metrics</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {tab === "insights" && (
        <div className="aws-card p-5">
          <h3 className="font-semibold mb-3">Logs Insights query</h3>
          <textarea
            defaultValue={"fields @timestamp, @message\n| filter @message like /ERROR/\n| sort @timestamp desc\n| limit 100"}
            rows={6}
            className="w-full font-mono text-[13px] border border-aws-border rounded p-3 outline-none"
          />
          <div className="flex justify-end mt-3"><button className="aws-btn-primary">Run query</button></div>
        </div>
      )}
    </div>
  );
}

function ChartCard({ title, data, color, type, xKey = "time" }: { title: string; data: any[]; color: string; type: "line" | "bar" | "area"; xKey?: string }) {
  return (
    <div className="aws-card p-5">
      <h3 className="font-semibold mb-3 text-[14px]">{title}</h3>
      <div className="h-52">
        <ResponsiveContainer>
          {type === "area" ? (
            <AreaChart data={data}>
              <defs>
                <linearGradient id={`g-${title}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={0.4} />
                  <stop offset="100%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey={xKey} tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Area dataKey="value" stroke={color} strokeWidth={2} fill={`url(#g-${title})`} />
            </AreaChart>
          ) : type === "bar" ? (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey={xKey} tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="value" fill={color} />
            </BarChart>
          ) : (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey={xKey} tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line dataKey="value" stroke={color} strokeWidth={2} dot={false} />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
