# Architecture Overview

This document provides a high-level architecture diagram of the Angular e-commerce application using Mermaid diagrams.

## Context Diagram

```mermaid
graph LR
    user["End User"] -->|Uses| angularApp["Angular Frontend (SPA)"]
    angularApp -->|HTTP| api["Backend API"]
    angularApp -->|Auth via OAuth/JWT| authServer["Authentication Server"]
``` 

## Container Diagram

```mermaid
graph TD
    subgraph Angular Frontend
        appModule[AppModule]
        coreModule[Core Module]
        featuresModule[Features Modules]
        layoutModule[Layout Module]
        sharedUiModule[Shared UI Module]
    end

    appModule --> coreModule
    appModule --> featuresModule
    appModule --> layoutModule
    appModule --> sharedUiModule
    coreModule -->|HTTP| api["Backend API"]
    coreModule -.->|NgRx state| state["State Store (cart, etc.)"]
```

## Module Relationships

```mermaid
flowchart LR
    subgraph Core
        authService[AuthService]
        cartService[CartService]
        productService[ProductService]
        themeService[ThemeService]
        toastService[ToastService]
        wishlistService[WishlistService]
        recentlyService[RecentlyViewedService]
    end
    subgraph Features
        auth[Login Component]
        cart[Cart Component]
        checkout[Checkout Component]
        home[Home Component]
        products[Product List, Card, Details Components]
        wishlist[Wishlist Component]
    end
    subgraph Shared
        button[Button]
        input[Input]
        loading[Loading Skeleton]
        modal[Modal]
        toast[Toast]
    end
    core --> features
    features --> shared
```

> 🔧 You can preview these diagrams with the Mermaid previewer in VS Code or online tools. Adjust as needed to capture additional details.