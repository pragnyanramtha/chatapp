/**
 * Assistant-UI Components - TypeScript Types & Implementation Patterns
 * 
 * This file documents the key interfaces, props, and patterns for:
 * - Reasoning & ReasoningGroup
 * - Sources
 * - ThreadList & ThreadListSidebar
 * - ToolFallback
 * - ToolGroup
 */

// ============================================================================
// REASONING COMPONENT TYPES
// ============================================================================

export interface ReasoningProps {
  /** Content of the reasoning part (markdown supported) */
  children: React.ReactNode;
  /** Visual variant: "outline" | "ghost" | "muted" */
  variant?: "outline" | "ghost" | "muted";
  /** CSS class names */
  className?: string;
}

export interface ReasoningGroupProps {
  /** Rendered reasoning components */
  children: React.ReactNode;
  /** Index of first reasoning part in group */
  startIndex: number;
  /** Index of last reasoning part in group */
  endIndex: number;
}

export interface ReasoningRootProps {
  /** Content to render inside */
  children: React.ReactNode;
  /** Visual variant */
  variant?: "outline" | "ghost" | "muted";
  /** Initial open state */
  defaultOpen?: boolean;
  /** Controlled open state */
  open?: boolean;
  /** Called when open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Merge props with child element */
  asChild?: boolean;
}

export interface ReasoningTriggerProps {
  /** Show loading animation */
  active?: boolean;
  /** Merge props with child element */
  asChild?: boolean;
}

export interface ReasoningContentProps {
  /** Content inside collapsible */
  children: React.ReactNode;
  /** Merge props with child element */
  asChild?: boolean;
}

export interface ReasoningTextProps {
  /** Text content (wrap with MarkdownText for markdown support) */
  children: React.ReactNode;
  /** Merge props with child element */
  asChild?: boolean;
}

export interface ReasoningFadeProps {
  /** CSS class names */
  className?: string;
  /** Merge props with child element */
  asChild?: boolean;
}

/**
 * REASONING USAGE PATTERNS
 * 
 * Pattern 1: Default with ReasoningGroup (RECOMMENDED)
 * ```tsx
 * <MessagePrimitive.Parts
 *   components={{
 *     Reasoning,
 *     ReasoningGroup,
 *   }}
 * />
 * ```
 * 
 * Pattern 2: Only Reasoning (manual grouping)
 * ```tsx
 * <MessagePrimitive.Parts
 *   components={{
 *     Reasoning,
 *   }}
 * />
 * ```
 * 
 * Pattern 3: Custom layout
 * ```tsx
 * <ReasoningGroup startIndex={0} endIndex={2}>
 *   <Reasoning.Root variant="muted">
 *     <Reasoning.Trigger active={isStreaming} />
 *     <Reasoning.Content>
 *       <Reasoning.Text>
 *         <MarkdownText>{content}</MarkdownText>
 *       </Reasoning.Text>
 *     </Reasoning.Content>
 *   </Reasoning.Root>
 * </ReasoningGroup>
 * ```
 */

// ============================================================================
// SOURCES COMPONENT TYPES
// ============================================================================

export interface SourcesProps {
  /** URL of the source */
  url: string;
  /** Display title (defaults to domain) */
  title?: string;
  /** Type of source (must be "url" to render) */
  sourceType: string;
  /** Visual variant */
  variant?: "outline" | "ghost" | "muted" | "secondary" | "info" | "warning" | "success" | "destructive";
  /** Size of badge */
  size?: "sm" | "default" | "lg";
  /** Link target attribute */
  target?: string;
  /** Link rel attribute */
  rel?: string;
  /** CSS class names */
  className?: string;
}

export interface SourceProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  /** URL the link points to */
  href: string;
  /** Visual variant */
  variant?: "outline" | "ghost" | "muted" | "secondary" | "info" | "warning" | "success" | "destructive";
  /** Size of badge */
  size?: "sm" | "default" | "lg";
  /** Merge props with child element */
  asChild?: boolean;
}

export interface SourceIconProps {
  /** URL used to derive favicon */
  url: string;
  /** CSS class names */
  className?: string;
}

