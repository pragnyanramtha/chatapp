# Assistant-UI Components Integration Guide

Complete reference for integrating Reasoning, Sources, ThreadList, ToolFallback, and ToolGroup components.

## 📋 Components Overview

| Component | Purpose | Status |
|-----------|---------|--------|
| **Reasoning** | Collapsible AI thinking/reasoning messages | Grouping with auto-expand |
| **Sources** | Display URL sources with favicon & title | Badge variants & sizes |
| **ThreadList** | Switch between conversations | Sidebar or custom layouts |
| **ToolFallback** | Default UI for tools without renderers | Streaming states support |
| **ToolGroup** | Wrapper for consecutive tool calls | Collapsible with variants |

---

## 🚀 Quick Integration Path

### 1. ThreadList Setup (Foundation)

```tsx
// /app/assistant.tsx
import { Thread } from "@/components/assistant-ui/thread";
import { ThreadListSidebar } from "@/components/assistant-ui/threadlist-sidebar";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";

export default function Assistant() {
  return (
    <SidebarProvider>
      <div className="flex h-dvh w-full">
        <ThreadListSidebar />
        <SidebarInset>
          <SidebarTrigger className="absolute top-4 left-4" />
          <Thread />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
```

### 2. Message Rendering with All Components

```tsx
// /components/assistant-ui/thread.tsx
import { MessagePrimitive } from "@assistant-ui/react";
import { MarkdownText } from "@/components/assistant-ui/markdown-text";
import { ToolFallback } from "@/components/assistant-ui/tool-fallback";
import { ToolGroup } from "@/components/assistant-ui/tool-group";
import { Reasoning, ReasoningGroup } from "@/components/assistant-ui/reasoning";
import { Sources } from "@/components/assistant-ui/sources";

const AssistantMessage: FC = () => {
  return (
    <MessagePrimitive.Root>
      <div>
        <MessagePrimitive.Parts
          components={{
            Text: MarkdownText,
            Reasoning,
            ReasoningGroup,
            tools: { Fallback: ToolFallback, Group: ToolGroup },
            source: Sources,
          }}
        />
      </div>
      <AssistantActionBar />
      <BranchPicker />
    </MessagePrimitive.Root>
  );
};
```

---

## 📖 Component Details

### Reasoning Component

**Purpose:** Display AI thinking/reasoning in collapsible sections that auto-expand during streaming.

**Key Features:**
- Auto-groups consecutive reasoning parts
- Shows shimmer animation while streaming
- Variant support: `outline` (default), `ghost`, `muted`
- Markdown support for reasoning content

**Usage:**
```tsx
import { Reasoning, ReasoningGroup } from "@/components/assistant-ui/reasoning";

// Use both together for default behavior
<MessagePrimitive.Parts
  components={{
    Reasoning,
    ReasoningGroup,
  }}
/>

// Or build custom layout with composable API
<Reasoning.Root variant="muted">
  <Reasoning.Trigger active={isStreaming} />
  <Reasoning.Content>
    <Reasoning.Text>
      <MarkdownText>{reasoningContent}</MarkdownText>
    </Reasoning.Text>
  </Reasoning.Content>
</Reasoning.Root>
```

**Composable Sub-components:**
- `Reasoning.Root` - Collapsible container with scroll lock
- `Reasoning.Trigger` - Button with icon, label, shimmer
- `Reasoning.Content` - Animated collapsible wrapper
- `Reasoning.Text` - Text wrapper with slide/fade animation
- `Reasoning.Fade` - Gradient fade overlay

---

### Sources Component

**Purpose:** Display URL references with favicon, domain title, and external links.

**Key Features:**
- Auto-fetches favicon from URL
- Falls back to domain initial in muted box
- Multiple variants: `outline`, `ghost`, `muted`, `secondary`, `info`, `warning`, `success`, `destructive`
- Size support: `sm`, `default`, `lg`
- Compound component API

**Usage:**
```tsx
import { Sources } from "@/components/assistant-ui/sources";

// Simple usage
<MessagePrimitive.Parts
  components={{
    source: Sources,
  }}
/>

// Custom layout with compound components
<Sources.Root href="https://example.com">
  <Sources.Icon url="https://example.com" />
  <Sources.Title>Example Domain</Sources.Title>
</Sources.Root>

// Custom styling
<Sources href="https://example.com" variant="muted" size="lg" />
```

