export type S3Bucket = {
  name: string;
  region: string;
  storageClass: string;
  objects: number;
  size: string;
  created: string;
  access: "Bucket and objects not public" | "Objects can be public" | "Public";
};

export const buckets: S3Bucket[] = [
  { name: "ecommerce-data-lake", region: "ap-south-1", storageClass: "Standard", objects: 124583, size: "2.4 TB", created: "2024-03-15T08:24:00Z", access: "Bucket and objects not public" },
  { name: "clickstream-logs", region: "ap-south-1", storageClass: "Standard-IA", objects: 892341, size: "812 GB", created: "2024-01-08T14:12:00Z", access: "Bucket and objects not public" },
  { name: "machine-learning-models", region: "us-east-1", storageClass: "Standard", objects: 482, size: "184 GB", created: "2023-11-22T09:45:00Z", access: "Bucket and objects not public" },
  { name: "backups-prod", region: "ap-south-1", storageClass: "Glacier", objects: 28412, size: "5.8 TB", created: "2023-06-01T00:00:00Z", access: "Bucket and objects not public" },
  { name: "static-website-assets", region: "us-east-1", storageClass: "Standard", objects: 1842, size: "412 MB", created: "2024-05-19T16:30:00Z", access: "Objects can be public" },
];

export type S3Object = {
  key: string;
  type: "folder" | "file";
  lastModified?: string;
  size?: string;
  storageClass?: string;
};

export const sampleObjects: Record<string, S3Object[]> = {
  "ecommerce-data-lake": [
    { key: "raw/", type: "folder" },
    { key: "processed/", type: "folder" },
    { key: "exports/", type: "folder" },
    { key: "manifest.json", type: "file", lastModified: "2026-05-18T10:24:00Z", size: "4.2 KB", storageClass: "Standard" },
    { key: "schema.avsc", type: "file", lastModified: "2026-05-15T08:11:00Z", size: "12 KB", storageClass: "Standard" },
  ],
  "clickstream-logs": [
    { key: "2026/05/", type: "folder" },
    { key: "2026/04/", type: "folder" },
    { key: "2026/03/", type: "folder" },
  ],
  "machine-learning-models": [
    { key: "recommender-v3.pkl", type: "file", lastModified: "2026-05-12T14:00:00Z", size: "84 MB", storageClass: "Standard" },
    { key: "fraud-detection-v2.onnx", type: "file", lastModified: "2026-04-30T09:15:00Z", size: "42 MB", storageClass: "Standard" },
    { key: "churn-model-v1.h5", type: "file", lastModified: "2026-03-21T11:30:00Z", size: "58 MB", storageClass: "Standard" },
  ],
  "backups-prod": [
    { key: "db-snapshots/", type: "folder" },
    { key: "filesystem/", type: "folder" },
  ],
  "static-website-assets": [
    { key: "images/", type: "folder" },
    { key: "css/", type: "folder" },
    { key: "js/", type: "folder" },
    { key: "index.html", type: "file", lastModified: "2026-05-19T16:30:00Z", size: "8.4 KB", storageClass: "Standard" },
    { key: "favicon.ico", type: "file", lastModified: "2026-05-19T16:30:00Z", size: "2.1 KB", storageClass: "Standard" },
  ],
};
