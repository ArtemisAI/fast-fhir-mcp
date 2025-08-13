// Test utilities for common testing patterns
// Note: This file requires test dependencies to be installed first

// Helper function to create mock form data
export const createMockFormData = (data: Record<string, any>): FormData => {
  const formData = new FormData()
  
  Object.entries(data).forEach(([key, value]) => {
    if (value instanceof File) {
      formData.append(key, value)
    } else if (value !== undefined && value !== null) {
      formData.append(key, value.toString())
    }
  })
  
  return formData
}

// Helper function to wait for async operations
export const waitForAsync = (ms: number = 0): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms))

// Helper function to mock API responses
export const mockApiResponse = <T,>(data: T, delay: number = 0): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay)
  })
}

// Helper function to mock API errors
export const mockApiError = (message: string, delay: number = 0): Promise<never> => {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error(message)), delay)
  })
}

// Helper function to create mock search params
export const createMockSearchParams = (params: Record<string, string>): URLSearchParams => {
  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    searchParams.set(key, value)
  })
  return searchParams
}

// Type definitions that will be available when testing libraries are installed
export type MockUserEvent = {
  type: (element: HTMLElement, text: string) => Promise<void>
  click: (element: HTMLElement) => Promise<void>
  selectOption: (element: HTMLElement, option: string) => Promise<void>
  upload: (element: HTMLElement, file: File) => Promise<void>
}

// When testing libraries are installed, this can be uncommented:
/*
import { render, RenderOptions, screen, findByText } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ReactElement, ReactNode } from 'react'
import { ThemeProvider } from 'next-themes'

const AllTheProviders = ({ children }: { children: ReactNode }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      {children}
    </ThemeProvider>
  )
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options })

export * from '@testing-library/react'
export { customRender as render }

export const mockUserEvent: MockUserEvent = {
  type: async (element: HTMLElement, text: string) => {
    const user = userEvent.setup()
    await user.type(element, text)
  },
  click: async (element: HTMLElement) => {
    const user = userEvent.setup()
    await user.click(element)
  },
  selectOption: async (element: HTMLElement, option: string) => {
    const user = userEvent.setup()
    await user.selectOptions(element, option)
  },
  upload: async (element: HTMLElement, file: File) => {
    const user = userEvent.setup()
    await user.upload(element, file)
  }
}

export const fillPatientForm = async (formData: {
  name?: string
  email?: string
  phone?: string
  [key: string]: any
}) => {
  if (formData.name) {
    const nameInput = screen.getByLabelText(/full name/i)
    await mockUserEvent.type(nameInput, formData.name)
  }
  
  if (formData.email) {
    const emailInput = screen.getByLabelText(/email/i)
    await mockUserEvent.type(emailInput, formData.email)
  }
  
  if (formData.phone) {
    const phoneInput = screen.getByLabelText(/phone/i)
    await mockUserEvent.type(phoneInput, formData.phone)
  }
}

export const submitForm = async () => {
  const submitButton = screen.getByRole('button', { name: /submit/i })
  await mockUserEvent.click(submitButton)
}

export const expectValidationError = async (
  container: HTMLElement,
  fieldName: string,
  expectedError: string
) => {
  const errorElement = await findByText(container, expectedError)
  expect(errorElement).toBeInTheDocument()
}

export const expectLoadingState = (container: HTMLElement) => {
  expect(container.querySelector('[data-testid="loading"]')).toBeInTheDocument()
}

export const expectSuccessState = async (container: HTMLElement, message: string) => {
  const successElement = await findByText(container, message)
  expect(successElement).toBeInTheDocument()
}
*/
