export type LambdaFunction = {
  name: string;
  runtime: string;
  lastModified: string;
  state: "Active" | "Inactive" | "Pending" | "Failed";
  triggers: string[];
  memory: number;
  timeout: number;
  codeSize: string;
  description: string;
  handler: string;
  envVars: { key: string; value: string }[];
  layers: string[];
};

export const functions: LambdaFunction[] = [
  {
    name: "processOrders",
    runtime: "Node.js 20.x",
    lastModified: "2026-05-19T08:24:00Z",
    state: "Active",
    triggers: ["API Gateway", "SQS"],
    memory: 512,
    timeout: 30,
    codeSize: "8.4 MB",
    description: "Process incoming customer orders and update inventory",
    handler: "index.handler",
    envVars: [
      { key: "ORDERS_TABLE", value: "Orders" },
      { key: "INVENTORY_TABLE", value: "Inventory" },
      { key: "REGION", value: "ap-south-1" },
    ],
    layers: ["aws-sdk-v3:12", "common-utils:4"],
  },
  {
    name: "generateRecommendations",
    runtime: "Python 3.12",
    lastModified: "2026-05-15T14:12:00Z",
    state: "Active",
    triggers: ["EventBridge"],
    memory: 2048,
    timeout: 120,
    codeSize: "42.1 MB",
    description: "Generate personalized product recommendations",
    handler: "main.lambda_handler",
    envVars: [
      { key: "MODEL_BUCKET", value: "machine-learning-models" },
      { key: "MODEL_KEY", value: "recommender-v3.pkl" },
    ],
    layers: ["numpy-pandas:8", "ml-runtime:3"],
  },
  {
    name: "transformClickstreamData",
    runtime: "Python 3.12",
    lastModified: "2026-05-10T09:45:00Z",
    state: "Active",
    triggers: ["S3"],
    memory: 1024,
    timeout: 300,
    codeSize: "18.7 MB",
    description: "Transform raw clickstream events for analytics",
    handler: "transform.handler",
    envVars: [
      { key: "OUTPUT_BUCKET", value: "ecommerce-data-lake" },
    ],
    layers: ["aws-sdk-v3:12"],
  },
  {
    name: "sendNotifications",
    runtime: "Node.js 20.x",
    lastModified: "2026-05-01T16:30:00Z",
    state: "Active",
    triggers: ["SNS", "DynamoDB Streams"],
    memory: 256,
    timeout: 15,
    codeSize: "2.1 MB",
    description: "Dispatch email and push notifications to users",
    handler: "notify.handler",
    envVars: [
      { key: "SES_REGION", value: "us-east-1" },
      { key: "FROM_EMAIL", value: "noreply@example.com" },
    ],
    layers: [],
  },
  {
    name: "nightlyETLJob",
    runtime: "Python 3.12",
    lastModified: "2026-04-22T00:00:00Z",
    state: "Inactive",
    triggers: ["EventBridge (cron)"],
    memory: 3008,
    timeout: 900,
    codeSize: "64.2 MB",
    description: "Aggregate daily metrics and load into warehouse",
    handler: "etl.run",
    envVars: [
      { key: "WAREHOUSE_HOST", value: "redshift-cluster.example.com" },
    ],
    layers: ["pandas:8", "psycopg2:2"],
  },
];

export const sampleCode = `exports.handler = async (event) => {
  console.log('Event:', JSON.stringify(event, null, 2));

  const orders = event.Records.map(r => JSON.parse(r.body));

  for (const order of orders) {
    await processOrder(order);
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ processed: orders.length }),
  };
};

async function processOrder(order) {
  // Validate, persist, and notify
  return order;
}`;

export const invocationData = Array.from({ length: 24 }, (_, i) => ({
  time: \`\${i.toString().padStart(2, "0")}:00\`,
  invocations: Math.floor(Math.random() * 800) + 200,
  errors: Math.floor(Math.random() * 20),
  duration: Math.floor(Math.random() * 400) + 100,
}));
