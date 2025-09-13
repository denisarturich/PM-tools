# Project Manager Prompts Reference - Design Guidelines

## Design Approach: Design System (Utility-Focused)
**Selected System:** Material Design with custom adaptations
**Justification:** This is a productivity tool for project managers requiring efficient navigation, clear information hierarchy, and professional presentation of structured content.

## Core Design Elements

### A. Color Palette
**Light Mode:**
- Primary: 219 69% 35% (Deep blue)
- Secondary: 219 50% 95% (Very light blue-gray)
- Background: 0 0% 98% (Near white)
- Surface: 0 0% 100% (Pure white)
- Text Primary: 219 20% 15% (Dark blue-gray)
- Text Secondary: 219 15% 45% (Medium blue-gray)

**Dark Mode:**
- Primary: 219 75% 65% (Bright blue)
- Secondary: 219 30% 15% (Dark blue-gray)
- Background: 219 25% 8% (Very dark blue)
- Surface: 219 20% 12% (Dark blue surface)
- Text Primary: 219 15% 90% (Light blue-gray)
- Text Secondary: 219 10% 70% (Medium light blue-gray)

### B. Typography
- **Primary Font:** Inter (Google Fonts)
- **Monospace:** JetBrains Mono (for code/prompts)
- **Hierarchy:** 
  - Headings: 600 weight, larger sizes
  - Body: 400 weight, comfortable reading size
  - Code snippets: Monospace, slightly smaller

### C. Layout System
**Tailwind Spacing Units:** Consistent use of 2, 4, 6, 8, 12, 16, 24
- Micro spacing: p-2, m-2
- Component spacing: p-4, gap-4
- Section spacing: p-6, mb-8
- Page margins: p-8, max-w-6xl

### D. Component Library

**Navigation:**
- Top navigation bar with search functionality
- Sidebar with categorized prompt library
- Breadcrumb navigation for deep content

**Content Display:**
- Card-based layout for prompt categories
- Clean tables for prompt listings with sorting
- Modal overlays for prompt details and editing
- Tabbed interface for different prompt views

**Forms:**
- Consistent input styling with proper focus states
- Clear form validation and error states
- Action buttons with primary/secondary hierarchy

**Data Management:**
- Search and filter components
- Pagination for large datasets
- Export functionality with clear visual feedback

### E. Animations
Minimal, purposeful animations only:
- Subtle hover states on interactive elements
- Smooth transitions for modal/drawer opening
- Loading states for data fetching

## Key Design Principles

1. **Clarity First:** Information hierarchy prioritizes prompt content and usability
2. **Professional Aesthetic:** Clean, business-appropriate styling suitable for workplace use
3. **Efficient Navigation:** Quick access to frequently used prompts and categories
4. **Consistent Patterns:** Standardized component usage across all views
5. **Content-Focused:** Design elements support rather than compete with prompt content

## Images
**No large hero images required.** This is a utility application focused on content delivery.
- Small category icons (24x24px) for prompt categories
- User avatar placeholders in navigation
- Simple illustrations for empty states only

The design emphasizes functionality and professional presentation over visual flourishes, ensuring project managers can efficiently access and manage their prompt library.