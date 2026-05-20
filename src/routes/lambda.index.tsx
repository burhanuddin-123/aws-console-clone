import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { PageHeader, StatusBadge } from "@/components/aws/Primitives";
import { DataTable, type Column } from "@/components/aws/DataTable";
import { awsClient } from "@/api/awsClient";
import type { LambdaFunction } from "@/data/lambda";

export const Route = createFileRoute("/lambda/")({
  head: () => ({
    meta: [
      { title: "AWS Lambda | Functions" },
      { name: "description", content: "Run code without provisioning servers — manage your Lambda functions." },
    ],
  }),
  component: LambdaIndex,
});

function LambdaIndex() {
  const [data, setData] = useState<LambdaFunction[]>([]);
  const navigate = useNavigate();

  useEffect(() => { awsClient.listFunctions().then(setData); }, []);

  const cols: Column<LambdaFunction>[] = [
    {
      key: "name", header: "Function name",
      render: (f) => (
        <button onClick={(e) => { e.stopPropagation(); navigate({ to: "/lambda/$functionName", params: { functionName: f.name } }); }} className="aws-link font-medium">
          {f.name}
        </button>
      ),
    },
    { key: "runtime", header: "Runtime" },
    { key: "lastModified", header: "Last modified", render: (f) => new Date(f.lastModified).toLocaleString() },
    { key: "state", header: "State", render: (f) => <StatusBadge status={f.state} /> },
    {
      key: "triggers", header: "Triggers",
      render: (f) => (
        <div className="flex flex-wrap gap-1">
          {f.triggers.map((t) => (
            <span key={t} className="text-[11px] bg-aws-surface border border-aws-border rounded px-1.5 py-0.5">{t}</span>
          ))}
        </div>
      ),
    },
    { key: "memory", header: "Memory", render: (f) => `${f.memory} MB` },
  ];

  return (
    <div className="p-6 max-w-[1600px]">
      <PageHeader
        title="Functions"
        description={`${data.length} functions`}
        breadcrumbs={[{ label: "AWS Lambda", to: "/lambda" }, { label: "Functions" }]}
        actions={
          <>
            <button className="aws-btn-secondary">Actions</button>
            <button className="aws-btn-primary inline-flex items-center gap-1.5"><Plus size={14} /> Create function</button>
          </>
        }
      />
      <DataTable
        data={data}
        columns={cols}
        rowKey={(f) => f.name}
        selectable
        searchKeys={["name", "runtime"]}
        onRowClick={(f) => navigate({ to: "/lambda/$functionName", params: { functionName: f.name } })}
      />
    </div>
  );
}
