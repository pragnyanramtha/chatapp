/**
 * Assistant-UI Components Export Index
 * 
 * Central export point for all assistant-ui components.
 * Includes Reasoning, Sources, ThreadList, ToolFallback, and ToolGroup.
 * 
 * @see https://www.assistant-ui.com/docs/ui
 * @see /docs/ASSISTANT_UI_COMPONENTS.md
 */

// ============================================================================
// MESSAGE DISPLAY COMPONENTS
// ============================================================================

export {
  Reasoning,
  ReasoningGroup,
  ReasoningRoot,
  ReasoningTrigger,
  ReasoningContent,
  ReasoningText,
  ReasoningFade,
  reasoningVariants,
  type ReasoningRootProps,
} from "./reasoning";

export {
  Sources,
  Source,
  SourceIcon,
  SourceTitle,
  type SourceProps,
  type SourceIconProps,
  type SourceTitleProps,
} from "./sources";

export {
  ToolFallback,
  ToolFallbackRoot,
  ToolFallbackTrigger,
  ToolFallbackContent,
  ToolFallbackArgs,
  ToolFallbackResult,
  ToolFallbackError,
  type ToolFallbackRootProps,
} from "./tool-fallback";

export {
  ToolGroup,
  type ToolGroupProps,
  type ToolGroupRootProps,
  type ToolGroupTriggerProps,
  type ToolGroupContentProps,
} from "./tool-group";

// ============================================================================
// THREAD LIST COMPONENTS
// ============================================================================

export { ThreadList } from "./thread-list";

export { ThreadListSidebar } from "./threadlist-sidebar";

// ============================================================================
// MAIN THREAD COMPONENT
// ============================================================================

export { Thread } from "./thread";
