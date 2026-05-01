/**
 * ThreadList Component - Display list of threads for conversation switching
 * 
 * Shows list of active threads with ability to create new, archive, and delete.
 * This is the custom layout version. For a complete sidebar, use ThreadListSidebar.
 * 
 * Features:
 * - New thread creation button
 * - Thread list with loading skeleton
 * - Archive action
 * - Visual indication of current active thread
 * - Hover menu for additional actions
 * 
 * @component
 * @example
 * // Custom grid layout
 * <div className="grid grid-cols-[200px_1fr]">
 *   <ThreadList />
 *   <Thread />
 * </div>
 * 
 * @example
 * // Or use ThreadListSidebar for complete sidebar
 * <SidebarProvider>
 *   <ThreadListSidebar />
 *   <SidebarInset><Thread /></SidebarInset>
 * </SidebarProvider>
 * 
 * @see https://www.assistant-ui.com/docs/ui/thread-list
 * @see /docs/ASSISTANT_UI_COMPONENTS.md
 * @see /docs/ASSISTANT_UI_RECIPES.md
 */

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AuiIf,
  ThreadListItemMorePrimitive,
  ThreadListItemPrimitive,
  ThreadListPrimitive,
} from "@assistant-ui/react";
import { ArchiveIcon, MoreHorizontalIcon, PlusIcon } from "lucide-react";
import type { FC } from "react";

/**
 * ThreadList Component
 * 
 * Main thread list container with new button, loading state, and thread items.
 * 
 * @returns Rendered thread list
 */
export const ThreadList: FC = () => {
  return (
    <ThreadListPrimitive.Root className="aui-root aui-thread-list-root flex flex-col gap-1">
      <ThreadListNew />
      <AuiIf condition={({ threads }) => threads.isLoading}>
        <ThreadListSkeleton />
      </AuiIf>
      <AuiIf condition={({ threads }) => !threads.isLoading}>
        <ThreadListPrimitive.Items>
          {() => <ThreadListItem />}
        </ThreadListPrimitive.Items>
      </AuiIf>
    </ThreadListPrimitive.Root>
  );
};

/**
 * ThreadListNew Component
 * 
 * Button to create a new thread.
 * Uses ThreadListPrimitive.New for automatic routing.
 * 
 * @returns Rendered new thread button
 */
const ThreadListNew: FC = () => {
  return (
    <ThreadListPrimitive.New asChild>
      <Button
        variant="outline"
        className="aui-thread-list-new h-9 justify-start gap-2 rounded-lg px-3 text-sm hover:bg-muted data-active:bg-muted"
      >
        <PlusIcon className="size-4" />
        New Thread
      </Button>
    </ThreadListPrimitive.New>
  );
};

/**
 * ThreadListSkeleton Component
 * 
 * Loading skeleton shown while threads are being fetched.
 * Displays 5 placeholder items to match typical list size.
 * 
 * @returns Rendered skeleton placeholders
 */
const ThreadListSkeleton: FC = () => {
  return (
    <div className="flex flex-col gap-1">
      {Array.from({ length: 5 }, (_, i) => (
        <div
          key={i}
          role="status"
          aria-label="Loading threads"
          className="aui-thread-list-skeleton-wrapper flex h-9 items-center px-3"
        >
          <Skeleton className="aui-thread-list-skeleton h-4 w-full" />
        </div>
      ))}
    </div>
  );
};

/**
 * ThreadListItem Component
 * 
 * Individual thread list item with trigger and more menu.
 * Shows thread title and archive action.
 * Highlights active thread with background.
 * 
 * @returns Rendered thread item
 */
const ThreadListItem: FC = () => {
  return (
    <ThreadListItemPrimitive.Root className="aui-thread-list-item group flex h-9 items-center gap-2 rounded-lg transition-colors hover:bg-muted focus-visible:bg-muted focus-visible:outline-none data-active:bg-muted">
      <ThreadListItemPrimitive.Trigger className="aui-thread-list-item-trigger flex h-full min-w-0 flex-1 items-center truncate px-3 text-start text-sm">
        <ThreadListItemPrimitive.Title fallback="New Chat" />
      </ThreadListItemPrimitive.Trigger>
      <ThreadListItemMore />
    </ThreadListItemPrimitive.Root>
  );
};

/**
 * ThreadListItemMore Component
 * 
 * Dropdown menu for additional thread actions.
 * Shows on hover or when focused.
 * Contains archive action.
 * 
 * @returns Rendered more menu
 */
const ThreadListItemMore: FC = () => {
  return (
    <ThreadListItemMorePrimitive.Root>
      <ThreadListItemMorePrimitive.Trigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="aui-thread-list-item-more mr-2 size-7 p-0 opacity-0 transition-opacity group-hover:opacity-100 data-[state=open]:bg-accent data-[state=open]:opacity-100 group-data-active:opacity-100"
        >
          <MoreHorizontalIcon className="size-4" />
          <span className="sr-only">More options</span>
        </Button>
      </ThreadListItemMorePrimitive.Trigger>
      <ThreadListItemMorePrimitive.Content
        side="bottom"
        align="start"
        className="aui-thread-list-item-more-content z-50 min-w-32 overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md"
      >
        <ThreadListItemPrimitive.Archive asChild>
          <ThreadListItemMorePrimitive.Item className="aui-thread-list-item-more-item flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
            <ArchiveIcon className="size-4" />
            Archive
          </ThreadListItemMorePrimitive.Item>
        </ThreadListItemPrimitive.Archive>
      </ThreadListItemMorePrimitive.Content>
    </ThreadListItemMorePrimitive.Root>
  );
};
