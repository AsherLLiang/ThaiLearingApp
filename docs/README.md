# Thai Learning App Documentation

Welcome to the comprehensive documentation for the Thai Learning App project.

## 📚 Documentation Overview

This folder contains detailed guides covering every aspect of the project. Each document is written at B2 English level for accessibility.

---

## 🗂️ Document Index

### **[PROJECT-SNAPSHOT](./PROJECT-SNAPSHOT.md)** ⭐ FOR AI CODE GENERATION
**Compressed project knowledge for Claude/AI assistants**
- Complete file structure with content summaries
- All types, stores, and component APIs
- Code patterns and conventions
- Design system tokens
- Implementation status and known issues
- **Use this to give Claude full project context without uploading all files!**

**中文版 Chinese Version：[PROJECT-SNAPSHOT-CN.md](./PROJECT-SNAPSHOT-CN.md)** 🇨🇳

**Usage Guide:** [How to Use Snapshot](./HOW-TO-USE-SNAPSHOT.md)
**中文使用指南：[HOW-TO-USE-SNAPSHOT-CN.md](./HOW-TO-USE-SNAPSHOT-CN.md)** 🇨🇳

---

### **[00 - Project Knowledge Base](./00-Project-Knowledge-Base.md)** ⭐ FOR HUMAN DEVELOPERS
**Your central reference for the entire project**
- Complete project overview and status
- Architecture diagrams
- Quick reference guide
- Development workflow
- Known issues and roadmap

**Read this first to understand the big picture!**

---

### **[01 - Expo Router Explained](./01-Expo-Router-Explained.md)**
**Complete guide to Expo Router (file-based routing)**
- What is Expo Router and why use it
- File-based routing patterns
- Layout system (\_layout.tsx)
- Route groups with (parentheses)
- Dynamic routes and parameters
- Navigation methods
- Comparison with React Navigation

**Topics covered:**
- Simple routes, nested routes, dynamic routes
- Stack, Tabs, Drawer navigators
- Modal presentation
- Deep linking

---

### **[02 - Project Routing & Navigation](./02-Project-Routing-Navigation.md)**
**How routing works in THIS specific project**
- Complete route map with visual diagrams
- Authentication flow (login → app redirect)
- Navigation patterns used
- File-by-file route analysis
- User journey examples
- Debugging navigation issues

**Key sections:**
- Root layout auth guard
- Auth group (login/register)
- Tabs group (home/courses/profile)
- Modal routes (review modal)
- Route protection mechanisms

---

### **[03 - File Import & Dependencies](./03-File-Import-Dependencies.md)**
**Import relationships and dependency graph**
- Complete import relationship diagram
- Dependency layers (constants → stores → components → screens)
- File-by-file import analysis
- Path alias (@/) explanation
- External package dependencies
- Circular dependency prevention
- Most connected files

**Visualizes:**
- Which files import which
- Dependency hierarchy
- Import anti-patterns to avoid

---

### **[04 - Parameter Passing Guide](./04-Parameter-Passing-Guide.md)**
**How data flows through the application**
- 3 ways to pass data: Props, Zustand State, URL Params
- Component props with examples
- Zustand state management patterns
- URL parameters (search params, dynamic routes)
- Complete data flow examples (login, review, language change)
- Type safety with TypeScript
- Callback props and render props

**Data flow patterns:**
- Login flow (props → state → navigation)
- Review session flow
- Language change flow

---

### **[05 - Zustand State Management](./05-Zustand-State-Management.md)**
**Complete guide to Zustand in the project**
- What is Zustand and why not Redux
- Core concepts (create, set, get)
- All 3 stores detailed:
  - userStore (authentication)
  - learningStore (progress tracking)
  - languageStore (UI language)
- Persistence with AsyncStorage
- Advanced patterns (selectors, derived state, middleware)
- Zustand vs Redux vs Context API
- Testing stores
- Best practices

**Each store includes:**
- State structure
- Actions explained
- Usage examples
- Real code from the project

---

