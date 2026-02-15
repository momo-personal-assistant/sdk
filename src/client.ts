import {
  MomoApiError,
  MomoAuthenticationError,
  MomoRateLimitError,
  MomoTimeoutError,
} from "./errors.js";
import type {
  MomoConfig,
  SearchParams,
  SearchResponse,
  StoreDecision,
  StoreResponse,
  ContextParams,
  ContextResponse,
  ExtractParams,
  ExtractResponse,
  SummaryParams,
  SummaryResponse,
  InsightsResponse,
  CapabilitiesResponse,
  UsageResponse,
  ScheduledTasksListResponse,
  CreateScheduledTaskParams,
  CreateScheduledTaskResponse,
  DeleteScheduledTaskResponse,
} from "./types.js";

const DEFAULT_BASE_URL = "https://app.usemomo.com";
const DEFAULT_TIMEOUT = 30_000;

export class Momo {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly timeout: number;
  private readonly _fetch: typeof globalThis.fetch;

  /** Namespaced CRUD for scheduled tasks */
  public readonly scheduledTasks: {
    list: () => Promise<ScheduledTasksListResponse>;
    create: (params: CreateScheduledTaskParams) => Promise<CreateScheduledTaskResponse>;
    delete: (taskId: string) => Promise<DeleteScheduledTaskResponse>;
  };

  constructor(config: MomoConfig) {
    if (!config.apiKey) {
      throw new Error("apiKey is required");
    }
    this.apiKey = config.apiKey;
    this.baseUrl = (config.baseUrl ?? DEFAULT_BASE_URL).replace(/\/+$/, "");
    this.timeout = config.timeout ?? DEFAULT_TIMEOUT;
    this._fetch = config.fetch ?? globalThis.fetch;

    this.scheduledTasks = {
      list: () => this.request<ScheduledTasksListResponse>("GET", "/api/ext/scheduled-tasks"),
      create: (params) =>
        this.request<CreateScheduledTaskResponse>("POST", "/api/ext/scheduled-tasks", params),
      delete: (taskId) =>
        this.request<DeleteScheduledTaskResponse>("DELETE", `/api/ext/scheduled-tasks/${encodeURIComponent(taskId)}`),
    };
  }

  // -----------------------------------------------------------------------
  // Public methods
  // -----------------------------------------------------------------------

  /**
   * Semantic search over stored decisions.
   *
   * Accepts a query string shorthand or a full params object.
   */
  async search(queryOrParams: string | SearchParams): Promise<SearchResponse> {
    const params: SearchParams =
      typeof queryOrParams === "string" ? { query: queryOrParams } : queryOrParams;

    const qs = new URLSearchParams({ query: params.query });
    if (params.limit !== undefined) qs.set("limit", String(params.limit));
    if (params.source !== undefined) qs.set("source", params.source);

    return this.request<SearchResponse>("GET", `/api/ext/search?${qs}`);
  }

  /**
   * Store one or more decisions.
   */
  async store(decisions: StoreDecision[]): Promise<StoreResponse> {
    return this.request<StoreResponse>("POST", "/api/ext/store", { decisions });
  }

  /**
   * Get LLM-ready context for a query.
   *
   * Accepts a query string shorthand or a full params object.
   */
  async context(queryOrParams: string | ContextParams): Promise<ContextResponse> {
    const params: ContextParams =
      typeof queryOrParams === "string" ? { query: queryOrParams } : queryOrParams;

    const qs = new URLSearchParams({ query: params.query });
    if (params.maxTokens !== undefined) qs.set("maxTokens", String(params.maxTokens));

    return this.request<ContextResponse>("GET", `/api/ext/context?${qs}`);
  }

  /**
   * Extract decisions from a conversation.
   */
  async extract(params: ExtractParams): Promise<ExtractResponse> {
    return this.request<ExtractResponse>("POST", "/api/ext/extract", params);
  }

  /**
   * Get a summary of recent decisions.
   */
  async summary(params?: SummaryParams): Promise<SummaryResponse> {
    const qs = new URLSearchParams();
    if (params?.period) qs.set("period", params.period);
    if (params?.type) qs.set("type", params.type);
    const query = qs.toString();
    return this.request<SummaryResponse>("GET", `/api/ext/summary${query ? `?${query}` : ""}`);
  }

  /**
   * Get cached memory insights.
   */
  async insights(): Promise<InsightsResponse> {
    return this.request<InsightsResponse>("GET", "/api/ext/insights");
  }

  /**
   * Discover available integrations and tools.
   */
  async capabilities(): Promise<CapabilitiesResponse> {
    return this.request<CapabilitiesResponse>("GET", "/api/ext/capabilities");
  }

  /**
   * Get current API usage and plan info.
   */
  async usage(): Promise<UsageResponse> {
    return this.request<UsageResponse>("GET", "/api/ext/usage");
  }

  // -----------------------------------------------------------------------
  // Internal
  // -----------------------------------------------------------------------

  private async request<T>(
    method: "GET" | "POST" | "DELETE",
    path: string,
    body?: unknown
  ): Promise<T> {
    const url = `${this.baseUrl}${path}`;

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeout);

    try {
      const res = await this._fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: body !== undefined ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      const text = await res.text();

      if (!res.ok) {
        if (res.status === 401) {
          throw new MomoAuthenticationError(text);
        }
        if (res.status === 429) {
          let remaining = 0;
          let limit = 0;
          try {
            const parsed = JSON.parse(text);
            remaining = parsed.remaining ?? 0;
            limit = parsed.limit ?? 0;
          } catch {
            // ignore parse errors
          }
          throw new MomoRateLimitError(text, remaining, limit);
        }
        throw new MomoApiError(
          `Momo API error (${res.status}): ${text}`,
          res.status,
          text
        );
      }

      const json = JSON.parse(text);

      // The API wraps responses in { success: true, ...data }.
      // Strip the `success` field so callers get the data directly.
      const { success: _success, ...data } = json;
      return data as T;
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        throw new MomoTimeoutError(this.timeout);
      }
      throw err;
    } finally {
      clearTimeout(timer);
    }
  }
}
