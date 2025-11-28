# ThaiLearningApp Project Snapshot V3

## Executive Summary

ThaiLearningApp is a React Native + Expo mobile application for learning Thai, utilizing a modern tech stack and cloud-native architecture.
**Current Version**: 1.0.2
**Date**: 2025-11-28
**Status**: MVP Development (approx. 45% complete)

### Key Changes in V3 (vs V2)
- **Configuration Refactor**:
    - Added `src/config/constants.ts` for centralized application constants (Collections, API Timeouts, Error Messages, Roles, Levels).
    - Removed `src/config/cloudbase.config.ts` (cleanup).
- **Bug Fixes**:
    - Fixed `userStore.ts` reference error (`email` -> `data.email`).
    - Added missing `ResetPasswordResponse` type in `api.types.ts`.
- **Structure Clarification**:
    - `src/config/`: Backend/App configuration.
    - `src/constants/`: UI constants (Colors, Typography).

## Project Overview
- **Tech Stack**: React Native, Expo, TypeScript, Zustand, CloudBase
- **Architecture**: Mobile MVVM + Cloud Functions Backend
- **Deployment**: Tencent CloudBase (Cloud Development)

## Directory Structure (v1.0.2)
```
ThaiLearningApp/
├── app/                    # Expo Router pages
│   ├── (auth)/            # Authentication pages
│   ├── (tabs)/            # Main tab pages
│   └── _layout.tsx        # Root layout
├── src/
│   ├── components/        # Reusable components
│   ├── config/            # App configuration (NEW: constants.ts)
│   ├── constants/         # UI Constants (Colors, Typography)
│   ├── entities/          # Data models & Types
│   ├── hooks/             # Custom React hooks
│   ├── i18n/              # Internationalization
│   ├── services/          # Business services
│   ├── stores/            # State management (Zustand)
│   └── utils/             # Utility functions
├── cloudbase/            # Cloud functions & config
└── assets/               # Static assets
```

## Core Components & State

### Configuration (`src/config/`)
- **`constants.ts`**: Centralized constants for DB collections, timeouts, error messages, user roles, and learning levels.
- **`api.endpoints.ts`**: API endpoint definitions.
- **`backend.config.ts`**: Backend connection settings.

### State Management (`src/stores/`)
- **`userStore.ts`**: Manages user authentication, registration, login, and profile updates. (Recently patched for stability).
- **`learningStore.ts`**: Tracks learning progress and course data.

### Type Definitions (`src/entities/types/`)
- **`api.types.ts`**: API request/response interfaces (Updated with `ResetPasswordResponse`).
- **`entities.ts`**: Core domain entities (User, Course, etc.).

## Development Status

### Completed Modules
- [x] **Authentication System** (100%)
    - Register/Login/Logout
    - Password Reset (Fixed)
    - Token Management
- [x] **Infrastructure** (100%)
    - Project Scaffold
    - Routing (Expo Router)
    - State Management (Zustand)
    - API Client
- [x] **Configuration Management** (100%)
    - Centralized Constants (New in V3)
- [ ] **Learning Features** (10%)
    - Course Listing (In Progress)
    - Study Interface
- [ ] **User Profile** (10%)
    - Basic Display
    - Settings

## Known Issues / TODOs
- **Learning Module**: Course content fetching and rendering needs to be fully implemented.
- **UI Polish**: Some screens need design refinements.
- **Testing**: Unit and E2E tests are pending.

## Environment Setup
```bash
npm install
npm start
```
