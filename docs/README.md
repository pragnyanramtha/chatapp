# Assistant-UI Documentation Suite

Comprehensive reference documentation for integrating **Reasoning**, **Sources**, **ThreadList**, **ToolFallback**, and **ToolGroup** components into your assistant application.

## 📚 Documentation Files

### 1. **[ASSISTANT_UI_COMPONENTS.md](./ASSISTANT_UI_COMPONENTS.md)** - Main Architecture Guide
**Start here** if you're new to these components.

- Component overview table
- Quick integration path
- Detailed component docs with features
- Complete message flow diagram
- Implementation checklist
- Common patterns

**Use this for:**
- Understanding what each component does
- How they work together
- Installation and setup
- Component anatomy

---

### 2. **[ASSISTANT_UI_CHEATSHEET.md](./ASSISTANT_UI_CHEATSHEET.md)** - Quick Reference
**Keep open while coding** - Fast lookup for APIs and props.

- Quick start command
- Component quick reference table
- All props and variants
- Integration patterns
- CSS classes quick list
- Common mistakes
- Debugging tips
- Mobile responsive tips

**Use this for:**
- Quick prop lookups
- Checking variant options
- Common implementation patterns
- Troubleshooting ideas

---

### 3. **[ASSISTANT_UI_TYPES.ts](./ASSISTANT_UI_TYPES.ts)** - TypeScript Interfaces
**Reference for TypeScript developers.**

- Complete interface definitions
- All component props documented
- Usage patterns in comments
- State management helpers
- Complete message component setup example

**Use this for:**
- TypeScript prop typing
- Interface reference
- IntelliSense context
- State management patterns

---

### 4. **[ASSISTANT_UI_RECIPES.md](./ASSISTANT_UI_RECIPES.md)** - Implementation Examples
**Copy-paste ready implementations.**

- 6 complete implementation recipes
- Custom components with styling
- Advanced patterns
- Troubleshooting guide (8 common issues + solutions)
- Performance optimization tips
- Testing checklist

**Use this for:**
- Copy-paste implementations
- Solving specific problems
- Advanced customization
- Performance tuning

---

## 🗂️ File Organization

```
/docs/
├── ASSISTANT_UI_COMPONENTS.md    ← Start here (architecture)
├── ASSISTANT_UI_CHEATSHEET.md    ← Keep open (quick ref)
├── ASSISTANT_UI_TYPES.ts         ← For TypeScript
├── ASSISTANT_UI_RECIPES.md       ← For examples
└── README.md                      ← This file (index)

/components/assistant-ui/
├── reasoning.tsx
├── sources.tsx
├── thread-list.tsx
├── threadlist-sidebar.tsx
├── tool-fallback.tsx
├── tool-group.tsx
├── thread.tsx                     ← Uses all above
└── [other UI components]
```

---

## 🚀 Quick Start

### Step 1: Install Components

```bash
shadcn add reasoning sources thread-list tool-fallback tool-group
```

This creates the component files in `/components/assistant-ui/`

### Step 2: Setup Complete Layout

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

### Step 3: Wire Components in Thread

```tsx
// /components/assistant-ui/thread.tsx
import { MessagePrimitive } from "@assistant-ui/react";
import { MarkdownText } from "@/components/assistant-ui/markdown-text";
import { ToolFallback } from "@/components/assistant-ui/tool-fallback";
import { ToolGroup } from "@/components/assistant-ui/tool-group";
import { Reasoning, ReasoningGroup } from "@/components/assistant-ui/reasoning";
import { Sources } from "@/components/assistant-ui/sources";

export function Thread() {
  return (
    <MessagePrimitive.Root>
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
    </MessagePrimitive.Root>
  );
}
```

### Step 4: Test It!

- ✅ Create new threads
- ✅ Switch between threads
- ✅ Watch reasoning collapse/expand
- ✅ Watch tools group and collapse
- ✅ Verify sources show favicons
- ✅ Check responsive behavior

---

## 📦 Component Summary

| Component | Purpose | Key Feature | Status |
|-----------|---------|-------------|--------|
| **Reasoning** | AI thinking/reasoning display | Auto-groups & collapses | ✅ Streaming support |
| **Sources** | URL references with favicons | Loads icons automatically | ✅ Multiple variants |
| **ThreadList** | Switch between conversations | Sidebar or custom layout | ✅ Archive/delete ops |
| **ToolFallback** | Default tool UI | Shows args + results | ✅ Handles all states |
| **ToolGroup** | Groups consecutive tools | Auto-expands when streaming | ✅ Collapsible container |

