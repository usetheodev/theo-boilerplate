# Web Frontend - Vite + React

Modern React SPA built with Vite, TypeScript, Tailwind CSS, and React Router.

## 🚀 Tech Stack

- **Vite 5** - Lightning-fast build tool with HMR
- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Tailwind CSS 3.4** - Utility-first CSS framework
- **React Router 6** - Client-side routing
- **Tanstack Query 5** - Server state management
- **Axios** - HTTP client with interceptors

## 📁 Project Structure

```
src/
├── main.tsx              # Entry point
├── App.tsx               # Root component with routes
├── vite-env.d.ts         # Vite type definitions
├── pages/                # Page components
│   ├── Home.tsx
│   ├── Dashboard.tsx
│   └── auth/
│       ├── Login.tsx
│       ├── Register.tsx
│       └── ForgotPassword.tsx
├── components/           # Reusable components
│   └── ProtectedRoute.tsx
├── hooks/                # Custom React hooks
│   ├── useAuth.ts
│   ├── useLogin.ts
│   └── useRegister.ts
├── lib/                  # Utilities
│   ├── api.ts           # Axios instance + auth API
│   └── utils.ts         # Helper functions
└── styles/
    └── globals.css      # Global Tailwind styles
```

## 🛠️ Development

### Install Dependencies
```bash
pnpm install
```

### Start Dev Server
```bash
pnpm dev
```
- Opens at `http://localhost:3000`
- Hot Module Replacement (HMR) enabled
- API proxy to backend at `http://localhost:3001`

### Build for Production
```bash
pnpm build
```
- Output: `dist/` directory
- Optimized with Rollup
- Assets hashed for cache busting

### Preview Production Build
```bash
pnpm preview
```

### Type Checking
```bash
pnpm type-check
```

### Linting
```bash
pnpm lint        # Check for issues
pnpm lint:fix    # Auto-fix issues
```

## 🔑 Environment Variables

Create `.env` file:

```bash
VITE_API_URL=http://localhost:3001
```

Access in code:
```typescript
import.meta.env.VITE_API_URL
```

## 🎨 Styling

Using **Tailwind CSS** with custom design tokens:

- Dark mode support (class-based)
- Custom color palette via CSS variables
- Responsive utilities
- Component-first approach

### Example
```tsx
<button className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90">
  Click me
</button>
```

## 🔐 Authentication

### Login Flow
1. User enters credentials
2. `useLogin` hook calls `/auth/login`
3. Tokens stored in `localStorage`
4. Axios interceptor adds token to requests
5. Redirect to `/dashboard`

### Protected Routes
```tsx
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  }
/>
```

### Token Refresh
Automatic token refresh via Axios interceptor:
- Intercepts 401 responses
- Calls `/auth/refresh` with refresh token
- Retries original request
- Redirects to login if refresh fails

## 📊 State Management

### Server State (Tanstack Query)
```tsx
const { mutate: login, isPending } = useLogin()

login({ email, password }, {
  onSuccess: (data) => {
    // Tokens stored automatically
    navigate('/dashboard')
  }
})
```

### Client State (Local)
Currently using React hooks (`useState`, `useEffect`).

To add Zustand:
```bash
pnpm add zustand
```

## 🚢 Deployment

### Static Hosting (Vercel, Netlify)
```bash
pnpm build
```
- Output: `dist/`
- SPA mode: All routes serve `index.html`

### Nginx
```nginx
server {
  listen 80;
  root /var/www/dist;

  location / {
    try_files $uri /index.html;
  }
}
```

### Docker
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install
COPY . .
RUN pnpm build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 🧪 Testing (TODO)

Install testing libraries:
```bash
pnpm add -D vitest @testing-library/react @testing-library/jest-dom
```

Add to `package.json`:
```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui"
  }
}
```

## 📝 Available Routes

| Path | Component | Protected | Description |
|------|-----------|-----------|-------------|
| `/` | Home | No | Landing page |
| `/login` | Login | No | Login form |
| `/register` | Register | No | Registration form |
| `/forgot-password` | ForgotPassword | No | Password reset |
| `/dashboard` | Dashboard | Yes | User dashboard |

## 🔗 API Integration

Backend API: `http://localhost:3001`

### Endpoints Used
- `POST /auth/login` - Login
- `POST /auth/register` - Register
- `POST /auth/refresh` - Refresh token
- `GET /auth/me` - Get current user
- `POST /auth/forgot-password` - Request password reset

## 🎯 Next Steps

- [ ] Add form validation with Zod
- [ ] Implement toast notifications
- [ ] Add loading skeletons
- [ ] Setup shadcn/ui components
- [ ] Add dark mode toggle
- [ ] Implement OAuth buttons
- [ ] Add user profile page
- [ ] Setup E2E tests with Playwright

## 🐛 Common Issues

### Port 3000 already in use
```bash
# Change port in vite.config.ts
server: {
  port: 3001
}
```

### API calls fail
- Ensure backend is running on port 3001
- Check `VITE_API_URL` in `.env`
- Check CORS settings in backend

### Build fails
```bash
rm -rf node_modules dist
pnpm install
pnpm build
```

---

**Built with ⚡ Vite + React**
