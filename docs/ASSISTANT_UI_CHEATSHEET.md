# Assistant-UI Components - Quick Reference Cheat Sheet

Fast lookup for component APIs, props, variants, and common patterns.

---

## 🚀 Quick Start

```bash
# Install all 5 components
shadcn add reasoning sources thread-list tool-fallback tool-group
```

---

## 📦 Component Quick Reference

### Reasoning Component

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `variant` | `outline` \| `ghost` \| `muted` | `outline` | Visual style |
| `children` | `ReactNode` | - | Content (wrap with MarkdownText for markdown) |
| `defaultOpen` | `boolean` | `false` | Initial state |
| `asChild` | `boolean` | `false` | Merge props with child |

**Auto-Group?** Yes - Use `ReasoningGroup` component  
**Streaming?** Yes - Shows shimmer on `Trigger` when active  
**Markdown?** Yes - Wrap content with `<MarkdownText>` component

```tsx
<Reasoning.Root variant="outline">
  <Reasoning.Trigger active={isStreaming} />
  <Reasoning.Content>
    <Reasoning.Text><MarkdownText>{content}</MarkdownText></Reasoning.Text>
  </Reasoning.Content>
</Reasoning.Root>
```

---

### Sources Component

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `url` | `string` | - | **Required** - Source URL |
| `title` | `string \| undefined` | - | Display title (falls back to domain) |
| `sourceType` | `string` | - | Must be `"url"` to render |
| `variant` | See variants below | `outline` | Color style |
| `size` | `sm` \| `default` \| `lg` | `default` | Badge size |
| `target` | `string` | `_blank` | Link target |
| `rel` | `string` | `noopener noreferrer` | Link rel attribute |

**Variants:**
```
outline | ghost | muted | secondary | info | warning | success | destructive
```

```tsx
<Sources href="https://example.com" variant="info" size="lg">
  <Sources.Icon url="https://example.com" />
  <Sources.Title>Title</Sources.Title>
</Sources>
```

---

### ThreadList Component

| Component | Purpose | Props |
|-----------|---------|-------|
| `ThreadListSidebar` | Complete sidebar layout | - |
| `ThreadList` | Custom layout | - |
| `ThreadListPrimitive.Root` | Container | `asChild` |
| `ThreadListPrimitive.New` | Create thread button | `asChild` |
| `ThreadListPrimitive.Items` | Thread list | `archived`, `components` |
| `ThreadListItemPrimitive.Root` | Item container | `asChild` |
| `ThreadListItemPrimitive.Trigger` | Switch thread | `asChild` |
| `ThreadListItemPrimitive.Title` | Thread name | `fallback` |
| `ThreadListItemPrimitive.Archive` | Archive button | `asChild` |
| `ThreadListItemPrimitive.Delete` | Delete button | `asChild` |

**Layout Options:**
```tsx
// Option 1: With Sidebar (RECOMMENDED)
<SidebarProvider>
  <ThreadListSidebar />
  <SidebarInset><Thread /></SidebarInset>
</SidebarProvider>

// Option 2: Custom Grid
<div className="grid grid-cols-[200px_1fr]">
  <ThreadList />
  <Thread />
</div>
```

---

### ToolFallback Component

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `toolName` | `string` | - | **Required** - Tool name display |
| `status` | `running` \| `complete` \| `error` \| `cancelled` | - | Current state |
| `args` | `Record<string, any>` | - | Tool arguments |
| `result` | `any` | - | Tool result |
| `error` | `string` | - | Error message |

**Status Flow:**
- `running` → Shows spinner + shimmer
- `complete` → Shows args + result
- `error` → Shows error message
- `cancelled` → Muted appearance

```tsx
<ToolFallback.Root>
  <ToolFallback.Trigger toolName="search" status="running" />
  <ToolFallback.Content>
    <ToolFallback.Args argsText="query: 'restaurants'" />
    <ToolFallback.Result result={results} />
  </ToolFallback.Content>
</ToolFallback.Root>
```

