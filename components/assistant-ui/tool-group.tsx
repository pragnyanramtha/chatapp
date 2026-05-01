
"use client";

import { memo, useCallback, useRef, useState, type ComponentProps, type ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { ChevronDownIcon } from "lucide-react";
import {
  useScrollLock,
} from "@assistant-ui/react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

const ANIMATION_DURATION = 200;

// ============================================================================
// VARIANTS & TYPES
// ============================================================================

/**
 * CVA variants for tool group styling
 * 
 * Variants:
 * - outline: Rounded border (default)
 * - ghost: No additional styling
 * - muted: Muted background with border
 */
const toolGroupVariants = cva(
  "aui-tool-group-root w-full",
  {
    variants: {
      variant: {
        outline: "rounded-lg border",
        ghost: "",
        muted: "rounded-lg bg-muted/50",
      },
    },
    defaultVariants: {
      variant: "outline",
    },
  },
);

export type ToolGroupVariants = VariantProps<typeof toolGroupVariants>;

// ============================================================================
// TOOL GROUP ROOT
// ============================================================================

/** Props for ToolGroupRoot component */
export type ToolGroupRootProps = Omit<
  ComponentProps<typeof Collapsible>,
  "open" | "onOpenChange"
> &
  ToolGroupVariants & {
    /** Controlled open state */
    open?: boolean;
    /** Callback when open state changes */
    onOpenChange?: (open: boolean) => void;
    /** Initial open state for uncontrolled usage */
    defaultOpen?: boolean;
  };

/**
 * ToolGroupRoot Component
 * 
 * Collapsible container for grouped tool calls.
 * Manages scroll lock when collapsing to prevent layout shift.
 * 
 * @param props ToolGroupRoot props
 * @returns Rendered collapsible container
 */
function ToolGroupRoot({
  className,
  variant,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  defaultOpen = false,
  children,
  ...props
}: ToolGroupRootProps) {
  const collapsibleRef = useRef<HTMLDivElement>(null);
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const lockScroll = useScrollLock(collapsibleRef, ANIMATION_DURATION);

  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : uncontrolledOpen;

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        lockScroll();
      }
      if (!isControlled) {
        setUncontrolledOpen(open);
      }
      controlledOnOpenChange?.(open);
    },
    [lockScroll, isControlled, controlledOnOpenChange],
  );

  return (
    <Collapsible
      ref={collapsibleRef}
      data-slot="tool-group-root"
      data-variant={variant}
      open={isOpen}
      onOpenChange={handleOpenChange}
      className={cn(
        "group/tool-group-root",
        toolGroupVariants({ variant, className }),
      )}
      style={
        {
          "--animation-duration": `${ANIMATION_DURATION}ms`,
        } as React.CSSProperties
      }
      {...props}
    >
      {children}
    </Collapsible>
  );
}

// ============================================================================
// TOOL GROUP TRIGGER
// ============================================================================

/** Props for ToolGroupTrigger component */
export type ToolGroupTriggerProps = ComponentProps<typeof CollapsibleTrigger> & {
  /** Number of tool calls in group (required) */
  count: number;
  /** Show loading animation/shimmer when true */
  active?: boolean;
};

/**
 * ToolGroupTrigger Component
 * 
 * Header button showing tool count with optional shimmer animation.
 * Shows loading spinner when `active={true}` during streaming.
 * 
 * @param props ToolGroupTrigger props
 * @returns Rendered trigger button
 */
