"use client";

import { useAuiState } from "@assistant-ui/react";
import { useThreadTokenUsage } from "@assistant-ui/react-ai-sdk";
import type { ThreadTokenUsage } from "@assistant-ui/react-ai-sdk";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type FC,
  type ReactNode,
} from "react";

const formatTokenCount = (tokens: number): string => {
  if (tokens >= 1_000_000) return `${(tokens / 1_000_000).toFixed(1)}M`;
  if (tokens >= 1_000) return `${(tokens / 1_000).toFixed(1)}k`;
  return `${tokens}`;
};

const getUsagePercent = (
  totalTokens: number | undefined,
  modelContextWindow: number,
): number => {
  if (!totalTokens) return 0;
  return Math.min((totalTokens / modelContextWindow) * 100, 100);
};

type UsageSeverity = "normal" | "warning" | "critical";

const getUsageSeverity = (percent: number): UsageSeverity => {
  if (percent > 85) return "critical";
  if (percent >= 65) return "warning";
  return "normal";
};

const getStrokeColor = (percent: number): string => {
  const severity = getUsageSeverity(percent);
  if (severity === "critical") return "stroke-red-500";
  if (severity === "warning") return "stroke-amber-500";
  return "stroke-emerald-500";
};

const getBarColor = (percent: number): string => {
  const severity = getUsageSeverity(percent);
  if (severity === "critical") return "bg-red-500";
  if (severity === "warning") return "bg-amber-500";
  return "bg-emerald-500";
};

type ContextDisplayContextValue = {
  usage: ThreadTokenUsage | undefined;
  totalTokens: number;
  percent: number;
  modelContextWindow: number;
};

type ModelPricing = {
  prompt?: number;
  completion?: number;
  input_cache_read?: number;
  internal_reasoning?: number;
  reasoning?: number;
};

type ModelsResponse = {
  data?: Array<{
    id?: string;
    canonical_slug?: string;
    pricing?: Record<string, string | number | null | undefined>;
  }>;
};

const ContextDisplayContext = createContext<ContextDisplayContextValue | null>(
  null,
);

function useContextDisplay(): ContextDisplayContextValue {
  const ctx = useContext(ContextDisplayContext);
  if (!ctx) {
    throw new Error("ContextDisplay.* must be used within ContextDisplay.Root");
  }
  return ctx;
}

function asRecord(value: unknown): Record<string, unknown> | undefined {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return undefined;
  }
  return value as Record<string, unknown>;
}

function asNumber(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.length > 0) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return undefined;
}

function useLatestAssistantModelId(): string | undefined {
  return useAuiState((s) => {
    for (let idx = s.thread.messages.length - 1; idx >= 0; idx -= 1) {
      const message = s.thread.messages[idx];
      if (message.role !== "assistant") continue;
      const metadata = asRecord(message.metadata);
      if (!metadata) continue;
      if (typeof metadata.modelId === "string") return metadata.modelId;
      const custom = asRecord(metadata.custom);
      if (custom && typeof custom.modelId === "string") return custom.modelId;
    }
    return undefined;
  });
}

function parsePricing(
  pricing: Record<string, string | number | null | undefined> | undefined,
): ModelPricing | undefined {
  if (!pricing) return undefined;
  const parsed: ModelPricing = {
    prompt: asNumber(pricing.prompt),
    completion: asNumber(pricing.completion),
    input_cache_read: asNumber(pricing.input_cache_read),
    internal_reasoning: asNumber(pricing.internal_reasoning),
    reasoning: asNumber(pricing.reasoning),
  };

  if (
    parsed.prompt === undefined &&
    parsed.completion === undefined &&
    parsed.input_cache_read === undefined &&
    parsed.internal_reasoning === undefined &&
    parsed.reasoning === undefined
  ) {
    return undefined;
  }
  return parsed;
}

