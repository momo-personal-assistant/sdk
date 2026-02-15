# @momo-memory/sdk — Test Results

> Ran on: 2026-02-15 against `localhost:3000`
> SDK version: 0.1.2
> Result: **12 passed, 0 failed**

---

## Test Script

```typescript
import { Momo, MomoApiError, MomoAuthenticationError } from "./src/index.js";

const API_KEY = "momo_npgfEh4E2Ni-9I6KAHkWz6grHhFfvrEoUCNAK_S2ju0";
const BASE_URL = "http://localhost:3000";

const momo = new Momo({ apiKey: API_KEY, baseUrl: BASE_URL });

// Tests run:
// 1. search(string)
// 2. search(params with limit + source)
// 3. context(string)
// 4. context(params with maxTokens)
// 5. store()
// 6. summary()
// 7. insights()
// 8. capabilities()
// 9. tools.execute(gmail_send_email)
// 10. usage()
// 11. scheduledTasks.list()
// 12. bad API key → MomoAuthenticationError
```

---

## Output Logs

### 1. `search('database')`

```json
{
  "results": [
    {
      "id": "9f225b7f-83e8-4b1a-bb41-15fe8cee56d9",
      "title": "Vercel and Supabase selected as hosting stack",
      "summary": "Vercel + Supabase combo",
      "source": "slack",
      "sourceDate": "2026-01-27T23:22:47.432Z",
      "decisionType": "selection",
      "confidence": "high",
      "involvedPersons": [],
      "score": 0.8
    },
    {
      "id": "2789fcc8-0501-4f5c-b953-a37b5348bab9",
      "title": "Vercel and Supabase selected for hosting stack",
      "summary": "Vercel + Supabase combo",
      "source": "slack",
      "sourceDate": "2026-01-27T23:21:50.464Z",
      "decisionType": "selection",
      "confidence": "high",
      "involvedPersons": [],
      "score": 0.8
    },
    {
      "id": "09960fb6-6d55-49d3-850f-49e1a5fba3fd",
      "title": "PostgreSQL selected over MongoDB for ACID compliance",
      "summary": "PostgreSQL",
      "source": "slack",
      "sourceDate": "2026-01-27T21:08:48.516Z",
      "decisionType": "selection",
      "confidence": "high",
      "involvedPersons": [],
      "score": 0.8
    },
    {
      "id": "bd04f608-ef6f-4c87-bd5d-69dde9e7a31c",
      "title": "Add source tracking to extraction jobs",
      "summary": "Implement source parameter in extraction job creation...",
      "source": "github",
      "sourceDate": "2026-01-27T00:43:47.000Z",
      "decisionType": "direction",
      "confidence": "high",
      "involvedPersons": [],
      "score": 0.8
    }
  ],
  "query": "database",
  "stats": {
    "totalResults": 9,
    "searchTimeMs": 1795,
    "embeddingTimeMs": 367
  }
}
```

---

### 2. `search({ query: 'project decisions', limit: 3, source: 'github' })`

```json
{
  "results": [],
  "query": "project decisions",
  "stats": {
    "totalResults": 1,
    "searchTimeMs": 902,
    "embeddingTimeMs": 277
  }
}
```

---

### 3. `context('auth decisions')`

```json
{
  "context": "Found 1 relevant decision from your history:\n\n\n[Decision 1] Enhanced decision extraction and multi-platform integration\n  Date: Feb 6, 2026 (last week)\n  Type: Strategic Direction\n  Summary: Added discoveredAuthorId tracking, new insight endpoints, improved disconnect handling, and documentation\n  Decided: Implement discoveredAuthorId field in decision storage for better attribution tracking across platforms\n  Rationale: Better attribution of decisions made by discovered members enables improved tracking and management of decisions across various platforms",
  "decisionsIncluded": 1,
  "estimatedTokens": 141,
  "wasTruncated": false
}
```

---

### 4. `context({ query: 'hiring', maxTokens: 2000 })`

```json
{
  "context": "Found 1 relevant decision from your history:\n\n\n[Decision 1] Migrate from Inngest to Cron Job\n  Date: Feb 13, 2026 (2 days ago)\n  Type: Strategic Direction\n  Summary: Replaced Inngest event-driven system with cron job scheduling\n  Decided: Switched from Inngest (event-driven workflow platform) to cron job-based scheduling\n  Background: ...",
  "decisionsIncluded": 1,
  "estimatedTokens": 315,
  "wasTruncated": false
}
```

---

### 5. `store()`

```json
{
  "stored": 1,
  "failed": 0,
  "neo4jSynced": 1
}
```

---

### 6. `summary({ period: 'week' })`

