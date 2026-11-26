# AWS Console Clone

A zero-cost AWS learning sandbox: a React clone of the AWS Management Console that talks to a **local AWS emulator** through the real **AWS SDK v3**, so you can practise cloud workflows without touching a real account or paying a cent.

> The code you write here is the code you'd write against real AWS. Moving to production is a matter of removing the local endpoint.

## What's in it

| Service | Console pages |
|---|---|
| **S3** | List, create and browse buckets |
| **DynamoDB** | List and create tables, table detail |
| **EC2** | Instances, launch wizard, key pairs, security groups |
| **Lambda** | List, create and edit functions, view details |
| **CloudWatch** | Log groups, streams and events |

Region switching is built in (`src/lib/RegionContext.jsx`).

## Architecture

```
Browser (React + Vite, AWS SDK v3)
   ├── /s3-api      ──► Floci AWS emulator   :4566   (S3, DynamoDB, ...)
   └── /backend-api ──► Express backend      :3001   (Lambda create/update/invoke/execute)
```

- **Frontend:** React 19, React Router, Vite, `@aws-sdk/client-s3`, `@aws-sdk/client-ec2`.
- **Backend:** a small Express service (`backend/`) that manages and executes Lambda functions.
- **Emulator:** [Floci](https://github.com/floci-io/floci), an open-source local AWS emulator (third-party, not part of this repo).

More detail: [`LAMBDA_FLOW.md`](LAMBDA_FLOW.md) (how Lambda create, invoke and logs work) and [`PLAN.md`](PLAN.md) (the original design and roadmap, including features that are planned but not built).

## Run it locally

Prerequisites: Node.js 18+ and Docker.

1. **Start the emulator** on port `4566`. Follow the [Floci README](https://github.com/floci-io/floci) for the current run command.
2. **Start the backend:**
   ```bash
   cd backend
   npm install
   npm start        # http://localhost:3001
   ```
3. **Start the UI** (from the repo root):
   ```bash
   npm install
   npm run dev      # http://localhost:5173
   ```

Sanity-check the emulator with `python test_floci.py` (needs `boto3`). It uses dummy credentials (`test` / `test`), which is all a local emulator needs.

## Status

Working: S3, DynamoDB, EC2 and CloudWatch views and the Lambda management backend. Several items in `PLAN.md` (IAM policy enforcement, WebSocket terminals, production deployment) are design notes, not shipped features.

## License

MIT, see [`LICENSE`](LICENSE).
