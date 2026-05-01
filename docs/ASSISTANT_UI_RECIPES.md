# Assistant-UI Implementation Recipes & Troubleshooting

Complete implementation examples and solutions for common issues with Reasoning, Sources, ThreadList, ToolFallback, and ToolGroup.

## 📋 Implementation Recipes

### Recipe 1: Complete Chat Thread Component

```tsx
// /components/assistant-ui/thread.tsx
import { FC } from "react";
import { MessagePrimitive } from "@assistant-ui/react";
import { MarkdownText } from "@/components/assistant-ui/markdown-text";
import { ToolFallback } from "@/components/assistant-ui/tool-fallback";
import { ToolGroup } from "@/components/assistant-ui/tool-group";
import { Reasoning, ReasoningGroup } from "@/components/assistant-ui/reasoning";
import { Sources } from "@/components/assistant-ui/sources";
import { AssistantActionBar } from "@/components/assistant-ui/assistant-action-bar";
import { BranchPicker } from "@/components/assistant-ui/branch-picker";

const AssistantMessage: FC = () => {
  return (
    <MessagePrimitive.Root className="group/message relative flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <MessagePrimitive.Parts
          components={{
            Text: MarkdownText,
            Reasoning,
            ReasoningGroup,
            tools: {
              Fallback: ToolFallback,
              Group: ToolGroup,
            },
            source: Sources,
          }}
        />
      </div>
      
      <div className="flex flex-col gap-1">
        <AssistantActionBar />
        <BranchPicker />
      </div>
    </MessagePrimitive.Root>
  );
};

export default AssistantMessage;
```

---

### Recipe 2: Complete Assistant Layout

```tsx
// /app/assistant.tsx
import { FC } from "react";
import { Thread } from "@/components/assistant-ui/thread";
import { ThreadListSidebar } from "@/components/assistant-ui/threadlist-sidebar";
import { 
  SidebarProvider, 
  SidebarInset, 
  SidebarTrigger 
} from "@/components/ui/sidebar";

const AssistantPage: FC = () => {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-dvh w-full">
        {/* Left Sidebar: Thread List */}
        <ThreadListSidebar />
        
        {/* Right Panel: Current Thread */}
        <SidebarInset>
          {/* Mobile Menu Trigger */}
          <div className="sticky top-0 z-10 flex items-center gap-4 border-b bg-background px-4 py-2">
            <SidebarTrigger />
            <div className="flex-1" />
          </div>
          
          {/* Thread Content */}
          <Thread />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AssistantPage;
```

---

### Recipe 3: Custom Reasoning with Auto-Markdown

```tsx
// /components/assistant-ui/custom-reasoning.tsx
import { FC } from "react";
import { useAuiState } from "@assistant-ui/react";
import { 
  Reasoning,
  ReasoningRoot,
  ReasoningTrigger,
  ReasoningContent,
  ReasoningText,
} from "@/components/assistant-ui/reasoning";
import { MarkdownText } from "@/components/assistant-ui/markdown-text";

interface CustomReasoningProps {
  children: string;
  startIndex: number;
  endIndex: number;
}

export const CustomReasoningGroup: FC<CustomReasoningProps> = ({
  children,
  startIndex,
  endIndex,
}) => {
  // Auto-detect if reasoning is streaming
  const isStreaming = useAuiState((s) => {
    if (s.message.status?.type !== "running") return false;
    const lastIndex = s.message.parts.length - 1;
    const lastType = s.message.parts[lastIndex]?.type;
    return lastType === "reasoning" && lastIndex >= startIndex && lastIndex <= endIndex;
  });

  return (
    <ReasoningRoot 
      defaultOpen={isStreaming}
      variant="muted"
    >
      <ReasoningTrigger active={isStreaming} />
      <ReasoningContent>
        <ReasoningText>
          <MarkdownText>{children}</MarkdownText>
        </ReasoningText>
      </ReasoningContent>
    </ReasoningRoot>
  );
};
```

---

