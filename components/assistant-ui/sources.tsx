/**
 * Sources Component - Display URL references with favicon and title
 * 
 * Renders URL sources with automatic favicon loading and fallback to domain initial.
 * Supports multiple visual variants and sizes.
 * 
 * @component
 * @example
 * // Simple usage as message part component
 * <MessagePrimitive.Parts
 *   components={{
 *     source: Sources,
 *   }}
 * />
 * 
 * @example
 * // Compound component for custom layouts
 * <Sources.Root href="https://example.com">
 *   <Sources.Icon url="https://example.com" />
 *   <Sources.Title>Example Domain</Sources.Title>
 * </Sources.Root>
 * 
 * @see https://www.assistant-ui.com/docs/ui/sources
 */

"use client";

import { ComponentProps, FC, ImgHTMLAttributes, memo } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { ExternalLinkIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================================================
// VARIANTS
// ============================================================================

/**
 * CVA variants for source badge styling
 * 
 * Variants:
 * - outline: Border with transparent background (default)
 * - ghost: No background or border
 * - muted: Solid muted background with border
 * - secondary: Secondary theme background
 * - info: Blue information style
 * - warning: Amber warning style
 * - success: Emerald success style
 * - destructive: Red destructive style
 */
const sourceVariants = cva(
  "aui-source inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors cursor-pointer hover:opacity-80",
  {
    variants: {
      variant: {
        outline:
          "border bg-transparent text-foreground border-border hover:bg-muted/50",
        ghost: "text-foreground hover:bg-muted/30",
        muted:
          "bg-muted text-muted-foreground border border-border hover:bg-muted/80",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        info: "bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100 hover:bg-blue-200 dark:hover:bg-blue-800",
        warning:
          "bg-amber-100 text-amber-900 dark:bg-amber-900 dark:text-amber-100 hover:bg-amber-200 dark:hover:bg-amber-800",
        success:
          "bg-emerald-100 text-emerald-900 dark:bg-emerald-900 dark:text-emerald-100 hover:bg-emerald-200 dark:hover:bg-emerald-800",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/80",
      },
      size: {
        sm: "text-xs px-2 py-1",
        default: "text-sm px-3 py-1.5",
        lg: "text-base px-4 py-2",
      },
    },
    defaultVariants: {
      variant: "outline",
      size: "default",
    },
  },
);

export type SourceVariants = VariantProps<typeof sourceVariants>;

// ============================================================================
// SOURCE ROOT COMPONENT
// ============================================================================

/** Props for Source root component */
export interface SourceProps
  extends Omit<ComponentProps<"a">, "href">,
    SourceVariants {
  /** URL the link points to (required) */
  href: string;
  /** Merge props with child element via Radix Slot */
  asChild?: boolean;
}

/**
 * Source Root Component
 * 
 * Renders as an anchor element with badge styling.
 * Opens URL in new tab by default (target="_blank", rel="noopener noreferrer").
 * 
 * @param props Source component props
 * @returns Rendered source badge link
 */
export const Source: FC<SourceProps> = memo(
  ({
    href,
    variant,
    size,
    target = "_blank",
    rel = "noopener noreferrer",
    className,
    children,
    ...props
  }) => {
    return (
      <a
        data-slot="source-root"
        href={href}
        target={target}
        rel={rel}
        className={cn(sourceVariants({ variant, size }), className)}
        {...props}
      >
        {children}
      </a>
    );
  },
);

Source.displayName = "Source";

// ============================================================================
// SOURCE ICON COMPONENT
// ============================================================================

/** Props for SourceIcon component */
export interface SourceIconProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "alt"> {
  /** URL used to derive favicon and fallback initial */
  url: string;
}

/**
 * SourceIcon Component
 * 
 * Displays favicon from the given URL.
 * Falls back to domain initial in a muted box if favicon fails to load.
 * 
 * @param props SourceIcon component props
 * @returns Rendered favicon or fallback initial
 * 
 * @example
 * <SourceIcon url="https://example.com" className="size-5" />
 */
export const SourceIcon: FC<SourceIconProps> = memo(
  ({ url, className, onError, ...props }) => {
    const domain = new URL(url).hostname;
    const initial = domain?.charAt(0).toUpperCase() ?? "?";

    return (
      <div className={cn("relative flex-shrink-0", className)}>
        <img
          data-slot="source-icon"
          src={`https://www.google.com/s2/favicons?sz=64&domain=${domain}`}
          alt=""
          className={cn("size-full rounded object-cover", className)}
          onError={(e) => {
            // Hide favicon on error, show fallback
            (e.target as HTMLImageElement).style.display = "none";
            onError?.(e);
          }}
          {...props}
        />
        <div
          data-slot="source-icon-fallback"
          className="absolute inset-0 flex items-center justify-center rounded bg-muted text-xs font-semibold text-muted-foreground hidden group-[img[style*='display: none']]:flex"
        >
          {initial}
        </div>
      </div>
    );
  },
);

SourceIcon.displayName = "SourceIcon";

// ============================================================================
// SOURCE TITLE COMPONENT
// ============================================================================

/** Props for SourceTitle component */
export interface SourceTitleProps extends ComponentProps<"span"> {}

/**
 * SourceTitle Component
 * 
 * Renders truncated title text for the source.
 * Default max-width is 37.5rem (can be overridden with className).
 * 
 * @param props SourceTitle component props
 * @returns Rendered title text
 * 
 * @example
 * <SourceTitle className="font-semibold">Example Domain</SourceTitle>
 */
export const SourceTitle: FC<SourceTitleProps> = memo(
  ({ className, children, ...props }) => {
    return (
      <span
        data-slot="source-title"
        className={cn(
          "truncate max-w-96",
          className,
        )}
        {...props}
      >
        {children}
      </span>
    );
  },
);

SourceTitle.displayName = "SourceTitle";

// ============================================================================
// COMPOUND COMPONENT EXPORTS
// ============================================================================

/**
 * Sources Compound Component
 * 
 * Sub-components for building custom source layouts.
 * 
 * @example
 * <Sources.Root href="https://example.com">
 *   <Sources.Icon url="https://example.com" />
 *   <Sources.Title>Example</Sources.Title>
 * </Sources.Root>
 */
export const Sources = Object.assign(Source, {
  Root: Source,
  Icon: SourceIcon,
  Title: SourceTitle,
});

// ============================================================================
// MESSAGE PART COMPONENT
// ============================================================================

/**
 * Sources Message Part Component
 * 
 * Default export for use with MessagePrimitive.Parts.
 * Renders when sourceType === "url".
 * 
 * @example
 * <MessagePrimitive.Parts
 *   components={{
 *     source: Sources,
 *   }}
 * />
 */
export type SourcesMessagePartProps = {
  url: string;
  title?: string;
  sourceType: string;
};

/**
 * Render a single source message part
 * 
 * Only renders if sourceType === "url".
 * Falls back to domain if title is not provided.
 */
const SourcesMessagePart: FC<SourcesMessagePartProps> = ({ url, title, sourceType }) => {
  if (sourceType !== "url") return null;

  const domain = title || new URL(url).hostname;

  return (
    <Sources href={url} size="default">
      <SourceIcon url={url} className="size-4" />
      <SourceTitle>{domain}</SourceTitle>
      <ExternalLinkIcon className="ml-1 size-3 opacity-60" />
    </Sources>
  );
};

SourcesMessagePart.displayName = "SourcesMessagePart";

// Export as default for message parts
Sources.displayName = "Sources";

export default SourcesMessagePart;
