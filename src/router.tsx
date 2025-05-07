import { createRootRoute, createRoute, createRouter } from '@tanstack/react-router'
import { InventoryPage } from './features/inventory/InventoryPage'
import { SalesPage } from './features/sales/SalesPage'
import App from './App'
import React from 'react'
import { LoginPage } from './auth/LoginPage'
import { SignUpPage } from './auth/SignUpPage'
import { AuthProvider } from './auth/AuthProvider'
import { ProtectedRoute } from './auth/ProtectedRoute'
import { CustomersPage } from './features/customers/CustomersPage'
import { ReportsPage } from './features/reports/ReportsPage'
import { EmployeesPage } from './features/employees/EmployeesPage'

export const rootRoute = createRootRoute({
  component: () => (
    <AuthProvider>
      <App />
    </AuthProvider>
  ),
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: function Index() {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">Total Sales</h2>
            <p className="text-3xl font-bold">$12,345</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">Inventory Items</h2>
            <p className="text-3xl font-bold">87</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">Active Customers</h2>
            <p className="text-3xl font-bold">42</p>
          </div>
        </div>
      </div>
    )
  },
})

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
})

const signUpRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/signup',
  component: SignUpPage,
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

const reportsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/reports',
  component: () => (
    <ProtectedRoute>
      <ReportsPage />
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

export const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  signUpRoute,
  inventoryRoute,
  salesRoute,
  customersRoute,
  reportsRoute,
  employeesRoute
])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
