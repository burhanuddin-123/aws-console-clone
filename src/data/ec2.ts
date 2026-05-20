export type Ec2Instance = {
  id: string;
  name: string;
  state: "running" | "stopped" | "pending" | "terminated" | "stopping";
  type: string;
  publicIp: string;
  privateIp: string;
  az: string;
  securityGroups: string[];
  launchTime: string;
  ami: string;
  keyPair: string;
  vpc: string;
};

export const instances: Ec2Instance[] = [
  {
    id: "i-0a12b34c56d789ef0",
    name: "web-server-prod",
    state: "running",
    type: "t3.large",
    publicIp: "13.232.84.142",
    privateIp: "10.0.1.42",
    az: "ap-south-1a",
    securityGroups: ["sg-web-prod", "sg-monitoring"],
    launchTime: "2026-04-12T08:24:00Z",
    ami: "ami-0123456789abcdef0",
    keyPair: "prod-key",
    vpc: "vpc-0a1b2c3d",
  },
  {
    id: "i-0123abcd4567ef890",
    name: "etl-runner",
    state: "running",
    type: "m5.xlarge",
    publicIp: "13.234.91.18",
    privateIp: "10.0.2.18",
    az: "ap-south-1b",
    securityGroups: ["sg-internal"],
    launchTime: "2026-04-22T14:30:00Z",
    ami: "ami-0123456789abcdef0",
    keyPair: "etl-key",
    vpc: "vpc-0a1b2c3d",
  },
  {
    id: "i-0ff123456789abcd0",
    name: "ml-training-node",
    state: "stopped",
    type: "g4dn.xlarge",
    publicIp: "-",
    privateIp: "10.0.3.55",
    az: "ap-south-1c",
    securityGroups: ["sg-ml-training"],
    launchTime: "2026-03-08T11:00:00Z",
    ami: "ami-0123456789abcdef0",
    keyPair: "ml-key",
    vpc: "vpc-0a1b2c3d",
  },
];

export const cpuData = Array.from({ length: 24 }, (_, i) => ({
  time: `${i.toString().padStart(2, "0")}:00`,
  cpu: Math.floor(Math.random() * 50) + 20,
  network: Math.floor(Math.random() * 800) + 100,
}));
