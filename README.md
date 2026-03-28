# Angular 16 E-commerce Frontend

This repository contains a standalone Angular 16 e-commerce frontend that uses PrimeNG for UI styling and NgRx for cart/product state.

## Features
- Product catalogue with list/detail views, loading skeletons, and retry handling.
- Cart management backed by NgRx with local storage hydration plus HTTP sync hooks for a backend at `environment.apiUrl`.
- Checkout view protected by `authGuard`, with login/register flows wired to REST endpoints.
- Wishlist powered by Angular signals and persisted to `localStorage`.
- Shared UI elements (buttons, inputs, modals, skeletons, toast notifications) and a simple theme toggle.

## Architecture
- Bootstrapped via `bootstrapApplication` with providers defined in `src/app/app.config.ts` (router, HTTP interceptors, NgRx store/effects, devtools).
- `LayoutComponent` hosts header/footer and lazy-loaded routes for home, products, cart, checkout, wishlist, and auth.
- Store slices: `products` (fetched through `ProductEffects`) and `cart` (reducers/selectors used across the cart/checkout UI).
- Services call REST endpoints under `environment.apiUrl`; wishlist and recently viewed items rely on signals and `localStorage`.

## Getting Started

### Prerequisites
- **Node.js**: Version 18+ (required for Angular 16)
- **Angular CLI**: Version 16+ (optional, but recommended for development)
- **Git**: For version control and collaboration

### Installation
1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/frontend.git
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment configuration:**
   - Copy `src/environments/environment.ts.example` to `src/environments/environment.ts`
   - Configure your API endpoints and feature flags

4. **Run the development server:**
   ```bash
   npm start
   ```
   Open `http://localhost:4200` in your browser.

5. **Build for production:**
   ```bash
   npm run build
   ```
   Outputs to `dist/frontend`.

### Development Workflow
- **Code formatting**: The project uses Prettier for consistent code formatting
- **Linting**: ESLint is configured to enforce code quality standards
- **Type checking**: TypeScript strict mode is enabled for better type safety
- **Hot reload**: Development server supports live reloading for faster iteration

## Configuration

### Environment Variables
- **API base URL**: Configure in `src/environments/environment.ts` (default: `http://localhost:8080/api`)
- **Feature flags**: Control experimental features via `featureFlags` object
- **Development vs Production**: Separate environment files for different deployment stages

### Styling and Theming
- **Global styling**: Defined in `src/styles.scss` with CSS custom properties
- **PrimeNG overrides**: Located in `src/styles/primeng-overrides.scss`
- **Theme switching**: Light/dark theme support with CSS-in-JS implementation
- **Design tokens**: Color palette and typography defined in `src/styles/_color-palette.scss`

### State Management
- **NgRx Store**: Cart and product state managed via NgRx with effects
- **Local storage**: Cart state persisted to localStorage with automatic hydration
- **Signals**: Wishlist and recently viewed items use Angular 16+ signals
- **State selectors**: Reusable selectors in `src/app/core/state/` for component consumption

## Testing

### Test Setup
The project is configured with Karma + Jasmine for unit testing:
- **Test runner**: Karma with Chrome headless browser
- **Framework**: Jasmine for test syntax and assertions
- **Coverage**: Istanbul for code coverage reporting
- **Configuration**: `tsconfig.spec.json` for test-specific TypeScript settings

### Writing Tests
Create test files alongside your components/services with the `.spec.ts` extension:

```typescript
// Example: src/app/core/services/cart.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CartService } from './cart.service';

describe('CartService', () => {
  let service: CartService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CartService]
    });
    service = TestBed.inject(CartService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add item to cart', () => {
    const mockProduct = { id: 1, title: 'Test Product', price: 100 };
    
    service.addToCart(mockProduct, 1);
    
    const cartState = service.cartState$.value;
    expect(cartState.items).toContain(jasmine.objectContaining({
      product: mockProduct,
      quantity: 1
    }));
  });
});
```

### Running Tests
```bash
# Run all tests once
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --code-coverage

# Run specific test file
npm test -- --include="**/cart.service.spec.ts"
```

### Test Structure
- **Unit tests**: Test individual components, services, and utilities
- **Integration tests**: Test component interactions and state management
- **Mock services**: Use Angular's testing utilities for HTTP and dependency injection
- **Test data**: Create mock data in `src/app/core/models/` for consistent testing

## Contributing

### Development Guidelines
1. **Code Style**: Follow the existing code style and use the provided ESLint/Prettier configuration
2. **Component Architecture**: Use standalone components where possible for better tree-shaking
3. **State Management**: Prefer NgRx for complex state, signals for simple reactive state
4. **Error Handling**: Implement proper error handling in services and user-facing components
5. **Accessibility**: Ensure all interactive elements are keyboard accessible and have proper ARIA labels

### Git Workflow
1. **Branch naming**: Use descriptive branch names (e.g., `feature/cart-improvements`, `fix/login-bug`)
2. **Commit messages**: Write clear, descriptive commit messages
3. **Pull requests**: Create PRs for all changes, include:
   - Description of changes
   - Screenshots for UI changes
   - Testing instructions
   - Related issue numbers (if applicable)

### Code Review Process
- All changes require at least one approval from a maintainer
- Tests must pass before merging
- Code should follow TypeScript strict mode and linting rules
- Documentation should be updated for significant changes