function estimateUsdBurned(
  usage: ThreadTokenUsage | undefined,
  pricing: ModelPricing | undefined,
): number | undefined {
  if (!usage || !pricing) return undefined;

  const inputCost = (usage.inputTokens ?? 0) * (pricing.prompt ?? 0);
  const cachedCost =
    (usage.cachedInputTokens ?? 0) *
    (pricing.input_cache_read ?? pricing.prompt ?? 0);
  const outputCost = (usage.outputTokens ?? 0) * (pricing.completion ?? 0);
  const reasoningRate =
    pricing.internal_reasoning ?? pricing.reasoning ?? undefined;
  const reasoningCost =
    reasoningRate !== undefined ? (usage.reasoningTokens ?? 0) * reasoningRate : 0;

  const total = inputCost + cachedCost + outputCost + reasoningCost;
  if (!Number.isFinite(total) || total <= 0) return undefined;
  return total;
}

function formatUsd(value: number): string {
  if (value < 0.0001) return `<$${value.toFixed(6)}`;
  if (value < 1) return `$${value.toFixed(4)}`;
  return `$${value.toFixed(2)}`;
}

type PresetProps = {
  modelContextWindow: number;
  className?: string;
  side?: "top" | "bottom" | "left" | "right";
  usage?: ThreadTokenUsage | undefined;
};

type ContextDisplayRootProps = {
  modelContextWindow: number;
  children: ReactNode;
  usage?: ThreadTokenUsage | undefined;
};

function ContextDisplayRootBase({
  modelContextWindow,
  children,
  usage,
}: {
  modelContextWindow: number;
  children: ReactNode;
  usage: ThreadTokenUsage | undefined;
}) {
  const threadId = useAuiState((s) => s.threadListItem.id);
  const rawTokens = usage?.totalTokens ?? 0;
  const [tokenState, setTokenState] = useState({
    threadId,
    totalTokens: rawTokens > 0 ? rawTokens : 0,
    usage,
  });

  useEffect(() => {
    setTokenState((prev) => {
      if (prev.threadId !== threadId) {
        return {
          threadId,
          totalTokens: rawTokens > 0 ? rawTokens : 0,
          usage,
        };
      }
      if (rawTokens > 0 && rawTokens !== prev.totalTokens) {
        return { ...prev, totalTokens: rawTokens, usage };
      }
      if (usage !== prev.usage) {
        return { ...prev, usage };
      }
      return prev;
    });
  }, [threadId, rawTokens, usage]);

  const totalTokens = tokenState.totalTokens;
  const percent = getUsagePercent(totalTokens, modelContextWindow);

  return (
    <ContextDisplayContext.Provider
      value={{
        usage: tokenState.usage,
        totalTokens,
        percent,
        modelContextWindow,
      }}
    >
      <Tooltip>{children}</Tooltip>
    </ContextDisplayContext.Provider>
  );
}

function ContextDisplayRootInternal({
  modelContextWindow,
  children,
}: {
  modelContextWindow: number;
  children: ReactNode;
}) {
  const usage = useThreadTokenUsage();
  return (
    <ContextDisplayRootBase
      modelContextWindow={modelContextWindow}
      usage={usage}
    >
      {children}
    </ContextDisplayRootBase>
  );
}

function ContextDisplayRoot(props: ContextDisplayRootProps) {
  if (props.usage !== undefined) {
    return (
      <ContextDisplayRootBase
        modelContextWindow={props.modelContextWindow}
        usage={props.usage}
      >
        {props.children}
      </ContextDisplayRootBase>
    );
  }
  return (
    <ContextDisplayRootInternal modelContextWindow={props.modelContextWindow}>
      {props.children}
    </ContextDisplayRootInternal>
  );
}

function ContextDisplayTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<"button">) {
  return (
    <TooltipTrigger asChild>
      <button
        type="button"
        data-slot="context-display-trigger"
        className={cn(
          "inline-flex items-center rounded-md transition-colors",
          className,
        )}
        {...props}
      >
        {children}
      </button>
    </TooltipTrigger>
  );
}

