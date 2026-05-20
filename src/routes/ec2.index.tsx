import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Play, Square, RotateCw, Trash2, Terminal, Server } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, StatusBadge } from "@/components/aws/Primitives";
import { DataTable, type Column } from "@/components/aws/DataTable";
import { awsClient } from "@/api/awsClient";
import type { Ec2Instance } from "@/data/ec2";

export const Route = createFileRoute("/ec2/")({
  head: () => ({
    meta: [
      { title: "EC2 | Instances" },
      { name: "description", content: "Amazon EC2 — secure, resizable cloud compute capacity." },
    ],
  }),
  component: Ec2Index,
});

function Ec2Index() {
  const [data, setData] = useState<Ec2Instance[]>([]);
  const navigate = useNavigate();

  async function refresh() { setData(await awsClient.listInstances()); }
  useEffect(() => { refresh(); }, []);

  const running = data.filter((i) => i.state === "running").length;
  const stopped = data.filter((i) => i.state === "stopped").length;

  async function action(fn: () => Promise<any>, msg: string) {
    await fn(); toast.success(msg); refresh();
  }

  const cols: Column<Ec2Instance>[] = [
    {
      key: "id", header: "Instance ID",
      render: (i) => (
        <button onClick={(e) => { e.stopPropagation(); navigate({ to: "/ec2/$instanceId", params: { instanceId: i.id } }); }} className="aws-link font-mono text-[12px]">
          {i.id}
        </button>
      ),
    },
    { key: "name", header: "Name" },
    { key: "state", header: "Instance state", render: (i) => <StatusBadge status={i.state} /> },
    { key: "type", header: "Instance type", render: (i) => <span className="font-mono text-[12px]">{i.type}</span> },
    { key: "publicIp", header: "Public IPv4", render: (i) => <span className="font-mono text-[12px]">{i.publicIp}</span> },
    { key: "az", header: "Availability Zone" },
    {
      key: "securityGroups", header: "Security groups",
      render: (i) => <span className="text-[12px]">{i.securityGroups.join(", ")}</span>,
    },
  ];

  return (
    <div className="p-6 max-w-[1600px]">
      <PageHeader
        title="Instances"
        description={`${data.length} instances · ${running} running · ${stopped} stopped`}
        breadcrumbs={[{ label: "EC2", to: "/ec2" }, { label: "Instances" }]}
        actions={
          <>
            <button onClick={() => toast.info("Connect dialog opened")} className="aws-btn-secondary inline-flex items-center gap-1.5"><Terminal size={14} /> Connect</button>
            <button className="aws-btn-secondary">Instance state ▾</button>
            <button className="aws-btn-secondary">Actions</button>
            <button onClick={() => toast.success("Launch wizard opened")} className="aws-btn-primary inline-flex items-center gap-1.5"><Server size={14} /> Launch instance</button>
          </>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="aws-card p-4"><div className="text-[12px] text-aws-text-muted">Total</div><div className="text-[22px] font-semibold mt-1">{data.length}</div></div>
        <div className="aws-card p-4"><div className="text-[12px] text-aws-text-muted">Running</div><div className="text-[22px] font-semibold mt-1 text-aws-success">{running}</div></div>
        <div className="aws-card p-4"><div className="text-[12px] text-aws-text-muted">Stopped</div><div className="text-[22px] font-semibold mt-1">{stopped}</div></div>
        <div className="aws-card p-4"><div className="text-[12px] text-aws-text-muted">Total vCPU</div><div className="text-[22px] font-semibold mt-1">14</div></div>
      </div>

      <DataTable
        data={data}
        columns={cols}
        rowKey={(i) => i.id}
        selectable
        searchKeys={["id", "name", "type", "publicIp"]}
        onRowClick={(i) => navigate({ to: "/ec2/$instanceId", params: { instanceId: i.id } })}
        toolbar={
          <>
            <button onClick={() => data[0] && action(() => awsClient.startInstance(data[0].id), `Started ${data[0].id}`)} className="aws-btn-secondary inline-flex items-center gap-1 text-[12px]"><Play size={12} /> Start</button>
            <button onClick={() => data[0] && action(() => awsClient.stopInstance(data[0].id), `Stopped ${data[0].id}`)} className="aws-btn-secondary inline-flex items-center gap-1 text-[12px]"><Square size={12} /> Stop</button>
            <button onClick={() => data[0] && action(() => awsClient.rebootInstance(data[0].id), `Rebooted ${data[0].id}`)} className="aws-btn-secondary inline-flex items-center gap-1 text-[12px]"><RotateCw size={12} /> Reboot</button>
            <button onClick={() => data[0] && action(() => awsClient.terminateInstance(data[0].id), `Terminated ${data[0].id}`)} className="aws-btn-secondary inline-flex items-center gap-1 text-[12px] text-aws-error"><Trash2 size={12} /> Terminate</button>
          </>
        }
      />
    </div>
  );
}
