import {
  Database, HardDrive, Server, Rocket, Globe, Shield, DollarSign,
  Calendar, Container, Activity, Search, GitBranch, Zap, Network,
  Cloud, Cpu, Box, Lock, BarChart3, Users, Code, Terminal,
  type LucideIcon
} from "lucide-react";

export type AwsService = {
  name: string;
  category: string;
  icon: LucideIcon;
  color: string;
  path?: string;
  description: string;
};

export const recentServices: AwsService[] = [
  { name: "DynamoDB", category: "Database", icon: Database, color: "#3b48cc", path: "/dynamodb", description: "Managed NoSQL database" },
  { name: "S3", category: "Storage", icon: HardDrive, color: "#7aa116", path: "/s3", description: "Scalable storage in the cloud" },
  { name: "EC2", category: "Compute", icon: Server, color: "#ed7100", path: "/ec2", description: "Virtual servers in the cloud" },
  { name: "Elastic Beanstalk", category: "Compute", icon: Rocket, color: "#ed7100", description: "Run and manage web apps" },
  { name: "Route 53", category: "Networking", icon: Globe, color: "#8c4fff", description: "Scalable DNS and domain name registration" },
  { name: "IAM", category: "Security", icon: Shield, color: "#dd344c", description: "Manage access to AWS resources" },
  { name: "Billing and Cost Management", category: "Management", icon: DollarSign, color: "#01a88d", description: "View, manage, and analyze your costs" },
  { name: "Amazon EventBridge", category: "App Integration", icon: Calendar, color: "#e7157b", description: "Serverless event bus" },
  { name: "ECS", category: "Compute", icon: Container, color: "#ed7100", description: "Run containerized applications" },
  { name: "CloudWatch", category: "Management", icon: Activity, color: "#e7157b", path: "/cloudwatch", description: "Monitor resources and applications" },
  { name: "Athena", category: "Analytics", icon: Search, color: "#8c4fff", description: "Query data in S3 using SQL" },
  { name: "Step Functions", category: "App Integration", icon: GitBranch, color: "#e7157b", description: "Coordinate distributed applications" },
  { name: "Lambda", category: "Compute", icon: Zap, color: "#ed7100", path: "/lambda", description: "Run code without thinking about servers" },
  { name: "VPC", category: "Networking", icon: Network, color: "#8c4fff", description: "Isolated cloud resources" },
];

export const allServices = [
  ...recentServices,
  { name: "CloudFront", category: "Networking", icon: Cloud, color: "#8c4fff", description: "Global content delivery network" },
  { name: "RDS", category: "Database", icon: Database, color: "#3b48cc", description: "Managed relational database" },
  { name: "SNS", category: "App Integration", icon: Activity, color: "#e7157b", description: "Pub/sub messaging" },
  { name: "SQS", category: "App Integration", icon: Box, color: "#e7157b", description: "Managed message queues" },
  { name: "Cognito", category: "Security", icon: Users, color: "#dd344c", description: "User identity and data sync" },
  { name: "API Gateway", category: "Networking", icon: Code, color: "#8c4fff", description: "Build, deploy, manage APIs" },
  { name: "CloudShell", category: "Compute", icon: Terminal, color: "#ed7100", description: "Browser-based shell" },
  { name: "KMS", category: "Security", icon: Lock, color: "#dd344c", description: "Managed key management" },
  { name: "QuickSight", category: "Analytics", icon: BarChart3, color: "#8c4fff", description: "Business intelligence" },
  { name: "SageMaker", category: "ML", icon: Cpu, color: "#01a88d", description: "Build and train ML models" },
];

export const regions = [
  { id: "ap-south-1", name: "Asia Pacific (Mumbai)" },
  { id: "us-east-1", name: "US East (N. Virginia)" },
  { id: "us-east-2", name: "US East (Ohio)" },
  { id: "us-west-1", name: "US West (N. California)" },
  { id: "us-west-2", name: "US West (Oregon)" },
  { id: "eu-west-1", name: "Europe (Ireland)" },
  { id: "eu-central-1", name: "Europe (Frankfurt)" },
  { id: "ap-southeast-1", name: "Asia Pacific (Singapore)" },
  { id: "ap-northeast-1", name: "Asia Pacific (Tokyo)" },
];
