# AWS Management Console Clone — Build Plan

## Scope
A pixel-faithful clone of the AWS Console covering: Console Home, S3, Lambda, DynamoDB, EC2, CloudWatch — with detail pages, realistic mock data, and a service layer ready for a future Floci backend.

## Stack note (important)
This template uses **TanStack Router** (file-based) — not React Router DOM. Switching routers would break the template's SSR/build setup. I'll implement routing with TanStack Router using identical URL paths to what you specified. Everything else (React + TS + Tailwind + Lucide + Recharts + Framer Motion) matches your spec. I'll add `framer-motion` and `recharts` (Lucide already present).

If you require literal `react-router-dom`, say so and I'll swap — but it adds risk with no UX difference.

## Design system (added to `src/styles.css`)
Semantic tokens in oklch, matching AWS palette:
- `--aws-squid-ink` (#16191f) top nav
- `--aws-orange` (#ff9900) primary CTA
- `--aws-blue` (#0972d3) action buttons
- `--aws-bg` (#fafafa) surface
- `--aws-border` (#d5dbdb)
- Inter font via Google Fonts import
- Border radius 12px, AWS-like shadows, sticky table headers

## Routes (TanStack file-based, paths match your spec 1:1)
```
src/routes/
  __root.tsx                  → shell: AwsTopNav + AwsSidebar + <Outlet/>
  index.tsx                   → Console Home
  s3.index.tsx                → S3 bucket list
  s3.$bucketName.tsx          → Bucket detail
  lambda.index.tsx            → Lambda functions
  lambda.$functionName.tsx    → Function detail
  dynamodb.index.tsx          → Tables list
  dynamodb.$tableName.tsx     → Table detail
  ec2.index.tsx               → EC2 dashboard
  ec2.$instanceId.tsx         → Instance detail
  cloudwatch.index.tsx        → CloudWatch
```

## Shared components (`src/components/aws/`)
AwsTopNav, AwsSidebar, PageHeader, Breadcrumbs, SearchBar, FilterBar, DataTable (generic, sortable, sticky header, pagination, row hover), StatusBadge, MetricCard, DashboardWidget (drag handle + menu + resize affordance), ChartCard, Tabs, EmptyState, CreateResourceModal, Toast (sonner).

## Mock data (`src/data/`)
`services.ts`, `s3.ts`, `lambda.ts`, `dynamodb.ts`, `ec2.ts`, `cloudwatch.ts` — realistic IDs, ISO timestamps, sizes, statuses, time-series metrics.

## Service layer (`src/api/awsClient.ts`)
Async functions returning mock data with 200–600ms simulated latency:
`listBuckets, createBucket, listFunctions, invokeFunction, listTables, scanTable, listInstances, startInstance, stopInstance, getMetrics`. Single swap-point for future Floci backend.

## Page details

**Console Home** — Grid of widgets: Recently Visited (14 services w/ icons), Applications (empty-state table, region selector, pagination), Welcome to AWS, AWS Health, Cost & Usage (Recharts stacked bar of 6 months), Trusted Advisor, Security Hub, Recent Activity. Header row: "Reset to default layout" + orange "Add widgets". Each widget has drag handle, three-dot menu, resize handle (visual only).

**S3** — Bucket table (Name, Region, Storage class, Objects, Size, Created), orange "Create bucket", search, filters. Detail page: tabs Objects / Properties / Permissions / Metrics / Management with object list, upload/create-folder/delete/download buttons, versioning toggle, lifecycle rules card.

**Lambda** — Functions table (Name, Runtime, Last modified, State badge, Triggers). Detail: visual trigger→function→destination diagram (SVG), Code tab w/ read-only editor (Monaco-free, simple `<pre>`), Test/Deploy buttons, Configuration tabs, Monitoring (Recharts line chart for invocations/errors/duration), Env vars, Layers, Permissions.

**DynamoDB** — Tables list (Name, Status, PK, SK, Capacity, Items, Size). Detail: Items grid, Explore items panel, PartiQL editor (`<textarea>` + Run), Indexes, Streams/Exports, Monitoring, Capacity.

**EC2** — Dashboard summary + Instances table (ID, Name, State, Type, Public IPv4, AZ, SGs). Actions toolbar (Launch orange / Connect / Start / Stop / Reboot / Terminate) with state transitions via toast. Detail tabs: Details, Security, Networking, Storage, Monitoring (charts), Tags.

**CloudWatch** — Sub-nav: Metrics, Logs, Alarms, Dashboards, Insights. Default view shows alarm cards (HighCPUAlarm, LambdaErrorRate, BillingThresholdExceeded), log groups list, and four Recharts widgets (CPU, Invocations, Error Rate, Billing).

## Interactions & polish
- Framer Motion: page fade-in, widget mount stagger, modal scale-in
- Loading skeletons on async data fetches
- Sonner toasts for create/start/stop/delete actions
- Sortable columns, client-side filter + search, pagination (10/25/50)
- Sticky table headers, hover row tint, keyboard `/` focuses search
- Sidebar collapsible (icon-only mini variant)
- Responsive: sidebar collapses to drawer on `<md`, widgets reflow to single column

## Technical notes
- Install `framer-motion` and `recharts` via bun
- Inter font loaded in `__root.tsx` head
- All colors via semantic tokens — no hardcoded hex in components
- Each route file sets its own `head()` meta (title + description)
- No backend; pure frontend with mock client

## Out of scope (call out)
- Real AWS API calls
- Real code execution / S3 uploads
- Authentication
- Persisted state across reloads (resource mutations live in memory)

## Deliverable
A polished, navigable AWS Console clone across ~30 files, ready to wire to Floci by swapping `src/api/awsClient.ts` implementations.