---

## 🎯 Use Case: Streaming AI Response

Here's how all components work together during a streaming response:

```
User: "What's the weather in NYC?"

┌─────────────────────────────────────────┐
│ AI Response (Streaming)                 │
├─────────────────────────────────────────┤
│ [Text] Working on your request...        │
├─────────────────────────────────────────┤
│ [ReasoningGroup] (auto-expanded)         │
│  • Analyzing the question                │
│  • Planning search query                 │
├─────────────────────────────────────────┤
│ [ToolGroup] (auto-expanded, 1 active)   │
│  • get_weather [RUNNING - shimmer]      │
├─────────────────────────────────────────┤
│ [Text] Weather in NYC:                   │
│ • Temperature: 72°F                      │
│ • Condition: Partly Cloudy              │
├─────────────────────────────────────────┤
│ [Sources]                                │
│  • 📌 weather.com | "Current Weather"   │
│  • 📌 forecast.io | "5-Day Forecast"    │
└─────────────────────────────────────────┘
```

---

## 🔄 Workflow: From Docs to Code

### For New Developers:

1. **Read:** [ASSISTANT_UI_COMPONENTS.md](./ASSISTANT_UI_COMPONENTS.md) (15 min)
   - Understand what each component does
   - See component anatomy
   - Follow quick start

2. **Reference:** [ASSISTANT_UI_CHEATSHEET.md](./ASSISTANT_UI_CHEATSHEET.md) (5 min)
   - Check all props available
   - See common patterns
   - Look up variants

3. **Implement:** [ASSISTANT_UI_RECIPES.md](./ASSISTANT_UI_RECIPES.md) (10 min)
   - Copy a recipe that matches your use case
   - Adapt styling/variants as needed
   - Test streaming states

### For Quick Lookups:

1. **Cheatsheet** for props/variants
2. **Recipes** for code examples
3. **Main Components** for architectural decisions

### For Issue Resolution:

1. Check **Recipes** troubleshooting section
2. Review component anatomy in **Components** guide
3. Reference **Types** for interface requirements

---

## ✨ Key Features Explained

### Auto-Grouping

**Reasoning & ToolGroup** automatically group consecutive parts:

```
Part 0: Reasoning  ─┐
Part 1: Reasoning  ├─→ [ReasoningGroup] (collapsed by default)
Part 2: Reasoning  ─┘

Part 3: ToolCall   ─┐
Part 4: ToolCall   ├─→ [ToolGroup] (collapsed by default)
Part 5: ToolCall   ─┘
```

### Streaming Auto-Expand

When a reason/tool group is **actively** streaming, they auto-expand:

```
Streaming = true  → ReasoningGroup defaultOpen={true}
Streaming = true  → ToolGroup defaultOpen={true}
Streaming = false → Both collapse to default
```

### Variant System

Each component has consistent variants:

```
outline  → Bordered, emphasized
ghost    → No styling, transparent
muted    → Subtle background
```

### Message Parts Pipeline

All these components work with **MessagePrimitive.Parts**:

```
Message Part
    ↓
Part Type Check
    ├→ text      → MarkdownText
    ├→ reasoning → Reasoning + ReasoningGroup
    ├→ tool-call → ToolGroup + ToolFallback
    ├→ source    → Sources
    └→ other     → null/custom
    ↓
Rendered Component
```

---

## 🧪 Testing Checklist

Use this before considering implementation complete:

### Component Tests
- [ ] Reasoning parts auto-collapse/expand
- [ ] Reasoning shows shimmer when streaming
- [ ] Sources load favicons (test with real URLs)
- [ ] Sources fallback to initials correctly
- [ ] ThreadList items are clickable
- [ ] ThreadList shows active thread styling
- [ ] ToolFallback shows args and result
- [ ] ToolGroup auto-groups consecutive tools
- [ ] ToolGroup auto-expands when streaming

### Integration Tests
- [ ] All components render in Message
- [ ] Message flows correctly (text → reasoning → tools → sources)
- [ ] Markdown renders in reasoning
- [ ] Markdown renders in text parts

### Streaming Tests
- [ ] Watch streaming states update
- [ ] See shimmer animations
- [ ] Watch groups collapse when streaming stops
- [ ] Verify no layout shift

