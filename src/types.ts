// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

export interface MomoConfig {
  /** API key (momo_sk_xxx or momo_tk_xxx) */
  apiKey: string;
  /** Base URL of the Momo API. Default: "https://app.usemomo.com" */
  baseUrl?: string;
  /** Request timeout in milliseconds. Default: 30000 */
  timeout?: number;
  /** Custom fetch implementation (useful for testing) */
  fetch?: typeof globalThis.fetch;
}

// ---------------------------------------------------------------------------
// Shared / enums
// ---------------------------------------------------------------------------

export type DecisionType =
  | "approval"
  | "rejection"
  | "selection"
  | "delegation"
  | "commitment"
  | "direction"
  | "confirmation"
  | "cancellation"
  | "negotiation"
  | "prioritization";

export type DecisionConfidence = "high" | "medium" | "low";

export type DecisionStatus =
  | "decided"
  | "pending"
  | "revised"
  | "revoked"
  | "executed";

export type DecisionSource =
  | "gmail"
  | "github"
  | "notion"
  | "slack"
  | "discord"
  | "calendar"
  | "manual"
  | "openclaw"
  | "other";

export interface PersonRef {
  name: string;
  email?: string;
  role?: "approver" | "requestor" | "stakeholder" | "participant";
}

export interface EntityRef {
  name: string;
  type: "company" | "product" | "project" | "service" | "other";
}

export interface ProjectRef {
  name: string;
  id?: string;
}

// ---------------------------------------------------------------------------
// search()
// ---------------------------------------------------------------------------

export interface SearchParams {
  query: string;
  /** Max results. Default: 10, max: 50 */
  limit?: number;
  /** Filter by source */
  source?: DecisionSource;
}

export interface SearchResult {
  id: string;
  title: string;
  summary: string;
  source: string;
  sourceDate: string;
  decisionType: string;
  confidence: DecisionConfidence;
  involvedPersons: PersonRef[];
  score: number;
}

export interface SearchResponse {
  results: SearchResult[];
  query: string;
  stats: { searchTimeMs: number };
}

// ---------------------------------------------------------------------------
// store()
// ---------------------------------------------------------------------------

export interface StoreDecision {
  id?: string;
  /** Required — decision title */
  title: string;
  /** Required — short summary of what was decided */
  summary: string;
  fullContext?: string;
  decisionType?: DecisionType;
  confidence?: DecisionConfidence;
  status?: DecisionStatus;
  chosen?: string;
  rationale?: string;
  involvedPersons?: PersonRef[];
  relatedEntities?: EntityRef[];
  relatedProjects?: ProjectRef[];
  source?: string;
  sourceDate?: string;
  sourceEmailId?: string;
  sourceThreadId?: string;
  sourceUrl?: string;
  sourceMetadata?: Record<string, unknown>;
}

export interface StoreResponse {
  stored: number;
  failed: number;
  neo4jSynced: number;
  errors?: string[];
}

// ---------------------------------------------------------------------------
// context()
// ---------------------------------------------------------------------------

export interface ContextParams {
  query: string;
  /** Max tokens for the context string. Default: 4000, max: 8000 */
  maxTokens?: number;
}

export interface ContextResponse {
  context: string | null;
  decisionsIncluded: number;
  estimatedTokens: number;
  wasTruncated: boolean;
}

// ---------------------------------------------------------------------------
// extract()
// ---------------------------------------------------------------------------

export interface ExtractMessage {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
}

export interface ExtractParams {
  /** Minimum 2 messages */
  messages: ExtractMessage[];
  source?: string;
  channel?: "slack" | "discord" | "whatsapp" | "telegram" | "webchat";
  channelId?: string;
  sessionId?: string;
}

export interface ExtractedDecision {
  id: string;
  title: string;
  decisionType: string;
}

export interface ExtractResponse {
  decisionsFound: number;
  decisionsStored: number;
  decisions: ExtractedDecision[];
  stats: {
    durationMs: number;
    tokensUsed: { inputTokens: number; outputTokens: number };
    neo4jSynced: number;
  };
}

// ---------------------------------------------------------------------------
// summary()
// ---------------------------------------------------------------------------

export type SummaryPeriod = "today" | "week" | "month";
export type SummaryType = "team" | "personal";

export interface SummaryParams {
  /** Default: "week" */
  period?: SummaryPeriod;
  /** Default: "personal" */
  type?: SummaryType;
}

export interface SummaryDecision {
  id: string;
  title: string;
  summary: string;
  chosen: string;
  source: string;
  sourceDate: string;
  decisionType: string;
  involvedPersons: PersonRef[];
}

export interface SummaryResponse {
  period: SummaryPeriod;
  type: SummaryType;
  since: string;
  totalDecisions: number;
  bySource: Record<
    string,
    { count: number; decisions: SummaryDecision[] }
  >;
}

// ---------------------------------------------------------------------------
// insights()
// ---------------------------------------------------------------------------

export interface InsightsResponse {
  data: {
    insights: string;
    generatedAt: string;
  } | null;
}

// ---------------------------------------------------------------------------
// capabilities()
// ---------------------------------------------------------------------------

export interface ToolDefinition {
  name: string;
  description: string;
  parameters: {
    type: string;
    properties: Record<string, unknown>;
    required?: string[];
  };
}

export interface CapabilitiesResponse {
  integrations: string[];
  tools: ToolDefinition[];
  toolCount: number;
}

// ---------------------------------------------------------------------------
// tools.execute()
// ---------------------------------------------------------------------------

export interface ToolExecuteParams {
  /** Tool name from capabilities() */
  tool: string;
  /** Tool-specific parameters */
  params: Record<string, unknown>;
}

export interface ToolExecuteResponse {
  tool: string;
  result: unknown;
}

// ---------------------------------------------------------------------------
// usage()
// ---------------------------------------------------------------------------

export interface UsageResponse {
  usage: {
    plan: "free" | "pro";
    month: string;
    limit: number;
    callCount: number;
    remaining: number;
  };
}

// ---------------------------------------------------------------------------
// scheduledTasks
// ---------------------------------------------------------------------------

export interface ScheduledTask {
  id: string;
  name: string;
  prompt: string;
  schedule: string;
  frequency: "daily" | "weekly" | "monthly";
  scheduledTime: string;
  dayOfWeek?: number;
  dayOfMonth?: number;
  deliveryChannel: "email" | "slack" | "in_app";
  timezone: string;
  enabled: boolean;
  lastRun: string | null;
  lastRunStatus: string | null;
  runCount: number;
  createdAt: string;
}

export interface ScheduledTasksListResponse {
  tasks: ScheduledTask[];
  count: number;
  activeCount: number;
}

export interface CreateScheduledTaskParams {
  name: string;
  prompt: string;
  scheduledTime: string;
  frequency: "daily" | "weekly" | "monthly";
  dayOfWeek?: number;
  dayOfMonth?: number;
  deliveryChannel?: "email" | "slack" | "in_app";
  deliveryConfig?: {
    emailSubject?: string;
    slackChannelId?: string;
  };
}

export interface CreateScheduledTaskResponse {
  task: {
    id: string;
    name: string;
    schedule: string;
    deliveryChannel: string;
    timezone: string;
  };
  message: string;
}

export interface DeleteScheduledTaskResponse {
  message: string;
}