**Composable Sub-components:**
- `ToolFallback.Root`
- `ToolFallback.Trigger`
- `ToolFallback.Content`
- `ToolFallback.Args`
- `ToolFallback.Result`
- `ToolFallback.Error`

---

### ToolGroup Component

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `variant` | `outline` \| `ghost` \| `muted` | `outline` | Visual style |
| `defaultOpen` | `boolean` | `false` | Initial state |
| `open` | `boolean` | - | Controlled open state |
| `onOpenChange` | `(open: boolean) => void` | - | State change callback |
| `count` | `number` | - | **Required** for Trigger - number of tools |
| `active` | `boolean` | `false` | Show loading animation |
| `asChild` | `boolean` | `false` | Merge props with child |

**Auto-Groups?** Yes - Consecutive tool calls  
**Streaming?** Yes - Auto-expands when `active={true}`  
**Animation?** Yes - Collapsible with scroll lock

```tsx
<ToolGroup.Root variant="outline" defaultOpen>
  <ToolGroup.Trigger count={3} active={isStreaming} />
  <ToolGroup.Content>
    {/* Tool UIs here */}
  </ToolGroup.Content>
</ToolGroup.Root>
```

---

## 🔗 Integration Patterns

### Pattern 1: Complete Message Setup

```tsx
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
```

### Pattern 2: Custom Tool Renderer

```tsx
const tools = {
  weather: WeatherToolUI,      // Custom component
  calculator: CalculatorToolUI,  // Custom component
  Fallback: ToolFallback,      // Fallback for others
  Group: ToolGroup,            // Auto-group consecutive
};
```

### Pattern 3: Variant Control

```tsx
// Reason - Use outline for emphasis
<Reasoning.Root variant="outline">

// Sources - Use info for highlights
<Sources variant="info" />

// ToolGroup - Use muted for subtlety
<ToolGroup.Root variant="muted">
```

---

## 📊 Variant Matrix

| Component | Variants | Use Case |
|-----------|----------|----------|
| **Reasoning** | outline, ghost, muted | outline = default |
| **Sources** | outline, ghost, muted, secondary, info, warning, success, destructive | outline = default |
| **ToolGroup** | outline, ghost, muted | outline = default |
| **ToolFallback** | - | None (uses context) |
| **ThreadList** | - | None (sidebar or grid) |

---

## 🎨 CSS Classes You Might Need

```tsx
// Container spacing
<div className="flex flex-col gap-4">

// Reasoning box
<Reasoning.Root className="rounded-lg border bg-muted/50" />

// ToolGroup variants styling
<ToolGroup.Root variant="outline" className="border rounded-md" />

// Sources badge
<Sources className="gap-2" size="lg" />

// ThreadList item state
<ThreadListItemPrimitive.Root className="data-[active]:bg-primary/10" />
```

---

## 🔄 Streaming Detection

```tsx
import { useAuiState } from "@assistant-ui/react";

const isStreaming = useAuiState(s => s.message.status?.type === "running");
const isReasoningStreaming = useAuiState(s => {
  if (s.message.status?.type !== "running") return false;
  const lastType = s.message.parts[s.message.parts.length - 1]?.type;
  return lastType === "reasoning";
});
```

---

## ✅ Common Implementation Checklist

- [ ] Install all 5 components via shadcn
- [ ] Wrap Thread message parts with all components
- [ ] Import MarkdownText for Reasoning content
- [ ] Use ReasoningGroup for auto-grouping
- [ ] Use ToolGroup for consecutive tools
- [ ] Set `variant` props for consistent styling
- [ ] Test streaming states (active={isStreaming})
- [ ] Verify favicon loading in Sources
- [ ] Test ThreadList item switching
- [ ] Verify collapse/expand animations work

---

## 🚨 Common Mistakes

