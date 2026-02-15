# @momo-memory/sdk

TypeScript SDK for the [Momo](https://usemomo.com) decision memory API.

Zero dependencies. Works in Node.js 18+, Deno, Bun, and edge runtimes.

## Install

```bash
npm install @momo-memory/sdk
```

## Quick Start

```typescript
import { Momo } from '@momo-memory/sdk'

const momo = new Momo({ apiKey: 'momo_sk_xxx' })

// Search decisions
const { results } = await momo.search('database migration')

// Store decisions
await momo.store([
  { title: 'Use PostgreSQL', summary: 'Chose Postgres over MySQL for JSONB support' }
])

// Get LLM-ready context
const { context } = await momo.context('auth decisions', { maxTokens: 4000 })
```

## API Reference

### Constructor

```typescript
const momo = new Momo({
  apiKey: 'momo_sk_xxx',             // required
  baseUrl: 'https://app.usemomo.com', // optional
  timeout: 30000,                     // optional (ms)
  fetch: customFetch,                 // optional (for testing)
})
```

### Methods

#### `search(query | params)`

Semantic search over stored decisions.

```typescript
// String shorthand
const { results } = await momo.search('hiring decisions')

// Full params
const { results } = await momo.search({
  query: 'hiring decisions',
  limit: 5,
  source: 'gmail',
})
```

#### `store(decisions)`

Store one or more decisions.

```typescript
const { stored, failed } = await momo.store([
  {
    title: 'Adopt React Server Components',
    summary: 'Moving to RSC for better performance',
    decisionType: 'direction',
    confidence: 'high',
    involvedPersons: [{ name: 'Alice', role: 'approver' }],
  },
])
```

#### `context(query | params)`

Get LLM-ready formatted context for a query.

```typescript
const { context, decisionsIncluded } = await momo.context('auth architecture')

// With token limit
const { context } = await momo.context({
  query: 'auth architecture',
  maxTokens: 4000,
})
```

#### `extract(params)`

Extract decisions from a conversation (min 2 messages).

```typescript
const { decisions } = await momo.extract({
  messages: [
    { role: 'user', content: 'Should we use Redis or Memcached?' },
    { role: 'assistant', content: "Let's go with Redis for its data structures." },
  ],
  source: 'openclaw',
})
```

#### `summary(params?)`

Get a summary of recent decisions grouped by source.

```typescript
const { totalDecisions, bySource } = await momo.summary({
  period: 'week',
  type: 'team',
})
```

#### `insights()`

Get cached memory insights (markdown).

```typescript
const { data } = await momo.insights()
if (data) {
  console.log(data.insights) // markdown string
}
```

#### `capabilities()`

Discover available integrations and tools.

```typescript
const { integrations, tools } = await momo.capabilities()
```

#### `tools.execute(params)`

Execute an integration tool (Gmail, Slack, Notion, GitHub). Use `capabilities()` to discover available tools.

```typescript
// Send an email via Gmail
const { result } = await momo.tools.execute({
  tool: 'gmail_send_email',
  params: {
    to: 'team@example.com',
    subject: 'Weekly update',
    body: 'Here are this week\'s key decisions...',
  },
})

// Search Slack messages
const { result } = await momo.tools.execute({
  tool: 'slack_search_messages',
  params: { query: 'launch date' },
})

// List GitHub PRs
const { result } = await momo.tools.execute({
  tool: 'github_list_prs',
  params: { owner: 'my-org', repo: 'my-repo', state: 'open' },
})
```

Available tools include:
- **Gmail**: `gmail_list_emails`, `gmail_get_email`, `gmail_get_thread`, `gmail_search_emails`, `gmail_send_email`, `gmail_reply_to_email`
- **Notion**: `notion_search_pages`, `notion_get_page`, `notion_list_databases`, `notion_query_database`, `notion_create_page`, `notion_append_content`, `notion_add_database_entry`
- **GitHub**: `github_list_repos`, `github_list_connected_repos`, `github_list_commits`, `github_get_commit`, `github_list_prs`, `github_get_pr`, `github_list_issues`
- **Slack**: `slack_get_my_identity`, `slack_list_channels`, `slack_get_channel_messages`, `slack_get_thread`, `slack_search_messages`, `slack_get_my_mentions`, `slack_send_message`, `slack_reply_to_thread`

#### `usage()`

Get current API usage and plan info.

```typescript
const { usage } = await momo.usage()
console.log(`${usage.callCount}/${usage.limit} calls used`)
```

#### `scheduledTasks.list()`

List all scheduled tasks.

```typescript
const { tasks, activeCount } = await momo.scheduledTasks.list()
```

#### `scheduledTasks.create(params)`

Create a new scheduled task.

```typescript
const { task } = await momo.scheduledTasks.create({
  name: 'Weekly Summary',
  prompt: 'Summarize this week\'s key decisions',
  frequency: 'weekly',
  scheduledTime: '09:00',
  dayOfWeek: 1, // Monday
  deliveryChannel: 'email',
})
```

#### `scheduledTasks.delete(taskId)`

Delete (disable) a scheduled task.

```typescript
await momo.scheduledTasks.delete('task-uuid')
```

## Error Handling

All API errors throw typed exceptions:

```typescript
import {
  MomoApiError,
  MomoAuthenticationError,
  MomoRateLimitError,
  MomoTimeoutError,
} from '@momo-memory/sdk'

try {
  await momo.search('test')
} catch (err) {
  if (err instanceof MomoAuthenticationError) {
    // 401 — bad API key
  } else if (err instanceof MomoRateLimitError) {
    // 429 — rate limited
    console.log(err.remaining, err.limit)
  } else if (err instanceof MomoTimeoutError) {
    // Request timed out
    console.log(err.timeoutMs)
  } else if (err instanceof MomoApiError) {
    // Other HTTP error
    console.log(err.status, err.rawResponse)
  }
}
```

## License

MIT
