export type Alarm = {
  name: string;
  state: "OK" | "ALARM" | "INSUFFICIENT_DATA";
  metric: string;
  threshold: string;
  lastUpdated: string;
};

export const alarms: Alarm[] = [
  { name: "HighCPUAlarm", state: "OK", metric: "CPUUtilization > 80%", threshold: "5 datapoints / 5 min", lastUpdated: "2026-05-19T08:24:00Z" },
  { name: "LambdaErrorRate", state: "ALARM", metric: "Errors > 10", threshold: "1 datapoint / 1 min", lastUpdated: "2026-05-19T09:12:00Z" },
  { name: "BillingThresholdExceeded", state: "OK", metric: "EstimatedCharges > $500", threshold: "1 datapoint / 6 hr", lastUpdated: "2026-05-19T06:00:00Z" },
  { name: "S3BucketSizeAlarm", state: "INSUFFICIENT_DATA", metric: "BucketSizeBytes > 6TB", threshold: "1 datapoint / 1 day", lastUpdated: "2026-05-18T00:00:00Z" },
];

export const logGroups = [
  { name: "/aws/lambda/processOrders", retention: "30 days", stored: "2.4 GB", streams: 184 },
  { name: "/aws/lambda/generateRecommendations", retention: "14 days", stored: "812 MB", streams: 42 },
  { name: "/aws/lambda/transformClickstreamData", retention: "7 days", stored: "1.2 GB", streams: 96 },
  { name: "/aws/ec2/web-server-prod", retention: "30 days", stored: "4.8 GB", streams: 12 },
  { name: "/aws/apigateway/orders-api", retention: "30 days", stored: "618 MB", streams: 8 },
];

export const cpuMetric = Array.from({ length: 24 }, (_, i) => ({
  time: `${i}h`,
  value: Math.floor(Math.random() * 40) + 30,
}));

export const invocationMetric = Array.from({ length: 24 }, (_, i) => ({
  time: `${i}h`,
  value: Math.floor(Math.random() * 800) + 200,
}));

export const errorRateMetric = Array.from({ length: 24 }, (_, i) => ({
  time: `${i}h`,
  value: Math.floor(Math.random() * 8),
}));

export const billingMetric = Array.from({ length: 30 }, (_, i) => ({
  day: `${i + 1}`,
  value: Math.floor(Math.random() * 50) + (i * 12),
}));

export const costData = Array.from({ length: 6 }, (_, i) => {
  const months = ["Dec", "Jan", "Feb", "Mar", "Apr", "May"];
  return {
    month: months[i],
    EC2: Math.floor(Math.random() * 200) + 200,
    S3: Math.floor(Math.random() * 80) + 40,
    Lambda: Math.floor(Math.random() * 60) + 20,
    DynamoDB: Math.floor(Math.random() * 100) + 50,
    Other: Math.floor(Math.random() * 80) + 30,
  };
});