| ❌ Wrong | ✅ Correct |
|---------|-----------|
| `<Reasoning>{text}</Reasoning>` | `<Reasoning.Root><Reasoning.Content><Reasoning.Text>{text}</Reasoning.Text></Reasoning.Content></Reasoning.Root>` |
| No `ReasoningGroup` | Use `ReasoningGroup` to auto-group consecutive parts |
| `<Sources sourceType="url" />` | Must pass as message part: `components={{ source: Sources }}` |
| `open={true}` always | Use `defaultOpen={isStreaming}` for auto-expand |
| `<ToolFallback {...part} />` without args | Use composable API to show args explicitly |
| Missing `MarkdownText` wrapper | Always wrap Reasoning content with MarkdownText |
| Not setting `variant` | Set variants for visual hierarchy |
| ThreadList item as `<div>` | Use `ThreadListItemPrimitive.Trigger` properly |

---

## 📱 Mobile Responsive Tips

```tsx
// ThreadListSidebar with mobile
<SidebarProvider>
  <ThreadListSidebar />          {/* Auto-collapses <768px */}
  <SidebarInset>
    <SidebarTrigger />           {/* Mobile menu trigger */}
    <Thread />
  </SidebarInset>
</SidebarProvider>

// Or use custom layout
<div className="grid grid-cols-1 md:grid-cols-[200px_1fr] h-full">
  <ThreadList className="hidden md:block" />
  <Thread />
</div>
```

---

## 🔍 Debugging

```tsx
// Check if part is recognized
{({ part }) => {
  console.log("Part type:", part.type);  // Should be: text|reasoning|tool-call|source
  if (part.type === "reasoning") return <Reasoning {...part} />;
  if (part.type === "tool-call") return <ToolGroup {...part} />;
  if (part.type === "source") return <Sources {...part} />;
  return null;
}}

// Check streaming state
const status = useAuiState(s => s.message.status?.type);
console.log("Message status:", status);  // Should be "running" while streaming
```

---

## 📚 Documentation Links

| Component | Docs URL |
|-----------|----------|
| Reasoning | https://www.assistant-ui.com/docs/ui/reasoning |
| Sources | https://www.assistant-ui.com/docs/ui/sources |
| ThreadList | https://www.assistant-ui.com/docs/ui/thread-list |
| ToolFallback | https://www.assistant-ui.com/docs/ui/tool-fallback |
| ToolGroup | https://www.assistant-ui.com/docs/ui/tool-group |
| All Components | https://www.assistant-ui.com/docs/ui |

---

## 💾 File Locations

```
/components/assistant-ui/
  ├── reasoning.tsx            # Individual reasoning parts
  ├── sources.tsx              # URL sources with favicons
  ├── thread-list.tsx          # Custom thread list layout
  ├── threadlist-sidebar.tsx   # Complete sidebar layout
  ├── tool-fallback.tsx        # Default tool UI
  ├── tool-group.tsx           # Groups consecutive tools
  ├── thread.tsx               # Main message display (uses all above)
  └── ...

/docs/
  ├── ASSISTANT_UI_COMPONENTS.md   # Main guide
  ├── ASSISTANT_UI_TYPES.ts        # TypeScript interfaces
  ├── ASSISTANT_UI_RECIPES.md      # Implementation examples
  └── ASSISTANT_UI_CHEATSHEET.md   # This file
```

---

## 🎯 Next Steps

1. ✅ Read [ASSISTANT_UI_COMPONENTS.md](./ASSISTANT_UI_COMPONENTS.md) for overall architecture
2. ✅ Review [ASSISTANT_UI_RECIPES.md](./ASSISTANT_UI_RECIPES.md) for implementation examples
3. ✅ Reference [ASSISTANT_UI_TYPES.ts](./ASSISTANT_UI_TYPES.ts) for TypeScript interfaces
4. 📋 Use this cheat sheet for quick lookups during development
5. 🧪 Test component variations and streaming states
6. 🚀 Deploy with confidence!