### **[06 - Frontend Design Philosophy](./06-Frontend-Design-Philosophy.md)**
**Design principles and UI/UX patterns**
- Design principles (cultural authenticity, paper & ink aesthetic)
- Color palette and usage
- Typography system (3 font families)
- Layout patterns (safe areas, spacing, cards)
- Component design patterns
- Glass-morphism and blur effects
- Animation philosophy
- Accessibility considerations
- Responsive design strategy

**Design decisions explained:**
- Why serif fonts?
- Why off-white background?
- Why protruding tab button?
- Component library structure
- Dark mode strategy (future)

---

## 🎯 How to Use This Documentation

### **For New Developers:**
1. Start with **[00 - Project Knowledge Base](./00-Project-Knowledge-Base.md)** for overview
2. Read **[01 - Expo Router Explained](./01-Expo-Router-Explained.md)** to understand routing
3. Study **[05 - Zustand State Management](./05-Zustand-State-Management.md)** for state
4. Reference others as needed

### **For Feature Development:**
1. Check **[02 - Project Routing](./02-Project-Routing-Navigation.md)** for navigation
2. Check **[04 - Parameter Passing](./04-Parameter-Passing-Guide.md)** for data flow
3. Check **[06 - Frontend Design](./06-Frontend-Design-Philosophy.md)** for UI patterns

### **For Debugging:**
1. **[03 - File Import & Dependencies](./03-File-Import-Dependencies.md)** - Find import issues
2. **[02 - Project Routing](./02-Project-Routing-Navigation.md)** - Navigation problems
3. **[05 - Zustand State Management](./05-Zustand-State-Management.md)** - State issues

### **For Design Work:**
1. **[06 - Frontend Design Philosophy](./06-Frontend-Design-Philosophy.md)** - All design decisions
2. Check `src/constants/colors.ts` and `typography.ts` for tokens
3. Reference existing components in `src/components/common/`

---

## 📖 Document Features

### ✅ What Each Document Includes

- **Explanations at B2 English level** - Clear, not overly technical
- **Code examples** - Real code from the project
- **Visual diagrams** - Directory trees, flow charts
- **Comparison tables** - Quick reference
- **Best practices** - Do's and don'ts
- **Troubleshooting tips** - Common issues and solutions

### 🎨 Document Structure

Each document follows this pattern:
1. **Introduction** - What this document covers
2. **Core Concepts** - Fundamentals explained simply
3. **Detailed Examples** - Real code from the project
4. **Patterns & Best Practices** - How to use effectively
5. **Common Issues** - Debugging and troubleshooting
6. **Summary** - Key takeaways

---

## 🔍 Quick Topic Finder

| I want to... | Read this document |
|--------------|-------------------|
| Understand the project | [00 - Knowledge Base](./00-Project-Knowledge-Base.md) |
| Add a new screen | [01 - Expo Router](./01-Expo-Router-Explained.md) |
| Understand navigation | [02 - Project Routing](./02-Project-Routing-Navigation.md) |
| Find what imports what | [03 - File Imports](./03-File-Import-Dependencies.md) |
| Pass data between screens | [04 - Parameter Passing](./04-Parameter-Passing-Guide.md) |
| Add global state | [05 - Zustand](./05-Zustand-State-Management.md) |
| Match the design style | [06 - Design Philosophy](./06-Frontend-Design-Philosophy.md) |

---

## 📝 Document Summaries

### Quick Overview of Each Document

**00 - Knowledge Base** (300+ lines)
- Everything in one place
- Architecture overview
- Current status and roadmap
- Quick reference guide

**01 - Expo Router** (400+ lines)
- Routing fundamentals
- File-based routing explained
- Navigation patterns
- Comparison with traditional routing

**02 - Project Routing** (600+ lines)
- Your app's specific routes
- Authentication flow
- Navigation code explained
- User journey examples

**03 - File Imports** (650+ lines)
- Import relationship graph
- Dependency layers
- Path aliases
- Import best practices

**04 - Parameter Passing** (700+ lines)
- Props, state, URL params
- Data flow examples
- Type safety
- Complete flows (login, review, language)

**05 - Zustand** (750+ lines)
- State management explained
- All 3 stores detailed
- Persistence patterns
- Advanced techniques

**06 - Design Philosophy** (650+ lines)
- Design principles
- Color and typography
- Component patterns
- Accessibility