export interface SourceTitleProps {
  /** Title content */
  children: React.ReactNode;
  /** CSS class names (default max-width: 37.5rem) */
  className?: string;
}

/**
 * SOURCES USAGE PATTERNS
 * 
 * Pattern 1: Simple (message part component)
 * ```tsx
 * <MessagePrimitive.Parts
 *   components={{
 *     source: Sources,
 *   }}
 * />
 * ```
 * 
 * Pattern 2: Compound components
 * ```tsx
 * <Sources.Root href="https://example.com">
 *   <Sources.Icon url="https://example.com" />
 *   <Sources.Title>Example Domain</Sources.Title>
 * </Sources.Root>
 * ```
 * 
 * Pattern 3: Custom styling
 * ```tsx
 * <Source href="https://example.com" variant="info" size="lg">
 *   <SourceIcon url="https://example.com" className="size-5" />
 *   <SourceTitle className="font-semibold">Custom Title</SourceTitle>
 * </Source>
 * ```
 * 
 * VARIANT STYLES:
 * - "outline" (default) - Border with transparent background
 * - "ghost" - No background or border
 * - "muted" - Solid muted background with border
 * - "secondary" - Secondary background color
 * - "info" - Blue background
 * - "warning" - Amber background
 * - "success" - Emerald background
 * - "destructive" - Red background
 */

// ============================================================================
// THREADLIST COMPONENT TYPES
// ============================================================================

export interface ThreadListPrimitiveRootProps {
  /** Merge props with child element */
  asChild?: boolean;
  /** CSS class names */
  className?: string;
}

export interface ThreadListPrimitiveNewProps {
  /** Merge props with child element */
  asChild?: boolean;
}

export interface ThreadListPrimitiveItemsProps {
  /** Render archived threads instead of active */
  archived?: boolean;
  /** Component mapping for custom rendering */
  components: {
    ThreadListItem: React.ComponentType<any>;
  };
}

export interface ThreadListItemPrimitiveRootProps {
  /** Merge props with child element */
  asChild?: boolean;
}

export interface ThreadListItemPrimitiveTriggerProps {
  /** Merge props with child element */
  asChild?: boolean;
}

export interface ThreadListItemPrimitiveTitleProps {
  /** Fallback content when thread has no title */
  fallback?: React.ReactNode;
}

export interface ThreadListItemPrimitiveArchiveProps {
  /** Merge props with child element */
  asChild?: boolean;
}

export interface ThreadListItemPrimitiveUnarchiveProps {
  /** Merge props with child element */
  asChild?: boolean;
}

export interface ThreadListItemPrimitiveDeleteProps {
  /** Merge props with child element */
  asChild?: boolean;
}

/**
 * THREADLIST USAGE PATTERNS
 * 
 * Pattern 1: With Sidebar (RECOMMENDED)
 * ```tsx
 * import { ThreadListSidebar } from "@/components/assistant-ui/threadlist-sidebar";
 * import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
 * 
 * export default function Assistant() {
 *   return (
 *     <SidebarProvider>
 *       <div className="flex h-dvh w-full">
 *         <ThreadListSidebar />
 *         <SidebarInset>
 *           <SidebarTrigger className="absolute top-4 left-4" />
 *           <Thread />
 *         </SidebarInset>
 *       </div>
 *     </SidebarProvider>
 *   );
 * }
 * ```
 * 
 * Pattern 2: Custom layout
 * ```tsx
 * import { ThreadList } from "@/components/assistant-ui/thread-list";
 * 
 * export default function Assistant() {
 *   return (
 *     <div className="grid h-full grid-cols-[200px_1fr]">
 *       <ThreadList />
 *       <Thread />
 *     </div>
 *   );
 * }
 * ```
 * 
 * Pattern 3: Custom composable API
 * ```tsx
 * <ThreadListPrimitive.Root>
 *   <ThreadListPrimitive.New />
 *   <ThreadListPrimitive.Items
 *     components={{
 *       ThreadListItem: ({ thread }) => (
 *         <ThreadListItemPrimitive.Root>
 *           <ThreadListItemPrimitive.Trigger>
 *             <ThreadListItemPrimitive.Title fallback="New Thread" />
 *           </ThreadListItemPrimitive.Trigger>
 *           <ThreadListItemMorePrimitive.Root>
 *             <ThreadListItemMorePrimitive.Trigger />
 *             <ThreadListItemMorePrimitive.Content>
 *               <ThreadListItemPrimitive.Archive />
 *               <ThreadListItemPrimitive.Delete />
 *             </ThreadListItemMorePrimitive.Content>
 *           </ThreadListItemMorePrimitive.Root>
 *         </ThreadListItemPrimitive.Root>
 *       ),
 *     }}
 *   />
 * </ThreadListPrimitive.Root>
 * ```
 */

