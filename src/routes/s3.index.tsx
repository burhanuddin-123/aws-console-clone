import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Trash2, Copy } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/aws/Primitives";
import { DataTable, type Column } from "@/components/aws/DataTable";
import { Modal } from "@/components/aws/Modal";
import { awsClient } from "@/api/awsClient";
import type { S3Bucket } from "@/data/s3";
import { regions } from "@/data/services";

export const Route = createFileRoute("/s3/")({
  head: () => ({
    meta: [
      { title: "Amazon S3 | Buckets" },
      { name: "description", content: "Amazon Simple Storage Service — manage buckets, objects, and configurations." },
    ],
  }),
  component: S3Index,
});

function S3Index() {
  const [data, setData] = useState<S3Bucket[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newRegion, setNewRegion] = useState("ap-south-1");
  const navigate = useNavigate();

  async function refresh() {
    setLoading(true);
    setData(await awsClient.listBuckets());
    setLoading(false);
  }
  useEffect(() => { refresh(); }, []);

  async function handleCreate() {
    if (!newName.trim()) return toast.error("Bucket name is required");
    await awsClient.createBucket(newName.trim(), newRegion);
    toast.success(`Bucket '${newName}' created`);
    setCreateOpen(false);
    setNewName("");
    refresh();
  }

  const columns: Column<S3Bucket>[] = [
    {
      key: "name",
      header: "Name",
      render: (b) => (
        <button
          onClick={(e) => { e.stopPropagation(); navigate({ to: "/s3/$bucketName", params: { bucketName: b.name } }); }}
          className="aws-link font-medium"
        >
          {b.name}
        </button>
      ),
    },
    { key: "region", header: "AWS Region" },
    { key: "storageClass", header: "Storage class" },
    { key: "access", header: "Access" },
    { key: "objects", header: "Objects", render: (b) => b.objects.toLocaleString() },
    { key: "size", header: "Total size" },
    { key: "created", header: "Creation date", render: (b) => new Date(b.created).toLocaleString() },
  ];

  return (
    <div className="p-6 max-w-[1600px]">
      <PageHeader
        title="Buckets"
        description={loading ? "Loading…" : `${data.length} buckets`}
        breadcrumbs={[{ label: "Amazon S3", to: "/s3" }, { label: "Buckets" }]}
        actions={
          <>
            <button className="aws-btn-secondary inline-flex items-center gap-1.5"><Copy size={14} /> Copy ARN</button>
            <button className="aws-btn-secondary inline-flex items-center gap-1.5"><Trash2 size={14} /> Delete</button>
            <button onClick={() => setCreateOpen(true)} className="aws-btn-primary inline-flex items-center gap-1.5">
              <Plus size={14} /> Create bucket
            </button>
          </>
        }
      />

      <DataTable
        data={data}
        columns={columns}
        rowKey={(b) => b.name}
        selectable
        searchKeys={["name", "region", "storageClass"]}
        onRowClick={(b) => navigate({ to: "/s3/$bucketName", params: { bucketName: b.name } })}
      />

      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Create bucket"
        footer={
          <>
            <button onClick={() => setCreateOpen(false)} className="aws-btn-secondary">Cancel</button>
            <button onClick={handleCreate} className="aws-btn-primary">Create bucket</button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-[13px] font-semibold mb-1">Bucket name</label>
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="my-unique-bucket-name"
              className="w-full px-3 py-2 border border-aws-border rounded text-[14px] outline-none focus:border-aws-blue"
            />
            <p className="text-[12px] text-aws-text-muted mt-1">Must be globally unique and follow naming rules.</p>
          </div>
          <div>
            <label className="block text-[13px] font-semibold mb-1">AWS Region</label>
            <select
              value={newRegion}
              onChange={(e) => setNewRegion(e.target.value)}
              className="w-full px-3 py-2 border border-aws-border rounded text-[14px] outline-none focus:border-aws-blue"
            >
              {regions.map((r) => <option key={r.id} value={r.id}>{r.name} ({r.id})</option>)}
            </select>
          </div>
          <div className="bg-aws-surface border border-aws-border rounded p-3 text-[13px]">
            <div className="font-semibold mb-1">Block Public Access settings</div>
            <p className="text-aws-text-muted">By default, all public access is blocked to protect your data.</p>
          </div>
        </div>
      </Modal>
    </div>
  );
}
