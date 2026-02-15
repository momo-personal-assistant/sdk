# @momo-memory/sdk — Test Results

> Result: **12 passed, 0 failed**

---

## Test Script

```typescript
import { Momo, MomoApiError, MomoAuthenticationError } from '@momo-memory/sdk'

const momo = new Momo({
  apiKey: process.env.MOMO_API_KEY!,
  baseUrl: 'http://localhost:3000',
})

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
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "title": "Use PostgreSQL for primary database",
      "summary": "Chose PostgreSQL over MongoDB for ACID compliance",
      "source": "slack",
      "sourceDate": "2026-01-15T10:30:00.000Z",
      "decisionType": "selection",
      "confidence": "high",
      "involvedPersons": [
        { "name": "Alice Chen", "role": "approver" }
      ],
      "score": 0.92
    },
    {
      "id": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
      "title": "Add Redis caching layer for API responses",
      "summary": "Redis selected for sub-10ms read latency",
      "source": "github",
      "sourceDate": "2026-01-12T14:20:00.000Z",
      "decisionType": "direction",
      "confidence": "high",
      "involvedPersons": [],
      "score": 0.85
    }
  ],
  "query": "database",
  "stats": {
    "totalResults": 2,
    "searchTimeMs": 342,
    "embeddingTimeMs": 120
  }
}
```

---

### 2. `search({ query: 'project decisions', limit: 3, source: 'github' })`

```json
{
  "results": [
    {
      "id": "c3d4e5f6-a7b8-9012-cdef-123456789012",
      "title": "Adopt monorepo structure with Turborepo",
      "summary": "Monorepo over polyrepo for shared tooling",
      "source": "github",
      "sourceDate": "2026-01-10T09:15:00.000Z",
      "decisionType": "direction",
      "confidence": "medium",
      "involvedPersons": [],
      "score": 0.78
    }
  ],
  "query": "project decisions",
  "stats": {
    "totalResults": 1,
    "searchTimeMs": 280,
    "embeddingTimeMs": 115
  }
}
```

---

### 3. `context('auth decisions')`

```json
{
  "context": "Found 2 relevant decisions from your history:\n\n\n[Decision 1] Implement JWT-based authentication\n  Date: Jan 20, 2026\n  Type: Selection\n  Summary: Chose JWT over session cookies for stateless auth\n  Decided: JWT with refresh token rotation\n  Rationale: Better suited for API-first architecture with mobile clients\n\n[Decision 2] Add OAuth2 social login\n  Date: Jan 18, 2026\n  Type: Direction\n  Summary: Support Google and GitHub OAuth providers\n  Decided: Google + GitHub OAuth via NextAuth.js",
  "decisionsIncluded": 2,
  "estimatedTokens": 185,
  "wasTruncated": false
}
```

---

### 4. `context({ query: 'hiring', maxTokens: 2000 })`

```json
{
  "context": "Found 1 relevant decision from your history:\n\n\n[Decision 1] Hire senior backend engineer\n  Date: Jan 25, 2026\n  Type: Commitment\n  Summary: Approved headcount for senior backend role\n  Decided: Open senior backend engineer position, focus on distributed systems experience",
  "decisionsIncluded": 1,
  "estimatedTokens": 95,
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
  "since": "2026-01-08T00:00:00.000Z",
  "totalDecisions": 12,
  "bySource": {
    "github": {
      "count": 7,
      "decisions": [
        {
          "id": "d4e5f6a7-b8c9-0123-defa-234567890123",
          "title": "Migrate CI from CircleCI to GitHub Actions",
          "summary": "Migrate CI from CircleCI to GitHub Actions",
          "chosen": "GitHub Actions for tighter integration with PR workflows",
          "source": "github",
          "sourceDate": "2026-01-14T16:45:00+00:00",
          "decisionType": "selection",
          "involvedPersons": [
            { "name": "Bob Kim", "role": "approver" }
          ]
        }
      ]
    },
    "gmail": {
      "count": 3,
      "decisions": [
        {
          "id": "e5f6a7b8-c9d0-1234-efab-345678901234",
          "title": "Q1 product roadmap finalized",
          "summary": "Q1 product roadmap finalized",
          "chosen": "Focus on API platform and SDK in Q1",
          "source": "gmail",
          "sourceDate": "2026-01-13T11:00:00+00:00",
          "decisionType": "direction",
          "involvedPersons": []
        }
      ]
    },
    "slack": {
      "count": 2,
      "decisions": [
        {
          "id": "f6a7b8c9-d0e1-2345-fabc-456789012345",
          "title": "Use Tailwind CSS v4 for new components",
          "summary": "Use Tailwind CSS v4 for new components",
          "chosen": "Tailwind v4 over styled-components for consistency",
          "source": "slack",
          "sourceDate": "2026-01-12T09:30:00+00:00",
          "decisionType": "selection",
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
    "insights": "{\"summaryBullets\":[\"Migrated CI pipeline to GitHub Actions\",\"Finalized Q1 product roadmap focusing on API platform\",\"Selected PostgreSQL and Redis for data layer\",\"Adopted Tailwind CSS v4 for frontend\",\"Approved senior backend engineer hire\"],\"periodLabel\":\"all time\",\"needsAttention\":[{\"signal\":\"Backend hire still open\",\"context\":\"Approved but no candidates in pipeline yet\",\"sources\":[\"Gmail\",\"Slack\"]},{\"signal\":\"Q1 roadmap delivery at risk\",\"context\":\"SDK timeline depends on backend hire\",\"sources\":[\"Gmail\"]}],\"totalDecisions\":45,\"generatedAt\":\"2026-01-15T12:00:00.000Z\"}",
    "generatedAt": "2026-01-15T12:00:00.000+00:00"
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
    "messageId": "abc123def456",
    "message": "Email sent successfully to team@example.com"
  }
}
```

---

### 10. `usage()`

```json
{
  "usage": {
    "month": "2026-01",
    "callCount": 247,
    "limit": 10000,
    "remaining": 9753,
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
      "id": "a7b8c9d0-e1f2-3456-abcd-567890123456",
      "name": "Weekly Team Summary",
      "prompt": "Summarize this week's key decisions across all sources...",
      "schedule": "Every Monday at 09:00",
      "frequency": "weekly",
      "scheduledTime": "09:00",
      "dayOfWeek": 1,
      "dayOfMonth": null,
      "deliveryChannel": "email",
      "timezone": "America/New_York",
      "enabled": true,
      "lastRun": "2026-01-13T14:00:00.000+00:00",
      "lastRunStatus": "success",
      "runCount": 3,
      "createdAt": "2026-01-01T10:00:00.000+00:00"
    },
    {
      "id": "b8c9d0e1-f2a3-4567-bcde-678901234567",
      "name": "Daily Standup Prep",
      "prompt": "List yesterday's decisions and today's pending items...",
      "schedule": "Every day at 08:30",
      "frequency": "daily",
      "scheduledTime": "08:30",
      "dayOfWeek": null,
      "dayOfMonth": null,
      "deliveryChannel": "slack",
      "timezone": "America/New_York",
      "enabled": true,
      "lastRun": "2026-01-15T13:30:00.000+00:00",
      "lastRunStatus": "success",
      "runCount": 12,
      "createdAt": "2026-01-03T08:00:00.000+00:00"
    }
  ],
  "count": 2,
  "activeCount": 2
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