**Total:** ~4,000 lines of documentation!

---

## 🎓 Learning Path

### Beginner Path (New to React Native/Expo)

**Week 1:** Foundation
- Day 1-2: Read [00 - Knowledge Base](./00-Project-Knowledge-Base.md)
- Day 3-4: Read [01 - Expo Router](./01-Expo-Router-Explained.md)
- Day 5: Explore project structure (`app/` folder)

**Week 2:** State & Data
- Day 1-2: Read [05 - Zustand](./05-Zustand-State-Management.md)
- Day 3-4: Read [04 - Parameter Passing](./04-Parameter-Passing-Guide.md)
- Day 5: Practice: Modify existing screen

**Week 3:** Navigation & Design
- Day 1-2: Read [02 - Project Routing](./02-Project-Routing-Navigation.md)
- Day 3-4: Read [06 - Design Philosophy](./06-Frontend-Design-Philosophy.md)
- Day 5: Practice: Add new screen

### Advanced Path (Experienced Developer)

**Day 1:** Read [00 - Knowledge Base](./00-Project-Knowledge-Base.md) + skim others
**Day 2:** Study stores (`src/stores/`) and reference [05 - Zustand](./05-Zustand-State-Management.md)
**Day 3:** Study routes (`app/`) and reference [02 - Project Routing](./02-Project-Routing-Navigation.md)
**Day 4:** Study components and reference [06 - Design Philosophy](./06-Frontend-Design-Philosophy.md)
**Day 5:** Start contributing!

---

## 💡 Tips for Reading

### Effective Reading Strategies

**1. Don't Read Linearly**
- Start with [00 - Knowledge Base](./00-Project-Knowledge-Base.md)
- Jump to specific sections as needed
- Use Ctrl+F to search within documents

**2. Code + Docs Together**
- Open relevant file while reading docs
- Compare documentation with actual code
- Try modifying code as you learn

**3. Use Documentation Index**
- Each document has table of contents
- Click section links to jump directly
- Return to index when needed

**4. Focus on Examples**
- Code examples show real patterns
- Compare with your use case
- Adapt examples to your needs

---

## 🔄 Keeping Documentation Updated

### When to Update Docs

**Update immediately when:**
- Adding new routes
- Creating new Zustand store
- Changing architecture
- Adding major features

**Update weekly:**
- Project status in Knowledge Base
- Known issues list
- Roadmap progress

**Update monthly:**
- Dependencies and versions
- Code metrics
- Performance benchmarks

---

## 🌟 Documentation Highlights

### Best Sections by Use Case

**"I'm stuck with routing"**
→ [02 - Project Routing](./02-Project-Routing-Navigation.md) - Section "User Journey Examples"

**"How do I share state?"**
→ [05 - Zustand](./05-Zustand-State-Management.md) - Section "How Zustand Works"

**"What colors/fonts to use?"**
→ [06 - Design Philosophy](./06-Frontend-Design-Philosophy.md) - Section "Color Palette" & "Typography"

**"Where does this file get used?"**
→ [03 - File Imports](./03-File-Import-Dependencies.md) - Section "Import Relationship Diagram"

**"How to pass data to a screen?"**
→ [04 - Parameter Passing](./04-Parameter-Passing-Guide.md) - Section "Pattern 3: URL Parameters"

---

## 📞 Feedback & Contributions

### Improving Documentation

Found an error or unclear section?
1. Note the document name and section
2. Describe the issue
3. Suggest improvement (if possible)

Want to add content?
1. Choose relevant document
2. Match existing style (B2 English, examples, diagrams)
3. Add to appropriate section
4. Update this README if adding new document

---

## 🎉 Final Note

This documentation was created to help you:
- ✅ Understand the project quickly
- ✅ Find answers without asking
- ✅ Make consistent decisions
- ✅ Write quality code
- ✅ Onboard new team members

**All 7 documents work together to give you complete project knowledge.**

**Start with the Knowledge Base, then explore as needed. Happy coding! 🚀**

---

**Created:** 2025-11-23
**Language Level:** English B2 (Upper Intermediate)
**Total Pages:** 7 comprehensive guides
**Total Lines:** ~4,000 lines of documentation