// ============================================================================
// TOOLFALLBACK COMPONENT TYPES
// ============================================================================

export interface ToolFallbackProps {
  /** Name of the tool */
  toolName: string;
  /** Tool call status: "running" | "complete" | "error" | "cancelled" */
  status: "running" | "complete" | "error" | "cancelled";
  /** Tool arguments as text */
  args?: Record<string, any>;
  /** Tool execution result */
  result?: any;
  /** Error message if status is "error" */
  error?: string;
}

export interface ToolFallbackRootProps {
  /** Merge props with child element */
  asChild?: boolean;
  /** CSS class names */
  className?: string;
}

export interface ToolFallbackTriggerProps {
  /** Name of the tool */
  toolName: string;
  /** Current status: "running" | "complete" | "error" | "cancelled" */
  status: string;
}

export interface ToolFallbackContentProps {
  /** Content inside collapsible */
  children: React.ReactNode;
  /** Merge props with child element */
  asChild?: boolean;
}

export interface ToolFallbackArgsProps {
  /** Tool arguments as formatted text */
  argsText: string;
}

export interface ToolFallbackResultProps {
  /** Tool result (will be JSON formatted) */
  result: any;
}

export interface ToolFallbackErrorProps {
  /** Current status */
  status: "error" | "cancelled";
  /** Error/cancellation message */
  message?: string;
}

/**
 * TOOLFALLBACK USAGE PATTERNS
 * 
 * Pattern 1: As message part component (RECOMMENDED)
 * ```tsx
 * <MessagePrimitive.Parts
 *   components={{
 *     tools: { Fallback: ToolFallback },
 *   }}
 * />
 * ```
 * 
 * Pattern 2: Custom layout with composable API
 * ```tsx
 * <ToolFallback.Root>
 *   <ToolFallback.Trigger toolName="get_weather" status="running" />
 *   <ToolFallback.Content>
 *     <ToolFallback.Error status="error" message="API rate limited" />
 *     <ToolFallback.Args argsText="location: New York" />
 *     <ToolFallback.Result result={weatherData} />
 *   </ToolFallback.Content>
 * </ToolFallback.Root>
 * ```
 * 
 * STATES:
 * - "running": Loading spinner, shows args being sent
 * - "complete": Shows args and result
 * - "error": Shows error message
 * - "cancelled": Muted appearance
 */

// ============================================================================
// TOOLGROUP COMPONENT TYPES
// ============================================================================

export interface ToolGroupProps {
  /** Index of first tool call in group */
  startIndex: number;
  /** Index of last tool call in group */
  endIndex: number;
  /** Rendered tool components */
  children: React.ReactNode;
}

export interface ToolGroupRootProps {
  /** Visual variant: "outline" | "ghost" | "muted" */
  variant?: "outline" | "ghost" | "muted";
  /** Controlled open state */
  open?: boolean;
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Initial open state */
  defaultOpen?: boolean;
  /** Merge props with child element */
  asChild?: boolean;
  /** CSS class names */
  className?: string;
}

export interface ToolGroupTriggerProps {
  /** Number of tool calls in group */
  count: number;
  /** Show loading animation */
  active?: boolean;
  /** Merge props with child element */
  asChild?: boolean;
}

export interface ToolGroupContentProps {
  /** Tool UI components to render */
  children: React.ReactNode;
  /** Merge props with child element */
  asChild?: boolean;
}

