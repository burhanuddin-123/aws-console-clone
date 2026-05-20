import { createFileRoute } from "@tanstack/react-router";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area } from "recharts";
import { PageHeader, StatusBadge } from "@/components/aws/Primitives";
import { Tabs } from "@/components/aws/Tabs";
import { instances, cpuData } from "@/data/ec2";

export const Route = createFileRoute("/ec2/$instanceId")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.instanceId} | EC2 Instance` },
      { name: "description", content: `Details, monitoring, and configuration for EC2 instance ${params.instanceId}.` },
    ],
  }),
  component: InstanceDetail,
});

function InstanceDetail() {
  const { instanceId } = Route.useParams();
  const inst = instances.find((i) => i.id === instanceId);
  if (!inst) return <div className="p-6">Instance not found.</div>;

  return (
    <div className="p-6 max-w-[1600px]">
      <PageHeader
        title={inst.name}
        description={inst.id}
        breadcrumbs={[{ label: "EC2", to: "/ec2" }, { label: "Instances", to: "/ec2" }, { label: inst.id }]}
        actions={<><StatusBadge status={inst.state} /><button className="aws-btn-secondary">Connect</button><button className="aws-btn-primary">Actions</button></>}
      />

      <Tabs tabs={[
        { id: "details", label: "Details", content: (
          <div className="aws-card p-5">
            <h3 className="font-semibold mb-3">Instance summary</h3>
            <dl className="grid grid-cols-2 md:grid-cols-3 gap-4 text-[13px]">
              <div><dt className="text-aws-text-muted">Instance ID</dt><dd className="font-mono text-[12px]">{inst.id}</dd></div>
              <div><dt className="text-aws-text-muted">Instance type</dt><dd className="font-mono text-[12px]">{inst.type}</dd></div>
              <div><dt className="text-aws-text-muted">Availability Zone</dt><dd>{inst.az}</dd></div>
              <div><dt className="text-aws-text-muted">Public IPv4</dt><dd className="font-mono text-[12px]">{inst.publicIp}</dd></div>
              <div><dt className="text-aws-text-muted">Private IPv4</dt><dd className="font-mono text-[12px]">{inst.privateIp}</dd></div>
              <div><dt className="text-aws-text-muted">Launch time</dt><dd>{new Date(inst.launchTime).toLocaleString()}</dd></div>
              <div><dt className="text-aws-text-muted">AMI</dt><dd className="font-mono text-[12px]">{inst.ami}</dd></div>
              <div><dt className="text-aws-text-muted">Key pair</dt><dd>{inst.keyPair}</dd></div>
              <div><dt className="text-aws-text-muted">VPC</dt><dd className="font-mono text-[12px]">{inst.vpc}</dd></div>
            </dl>
          </div>
        )},
        { id: "security", label: "Security", content: (
          <div className="aws-card p-5">
            <h3 className="font-semibold mb-3">Security groups</h3>
            <div className="space-y-2">
              {inst.securityGroups.map((sg) => (
                <div key={sg} className="flex items-center justify-between p-3 border border-aws-border rounded">
                  <span className="font-mono text-[13px] aws-link">{sg}</span>
                  <span className="text-[12px] text-aws-text-muted">3 inbound rules</span>
                </div>
              ))}
            </div>
          </div>
        )},
        { id: "networking", label: "Networking", content: (
          <div className="aws-card p-5">
            <h3 className="font-semibold mb-3">Networking details</h3>
            <dl className="grid grid-cols-2 gap-4 text-[13px]">
              <div><dt className="text-aws-text-muted">VPC</dt><dd className="font-mono text-[12px]">{inst.vpc}</dd></div>
              <div><dt className="text-aws-text-muted">Subnet</dt><dd className="font-mono text-[12px]">subnet-0a1b2c3d4e5f</dd></div>
              <div><dt className="text-aws-text-muted">Public DNS</dt><dd className="font-mono text-[12px]">ec2-{inst.publicIp.replace(/\./g, "-")}.{inst.az}.compute.amazonaws.com</dd></div>
              <div><dt className="text-aws-text-muted">Private DNS</dt><dd className="font-mono text-[12px]">ip-{inst.privateIp.replace(/\./g, "-")}.internal</dd></div>
            </dl>
          </div>
        )},
        { id: "storage", label: "Storage", content: (
          <div className="aws-card overflow-hidden">
            <table className="w-full text-[13px]">
              <thead className="bg-aws-surface"><tr>
                <th className="px-3 py-2 text-left font-semibold">Volume ID</th>
                <th className="px-3 py-2 text-left font-semibold">Device</th>
                <th className="px-3 py-2 text-left font-semibold">Size</th>
                <th className="px-3 py-2 text-left font-semibold">Type</th>
                <th className="px-3 py-2 text-left font-semibold">State</th>
              </tr></thead>
              <tbody>
                <tr className="border-t border-aws-border"><td className="px-3 py-2 font-mono text-[12px] aws-link">vol-0a1b2c3d4e5f6</td><td className="px-3 py-2">/dev/xvda</td><td className="px-3 py-2">30 GiB</td><td className="px-3 py-2">gp3</td><td className="px-3 py-2"><StatusBadge status="OK" /></td></tr>
                <tr className="border-t border-aws-border"><td className="px-3 py-2 font-mono text-[12px] aws-link">vol-1b2c3d4e5f6a</td><td className="px-3 py-2">/dev/sdb</td><td className="px-3 py-2">100 GiB</td><td className="px-3 py-2">gp3</td><td className="px-3 py-2"><StatusBadge status="OK" /></td></tr>
              </tbody>
            </table>
          </div>
        )},
        { id: "monitoring", label: "Monitoring", content: (
          <div className="grid md:grid-cols-2 gap-4">
            <div className="aws-card p-5">
              <h3 className="font-semibold mb-3 text-[14px]">CPU utilization (%)</h3>
              <div className="h-48">
                <ResponsiveContainer>
                  <AreaChart data={cpuData}>
                    <defs>
                      <linearGradient id="cpu" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#0972d3" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="#0972d3" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="time" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Area dataKey="cpu" stroke="#0972d3" strokeWidth={2} fill="url(#cpu)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="aws-card p-5">
              <h3 className="font-semibold mb-3 text-[14px]">Network in (KB)</h3>
              <div className="h-48">
                <ResponsiveContainer>
                  <LineChart data={cpuData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="time" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Line dataKey="network" stroke="#ff9900" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )},
        { id: "tags", label: "Tags", content: (
          <div className="aws-card overflow-hidden">
            <table className="w-full text-[13px]">
              <thead className="bg-aws-surface"><tr><th className="px-3 py-2 text-left font-semibold">Key</th><th className="px-3 py-2 text-left font-semibold">Value</th></tr></thead>
              <tbody>
                <tr className="border-t border-aws-border"><td className="px-3 py-2 font-mono text-[12px]">Name</td><td className="px-3 py-2">{inst.name}</td></tr>
                <tr className="border-t border-aws-border"><td className="px-3 py-2 font-mono text-[12px]">Environment</td><td className="px-3 py-2">production</td></tr>
                <tr className="border-t border-aws-border"><td className="px-3 py-2 font-mono text-[12px]">Team</td><td className="px-3 py-2">platform</td></tr>
              </tbody>
            </table>
          </div>
        )},
      ]} />
    </div>
  );
}
