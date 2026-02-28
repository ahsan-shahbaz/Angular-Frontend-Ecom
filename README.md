# Angular 16 Enterprise eCommerce POC

Welcome to the **Angular 16 Senior Architect eCommerce POC**. This is a portfolio-ready, fully functional frontend proof of concept built to demonstrate enterprise-level frontend standards.

## 🚀 Project Overview

This eCommerce application implements a modern shopping experience including product browsing, filtering, cart management, and checkout simulation. 
Built completely with **Angular 16 Standalone Components**, the app relies on strictly typed mock data and `rxjs` to simulate network latency, reflecting real-world asynchronous API behavior.

## 🏗 Advanced Architecture Explanation

This project relies on **Clean Architecture**, **Feature-Sliced Design**, and the latest **Angular 16+ Paradigms**.

1. **Standalone Components**: The application is entirely free of `NgModules`. Routing, lazy loading, and component dependencies are managed entirely at the component and sparse route level.
2. **NgRx State Management**: The entire Shopping Cart domain is handled via a **Redux paradigm** utilizing `@ngrx/store` and `@ngrx/effects`. The state is immutable, heavily strictly typed, and continuously syncs to `localStorage` transparently via side-effect handling, entirely off the main thread UI.
3. **Angular Signals Interoperability**: Bridging the gap between RxJS and the new reactivity model, the UI consumes state via **Signals** (`toSignal` from `@angular/core/rxjs-interop`). This allows the `ChangeDetectionStrategy.OnPush` mechanism to surgically update only what changed in the template.
4. **RxJS Edge Caching (`shareReplay`)**: HTTP Service mock calls implement an intelligent API cache layer directly inside the RxJS pipeline utilizing `shareReplay(1)` & `catchError()`. This prevents redundant concurrent network requests when rendering heavy views simultaneously.
5. **Token-Based Theming Architecture**: The application employs a sophisticated global CSS custom variable (Token) system decoupled into generic Palettes (`blue-500`, `slate-900`). These tokens override **PrimeNG 16** core variables seamlessly at run-time, offering a pristine, flicker-free Light/Dark mode without CSS duplication.
6. **Web Security (XSS Protection)**: Employs Angular's `DomSanitizer` to dynamically scrub and bypass trusted HTML strings retrieved from the mock API before binding them to `[innerHTML]`, preventing Cross-Site Scripting vulnerabilities.

## 📁 Folder Structure

The project implements a massively scalable folder structure under `src/app/`:

```
src/app
 ├── core/          
 │   ├── state/     # NgRx Actions, Reducers, Effects, and Selectors
 │   ├── models/    # Strictly typed domain entities
 │   └── services/  # Singletons (API integration, Auth, Theming)
 ├── shared/        # Highly reusable UI components (Decoupled Buttons, Inputs, Skeletons)
 ├── features/      # Domain-specific modules (Products, Cart, Checkout, Auth) - Lazy Loaded
 ├── layout/        # App shell components (Header, Footer)
 └── app.config.ts  # Centralized app configuration (Store, Effects, Router, Providers)
```

## 🏃‍♂️ How to Run the Project

1. Ensure **Node.js** (v18+) and **Angular CLI** (v16+) are installed.
2. Clone the repository and navigate to the frontend directory: `cd frontend`
3. Install dependencies: `npm install`
4. Run the development server: `npm run start` or `ng serve`
5. Navigate to `http://localhost:4200/`

**Mock Login Data**: Use `test@test.com` and `password` to test protected routes.

## 🔌 Environment Flags & Connecting to a Real Backend

The application uses **Environment-Based Feature Flags** (`environments/environment.ts`):
- To map to a real API, change the `apiUrl` flag from the local mock port to your production endpoint.
- Switch `enableWishlist` or `newCheckoutFlow` booleans to dynamically inject component features globally.

To swap the Mock API for real HTTP calls:
1. Inside `core/services/product.service.ts`, simply replace the `of(mockData)` simulation with `this.http.get<Product[]>(`${environment.apiUrl}/products`)`. 
2. The `auth.interceptor.ts` is already wired up globally. Once real JWT tokens are persisted during login, the interceptor will automatically attach them as `Bearer` tokens to outbound requests securely.

## 🗣 Senior Leadership Interview Talking Points

- **Performance**: Highlighting the global use of `OnPush` change detection coupled with **Signals** and route-based `lazy loading` boundaries.
- **State Management**: Defending the use of **NgRx** over standard BehaviorSubjects by demonstrating the separation of Reducers from side-effects (`@ngrx/effects`), acting as an API facade through `cart.service.ts`.
- **Security & Optimization**: Mentioning the usage of `shareReplay(1)` stream caching to reduce server loads, and `DomSanitizer` usage for dynamic CMS content injection.
- **Design Systems**: Elaborating on the token-driven design overrides (`theme.scss`), proving you can consume an enterprise library like PrimeNG while keeping the exact corporate branding identity intact.

## 📈 Scalability Explanation

As the application grows:
- **Features folder** allows different teams to own specific domains (e.g., checkout vs products) with zero tight-coupling.
- The **Shared UI** module acts as an internal Design System, meaning we don't duplicate arbitrary HTML/CSS across views.
- **NgRx Selectors** allow disparate parts of the massive DOM to subscribe to tiny slivers of data without causing cascading re-renders across parent components.
