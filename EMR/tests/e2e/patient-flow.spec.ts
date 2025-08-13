import { test, expect } from '@playwright/test'
import { mockPatientData } from '../fixtures/mockData'

test.describe('Patient Registration Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the home page
    await page.goto('/')
  })

  test('should complete patient registration successfully', async ({ page }) => {
    // Fill out initial patient form
    await page.fill('[name="name"]', mockPatientData.basic.name)
    await page.fill('[name="email"]', mockPatientData.basic.email)
    await page.fill('[name="phone"]', mockPatientData.basic.phone)
    
    // Submit the form
    await page.click('button[type="submit"]')
    
    // Should navigate to registration page
    await expect(page).toHaveURL(/\/patients\/[^\/]+\/register/)
    
    // Fill out detailed registration form
    const regData = mockPatientData.registration
    
    await page.fill('[name="name"]', regData.name)
    await page.fill('[name="email"]', regData.email)
    await page.fill('[name="phone"]', regData.phone)
    
    // Fill birth date
    await page.fill('[name="birthDate"]', '1990-01-15')
    
    // Select gender
    await page.selectOption('[name="gender"]', regData.gender)
    
    // Fill address
    await page.fill('[name="address"]', regData.address)
    await page.fill('[name="occupation"]', regData.occupation)
    
    // Emergency contact
    await page.fill('[name="emergencyContactName"]', regData.emergencyContactName)
    await page.fill('[name="emergencyContactNumber"]', regData.emergencyContactNumber)
    
    // Select primary physician
    await page.selectOption('[name="primaryPhysician"]', regData.primaryPhysician)
    
    // Insurance information
    await page.fill('[name="insuranceProvider"]', regData.insuranceProvider)
    await page.fill('[name="insurancePolicyNumber"]', regData.insurancePolicyNumber)
    
    // Medical history (optional fields)
    await page.fill('[name="allergies"]', regData.allergies || '')
    await page.fill('[name="currentMedication"]', regData.currentMedication || '')
    await page.fill('[name="familyMedicalHistory"]', regData.familyMedicalHistory || '')
    await page.fill('[name="pastMedicalHistory"]', regData.pastMedicalHistory || '')
    
    // Identification
    await page.selectOption('[name="identificationType"]', regData.identificationType || '')
    await page.fill('[name="identificationNumber"]', regData.identificationNumber || '')
    
    // Consent checkboxes
    await page.check('[name="treatmentConsent"]')
    await page.check('[name="disclosureConsent"]')
    await page.check('[name="privacyConsent"]')
    
    // Submit registration
    await page.click('button[type="submit"]')
    
    // Should navigate to appointment booking
    await expect(page).toHaveURL(/\/patients\/[^\/]+\/new-appointment/)
  })

  test('should show validation errors for invalid data', async ({ page }) => {
    // Try to submit empty form
    await page.click('button[type="submit"]')
    
    // Should show validation errors
    await expect(page.locator('text=Name must be at least 2 characters')).toBeVisible()
    await expect(page.locator('text=Invalid email address')).toBeVisible()
    await expect(page.locator('text=Invalid phone number')).toBeVisible()
  })

  test('should show validation errors for invalid email format', async ({ page }) => {
    await page.fill('[name="name"]', 'John Doe')
    await page.fill('[name="email"]', 'invalid-email')
    await page.fill('[name="phone"]', '+1234567890')
    
    await page.click('button[type="submit"]')
    
    await expect(page.locator('text=Invalid email address')).toBeVisible()
  })

  test('should show validation errors for invalid phone format', async ({ page }) => {
    await page.fill('[name="name"]', 'John Doe')
    await page.fill('[name="email"]', 'john@example.com')
    await page.fill('[name="phone"]', '123')
    
    await page.click('button[type="submit"]')
    
    await expect(page.locator('text=Invalid phone number')).toBeVisible()
  })
})

