import { buckets, sampleObjects, type S3Bucket } from "@/data/s3";
import { functions, type LambdaFunction } from "@/data/lambda";
import { tables, sampleItems, type DynamoTable } from "@/data/dynamodb";
import { instances, type Ec2Instance } from "@/data/ec2";

const delay = (ms = 350) => new Promise((r) => setTimeout(r, ms));

let _buckets = [...buckets];
let _instances = [...instances];

export const awsClient = {
  async listBuckets(): Promise<S3Bucket[]> {
    await delay();
    return [..._buckets];
  },
  async createBucket(name: string, region: string): Promise<S3Bucket> {
    await delay();
    const bucket: S3Bucket = {
      name, region, storageClass: "Standard", objects: 0, size: "0 B",
      created: new Date().toISOString(), access: "Bucket and objects not public",
    };
    _buckets = [bucket, ..._buckets];
    return bucket;
  },
  async listObjects(bucket: string) {
    await delay(200);
    return sampleObjects[bucket] ?? [];
  },
  async listFunctions(): Promise<LambdaFunction[]> {
    await delay();
    return functions;
  },
  async invokeFunction(name: string) {
    await delay(800);
    return { statusCode: 200, payload: { ok: true, function: name, executionTime: Math.floor(Math.random() * 400) + 50 } };
  },
  async listTables(): Promise<DynamoTable[]> {
    await delay();
    return tables;
  },
  async scanTable(name: string) {
    await delay();
    return sampleItems[name] ?? [];
  },
  async listInstances(): Promise<Ec2Instance[]> {
    await delay();
    return [..._instances];
  },
  async startInstance(id: string) {
    await delay(600);
    _instances = _instances.map(i => i.id === id ? { ...i, state: "running" as const } : i);
    return _instances.find(i => i.id === id)!;
  },
  async stopInstance(id: string) {
    await delay(600);
    _instances = _instances.map(i => i.id === id ? { ...i, state: "stopped" as const } : i);
    return _instances.find(i => i.id === id)!;
  },
  async rebootInstance(id: string) {
    await delay(600);
    return _instances.find(i => i.id === id)!;
  },
  async terminateInstance(id: string) {
    await delay(600);
    _instances = _instances.map(i => i.id === id ? { ...i, state: "terminated" as const } : i);
    return _instances.find(i => i.id === id)!;
  },
  async getMetrics() {
    await delay(200);
    return { ok: true };
  },
};