**Props:**
- `url` (required) - Source URL
- `title` - Display title (falls back to domain)
- `variant` - Visual style
- `size` - Badge size
- `target` - Link target (default: `_blank`)
- `rel` - Link rel (default: `noopener noreferrer`)

---

### ThreadList Component

**Purpose:** Switch between active conversations with archive/delete management.

**Key Features:**
- Two layouts: `ThreadListSidebar` (complete) or `ThreadList` (custom)
- New thread creation button
- Archive/unarchive threads
- Delete threads
- Current thread tracking
- Dropdown menu for additional actions

**Usage - With Sidebar:**
```tsx
import { ThreadListSidebar } from "@/components/assistant-ui/threadlist-sidebar";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";

export default function Assistant() {
  return (
    <SidebarProvider>
      <div className="flex h-dvh w-full">
        <ThreadListSidebar />
        <SidebarInset>
          <SidebarTrigger className="absolute top-4 left-4" />
          <Thread />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
```

**Usage - Custom Layout:**
```tsx
import { ThreadList } from "@/components/assistant-ui/thread-list";

export default function Assistant() {
  return (
    <div className="grid h-full grid-cols-[200px_1fr]">
      <ThreadList />
      <Thread />
    </div>
  );
}
```

**Anatomy:**
```tsx
import { ThreadListPrimitive, ThreadListItemPrimitive } from "@assistant-ui/react";

<ThreadListPrimitive.Root>
  <ThreadListPrimitive.New />
  <ThreadListPrimitive.Items>
    {() => (
      <ThreadListItemPrimitive.Root>
        <ThreadListItemPrimitive.Trigger>
          <ThreadListItemPrimitive.Title fallback="New Thread" />
        </ThreadListItemPrimitive.Trigger>
        <ThreadListItemPrimitive.Archive />
        <ThreadListItemPrimitive.Delete />
      </ThreadListItemPrimitive.Root>
    )}
  </ThreadListPrimitive.Items>
</ThreadListPrimitive.Root>
```

---

### ToolFallback Component

**Purpose:** Default UI for tool calls without custom renderers. Shows arguments and results.

**Key Features:**
- Displays tool name with status icon
- Shows loading spinner during execution
- Streams tool arguments and results
- Handles cancelled/error states
- Collapsible content with scroll lock
- Shimmer animation

**Usage:**
```tsx
import { ToolFallback } from "@/components/assistant-ui/tool-fallback";

<MessagePrimitive.Parts
  components={{
    tools: { Fallback: ToolFallback },
  }}
/>

// Custom layout with composable API
<ToolFallback.Root>
  <ToolFallback.Trigger toolName="get_weather" status={status} />
  <ToolFallback.Content>
    <ToolFallback.Error status={status} />
    <ToolFallback.Args argsText={argsText} />
    <ToolFallback.Result result={result} />
  </ToolFallback.Content>
</ToolFallback.Root>
```

**States:**
- **Running:** Spinner + shimmer, shows args being sent
- **Complete:** Shows args and result
- **Cancelled:** Muted appearance with cancellation message
- **Error:** Shows error message

**Composable Sub-components:**
- `ToolFallback.Root` - Main container
- `ToolFallback.Trigger` - Header with tool name & status
- `ToolFallback.Content` - Collapsible content
- `ToolFallback.Args` - Tool arguments display
- `ToolFallback.Result` - Tool result display
- `ToolFallback.Error` - Error/cancellation message

---

### ToolGroup Component

**Purpose:** Wrap consecutive tool calls in collapsible container. Auto-expands during streaming.

**Key Features:**
- Groups consecutive tool calls automatically
- Collapsible with auto-expand during streaming
- Tool count display in header
- Shimmer animation while streaming
- Multiple variants: `outline` (default), `ghost`, `muted`
- Scroll lock to prevent layout shift

**Usage:**
```tsx
import { ToolGroup } from "@/components/assistant-ui/tool-group";

// Use as default UI for tool groups
<MessagePrimitive.Parts
  components={{
    tools: { Group: ToolGroup },
  }}
/>

// Custom layout with variants
<ToolGroup.Root variant="muted" defaultOpen>
  <ToolGroup.Trigger count={3} active={false} />
  <ToolGroup.Content>
    {/* Tool UIs here - custom or ToolFallback */}
  </ToolGroup.Content>
</ToolGroup.Root>
```