### Adding New Features
1. **Create an issue**: Describe the feature and get community feedback
2. **Design discussion**: Discuss architecture and implementation approach
3. **Implementation**: Follow the established patterns in the codebase
4. **Testing**: Add appropriate unit and integration tests
5. **Documentation**: Update README and any relevant documentation

### Bug Reports
When reporting bugs, please include:
- **Environment details**: Node.js version, browser, OS
- **Steps to reproduce**: Clear, step-by-step instructions
- **Expected behavior**: What should happen
- **Actual behavior**: What actually happens
- **Error messages**: Any console errors or stack traces
- **Screenshots**: Visual representation of the issue

## Project Structure

```
src/
├── app/
│   ├── app.component.ts          # Root component
│   ├── app.config.ts            # Application providers and configuration
│   ├── app.routes.ts            # Route definitions
│   ├── core/                    # Core services, models, and state
│   │   ├── services/            # HTTP services and business logic
│   │   ├── models/              # TypeScript interfaces and types
│   │   ├── state/               # NgRx store, reducers, and effects
│   │   └── guards/              # Route guards and interceptors
│   ├── features/                # Feature modules (lazy-loaded)
│   │   ├── products/            # Product catalog functionality
│   │   ├── cart/                # Shopping cart management
│   │   ├── checkout/            # Order completion flow
│   │   ├── auth/                # Authentication and authorization
│   │   └── wishlist/            # Wishlist management
│   ├── layout/                  # Layout components (header, footer)
│   └── shared/                  # Shared components and utilities
│       ├── ui/                  # Reusable UI components
│       └── components/          # Shared business components
├── assets/                      # Static assets (images, fonts)
├── environments/                # Environment-specific configurations
└── styles/                      # Global styles and theme definitions
```

## API Integration

### Backend Requirements
The frontend expects a REST API with the following endpoints:
- `GET /api/products` - Product catalog
- `GET /api/products/:id` - Individual product details
- `POST /api/auth/login` - User authentication
- `POST /api/auth/register` - User registration
- `GET /api/cart` - User's shopping cart
- `POST /api/orders` - Order creation

### Java Spring Boot Backend
This frontend is designed to work seamlessly with the [Java Spring Boot E-commerce Backend API](https://github.com/ahsan-shahbaz/Java-SpringBoot-Ecom). The backend provides:

- **Complete REST API** with all required endpoints
- **JWT Authentication** for secure user management
- **Database Integration** with Microsoft SQL Server
- **Comprehensive Documentation** including API specifications
- **Development Environment** setup with Docker support
- **Testing Framework** with unit and integration tests

### Quick Start with Backend
1. **Clone the backend repository:**
   ```bash
   git clone https://github.com/ahsan-shahbaz/Java-SpringBoot-Ecom.git
   ```

2. **Set up the backend:**
   - Follow the [Backend Development Guide](https://github.com/ahsan-shahbaz/Java-SpringBoot-Ecom/blob/main/DEVELOPMENT.md)
   - Configure database connection in `application.yml`
   - Start the backend server on `http://localhost:8080`

3. **Configure frontend:**
   - Update `src/environments/environment.ts`:
   ```typescript
   export const environment = {
     production: false,
     apiUrl: 'http://localhost:8080/api'
   };
   ```

4. **Start both applications:**
   ```bash
   # Backend
   cd Java-SpringBoot-Ecom
   mvn spring-boot:run
   
   # Frontend
   cd Angular-Frontend-Ecom
   npm start
   ```

### Mock Data
For development without a backend, the project includes mock data in the services. To use a real backend:
1. Update `environment.apiUrl` in your environment files
2. Implement the required API endpoints
3. Adjust service methods as needed for your API structure

## Performance Optimization

### Best Practices
- **Lazy loading**: All feature modules are lazy-loaded for optimal bundle size
- **Image optimization**: Use responsive images and consider implementing image lazy loading
- **State management**: Use NgRx selectors for efficient state access
- **Change detection**: Leverage `OnPush` change detection strategy where appropriate
- **Bundle analysis**: Use `npm run build -- --stats-json` and analyze with webpack-bundle-analyzer

### Development Tools
- **Angular DevTools**: Browser extension for debugging Angular applications
- **Redux DevTools**: For debugging NgRx state changes
- **Performance monitoring**: Built-in Angular performance monitoring

## Deployment

### Build Configuration
The project supports multiple build configurations:
- **Development**: Optimized for development with source maps and debugging
- **Production**: Minified and optimized for performance

### Deployment Options
- **Static hosting**: The built files can be hosted on any static file server
- **Docker**: Containerize the application for consistent deployment
- **CI/CD**: Configure automated builds and deployments

For detailed deployment instructions, see [deployment.md](./deployment.md).

## Support and Community

### Getting Help
- **Issues**: Use GitHub Issues for bug reports and feature requests
- **Discussions**: Join discussions for questions and community support
- **Documentation**: Check this README and inline code comments

### Contributing
We welcome contributions! Please read our [contribution guidelines](#contributing) above and:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for your changes
5. Submit a pull request

## License
[Specify your license here]

## Contact
For questions and support, please open an issue or contact the maintainers.

---

**Note**: This project is a demonstration of modern Angular development practices and e-commerce frontend architecture. It's designed to be educational and production-ready.