```json
{
  "period": "week",
  "type": "team",
  "since": "2026-02-08T19:33:20.102Z",
  "totalDecisions": 32,
  "bySource": {
    "openclaw": {
      "count": 3,
      "decisions": [
        {
          "id": "55805153-57fa-4219-8980-af43d6b371cb",
          "title": "SDK Test: Use Bun for scripts",
          "summary": "SDK Test: Use Bun for scripts",
          "chosen": "Chose Bun over tsx for running TypeScript scripts",
          "source": "openclaw",
          "sourceDate": "2026-02-15T19:33:17.54+00:00",
          "decisionType": "selection",
          "involvedPersons": [
            { "name": "Test User", "role": "approver" }
          ]
        }
      ]
    },
    "gmail": {
      "count": 6,
      "decisions": [
        {
          "id": "33feef7f-9b26-4831-8e06-347c8e61d307",
          "title": "Momo Memory Plugin Launch and Funding Pitch",
          "summary": "Momo Memory Plugin Launch and Funding Pitch",
          "chosen": "Momo founder is actively seeking $125K in funding...",
          "source": "gmail",
          "sourceDate": "2026-02-15T18:46:02+00:00",
          "decisionType": "commitment",
          "involvedPersons": []
        }
      ]
    },
    "github": {
      "count": 23,
      "decisions": [
        {
          "id": "265229c1-7761-4625-ad21-88b917436ae5",
          "title": "Setup cron job during initialization",
          "summary": "Configure cron scheduling during application setup phase",
          "chosen": "Initialize cron job as part of setup process",
          "source": "github",
          "sourceDate": "2026-02-13T08:31:37+00:00",
          "decisionType": "direction",
          "involvedPersons": []
        }
      ]
    }
  }
}
```

---

### 7. `insights()`

```json
{
  "data": {
    "insights": "{\"summaryBullets\":[\"Completed Neo4j migration with login system updates\",\"Prepared SAFE contract for Untapped Capital Fund II\",\"Scheduled Insight Partners relationship-building meeting\",\"Implemented maintenance mode with waitlist signup\",\"Selected Vercel and Supabase for hosting stack\"],\"periodLabel\":\"all time\",\"needsAttention\":[{\"signal\":\"Investor follow-up needed\",\"context\":\"Pending terms discussion with Yohei, upcoming Insight Partners meeting\",\"sources\":[\"Gmail\",\"Slack\"]},{\"signal\":\"Fundraising strategy requires careful execution\",\"context\":\"Focus on traction before active fundraising\",\"sources\":[\"Gmail\",\"Notion\"]}],\"totalDecisions\":151,\"generatedAt\":\"2026-02-13T22:42:21.035Z\"}",
    "generatedAt": "2026-02-13T22:42:21.145+00:00"
  }
}
```

---

### 8. `capabilities()`

```json
{
  "integrations": ["github", "gmail", "google", "notion", "slack"],
  "tools": [
    { "name": "gmail_list_emails", "description": "List emails from the user's Gmail inbox...", "parameters": {} },
    { "name": "gmail_get_email", "description": "Get the full content of a specific email...", "parameters": {} },
    { "name": "gmail_get_thread", "description": "Get all messages in an email thread...", "parameters": {} },
    { "name": "gmail_search_emails", "description": "Search for emails using Gmail's search syntax...", "parameters": {} },
    { "name": "gmail_send_email", "description": "Send a new email...", "parameters": {} },
    { "name": "gmail_reply_to_email", "description": "Reply to an existing email thread...", "parameters": {} },
    { "name": "notion_search_pages", "description": "Search for pages in Notion workspace...", "parameters": {} },
    { "name": "notion_get_page", "description": "Get the full content of a Notion page...", "parameters": {} },
    { "name": "notion_list_databases", "description": "List databases in Notion workspace...", "parameters": {} },
    { "name": "notion_query_database", "description": "Query a Notion database...", "parameters": {} },
    { "name": "notion_create_page", "description": "Create a new sub-page under a Notion page...", "parameters": {} },
    { "name": "notion_append_content", "description": "Append content to a Notion page...", "parameters": {} },
    { "name": "notion_add_database_entry", "description": "Add a new entry to a Notion database...", "parameters": {} },
    { "name": "github_list_repos", "description": "List the user's GitHub repositories...", "parameters": {} },
    { "name": "github_list_connected_repos", "description": "List GitHub repos connected to Momo...", "parameters": {} },
    { "name": "github_list_commits", "description": "List recent commits for a repo...", "parameters": {} },
    { "name": "github_get_commit", "description": "Get details of a specific commit...", "parameters": {} },
    { "name": "github_list_prs", "description": "List pull requests for a repo...", "parameters": {} },
    { "name": "github_get_pr", "description": "Get details of a specific pull request...", "parameters": {} },
    { "name": "github_list_issues", "description": "List issues for a repo...", "parameters": {} },
    { "name": "slack_get_my_identity", "description": "Get the current user's Slack identity...", "parameters": {} },
    { "name": "slack_list_channels", "description": "List Slack channels...", "parameters": {} },
    { "name": "slack_get_channel_messages", "description": "Get recent messages from a Slack channel...", "parameters": {} },
    { "name": "slack_get_thread", "description": "Get all messages in a Slack thread...", "parameters": {} },
    { "name": "slack_search_messages", "description": "Search for messages containing text...", "parameters": {} },
    { "name": "slack_get_my_mentions", "description": "Find Slack messages where you are @mentioned...", "parameters": {} },
    { "name": "slack_send_message", "description": "Send a message to a Slack channel...", "parameters": {} },
    { "name": "slack_reply_to_thread", "description": "Reply to a Slack thread...", "parameters": {} },
    { "name": "momo_create_scheduled_task", "description": "Create a new scheduled task...", "parameters": {} },
    { "name": "momo_list_scheduled_tasks", "description": "List all scheduled tasks...", "parameters": {} },
    { "name": "momo_cancel_scheduled_task", "description": "Cancel a scheduled task...", "parameters": {} }
  ],
  "toolCount": 31
}
```

