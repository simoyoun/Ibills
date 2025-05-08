import { createRootRoute, createRoute, createRouter } from '@tanstack/react-router'
import { InventoryPage } from './features/inventory/InventoryPage'
import { SalesPage } from './features/sales/SalesPage'
import { CustomersPage } from './features/customers/CustomersPage'
import { EmployeesPage } from './features/employees/EmployeesPage'
import { ReportsPage } from './features/reports/ReportsPage'
import App from './App'
import React from 'react'
import { LoginPage } from './auth/LoginPage'
import { SignUpPage } from './auth/SignUpPage'
import { ForgotPasswordPage } from './auth/ForgotPasswordPage'
import { ProtectedRoute } from './auth/ProtectedRoute'

const IndexComponent = () => (
  <div className="p-6">
    Dashboard coming soon
  </div>
)

export const rootRoute = createRootRoute({
  component: App,
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => (
    <ProtectedRoute>
      <IndexComponent />
    </ProtectedRoute>
  ),
})

const inventoryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/inventory',
  component: () => (
    <ProtectedRoute>
      <InventoryPage />
    </ProtectedRoute>
  ),
})

const salesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/sales',
  component: () => (
    <ProtectedRoute>
      <SalesPage />
    </ProtectedRoute>
  ),
})

const customersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/customers',
  component: () => (
    <ProtectedRoute>
      <CustomersPage />
    </ProtectedRoute>
  ),
})

const employeesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/employees',
  component: () => (
    <ProtectedRoute>
      <EmployeesPage />
    </ProtectedRoute>
  ),
})

const reportsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/reports',
  component: () => (
    <ProtectedRoute>
      <ReportsPage />
    </ProtectedRoute>
  ),
})

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
})

const signupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/signup',
  component: SignUpPage,
})

const forgotPasswordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/forgot-password',
  component: ForgotPasswordPage,
})

export const routeTree = rootRoute.addChildren([
  indexRoute,
  inventoryRoute,
  salesRoute,
  customersRoute,
  employeesRoute,
  reportsRoute,
  loginRoute,
  signupRoute,
  forgotPasswordRoute,
])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
