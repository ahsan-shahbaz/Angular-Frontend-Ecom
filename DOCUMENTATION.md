# Angular E-commerce Frontend Documentation

This document provides a comprehensive overview of the Angular-based frontend application. It covers architectural decisions, module features, components, services, utilities, and instructions for development and deployment. This manual is intended to guide new contributors or users through the entire codebase.

---

## 📦 Project Overview

- **Framework:** Angular 16.2.16
- **Styling / UI Library:** PrimeNG (latest stable) for rich UI components, along with `styles.css` / `styles.scss`.
- **Language:** TypeScript
- **Purpose:** A user management demo within an e-commerce context, showcasing CRUD operations, form validation, state management, and modular architecture.

The application currently implements a single `User` module with mocked backend data via `MockDataService`. It can be extended to integrate real APIs, authentication, and additional domains.

---

## 🗂 Workspace Structure

```
angular.json
package.json
README.md
DOCUMENTATION.md   <- this file
src/
  main.ts
  index.html
  styles.css / styles.scss
  app/
    app.module.ts
    app-routing.module.ts
    app.component.*
    user/
      user.module.ts
      user-routing.module.ts
      components/
        user-list/...
        user-register/...
        shared/user-modal/...
      services/
        user.service.ts
        mock-data.service.ts
      models/           (domain & API types)
      constants/        (validation, messages, pagination, etc.)
      pipes/            (userFullName, userStatus)
      store/            (simple state store)
      guards/           (access guard stub)
      utils/            (transforms, filters, helpers)
      index.ts          (barrel export)
  assets/
  environments/
```

---

## 🔌 Application Bootstrap

- `src/main.ts` bootstraps `AppModule`.
- `AppModule` imports core Angular modules plus `AppRoutingModule` and provides `MessageService` (PrimeNG) globally.
- Initial route (`''`) redirects to `/users` which lazily loads `UserModule`.

---

## 🧱 Modules & Routing

### `AppModule` & `AppRoutingModule`
- Root module.
- Defines redirect to `'users'` and lazy-loads `UserModule`.

### `UserModule` & `UserRoutingModule`
- Feature module containing all user-management logic.
- Declares page components (`UserListComponent`, `UserRegistrationFormComponent`), a shared modal component, and two custom pipes.
- Imports reactive forms and a wide array of PrimeNG modules for UI controls (table, dialog, buttons, etc.).
- Routing config displays `UserListComponent` on the base path.

---

## 🧩 Components

### `UserListComponent`
- Displays users in a PrimeNG table with search, pagination, and row-action menu (view/edit/delete).
- Handles selection, loading state, and communicates with `UserService`.
- Uses `MessageService` and `ConfirmationService` for feedback dialogs.
- Opens registration form for create/edit operations.

### `UserRegistrationFormComponent`
- Reactive form supporting personal, contact, location, and preferences panels.
- Validates fields (required, patterns, min lengths, terms checkbox, etc.).
- Dynamically loads states based on selected country.
- Emits `saved` event after successful create/update and toggles visibility.

### `UserModalComponent`
- Generic wrapper around PrimeNG `<p-dialog>`.
- Configurable header, size, draggability, footer.
- Used by list and form components for consistent modal behavior.

---

## 🧠 Services

### `UserService`
- Primary API abstraction for user operations.
- Methods: `getUsers`, `getUserById`, `createUser`, `updateUser`, `deleteUser`, plus helpers for countries, states, genders, subscriptions.
- Converts between domain models and API request/response formats using helpers from `user.utils`.
- Uses RxJS operators to deal with observables and error handling.

### `MockDataService`
- Simulates backend responses with in-memory arrays and artificial delays (`delay()` operator).
- Provides CRUD operations and lists of countries, states, and subscription options.
- Used exclusively in development/demo scenarios; replace with real HTTP calls as needed.

---

## 📁 Models (TypeScript Interfaces)