### Recipe 4: Tool Group with Mixed Custom UIs

```tsx
// /components/tools/weather-tool-ui.tsx
import { FC } from "react";
import { Cloud, CloudRain, Sun } from "lucide-react";

interface WeatherResult {
  location: string;
  temperature: number;
  condition: "sunny" | "cloudy" | "rainy";
  humidity: number;
}

const getWeatherIcon = (condition: string) => {
  switch (condition) {
    case "sunny":
      return <Sun className="size-6 text-yellow-500" />;
    case "cloudy":
      return <Cloud className="size-6 text-gray-500" />;
    case "rainy":
      return <CloudRain className="size-6 text-blue-500" />;
    default:
      return <Cloud className="size-6" />;
  }
};

export const WeatherToolUI: FC<WeatherResult> = ({
  location,
  temperature,
  condition,
  humidity,
}) => {
  return (
    <div className="flex items-center gap-3 rounded-lg border bg-background p-3">
      {getWeatherIcon(condition)}
      <div className="flex-1">
        <div className="text-xs text-muted-foreground">{location}</div>
        <div className="text-lg font-semibold">{temperature}°F</div>
        <div className="text-xs text-muted-foreground">Humidity: {humidity}%</div>
      </div>
    </div>
  );
};

// /components/assistant-ui/thread.tsx
import { ToolGroup } from "@/components/assistant-ui/tool-group";
import { ToolFallback } from "@/components/assistant-ui/tool-fallback";
import { WeatherToolUI } from "@/components/tools/weather-tool-ui";

// Use in message parts
const tools = {
  weather: WeatherToolUI,
  search: SearchToolUI,
  calculator: CalculatorToolUI,
  Fallback: ToolFallback,
  Group: ToolGroup,
};

<MessagePrimitive.Parts components={{ tools }} />
```

---

### Recipe 5: Custom Sources with Icons

```tsx
// /components/assistant-ui/custom-sources.tsx
import { FC } from "react";
import { ExternalLink } from "lucide-react";
import { 
  Source,
  SourceIcon,
  SourceTitle,
} from "@/components/assistant-ui/sources";

interface CustomSourceProps {
  url: string;
  title?: string;
  description?: string;
  variant?: "outline" | "muted" | "info";
}

export const CustomSource: FC<CustomSourceProps> = ({
  url,
  title,
  description,
  variant = "outline",
}) => {
  return (
    <Source 
      href={url} 
      variant={variant}
      className="flex items-start gap-3"
      target="_blank"
      rel="noopener noreferrer"
    >
      <SourceIcon url={url} className="size-6 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <SourceTitle className="font-medium">
          {title || new URL(url).hostname}
        </SourceTitle>
        {description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {description}
          </p>
        )}
      </div>
      <ExternalLink className="size-4 flex-shrink-0 opacity-50" />
    </Source>
  );
};
```

---

### Recipe 6: ThreadList with Custom Styling