test.describe('Appointment Booking Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Assuming we have a registered patient, navigate to appointment booking
    await page.goto('/patients/test-user-id/new-appointment')
  })

  test('should book appointment successfully', async ({ page }) => {
    // Select doctor
    await page.selectOption('[name="primaryPhysician"]', 'Dr. Green')
    
    // Enter reason
    await page.fill('[name="reason"]', 'Annual checkup')
    
    // Set appointment date/time
    await page.fill('[name="schedule"]', '2025-09-01T10:00')
    
    // Add note
    await page.fill('[name="note"]', 'Morning appointment preferred')
    
    // Submit appointment
    await page.click('button[type="submit"]')
    
    // Should show success message or redirect
    await expect(page.locator('text=Appointment booked successfully')).toBeVisible()
  })

  test('should show validation errors for missing required fields', async ({ page }) => {
    // Try to submit without selecting doctor
    await page.click('button[type="submit"]')
    
    await expect(page.locator('text=Select at least one doctor')).toBeVisible()
  })
})

test.describe('Admin Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to admin page
    await page.goto('/?admin=true')
  })

  test('should show admin passkey modal', async ({ page }) => {
    await expect(page.locator('[data-testid="passkey-modal"]')).toBeVisible()
  })

  test('should access admin dashboard with correct passkey', async ({ page }) => {
    // Enter correct passkey (this would need to be mocked or use test credentials)
    await page.fill('[name="passkey"]', '123456')
    await page.click('button[type="submit"]')
    
    // Should navigate to admin dashboard
    await expect(page).toHaveURL('/admin')
    
    // Should show admin dashboard elements
    await expect(page.locator('text=Admin Dashboard')).toBeVisible()
    await expect(page.locator('text=Welcome 👋')).toBeVisible()
  })

  test('should show appointment statistics', async ({ page }) => {
    // Assuming we're on admin dashboard
    await page.goto('/admin')
    
    // Should show stat cards
    await expect(page.locator('text=Scheduled appointments')).toBeVisible()
    await expect(page.locator('text=Pending appointments')).toBeVisible()
    await expect(page.locator('text=Cancelled appointments')).toBeVisible()
  })

  test('should show appointments table', async ({ page }) => {
    await page.goto('/admin')
    
    // Should show data table
    await expect(page.locator('[data-testid="appointments-table"]')).toBeVisible()
    
    // Should show table headers
    await expect(page.locator('text=Patient')).toBeVisible()
    await expect(page.locator('text=Status')).toBeVisible()
    await expect(page.locator('text=Appointment')).toBeVisible()
    await expect(page.locator('text=Doctor')).toBeVisible()
  })
})

test.describe('Responsive Design', () => {
  test('should be responsive on mobile devices', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    await page.goto('/')
    
    // Check that the layout adapts to mobile
    const container = page.locator('.container')
    await expect(container).toBeVisible()
    
    // Check that forms are still usable
    await page.fill('[name="name"]', 'John Doe')
    await page.fill('[name="email"]', 'john@example.com')
    await page.fill('[name="phone"]', '+1234567890')
    
    const submitButton = page.locator('button[type="submit"]')
    await expect(submitButton).toBeVisible()
  })

  test('should be responsive on tablet devices', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 })
    
    await page.goto('/')
    
    // Check layout on tablet
    const mainContent = page.locator('main')
    await expect(mainContent).toBeVisible()
  })
})

test.describe('Accessibility', () => {
  test('should have proper accessibility attributes', async ({ page }) => {
    await page.goto('/')
    
    // Check for proper form labels
    const nameInput = page.locator('[name="name"]')
    await expect(nameInput).toHaveAttribute('aria-label')
    
    const emailInput = page.locator('[name="email"]')
    await expect(emailInput).toHaveAttribute('aria-label')
    
    // Check for submit button accessibility
    const submitButton = page.locator('button[type="submit"]')
    await expect(submitButton).toBeVisible()
    await expect(submitButton).toBeEnabled()
  })

  test('should support keyboard navigation', async ({ page }) => {
    await page.goto('/')
    
    // Test tab navigation
    await page.keyboard.press('Tab')
    await expect(page.locator('[name="name"]')).toBeFocused()
    
    await page.keyboard.press('Tab')
    await expect(page.locator('[name="email"]')).toBeFocused()
    
    await page.keyboard.press('Tab')
    await expect(page.locator('[name="phone"]')).toBeFocused()
  })
})
