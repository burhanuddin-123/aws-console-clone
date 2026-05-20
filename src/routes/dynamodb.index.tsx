import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { PageHeader, StatusBadge } from "@/components/aws/Primitives";
import { DataTable, type Column } from "@/components/aws/DataTable";
import { awsClient } from "@/api/awsClient";
import type { DynamoTable } from "@/data/dynamodb";

export const Route = createFileRoute("/dynamodb/")({
  head: () => ({
    meta: [
      { title: "DynamoDB | Tables" },
      { name: "description", content: "Amazon DynamoDB — fully managed NoSQL database tables." },
    ],
  }),
  component: DynamoIndex,
});

function DynamoIndex() {
  const [data, setData] = useState<DynamoTable[]>([]);
  const navigate = useNavigate();

  useEffect(() => { awsClient.listTables().then(setData); }, []);

  const cols: Column<DynamoTable>[] = [
    {
      key: "name", header: "Name",
      render: (t) => (
        <button onClick={(e) => { e.stopPropagation(); navigate({ to: "/dynamodb/$tableName", params: { tableName: t.name } }); }} className="aws-link font-medium">
          {t.name}
        </button>
      ),
    },
    { key: "status", header: "Status", render: (t) => <StatusBadge status={t.status} /> },
    { key: "partitionKey", header: "Partition key" },
    { key: "sortKey", header: "Sort key", render: (t) => t.sortKey ?? "—" },
    { key: "capacityMode", header: "Capacity mode" },
    { key: "itemCount", header: "Item count", render: (t) => t.itemCount.toLocaleString() },
    { key: "size", header: "Size" },
  ];

  return (
    <div className="p-6 max-w-[1600px]">
      <PageHeader
        title="Tables"
        description={`${data.length} tables`}
        breadcrumbs={[{ label: "DynamoDB", to: "/dynamodb" }, { label: "Tables" }]}
        actions={
          <>
            <button className="aws-btn-secondary">Actions</button>
            <button className="aws-btn-primary inline-flex items-center gap-1.5"><Plus size={14} /> Create table</button>
          </>
        }
      />
      <DataTable
        data={data}
        columns={cols}
        rowKey={(t) => t.name}
        selectable
        searchKeys={["name"]}
        onRowClick={(t) => navigate({ to: "/dynamodb/$tableName", params: { tableName: t.name } })}
      />
    </div>
  );
}