/**
 * TOOLGROUP USAGE PATTERNS
 * 
 * Pattern 1: As message part component (RECOMMENDED)
 * ```tsx
 * <MessagePrimitive.Parts
 *   components={{
 *     tools: { Group: ToolGroup },
 *   }}
 * />
 * ```
 * 
 * Pattern 2: With ToolFallback for ungrouped tools
 * ```tsx
 * <MessagePrimitive.Parts
 *   components={{
 *     tools: {
 *       Group: ToolGroup,
 *       Fallback: ToolFallback,
 *     },
 *   }}
 * />
 * ```
 * 
 * Pattern 3: Custom layout
 * ```tsx
 * <ToolGroup.Root variant="muted" defaultOpen>
 *   <ToolGroup.Trigger count={3} active={false} />
 *   <ToolGroup.Content>
 *     <WeatherToolUI location="New York" />
 *     <WeatherToolUI location="London" />
 *     <SearchToolUI query="restaurants" />
 *   </ToolGroup.Content>
 * </ToolGroup.Root>
 * ```
 * 
 * Pattern 4: With mixed custom & fallback UIs
 * ```tsx
 * <ToolGroup.Root variant="outline">
 *   <ToolGroup.Trigger count={2} />
 *   <ToolGroup.Content>
 *     <WeatherToolUI location="NYC" tempF={72} />
 *     <ToolFallback toolName="search" status="complete" result={{}} />
 *   </ToolGroup.Content>
 * </ToolGroup.Root>
 * ```
 * 
 * VARIANTS:
 * - "outline" (default) - Rounded border
 * - "ghost" - No additional styling
 * - "muted" - Muted background with border
 */

// ============================================================================
// COMPLETE MESSAGE COMPONENT SETUP
// ============================================================================

/**
 * COMPLETE EXAMPLE: All components integrated
 * 
 * ```tsx
 * import { MessagePrimitive } from "@assistant-ui/react";
 * import { MarkdownText } from "@/components/assistant-ui/markdown-text";
 * import { ToolFallback } from "@/components/assistant-ui/tool-fallback";
 * import { ToolGroup } from "@/components/assistant-ui/tool-group";
 * import { Reasoning, ReasoningGroup } from "@/components/assistant-ui/reasoning";
 * import { Sources } from "@/components/assistant-ui/sources";
 * 
 * const AssistantMessage: FC = () => {
 *   return (
 *     <MessagePrimitive.Root className="group/message relative">
 *       <div className="flex flex-col gap-4">
 *         <MessagePrimitive.Parts
 *           components={{
 *             Text: MarkdownText,
 *             Reasoning,
 *             ReasoningGroup,
 *             tools: {
 *               Fallback: ToolFallback,
 *               Group: ToolGroup,
 *             },
 *             source: Sources,
 *           }}
 *         />
 *       </div>
 *       <AssistantActionBar />
 *     </MessagePrimitive.Root>
 *   );
 * };
 * ```
 */

// ============================================================================
// STATE MANAGEMENT HELPERS
// ============================================================================

/**
 * Check if reasoning is streaming
 * 
 * ```tsx
 * import { useAuiState } from "@assistant-ui/react";
 * 
 * const ReasoningGroupImpl = ({ startIndex, endIndex, children }) => {
 *   const isReasoningStreaming = useAuiState((s) => {
 *     if (s.message.status?.type !== "running") return false;
 *     const lastIndex = s.message.parts.length - 1;
 *     if (lastIndex < 0) return false;
 *     const lastType = s.message.parts[lastIndex]?.type;
 *     if (lastType !== "reasoning") return false;
 *     return lastIndex >= startIndex && lastIndex <= endIndex;
 *   });
 *   
 *   return (
 *     <ReasoningRoot defaultOpen={isReasoningStreaming}>
 *       <ReasoningTrigger active={isReasoningStreaming} />
 *       <ReasoningContent>
 *         <ReasoningText>{children}</ReasoningText>
 *       </ReasoningContent>
 *     </ReasoningRoot>
 *   );
 * };
 * ```
 */