function ContextDisplayContent({
  side = "top",
  className,
}: {
  side?: "top" | "bottom" | "left" | "right" | undefined;
  className?: string;
}) {
  const { usage, totalTokens, percent, modelContextWindow } =
    useContextDisplay();
  const modelId = useLatestAssistantModelId();
  const [pricingByModelId, setPricingByModelId] = useState<
    Record<string, ModelPricing>
  >({});

  useEffect(() => {
    let active = true;

    const load = async () => {
      const response = await fetch("/api/models");
      if (!response.ok) return;
      const payload: ModelsResponse = await response.json();
      const entries = payload.data ?? [];
      const map: Record<string, ModelPricing> = {};

      for (const model of entries) {
        const pricing = parsePricing(model.pricing);
        if (!pricing) continue;
        if (model.id) map[model.id] = pricing;
        if (model.canonical_slug) map[model.canonical_slug] = pricing;
      }

      if (active) setPricingByModelId(map);
    };

    load().catch((error: unknown) => {
      console.error("[context-display] Failed to load model pricing", error);
    });
    return () => {
      active = false;
    };
  }, []);

  const estimatedCost = estimateUsdBurned(
    usage,
    modelId ? pricingByModelId[modelId] : undefined,
  );

  return (
    <TooltipContent
      side={side}
      sideOffset={8}
      data-slot="context-display-popover"
      className={cn(
        "[&_span>svg]:hidden! rounded-lg border bg-popover px-3 py-2 text-popover-foreground shadow-md",
        className,
      )}
    >
      <div className="grid min-w-40 gap-1.5 text-xs">
        <div className="flex items-center justify-between gap-4">
          <span className="text-muted-foreground">Usage</span>
          <span className="font-mono tabular-nums">{Math.round(percent)}%</span>
        </div>
        {usage?.inputTokens !== undefined && (
          <div className="flex items-center justify-between gap-4">
            <span className="text-muted-foreground">Input</span>
            <span className="font-mono tabular-nums">
              {formatTokenCount(usage.inputTokens)}
            </span>
          </div>
        )}
        {usage?.cachedInputTokens !== undefined &&
          usage.cachedInputTokens > 0 && (
            <div className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground">Cached</span>
              <span className="font-mono tabular-nums">
                {formatTokenCount(usage.cachedInputTokens)}
              </span>
            </div>
          )}
        {usage?.outputTokens !== undefined && (
          <div className="flex items-center justify-between gap-4">
            <span className="text-muted-foreground">Output</span>
            <span className="font-mono tabular-nums">
              {formatTokenCount(usage.outputTokens)}
            </span>
          </div>
        )}
        {usage?.reasoningTokens !== undefined && usage.reasoningTokens > 0 && (
          <div className="flex items-center justify-between gap-4">
            <span className="text-muted-foreground">Reasoning</span>
            <span className="font-mono tabular-nums">
              {formatTokenCount(usage.reasoningTokens)}
            </span>
          </div>
        )}
        <div className="mt-0.5 border-t pt-1.5">
          {estimatedCost !== undefined && (
            <div className="mb-1.5 flex items-center justify-between gap-4">
              <span className="text-muted-foreground">Estimated cost</span>
              <span className="font-mono tabular-nums">
                {formatUsd(estimatedCost)}
              </span>
            </div>
          )}
          <div className="flex items-center justify-between gap-4">
            <span className="text-muted-foreground">Total</span>
            <span className="font-mono tabular-nums">
              {formatTokenCount(totalTokens)} /{" "}
              {formatTokenCount(modelContextWindow)}
            </span>
          </div>
        </div>
      </div>
    </TooltipContent>
  );
}

const RING_SIZE = 24;
const RING_STROKE = 3;
const RING_RADIUS = (RING_SIZE - RING_STROKE) / 2;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

