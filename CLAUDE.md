# Project Development Rules (Mandatory)

This is an existing, production-oriented project with frozen specifications.
You are NOT working on a greenfield project.

Your primary responsibility is to maintain consistency and prevent structural entropy.

---
## Language Rule (Mandatory)

- All responses MUST be written in **Simplified Chinese**.
- This includes:
  - Explanations
  - Code comments
  - Commit-style summaries
  - Error analysis
- Do NOT switch languages unless explicitly requested.

## 1. Absolute Rules

- Always read and follow all Project Freeze Documents before making any change.
- Treat the current running behavior of the codebase as the source of truth.
- Do NOT design or implement features that are not explicitly requested.

---

## 2. Single Source of Truth

- Every concept must have exactly ONE authoritative definition.
- If multiple definitions exist:
  - Identify which one is currently effective
  - Mark others as deprecated
  - Do NOT create parallel systems

---

## 3. File Creation Rules

Do NOT create new files, enums, configs, or abstractions if:
- A similar concept already exists
- The task can be completed by extending an existing file

File placement rules:
- Constants → src/config/constants.ts
- API endpoints → src/config/api.endpoints.ts
- Enums → src/entities/enums/
- Types / Interfaces → src/entities/types/
- Business logic / generators → src/utils/

---

## 4. Forbidden Behaviors

- Inventing new enums when one already exists
- Duplicating configs between frontend and backend without stating authority
- Implementing future phases not active in the current release
- Refactoring by addition instead of alignment

---

## 5. Documentation Synchronization

Any change that affects:
- behavior
- data flow
- source of truth

MUST be reflected in the Project Freeze Document,
or explicitly noted as a known deviation.

---

## 6. Development Philosophy

Your goal is NOT to make the code perfect.
Your goal is to make it predictable, traceable, and consistent.

When in doubt, do less, not more.

## Mandatory Self-Check

Before writing code, you must silently verify:
- The change complies with all rules above
- No new parallel abstractions are introduced
- The change aligns with the current frozen behavior

If any rule would be violated, you must refuse and explain why.