---

### 9. `tools.execute(gmail_send_email)`

```json
{
  "tool": "gmail_send_email",
  "result": {
    "sent": true,
    "messageId": "19c62cb226fe4258",
    "message": "Email sent successfully to cailyn@usemomo.com"
  }
}
```

---

### 10. `usage()`

```json
{
  "usage": {
    "month": "2026-02",
    "callCount": 101,
    "limit": 10000,
    "remaining": 9899,
    "plan": "free"
  }
}
```

---

### 11. `scheduledTasks.list()`

```json
{
  "tasks": [
    {
      "id": "5170855e-a163-4ec6-9314-1a28477e3462",
      "name": "Daily Brief",
      "prompt": "Summarize today's key decisions and updates from Gmail...",
      "schedule": "Every day at 00:45",
      "frequency": "daily",
      "scheduledTime": "00:45",
      "dayOfWeek": null,
      "dayOfMonth": null,
      "deliveryChannel": "email",
      "timezone": "America/Los_Angeles",
      "enabled": false,
      "lastRun": "2026-02-13T08:45:43.461+00:00",
      "lastRunStatus": "success",
      "runCount": 1,
      "createdAt": "2026-02-13T08:43:55.117169+00:00"
    },
    {
      "id": "31ba9e2f-d202-41da-b9de-233f787a6bc9",
      "name": "Daily Work Brief",
      "prompt": "Summarize all decisions, commits, meetings...",
      "schedule": "Every day at 23:54",
      "frequency": "daily",
      "scheduledTime": "23:54",
      "deliveryChannel": "email",
      "timezone": "America/Los_Angeles",
      "enabled": false,
      "lastRun": "2026-02-13T07:54:49.823+00:00",
      "lastRunStatus": "success",
      "runCount": 1,
      "createdAt": "2026-02-11T01:08:16.452389+00:00"
    },
    {
      "id": "886f4ece-8623-492f-8fd5-4e0590aad53c",
      "name": "Daily Discord Decisions to #general",
      "prompt": "Find all decisions that were made in Discord today...",
      "schedule": "Every day at 16:36",
      "frequency": "daily",
      "scheduledTime": "16:36",
      "deliveryChannel": "in_app",
      "timezone": "America/Los_Angeles",
      "enabled": false,
      "runCount": 4,
      "createdAt": "2026-02-07T00:33:19.23364+00:00"
    },
    {
      "id": "e199bebf-0ae9-4a63-a04d-b9df0b2b491e",
      "name": "Daily Work Summary (Email)",
      "prompt": "Summarize all work I completed today...",
      "schedule": "Every day at 19:52",
      "frequency": "daily",
      "scheduledTime": "19:52",
      "deliveryChannel": "email",
      "timezone": "America/Los_Angeles",
      "enabled": false,
      "runCount": 10,
      "createdAt": "2026-02-06T22:36:04.19352+00:00"
    }
  ],
  "count": 4,
  "activeCount": 0
}
```

---

### 12. Bad API key → `MomoAuthenticationError`

```json
{
  "errorName": "MomoAuthenticationError",
  "status": 401,
  "message": "Authentication failed — check your API key"
}
```