function RingVisual() {
  const { percent } = useContextDisplay();

  return (
    <svg
      aria-hidden="true"
      width={RING_SIZE}
      height={RING_SIZE}
      viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}
      className="-rotate-90"
    >
      <circle
        cx={RING_SIZE / 2}
        cy={RING_SIZE / 2}
        r={RING_RADIUS}
        fill="none"
        strokeWidth={RING_STROKE}
        className="stroke-muted"
      />
      <circle
        cx={RING_SIZE / 2}
        cy={RING_SIZE / 2}
        r={RING_RADIUS}
        fill="none"
        strokeWidth={RING_STROKE}
        strokeLinecap="round"
        strokeDasharray={RING_CIRCUMFERENCE}
        strokeDashoffset={
          RING_CIRCUMFERENCE - (percent / 100) * RING_CIRCUMFERENCE
        }
        className={cn(
          "transition-[stroke-dashoffset,stroke] duration-300",
          getStrokeColor(percent),
        )}
      />
    </svg>
  );
}

const ContextDisplayRing: FC<PresetProps> = ({
  modelContextWindow,
  className,
  side,
  usage,
}) => (
  <ContextDisplayRoot modelContextWindow={modelContextWindow} usage={usage}>
    <ContextDisplayTrigger
      className={cn("p-1", className)}
      aria-label="Context usage"
    >
      <RingVisual />
    </ContextDisplayTrigger>
    <ContextDisplayContent side={side} />
  </ContextDisplayRoot>
);

function BarVisual() {
  const { percent, totalTokens } = useContextDisplay();

  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-300",
            getBarColor(percent),
          )}
          style={{ width: `${percent}%` }}
        />
      </div>
      <span className="text-[10px] text-muted-foreground tabular-nums">
        {formatTokenCount(totalTokens)} ({Math.round(percent)}%)
      </span>
    </div>
  );
}

const ContextDisplayBar: FC<PresetProps> = ({
  modelContextWindow,
  className,
  side,
  usage,
}) => (
  <ContextDisplayRoot modelContextWindow={modelContextWindow} usage={usage}>
    <ContextDisplayTrigger
      className={cn("px-2 py-1", className)}
      aria-label="Context usage"
    >
      <BarVisual />
    </ContextDisplayTrigger>
    <ContextDisplayContent side={side} />
  </ContextDisplayRoot>
);

function TextVisual() {
  const { totalTokens, modelContextWindow } = useContextDisplay();

  return (
    <>
      {formatTokenCount(totalTokens)} / {formatTokenCount(modelContextWindow)}
    </>
  );
}

const ContextDisplayText: FC<PresetProps> = ({
  modelContextWindow,
  className,
  side,
  usage,
}) => (
  <ContextDisplayRoot modelContextWindow={modelContextWindow} usage={usage}>
    <ContextDisplayTrigger
      aria-label="Context usage"
      className={cn(
        "px-2 py-1 font-mono text-muted-foreground text-xs tabular-nums hover:bg-accent hover:text-accent-foreground",
        className,
      )}
    >
      <TextVisual />
    </ContextDisplayTrigger>
    <ContextDisplayContent side={side} />
  </ContextDisplayRoot>
);

const ContextDisplay = {} as {
  Root: typeof ContextDisplayRoot;
  Trigger: typeof ContextDisplayTrigger;
  Content: typeof ContextDisplayContent;
  Ring: typeof ContextDisplayRing;
  Bar: typeof ContextDisplayBar;
  Text: typeof ContextDisplayText;
};

ContextDisplay.Root = ContextDisplayRoot;
ContextDisplay.Trigger = ContextDisplayTrigger;
ContextDisplay.Content = ContextDisplayContent;
ContextDisplay.Ring = ContextDisplayRing;
ContextDisplay.Bar = ContextDisplayBar;
ContextDisplay.Text = ContextDisplayText;

export {
  ContextDisplay,
  ContextDisplayRoot,
  ContextDisplayTrigger,
  ContextDisplayContent,
  ContextDisplayRing,
  ContextDisplayBar,
  ContextDisplayText,
};
