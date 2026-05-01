/**
 * ThreadListSidebar Component - Complete sidebar layout with thread list
 * 
 * Provides a full-featured sidebar for displaying thread list with header and footer.
 * This is the complete solution for most use cases. For custom layouts, use ThreadList.
 * 
 * Features:
 * - Header with assistant-ui branding
 * - Thread list (new, archive, delete)
 * - Footer with GitHub link
 * - Mobile-responsive (collapses on small screens)
 * - Sidebar rail for mobile navigation
 * 
 * @component
 * @example
 * // With SidebarProvider (RECOMMENDED)
 * <SidebarProvider>
 *   <ThreadListSidebar />
 *   <SidebarInset>
 *     <SidebarTrigger />
 *     <Thread />
 *   </SidebarInset>
 * </SidebarProvider>
 * 
 * @see https://www.assistant-ui.com/docs/ui/thread-list
 * @see /docs/ASSISTANT_UI_COMPONENTS.md
 * @see /docs/ASSISTANT_UI_RECIPES.md
 */

import type * as React from "react";
import { GitHubIcon } from "@/components/icons/github";
import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { ThreadList } from "@/components/assistant-ui/thread-list";

/**
 * ThreadListSidebar Component
 * 
 * Complete sidebar layout with thread list.
 * Wraps ThreadList with header (branding) and footer (GitHub link).
 * Mobile-responsive via SidebarProvider integration.
 * 
 * @param props Sidebar component props
 * @returns Rendered sidebar
 */
export function ThreadListSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader className="aui-sidebar-header mb-2 border-b">
        <div className="aui-sidebar-header-content flex items-center justify-between">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <Link
                  href="https://assistant-ui.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="aui-sidebar-header-icon-wrapper flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <img src="/logo.svg" alt="HackClub AI" className="aui-sidebar-header-icon size-5" />
                  </div>
                  <div className="aui-sidebar-header-heading mr-6 flex flex-col gap-0.5 leading-none">
                    <span className="aui-sidebar-header-title font-semibold">
                      HackClub AI
                    </span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </SidebarHeader>
      <SidebarContent className="aui-sidebar-content px-2">
        <ThreadList />
      </SidebarContent>
      <SidebarRail />
      <SidebarFooter className="aui-sidebar-footer border-t">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link
                href="https://github.com/assistant-ui/assistant-ui"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="aui-sidebar-footer-icon-wrapper flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <GitHubIcon className="aui-sidebar-footer-icon size-4" />
                </div>
                <div className="aui-sidebar-footer-heading flex flex-col gap-0.5 leading-none">
                  <span className="aui-sidebar-footer-title font-semibold">
                    GitHub
                  </span>
                  <span>View Source</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