```tsx
// /components/assistant-ui/custom-thread-list.tsx
import { FC } from "react";
import {
  ThreadListPrimitive,
  ThreadListItemPrimitive,
  ThreadListItemMorePrimitive,
} from "@assistant-ui/react";
import { Plus, Trash2, Archive } from "lucide-react";
import { Button } from "@/components/ui/button";

export const CustomThreadList: FC = () => {
  return (
    <div className="flex flex-col h-full bg-muted/30">
      {/* Header */}
      <div className="border-b p-4">
        <ThreadListPrimitive.New asChild>
          <Button variant="default" size="sm" className="w-full">
            <Plus className="size-4 mr-2" />
            New Chat
          </Button>
        </ThreadListPrimitive.New>
      </div>

      {/* Thread List */}
      <div className="flex-1 overflow-y-auto">
        <ThreadListPrimitive.Root>
          <ThreadListPrimitive.Items
            components={{
              ThreadListItem: () => (
                <ThreadListItemPrimitive.Root className="border-b px-2 py-1">
                  <ThreadListItemPrimitive.Trigger 
                    asChild
                    className="data-[active]:bg-primary/10"
                  >
                    <button className="w-full flex-1 text-left px-3 py-2 rounded hover:bg-muted">
                      <ThreadListItemPrimitive.Title 
                        fallback="New Thread"
                        className="truncate text-sm font-medium"
                      />
                    </button>
                  </ThreadListItemPrimitive.Trigger>

                  {/* Actions Menu */}
                  <ThreadListItemMorePrimitive.Root>
                    <ThreadListItemMorePrimitive.Trigger asChild>
                      <Button variant="ghost" size="sm">
                        ⋮
                      </Button>
                    </ThreadListItemMorePrimitive.Trigger>
                    <ThreadListItemMorePrimitive.Content 
                      className="w-32"
                    >
                      <ThreadListItemMorePrimitive.Item asChild>
                        <ThreadListItemPrimitive.Archive>
                          <Archive className="size-4 mr-2" />
                          Archive
                        </ThreadListItemPrimitive.Archive>
                      </ThreadListItemMorePrimitive.Item>

                      <ThreadListItemMorePrimitive.Separator />

                      <ThreadListItemMorePrimitive.Item asChild>
                        <ThreadListItemPrimitive.Delete>
                          <Trash2 className="size-4 mr-2" />
                          Delete
                        </ThreadListItemPrimitive.Delete>
                      </ThreadListItemMorePrimitive.Item>
                    </ThreadListItemMorePrimitive.Content>
                  </ThreadListItemMorePrimitive.Root>
                </ThreadListItemPrimitive.Root>
              ),
            }}
          />
        </ThreadListPrimitive.Root>
      </div>

      {/* Archived Section */}
      <div className="border-t p-4">
        <details className="text-xs">
          <summary className="cursor-pointer font-medium text-muted-foreground">
            Archived Threads
          </summary>
          <div className="mt-2">
            <ThreadListPrimitive.Items
              archived
              components={{
                ThreadListItem: () => (
                  <ThreadListItemPrimitive.Root>
                    <ThreadListItemPrimitive.Trigger className="text-xs">
                      <ThreadListItemPrimitive.Title fallback="Archived" />
                    </ThreadListItemPrimitive.Trigger>
                  </ThreadListItemPrimitive.Root>
                ),
              }}
            />
          </div>
        </details>
      </div>
    </div>
  );
};
```

---

## 🔧 Troubleshooting Guide

### Issue 1: ReasoningGroup Not Auto-Collapsing

**Problem:** Reasoning parts appear fully expanded instead of collapsed initially.

**Solution:**
```tsx
// The defaultOpen prop should be controlled based on streaming state
const isStreaming = useAuiState(s => s.message.status?.type === "running");

<ReasoningRoot defaultOpen={isStreaming}>
  <ReasoningTrigger active={isStreaming} />
  {/* ... */}
</ReasoningRoot>
```

---

### Issue 2: Sources Favicon Not Loading

**Problem:** Favicons don't load, always showing initials.

**Solution:**
```tsx
// Ensure URL is valid and CORS-accessible
// Use SourceIcon directly for debugging
<SourceIcon 
  url="https://example.com" 
  className="size-6"
  // The component will automatically fallback if favicon doesn't load
/>

// For development, you may need to use a favicon service
<SourceIcon 
  url={`https://icon.horse/icon/${new URL(sourceUrl).hostname}`}
/>
```

---

### Issue 3: ToolGroup Always Open

**Problem:** ToolGroup doesn't collapse during streaming.

**Solution:**
```tsx
// Use defaultOpen prop instead of open prop for uncontrolled behavior
<ToolGroup.Root 
  defaultOpen={false}  // Starts closed
  // Don't set: open={true}
>
  <ToolGroup.Trigger count={3} active={isStreaming} />
  <ToolGroup.Content>
    {/* Tools */}
  </ToolGroup.Content>