function ToolGroupTrigger({
  count,
  active = false,
  className,
  ...props
}: ToolGroupTriggerProps) {
  return (
    <CollapsibleTrigger
      data-slot="tool-group-trigger"
      className={cn(
        "aui-tool-group-trigger group/trigger flex w-full items-center gap-2 px-4 py-3 text-sm font-medium transition-colors hover:bg-muted/50",
        className,
      )}
      {...props}
    >
      <span
        data-slot="tool-group-trigger-label"
        className="relative inline-block grow text-left leading-none"
      >
        <span className="flex items-center gap-2">
          {active && (
            <span className="inline-block size-2 rounded-full bg-primary animate-pulse" />
          )}
          <span>{count} tool{count !== 1 ? "s" : ""}</span>
        </span>
        {active && (
          <span
            aria-hidden
            data-slot="tool-group-trigger-shimmer"
            className="aui-tool-group-trigger-shimmer shimmer pointer-events-none absolute inset-0 motion-reduce:hidden"
          >
            <span className="flex items-center gap-2">
              <span className="inline-block size-2 rounded-full bg-primary animate-pulse" />
              <span>{count} tool{count !== 1 ? "s" : ""}</span>
            </span>
          </span>
        )}
      </span>
      <ChevronDownIcon
        data-slot="tool-group-trigger-chevron"
        className={cn(
          "aui-tool-group-trigger-chevron size-4 shrink-0 transition-transform",
          "group-data-[state=open]/collapsible-root:rotate-180",
        )}
      />
    </CollapsibleTrigger>
  );
}

// ============================================================================
// TOOL GROUP CONTENT
// ============================================================================

/** Props for ToolGroupContent component */
export type ToolGroupContentProps = ComponentProps<typeof CollapsibleContent>;

/**
 * ToolGroupContent Component
 * 
 * Animated collapsible content wrapper for tool UI components.
 * 
 * @param props ToolGroupContent props
 * @returns Rendered content wrapper
 */
function ToolGroupContent({
  className,
  children,
  ...props
}: ToolGroupContentProps) {
  return (
    <CollapsibleContent
      data-slot="tool-group-content"
      className={cn(
        "aui-tool-group-content flex flex-col gap-2 overflow-hidden px-4 pb-3",
        "data-[state=open]:animate-in data-[state=open]:fade-in-0",
        "data-[state=open]:slide-in-from-top-2",
        "data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
        "data-[state=closed]:slide-out-to-top-2",
        "duration-300",
        className,
      )}
      style={
        {
          "--animation-duration": `${ANIMATION_DURATION}ms`,
        } as React.CSSProperties
      }
      {...props}
    >
      {children}
    </CollapsibleContent>
  );
}

// ============================================================================
// MAIN TOOL GROUP COMPONENT
// ============================================================================

/** Props for ToolGroup component (message part component) */
export type ToolGroupProps = {
  /** Index of first tool call in group */
  startIndex: number;
  /** Index of last tool call in group */
  endIndex: number;
  /** Rendered tool call components */
  children: ReactNode;
};

/**
 * ToolGroup Message Part Component
 * 
 * Used by MessagePrimitive.Parts to auto-group consecutive tool calls.
 * Combines ToolGroupRoot, ToolGroupTrigger, and ToolGroupContent.
 * 
 * @param props ToolGroup props (from message part grouping)
 * @returns Rendered tool group
 */
import { type FC } from "react";
const ToolGroupComponent: FC<{ startIndex?: number; endIndex?: number; children?: ReactNode }> = memo(
  ({ startIndex, endIndex, children }) => {
    // Count children to determine label
    const childCount = typeof children === "string" ? 1 : (Array.isArray(children) ? children.length : 1);

    return (
      <ToolGroupRoot variant="outline" defaultOpen>
        <ToolGroupTrigger count={childCount} />
        <ToolGroupContent>{children}</ToolGroupContent>
      </ToolGroupRoot>
    );
  },
);

ToolGroupComponent.displayName = "ToolGroup";

// ============================================================================
// EXPORTS
// ============================================================================

/**
 * ToolGroup Compound Component
 * 
 * Sub-components for building custom tool group layouts.
 * 
 * @example
 * <ToolGroup.Root variant="muted">
 *   <ToolGroup.Trigger count={3} active={isStreaming} />
 *   <ToolGroup.Content>
 *     ... tools
 *   </ToolGroup.Content>
 * </ToolGroup.Root>
 */
export const ToolGroup = Object.assign(ToolGroupComponent, {
  Root: ToolGroupRoot,
  Trigger: ToolGroupTrigger,
  Content: ToolGroupContent,
});

export default ToolGroup;
