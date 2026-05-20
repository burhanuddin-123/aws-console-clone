import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Play } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, StatusBadge } from "@/components/aws/Primitives";
import { Tabs } from "@/components/aws/Tabs";
import { tables } from "@/data/dynamodb";
import { awsClient } from "@/api/awsClient";

export const Route = createFileRoute("/dynamodb/$tableName")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.tableName} | DynamoDB` },
      { name: "description", content: `Explore items, indexes, and capacity for the ${params.tableName} DynamoDB table.` },
    ],
  }),
  component: TableDetail,
});

function TableDetail() {
  const { tableName } = Route.useParams();
  const table = tables.find((t) => t.name === tableName);
  const [items, setItems] = useState<Record<string, any>[]>([]);
  const [query, setQuery] = useState(`SELECT * FROM "${tableName}"`);

  useEffect(() => { awsClient.scanTable(tableName).then(setItems); }, [tableName]);

  if (!table) return <div className="p-6">Table not found.</div>;

  const keys = items[0] ? Object.keys(items[0]) : [];

  return (
    <div className="p-6 max-w-[1600px]">
      <PageHeader
        title={table.name}
        description={`${table.itemCount.toLocaleString()} items · ${table.size}`}
        breadcrumbs={[{ label: "DynamoDB", to: "/dynamodb" }, { label: "Tables", to: "/dynamodb" }, { label: table.name }]}
        actions={
          <>
            <StatusBadge status={table.status} />
            <button className="aws-btn-secondary">Actions</button>
            <button className="aws-btn-primary">Create item</button>
          </>
        }
      />

      <Tabs tabs={[
        { id: "items", label: "Explore items", content: (
          <div className="aws-card overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead className="bg-aws-surface">
                <tr>{keys.map((k) => <th key={k} className="px-3 py-2 text-left font-semibold border-b border-aws-border">{k}</th>)}</tr>
              </thead>
              <tbody>
                {items.map((it, i) => (
                  <tr key={i} className="border-b border-aws-border last:border-0 hover:bg-aws-surface">
                    {keys.map((k) => <td key={k} className="px-3 py-2 font-mono text-[12px]">{String(it[k])}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )},
        { id: "partiql", label: "PartiQL editor", content: (
          <div className="aws-card p-5">
            <h3 className="font-semibold mb-2">Query editor</h3>
            <textarea
              value={query} onChange={(e) => setQuery(e.target.value)} rows={6}
              className="w-full font-mono text-[13px] border border-aws-border rounded p-3 outline-none focus:border-aws-blue"
            />
            <div className="flex justify-end mt-3">
              <button onClick={() => toast.success("Query executed")} className="aws-btn-primary inline-flex items-center gap-1.5">
                <Play size={14} /> Run
              </button>
            </div>
          </div>
        )},
        { id: "indexes", label: "Indexes", content: (
          <div className="aws-card p-5">
            <h3 className="font-semibold mb-3">Global secondary indexes</h3>
            <p className="text-[13px] text-aws-text-muted">No global secondary indexes configured.</p>
          </div>
        )},
        { id: "streams", label: "Exports and streams", content: (
          <div className="aws-card p-5">
            <h3 className="font-semibold mb-3">DynamoDB streams</h3>
            <div className="flex items-center justify-between">
              <span className="text-[13px]">Stream status</span>
              <span className="text-aws-success font-medium">Enabled (NEW_AND_OLD_IMAGES)</span>
            </div>
          </div>
        )},
        { id: "monitor", label: "Monitor", content: (
          <div className="grid md:grid-cols-2 gap-4">
            <div className="aws-card p-5">
              <h3 className="font-semibold mb-2 text-[14px]">Read capacity</h3>
              <div className="text-[28px] font-bold">{Math.floor(Math.random() * 800) + 200}</div>
              <div className="text-[12px] text-aws-text-muted">consumed RCU / hour</div>
            </div>
            <div className="aws-card p-5">
              <h3 className="font-semibold mb-2 text-[14px]">Write capacity</h3>
              <div className="text-[28px] font-bold">{Math.floor(Math.random() * 400) + 100}</div>
              <div className="text-[12px] text-aws-text-muted">consumed WCU / hour</div>
            </div>
          </div>
        )},
        { id: "capacity", label: "Capacity settings", content: (
          <div className="aws-card p-5">
            <h3 className="font-semibold mb-3">Capacity mode</h3>
            <div className="text-[14px] font-medium">{table.capacityMode}</div>
            <p className="text-[13px] text-aws-text-muted mt-2">
              {table.capacityMode === "On-demand"
                ? "Pay-per-request pricing. DynamoDB instantly accommodates your workloads."
                : "Provisioned throughput with predictable performance."}
            </p>
          </div>
        )},
      ]} />
    </div>
  );
}
