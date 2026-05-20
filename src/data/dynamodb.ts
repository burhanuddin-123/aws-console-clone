export type DynamoTable = {
  name: string;
  status: "Active" | "Creating" | "Updating" | "Deleting";
  partitionKey: string;
  sortKey: string | null;
  capacityMode: "On-demand" | "Provisioned";
  itemCount: number;
  size: string;
  created: string;
};

export const tables: DynamoTable[] = [
  { name: "Customers", status: "Active", partitionKey: "customerId (S)", sortKey: null, capacityMode: "On-demand", itemCount: 42851, size: "184 MB", created: "2024-02-12T08:00:00Z" },
  { name: "Orders", status: "Active", partitionKey: "orderId (S)", sortKey: "createdAt (S)", capacityMode: "On-demand", itemCount: 1284512, size: "4.2 GB", created: "2024-02-12T08:00:00Z" },
  { name: "Products", status: "Active", partitionKey: "sku (S)", sortKey: null, capacityMode: "Provisioned", itemCount: 8421, size: "24 MB", created: "2024-02-12T08:00:00Z" },
  { name: "Sessions", status: "Active", partitionKey: "sessionId (S)", sortKey: null, capacityMode: "On-demand", itemCount: 184221, size: "412 MB", created: "2024-08-19T14:30:00Z" },
  { name: "Recommendations", status: "Active", partitionKey: "userId (S)", sortKey: "rank (N)", capacityMode: "On-demand", itemCount: 924531, size: "1.8 GB", created: "2024-11-04T11:15:00Z" },
];

export const sampleItems: Record<string, Record<string, string | number>[]> = {
  Customers: [
    { customerId: "c-1042", email: "asha@example.com", name: "Asha Patel", tier: "gold", lifetimeValue: 4820 },
    { customerId: "c-1043", email: "ravi@example.com", name: "Ravi Kumar", tier: "silver", lifetimeValue: 1240 },
    { customerId: "c-1044", email: "meera@example.com", name: "Meera Iyer", tier: "platinum", lifetimeValue: 18420 },
    { customerId: "c-1045", email: "arjun@example.com", name: "Arjun Singh", tier: "silver", lifetimeValue: 940 },
  ],
  Orders: [
    { orderId: "o-9821", createdAt: "2026-05-19T08:12:00Z", customerId: "c-1042", total: 248.5, status: "shipped" },
    { orderId: "o-9822", createdAt: "2026-05-19T08:24:00Z", customerId: "c-1044", total: 1840.0, status: "processing" },
    { orderId: "o-9823", createdAt: "2026-05-19T09:01:00Z", customerId: "c-1043", total: 64.99, status: "delivered" },
  ],
  Products: [
    { sku: "WH-1042", name: "Wireless Headphones", price: 129.99, stock: 421 },
    { sku: "KB-2284", name: "Mechanical Keyboard", price: 184.5, stock: 142 },
    { sku: "MS-3392", name: "Ergonomic Mouse", price: 64.99, stock: 821 },
  ],
  Sessions: [
    { sessionId: "s-a1b2c3", userId: "c-1042", startedAt: "2026-05-19T08:10:00Z", ttl: 1747654200 },
    { sessionId: "s-d4e5f6", userId: "c-1044", startedAt: "2026-05-19T08:22:00Z", ttl: 1747654920 },
  ],
  Recommendations: [
    { userId: "c-1042", rank: 1, sku: "WH-1042", score: 0.94 },
    { userId: "c-1042", rank: 2, sku: "KB-2284", score: 0.87 },
    { userId: "c-1044", rank: 1, sku: "MS-3392", score: 0.91 },
  ],
};
