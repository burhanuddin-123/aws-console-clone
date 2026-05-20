import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Play, UploadCloud, Zap, Database, Globe, Calendar } from "lucide-react";
import { toast } from "sonner";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { PageHeader, StatusBadge } from "@/components/aws/Primitives";
import { Tabs } from "@/components/aws/Tabs";
import { functions, sampleCode, invocationData } from "@/data/lambda";
import { awsClient } from "@/api/awsClient";

export const Route = createFileRoute("/lambda/$functionName")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.functionName} | AWS Lambda` },
      { name: "description", content: `Configure, test, and monitor the ${params.functionName} Lambda function.` },
    ],
  }),
  component: FunctionDetail,
});

const triggerIcons: Record<string, any> = {
  "API Gateway": Globe, "SQS": Database, "EventBridge": Calendar,
  "S3": Database, "SNS": Zap, "DynamoDB Streams": Database, "EventBridge (cron)": Calendar,
};

function FunctionDetail() {
  const { functionName } = Route.useParams();
  const fn = functions.find((f) => f.name === functionName);
  const [testing, setTesting] = useState(false);

  if (!fn) return <div className="p-6">Function not found.</div>;

  async function test() {
    setTesting(true);
    const res = await awsClient.invokeFunction(functionName);
    setTesting(false);
    toast.success(`Invocation succeeded (${res.payload.executionTime}ms)`);
  }

  return (
    <div className="p-6 max-w-[1600px]">
      <PageHeader
        title={fn.name}
        description={fn.description}
        breadcrumbs={[{ label: "AWS Lambda", to: "/lambda" }, { label: "Functions", to: "/lambda" }, { label: fn.name }]}
        actions={
          <>
            <StatusBadge status={fn.state} />
            <button onClick={test} disabled={testing} className="aws-btn-secondary inline-flex items-center gap-1.5">
              <Play size={14} /> {testing ? "Invoking…" : "Test"}
            </button>
            <button onClick={() => toast.success("Function deployed")} className="aws-btn-primary inline-flex items-center gap-1.5">
              <UploadCloud size={14} /> Deploy
            </button>
          </>
        }
      />

      {/* Function overview diagram */}
      <div className="aws-card p-5 mb-4">
        <h3 className="font-semibold mb-4 text-[14px]">Function overview</h3>
        <div className="flex items-center justify-center gap-4 flex-wrap py-2">
          <div className="flex flex-col gap-2">
            {fn.triggers.map((t) => {
              const Icon = triggerIcons[t] ?? Zap;
              return (
                <div key={t} className="inline-flex items-center gap-2 bg-aws-surface border border-aws-border rounded-lg px-3 py-2 text-[13px]">
                  <Icon size={16} className="text-aws-blue" /> {t}
                </div>
              );
            })}
          </div>
          <div className="text-aws-text-muted">→</div>
          <div className="bg-aws-orange/10 border-2 border-aws-orange rounded-lg px-5 py-4 text-center min-w-[200px]">
            <Zap size={22} className="mx-auto text-aws-orange mb-1" />
            <div className="font-semibold">{fn.name}</div>
            <div className="text-[11px] text-aws-text-muted">{fn.runtime}</div>
          </div>
          <div className="text-aws-text-muted">→</div>
          <div className="inline-flex items-center gap-2 bg-aws-surface border border-dashed border-aws-border rounded-lg px-3 py-2 text-[13px] text-aws-text-muted">
            + Add destination
          </div>
        </div>
      </div>

      <Tabs tabs={[
        { id: "code", label: "Code", content: (
          <div className="aws-card overflow-hidden">
            <div className="bg-[#1e2329] text-gray-300 px-4 py-2 text-[12px] font-mono flex justify-between">
              <span>index.js</span>
              <span>{fn.codeSize}</span>
            </div>
            <pre className="bg-[#1e2329] text-gray-100 p-4 text-[12px] font-mono overflow-x-auto leading-relaxed">{sampleCode}</pre>
          </div>
        )},
        { id: "test", label: "Test", content: (
          <div className="aws-card p-5">
            <h3 className="font-semibold mb-3">Test event</h3>
            <textarea
              defaultValue={'{\n  "Records": [\n    { "body": "{\\"orderId\\": \\"o-9821\\"}" }\n  ]\n}'}
              rows={10}
              className="w-full font-mono text-[12px] border border-aws-border rounded p-3 outline-none"
            />
            <button onClick={test} className="aws-btn-primary mt-3 inline-flex items-center gap-1.5">
              <Play size={14} /> Invoke
            </button>
          </div>
        )},
        { id: "config", label: "Configuration", content: (
          <div className="space-y-4">
            <div className="aws-card p-5">
              <h3 className="font-semibold mb-3">General configuration</h3>
              <dl className="grid grid-cols-2 gap-3 text-[13px]">
                <div><dt className="text-aws-text-muted">Memory</dt><dd className="font-medium">{fn.memory} MB</dd></div>
                <div><dt className="text-aws-text-muted">Timeout</dt><dd className="font-medium">{fn.timeout}s</dd></div>
                <div><dt className="text-aws-text-muted">Handler</dt><dd className="font-mono text-[12px]">{fn.handler}</dd></div>
                <div><dt className="text-aws-text-muted">Runtime</dt><dd className="font-medium">{fn.runtime}</dd></div>
              </dl>
            </div>
            <div className="aws-card p-5">
              <h3 className="font-semibold mb-3">Environment variables</h3>
              <table className="w-full text-[13px]">
                <thead className="bg-aws-surface">
                  <tr><th className="px-3 py-2 text-left font-semibold">Key</th><th className="px-3 py-2 text-left font-semibold">Value</th></tr>
                </thead>
                <tbody>
                  {fn.envVars.map((e) => (
                    <tr key={e.key} className="border-t border-aws-border"><td className="px-3 py-2 font-mono text-[12px]">{e.key}</td><td className="px-3 py-2 font-mono text-[12px]">{e.value}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="aws-card p-5">
              <h3 className="font-semibold mb-3">Layers</h3>
              {fn.layers.length === 0 ? <p className="text-[13px] text-aws-text-muted">No layers attached.</p> : (
                <div className="space-y-1">{fn.layers.map((l) => <div key={l} className="font-mono text-[12px] py-1">{l}</div>)}</div>
              )}
            </div>
          </div>
        )},
        { id: "monitor", label: "Monitor", content: (
          <div className="grid md:grid-cols-2 gap-4">
            <div className="aws-card p-5">
              <h3 className="font-semibold mb-3 text-[14px]">Invocations</h3>
              <div className="h-48">
                <ResponsiveContainer>
                  <LineChart data={invocationData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="time" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="invocations" stroke="#0972d3" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="aws-card p-5">
              <h3 className="font-semibold mb-3 text-[14px]">Errors</h3>
              <div className="h-48">
                <ResponsiveContainer>
                  <LineChart data={invocationData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="time" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="errors" stroke="#dd344c" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="aws-card p-5 md:col-span-2">
              <h3 className="font-semibold mb-3 text-[14px]">Duration (ms)</h3>
              <div className="h-48">
                <ResponsiveContainer>
                  <LineChart data={invocationData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="time" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="duration" stroke="#ff9900" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )},
        { id: "perms", label: "Permissions", content: (
          <div className="aws-card p-5">
            <h3 className="font-semibold mb-3">Execution role</h3>
            <div className="text-[13px] font-mono">arn:aws:iam::512357470856:role/{fn.name}-role</div>
            <div className="mt-3 text-[13px] text-aws-text-muted">Resource-based policy statements: 1</div>
          </div>
        )},
      ]} />
    </div>
  );
}
