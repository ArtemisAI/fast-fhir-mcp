#!/usr/bin/env pwsh

# Test Dependencies Installation Script
# This script installs all required testing dependencies for the EMR project

Write-Host "🧪 Installing Testing Dependencies for EMR Project..." -ForegroundColor Yellow

# Change to EMR directory
Set-Location "G:\projects\_School\fhir-mcp\EMR"

Write-Host "📦 Installing Jest and Testing Libraries..." -ForegroundColor Blue

# Install core testing dependencies
npm install --save-dev @types/jest @types/node jest jest-environment-jsdom

# Install React Testing Library
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event

# Install Playwright for E2E testing
npm install --save-dev @playwright/test

# Install additional testing utilities
npm install --save-dev msw @types/ms

Write-Host "✅ Testing dependencies installed successfully!" -ForegroundColor Green

Write-Host "🔧 Setting up Jest configuration..." -ForegroundColor Blue

# Update package.json test scripts (already done via previous modifications)
Write-Host "✅ Jest configuration already set up in package.json" -ForegroundColor Green

Write-Host "🎭 Installing Playwright browsers..." -ForegroundColor Blue
npx playwright install

Write-Host "✅ Playwright browsers installed!" -ForegroundColor Green

Write-Host ""
Write-Host "🎉 Test setup complete! Available commands:" -ForegroundColor Green
Write-Host "  npm run test              - Run all Jest tests" -ForegroundColor Cyan
Write-Host "  npm run test:unit         - Run unit tests only" -ForegroundColor Cyan
Write-Host "  npm run test:integration  - Run integration tests only" -ForegroundColor Cyan
Write-Host "  npm run test:e2e          - Run Playwright E2E tests" -ForegroundColor Cyan
Write-Host "  npm run test:watch        - Run tests in watch mode" -ForegroundColor Cyan
Write-Host "  npm run test:coverage     - Run tests with coverage report" -ForegroundColor Cyan

Write-Host ""
Write-Host "📝 Next steps:" -ForegroundColor Yellow
Write-Host "1. Uncomment test code in test files" -ForegroundColor White
Write-Host "2. Run 'npm run test' to verify all tests pass" -ForegroundColor White
Write-Host "3. Start developing FHIR integration features" -ForegroundColor White