- **Domain models** (`models/user.model.ts`) used throughout the UI.
- **API models** (`models/api-response.model.ts`) reflect backend contracts.
- Utility types such as `SelectOption`, `Gender`, pagination metadata, filter params.
- Barrel exports facilitate easy imports (`import { User } from './user';`).

---

## 🛠 Utilities & Helpers

- `transformUserApiToDomain` / `userToTableRow` convert between API and UI formats and add computed fields.
- Gender mapping functions (`mapGenderBiDirectional`) keep domain/API representations in sync.
- Generic filters, sorters, age calculation, date formatting, permission helpers.
- These are reusable across components and services.

---

## 🧷 Constants

- **Validation rules** (`USER_VALIDATION`): regex patterns, length limits, defaults for forms.
- **Messages** (`USER_MESSAGES`): centralized strings for success, error, validation, and confirmations.
- **Pagination** defaults and options.
- **Genders** and status labels.

Keeping messages and rules in constants reduces duplication and eases localization/enhancement.

---

## 🔁 State Management

- `UserStore` uses a `BehaviorSubject` as a simple client-side store.
- Exposes `users$` observable and methods for CRUD operations and filters.
- Current implementation is unused in components (e.g. list fetches directly from service) but prepared for future expansion (e.g. caching, optimistic updates).

---

## 🔐 Guards

- `UserAccessGuard` protects routes by checking authentication/roles.
- Currently stubbed to always return `true`; placeholders included for real auth integration.

---

## 🚀 Development & Build

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Serve locally:**
   ```bash
   ng serve
   # Or use the provided VS Code task (npm: start)
   ```
   Navigate to `http://localhost:4200`.

3. **Build for production:**
   ```bash
   ng build --prod
   ```
   Output goes to `dist/`.

4. **Testing:**
   - Unit tests: `ng test` (Karma + Jasmine).
   - E2E: configure a testing framework (`ng e2e`).

---

## ✅ Running Tasks in VS Code

Use the `npm: start` or `npm: test` tasks defined in the workspace tasks list. They launch the dev server or tests respectively.

---

## 🧪 Example Data Flow (Create User)

1. User clicks "New User" in `UserListComponent`.
2. `showRegistrationForm` toggled; `UserRegistrationFormComponent` opens.
3. Form collects input; on save:
   - Validates fields; shows error toast if invalid.
   - Constructs request payload and calls `UserService.createUser()`.
   - `UserService` transforms data and delegates to `MockDataService`.
   - Mock API returns new user; service converts to domain model and emits via observable.
   - Component receives the saved user, triggers success toast, reloads list.

---

## 🛠 Extending the Application

- **Replace mock API:** swap `MockDataService` with an `HttpClient` implementation.
- **Add authentication:** integrate with real auth service; update guard.
- **Pagination & filtering:** enhance `UserListComponent` with server-side paging.
- **Additional domains:** replicate module structure for products, orders, etc.
- **State usage:** tie `UserStore` into service and components to centralize data.

---

## 📚 Coding Guidelines & Notes

- Follow Angular style guide (official) for naming, folder layout, and architecture.
- Use standalone declarations sparingly; this project mostly registers components in modules.
- Keep API transformation logic in utilities to keep services thin.
- Centralize constants/messages for maintainability.
- Write unit tests for services, utils, and pipes (not yet implemented in this repo).

---

## 📦 Dependencies (partial list from `package.json`)

- `@angular/*` (core framework)
- `primeng` & `primeicons` (UI)
- `rxjs` (reactive programming)
- `typescript`, `karma`, etc.

Review `package.json` for exact versions and dev dependencies.

---

## 📄 Additional Resources

- [Angular CLI Reference](https://angular.io/cli)
- [PrimeNG Documentation](https://primefaces.org/primeng)
- [Angular Style Guide](https://angular.io/guide/styleguide)

---

> **Note:** This documentation captures the current state of the frontend as of **February 28 2026**. Keep it updated when architectural changes are made.

---

*End of documentation.*