</ToolGroup.Root>
```

---

### Issue 4: ThreadList Items Not Clickable

**Problem:** Clicking thread items doesn't switch threads.

**Solution:**
```tsx
// WRONG: Using regular div/button instead of Trigger
<div onClick={switchThread}>
  <ThreadListItemPrimitive.Title />
</div>

// CORRECT: Wrap Trigger properly
<ThreadListItemPrimitive.Trigger asChild>
  <button>
    <ThreadListItemPrimitive.Title />
  </button>
</ThreadListItemPrimitive.Trigger>
```

---

### Issue 5: ToolFallback Not Showing Arguments

**Problem:** Tool arguments don't display, only result shows.

**Solution:**
```tsx
// Ensure tool result includes proper structure
// WRONG - Missing args display
<ToolFallback {...part} />

// CORRECT - Use composable API with explicit Args
<ToolFallback.Root>
  <ToolFallback.Trigger toolName={part.toolName} status={part.status} />
  <ToolFallback.Content>
    <ToolFallback.Args argsText={JSON.stringify(part.args, null, 2)} />
    <ToolFallback.Result result={part.result} />
  </ToolFallback.Content>
</ToolFallback.Root>
```

---

### Issue 6: Reasoning Content Not Readable

**Problem:** Reasoning text is too small or unformatted.

**Solution:**
```tsx
// WRONG: Reasoning without MarkdownText
<ReasoningText>{content}</ReasoningText>

// CORRECT: Wrap with MarkdownText for better formatting
<ReasoningText>
  <MarkdownText>{content}</MarkdownText>
</ReasoningText>

// Or use variant for better visibility
<ReasoningRoot variant="outline">
  {/* Outline variant has better contrast */}
</ReasoningRoot>
```

---

## 🎯 Performance Optimization

### 1. Memoize Custom Tool Components

```tsx
const WeatherToolUI = memo(({ location, temperature, condition, humidity }: WeatherResult) => {
  // Component code
});

export default WeatherToolUI;
```

### 2. Lazy Load Tool Groups

```tsx
import { lazy, Suspense } from "react";

const ToolGroupLazy = lazy(() => import("@/components/assistant-ui/tool-group"));
const ToolFallbackSkeleton = () => <div className="h-12 bg-muted rounded animate-pulse" />;

<Suspense fallback={<ToolFallbackSkeleton />}>
  <ToolGroupLazy {...props} />
</Suspense>
```

### 3. Virtualize Long Thread Lists

```tsx
import { Window, WindowScroller } from "react-virtualized";

<WindowScroller>
  {({ height, isScrolling, onChildScroll, scrollTop }) => (
    <Window
      autoHeight
      height={height}
      isScrolling={isScrolling}
      onScroll={onChildScroll}
      scrollTop={scrollTop}
      rowCount={threads.length}
      rowHeight={60}
      rowRenderer={({ key, index, style }) => (
        <ThreadListItem key={key} thread={threads[index]} style={style} />
      )}
    />
  )}
</WindowScroller>
```

---

## ✅ Testing Checklist

- [ ] Reasoning parts group correctly with auto-expand during streaming
- [ ] Sources load favicons or fallback to initials
- [ ] ThreadList items are clickable and switch threads
- [ ] ToolFallback shows args and results
- [ ] ToolGroup collapses/expands with animation
- [ ] All variants render correctly (outline, ghost, muted)
- [ ] Markdown renders in Reasoning and MarkdownText
- [ ] Links in Sources open in new tabs
- [ ] Thread archive/delete operations work
- [ ] Mobile responsive (sidebar collapses)

---

## 📚 Related Documentation

- **assistant-ui Documentation**: https://www.assistant-ui.com/docs/ui
- **Reasoning**: https://www.assistant-ui.com/docs/ui/reasoning
- **Sources**: https://www.assistant-ui.com/docs/ui/sources
- **ThreadList**: https://www.assistant-ui.com/docs/ui/thread-list
- **ToolFallback**: https://www.assistant-ui.com/docs/ui/tool-fallback
- **ToolGroup**: https://www.assistant-ui.com/docs/ui/tool-group