### Responsive Tests
- [ ] Mobile sidebar collapses
- [ ] Components still visible on mobile
- [ ] Touch interactions work
- [ ] No horizontal overflow

---

## 🔗 External Resources

### Official Documentation
- **Main Docs:** https://www.assistant-ui.com/docs
- **UI Components:** https://www.assistant-ui.com/docs/ui
- **GitHub:** https://github.com/assistant-ui

### Component-Specific Docs
- **Reasoning:** https://www.assistant-ui.com/docs/ui/reasoning
- **Sources:** https://www.assistant-ui.com/docs/ui/sources
- **ThreadList:** https://www.assistant-ui.com/docs/ui/thread-list
- **ToolFallback:** https://www.assistant-ui.com/docs/ui/tool-fallback
- **ToolGroup:** https://www.assistant-ui.com/docs/ui/tool-group

### Related Libraries
- **@assistant-ui/react** - Main library
- **shadcn/ui** - UI components (used by assistant-ui)
- **Radix UI** - Low-level primitives

---

## 📞 Support & Troubleshooting

### Common Issues (Find solutions in Recipes)

1. **ReasoningGroup not collapsing** → See Issue #1 in Recipes
2. **Sources favicon not loading** → See Issue #2 in Recipes
3. **ToolGroup staying open** → See Issue #3 in Recipes
4. **ThreadList items not clickable** → See Issue #4 in Recipes
5. **ToolFallback args not showing** → See Issue #5 in Recipes
6. **Reasoning text unreadable** → See Issue #6 in Recipes

### Get Help

- Check **ASSISTANT_UI_RECIPES.md** troubleshooting section
- Review **ASSISTANT_UI_COMPONENTS.md** anatomy section
- Verify types in **ASSISTANT_UI_TYPES.ts**
- Look at examples in **ASSISTANT_UI_RECIPES.md**

---

## 🚀 Going Further

### Custom Tool Renderers

Create custom UIs for specific tools:

```tsx
const tools = {
  weather: WeatherToolUI,      // Custom component
  calculator: CalculatorToolUI, // Custom component
  Fallback: ToolFallback,      // Fallback for unknown tools
  Group: ToolGroup,             // Auto-group consecutive
};
```

### Advanced Styling

Use Tailwind variants for different states:

```tsx
<Reasoning.Root
  className="data-[variant=outline]:border-blue-500 data-[open=true]:bg-blue-50"
>
```

### Performance Optimization

- Memoize custom tool components
- Lazy load heavy components
- Virtualize long thread lists

See **ASSISTANT_UI_RECIPES.md** for performance section.

---

## 📝 Notes for Developers

- **Always use `ReasoningGroup`** for auto-grouping reasoning parts
- **Always use `ToolGroup`** for auto-grouping tool calls
- **Always wrap Reasoning content** with `<MarkdownText>`
- **Always test streaming states** - They're critical!
- **Use composable API** when you need custom layouts
- **Control variants consistently** across your app

---

## 🎓 Learning Path

**Beginner:** Components Guide → Cheatsheet → Play with styling  
**Intermediate:** Recipes → Create custom tool UIs → Advanced patterns  
**Advanced:** TypeScript interfaces → State management → Performance optimization

---

**Last Updated:** 2026-04-30  
**Documentation Version:** 1.0  
**Assistant-UI Version:** Latest (compatible with v0.x)

---

## 📋 Quick Navigation

| Need | Go To |
|------|-------|
| What do these components do? | [ASSISTANT_UI_COMPONENTS.md](./ASSISTANT_UI_COMPONENTS.md) |
| What props does X have? | [ASSISTANT_UI_CHEATSHEET.md](./ASSISTANT_UI_CHEATSHEET.md) |
| Show me code examples | [ASSISTANT_UI_RECIPES.md](./ASSISTANT_UI_RECIPES.md) |
| TypeScript types? | [ASSISTANT_UI_TYPES.ts](./ASSISTANT_UI_TYPES.ts) |
| How do I implement? | [ASSISTANT_UI_COMPONENTS.md](./ASSISTANT_UI_COMPONENTS.md) → [ASSISTANT_UI_RECIPES.md](./ASSISTANT_UI_RECIPES.md) |
| I have an error | [ASSISTANT_UI_RECIPES.md](./ASSISTANT_UI_RECIPES.md) Troubleshooting |