**With Custom Tool UIs:**
```tsx
function WeatherToolUI({ location, temperature, condition }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border p-3">
      <WeatherIcon condition={condition} />
      <div>
        <div className="text-xs text-muted-foreground">{location}</div>
        <div className="text-lg font-medium">{temperature}°F</div>
      </div>
    </div>
  );
}

<ToolGroup.Root variant="outline">
  <ToolGroup.Trigger count={3} />
  <ToolGroup.Content>
    <WeatherToolUI location="New York" temperature={65} condition="Cloudy" />
    <WeatherToolUI location="London" temperature={55} condition="Rainy" />
  </ToolGroup.Content>
</ToolGroup.Root>
```

**Composable Sub-components:**
- `ToolGroup.Root` - Container with variants
- `ToolGroup.Trigger` - Header with count & shimmer
- `ToolGroup.Content` - Animated collapsible wrapper

**Props:**
- `variant` - `outline` | `ghost` | `muted` (default: `outline`)
- `open` - Controlled open state
- `onOpenChange` - Callback for state changes
- `defaultOpen` - Initial open state

---

## 🔄 Complete Message Flow

```typescript
// Message with all component types:
{
  type: "message",
  role: "assistant",
  parts: [
    // Text + Markdown
    { type: "text", text: "Let me analyze this..." },
    
    // AI Reasoning (grouped)
    { type: "reasoning", text: "First, I'll consider..." },
    { type: "reasoning", text: "Then I'll examine..." },
    
    // Tool Calls (grouped)
    { type: "tool-call", name: "search", args: "...", status: "running" },
    { type: "tool-call", name: "search", args: "...", status: "complete", result: "..." },
    
    // Additional Text
    { type: "text", text: "Based on my analysis..." },
    
    // Sources/References
    { type: "source", url: "https://example.com", title: "Example" },
  ]
}
```

---

## 🎯 Implementation Checklist

- [ ] Install ThreadList components
- [ ] Setup SidebarProvider layout
- [ ] Install Reasoning + ReasoningGroup
- [ ] Install Sources component
- [ ] Install ToolFallback component
- [ ] Install ToolGroup component
- [ ] Wire components into MessagePrimitive.Parts
- [ ] Test streaming states (Reasoning, ToolGroup auto-expand)
- [ ] Test all variants and sizes
- [ ] Verify markdown rendering in Reasoning
- [ ] Test favicon loading in Sources
- [ ] Test tool call grouping logic

---

## 🔧 Common Patterns

### Pattern 1: Disable ReasoningGroup (Manual Layout)
```tsx
// Only use Reasoning without ReasoningGroup
<MessagePrimitive.Parts
  components={{
    Reasoning, // Individual parts only
    // ReasoningGroup not included
  }}
/>
```

### Pattern 2: Custom Tool Renderer with Fallback
```tsx
const customTools = {
  weather: WeatherToolUI,
  search: SearchToolUI,
  Fallback: ToolFallback,
};

<MessagePrimitive.Parts
  components={{
    tools: customTools,
  }}
/>
```

### Pattern 3: Sources with Custom Styling
```tsx
import { Source, SourceIcon, SourceTitle } from "@/components/assistant-ui/sources";

<Source href="https://example.com" variant="info" size="lg" className="gap-2">
  <SourceIcon url="https://example.com" className="size-5" />
  <SourceTitle className="font-semibold">Custom Source</SourceTitle>
</Source>
```

---

## 📚 Related Components

- **Thread** - Main chat message display
- **MessagePrimitive** - Low-level message rendering
- **Markdown Text** - Markdown rendering for text/reasoning
- **Context Display** - Show context/references
- **Directive Text** - Special text formatting

---

## ✅ Verification

After implementation:

1. **Reasoning Groups:** Verify consecutive reasoning parts collapse/expand
2. **Tool Groups:** Verify consecutive tools are grouped automatically
3. **Streaming:** All components should support streaming states
4. **Variants:** Test different color/styling variants for each component
5. **Sources:** Verify favicons load and fallback to initials
6. **ThreadList:** Test create, archive, delete operations
