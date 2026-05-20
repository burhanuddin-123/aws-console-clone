import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Upload, FolderPlus, Trash2, Download, FileText, Folder } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/aws/Primitives";
import { Tabs } from "@/components/aws/Tabs";
import { DataTable, type Column } from "@/components/aws/DataTable";
import { awsClient } from "@/api/awsClient";
import { buckets, type S3Object } from "@/data/s3";

export const Route = createFileRoute("/s3/$bucketName")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.bucketName} | Amazon S3` },
      { name: "description", content: `Manage objects, properties, and permissions for the ${params.bucketName} bucket.` },
    ],
  }),
  component: BucketDetail,
});

function BucketDetail() {
  const { bucketName } = Route.useParams();
  const bucket = buckets.find((b) => b.name === bucketName);
  const [objects, setObjects] = useState<S3Object[]>([]);
  const [versioning, setVersioning] = useState(true);

  useEffect(() => {
    awsClient.listObjects(bucketName).then(setObjects);
  }, [bucketName]);

  const cols: Column<S3Object>[] = [
    {
      key: "key", header: "Name", render: (o) => (
        <span className="inline-flex items-center gap-2">
          {o.type === "folder" ? <Folder size={14} className="text-aws-blue" /> : <FileText size={14} className="text-aws-text-muted" />}
          <span className={o.type === "folder" ? "aws-link" : ""}>{o.key}</span>
        </span>
      ),
    },
    { key: "type", header: "Type" },
    { key: "lastModified", header: "Last modified", render: (o) => o.lastModified ? new Date(o.lastModified).toLocaleString() : "—" },
    { key: "size", header: "Size", render: (o) => o.size ?? "—" },
    { key: "storageClass", header: "Storage class", render: (o) => o.storageClass ?? "—" },
  ];

  return (
    <div className="p-6 max-w-[1600px]">
      <PageHeader
        title={bucketName}
        description={bucket ? `Region: ${bucket.region} · ${bucket.objects.toLocaleString()} objects · ${bucket.size}` : ""}
        breadcrumbs={[{ label: "Amazon S3", to: "/s3" }, { label: "Buckets", to: "/s3" }, { label: bucketName }]}
        actions={
          <>
            <button className="aws-btn-secondary inline-flex items-center gap-1.5"><Download size={14} /> Download</button>
            <button className="aws-btn-secondary inline-flex items-center gap-1.5"><Trash2 size={14} /> Delete</button>
            <button className="aws-btn-secondary inline-flex items-center gap-1.5"><FolderPlus size={14} /> Create folder</button>
            <button onClick={() => toast.success("Upload simulated")} className="aws-btn-primary inline-flex items-center gap-1.5">
              <Upload size={14} /> Upload
            </button>
          </>
        }
      />

      <Tabs tabs={[
        { id: "objects", label: "Objects", content: (
          <DataTable data={objects} columns={cols} rowKey={(o) => o.key} selectable searchKeys={["key"]} />
        )},
        { id: "properties", label: "Properties", content: (
          <div className="space-y-4">
            <div className="aws-card p-5">
              <h3 className="font-semibold mb-3">Bucket overview</h3>
              <dl className="grid grid-cols-2 gap-3 text-[13px]">
                <div><dt className="text-aws-text-muted">Region</dt><dd className="font-medium">{bucket?.region}</dd></div>
                <div><dt className="text-aws-text-muted">Created</dt><dd className="font-medium">{bucket && new Date(bucket.created).toLocaleString()}</dd></div>
                <div><dt className="text-aws-text-muted">Default storage class</dt><dd className="font-medium">{bucket?.storageClass}</dd></div>
                <div><dt className="text-aws-text-muted">ARN</dt><dd className="font-mono text-[12px]">arn:aws:s3:::{bucketName}</dd></div>
              </dl>
            </div>
            <div className="aws-card p-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Bucket Versioning</h3>
                  <p className="text-[13px] text-aws-text-muted mt-1">Keep multiple versions of an object in the same bucket.</p>
                </div>
                <button
                  onClick={() => setVersioning(!versioning)}
                  className={`px-3 py-1.5 rounded text-[13px] font-medium ${versioning ? "bg-aws-blue text-white" : "bg-aws-surface border border-aws-border"}`}
                >
                  {versioning ? "Enabled" : "Suspended"}
                </button>
              </div>
            </div>
          </div>
        )},
        { id: "permissions", label: "Permissions", content: (
          <div className="aws-card p-5">
            <h3 className="font-semibold mb-3">Block public access (bucket settings)</h3>
            <div className="space-y-2 text-[13px]">
              {["Block all public access", "Block public ACLs", "Block public bucket policies", "Block cross-account access"].map((s) => (
                <div key={s} className="flex items-center justify-between py-2 border-b border-aws-border last:border-0">
                  <span>{s}</span><span className="text-aws-success font-medium">On</span>
                </div>
              ))}
            </div>
          </div>
        )},
        { id: "metrics", label: "Metrics", content: (
          <div className="aws-card p-5">
            <h3 className="font-semibold mb-3">Total bucket size</h3>
            <div className="text-[28px] font-bold">{bucket?.size}</div>
            <div className="text-[13px] text-aws-text-muted">{bucket?.objects.toLocaleString()} objects</div>
          </div>
        )},
        { id: "management", label: "Management", content: (
          <div className="aws-card p-5">
            <h3 className="font-semibold mb-3">Lifecycle rules</h3>
            <p className="text-[13px] text-aws-text-muted mb-3">No lifecycle rules. Create rules to manage object lifecycles.</p>
            <button className="aws-btn-primary">Create lifecycle rule</button>
          </div>
        )},
      ]} />
    </div>
  );
}
