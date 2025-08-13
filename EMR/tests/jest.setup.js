// Jest setup file
import '@testing-library/jest-dom'
import { TextEncoder, TextDecoder } from 'util'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    }
  },
  useSearchParams() {
    return new URLSearchParams()
  },
  usePathname() {
    return '/'
  },
}))

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />
  },
}))

// Mock Appwrite
jest.mock('node-appwrite', () => ({
  Client: jest.fn(() => ({
    setEndpoint: jest.fn().mockReturnThis(),
    setProject: jest.fn().mockReturnThis(),
    setKey: jest.fn().mockReturnThis(),
  })),
  Databases: jest.fn(() => ({
    createDocument: jest.fn(),
    listDocuments: jest.fn(),
    updateDocument: jest.fn(),
    deleteDocument: jest.fn(),
  })),
  Users: jest.fn(() => ({
    create: jest.fn(),
    get: jest.fn(),
    list: jest.fn(),
  })),
  Storage: jest.fn(() => ({
    createFile: jest.fn(),
    getFile: jest.fn(),
    deleteFile: jest.fn(),
  })),
  Messaging: jest.fn(() => ({
    createSms: jest.fn(),
  })),
  ID: {
    unique: jest.fn(() => 'mock-unique-id'),
  },
  Query: {
    equal: jest.fn(),
    orderDesc: jest.fn(),
  },
  InputFile: {
    fromBlob: jest.fn(),
  },
}))

// Polyfills for Node.js environment
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder

// Mock environment variables
process.env.NEXT_PUBLIC_ENDPOINT = 'http://localhost:1337/v1'
process.env.PROJECT_ID = 'test-project-id'
process.env.API_KEY = 'test-api-key'
process.env.DATABASE_ID = 'test-database-id'
process.env.PATIENT_COLLECTION_ID = 'test-patient-collection'
process.env.DOCTOR_COLLECTION_ID = 'test-doctor-collection'
process.env.APPOINTMENT_COLLECTION_ID = 'test-appointment-collection'
process.env.NEXT_PUBLIC_BUCKET_ID = 'test-bucket-id'

// Suppress console warnings during tests
const originalConsoleWarn = console.warn
const originalConsoleError = console.error

beforeAll(() => {
  console.warn = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is no longer supported')
    ) {
      return
    }
    originalConsoleWarn.call(console, ...args)
  }

  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Warning:') || args[0].includes('Error:'))
    ) {
      return
    }
    originalConsoleError.call(console, ...args)
  }
})

afterAll(() => {
  console.warn = originalConsoleWarn
  console.error = originalConsoleError
})
