# Fast FHIR MCP Development Instructions

**Always follow these instructions first and only fallback to additional search and context gathering if the information provided here is incomplete or found to be in error.**

## Project Overview
Fast FHIR MCP is a healthcare integration project transforming a legacy EMR system (CarePulse) into a FHIR-compliant platform using the Model Context Protocol (MCP) for AI-powered healthcare workflows. The main application is a Next.js 14 healthcare management system located in the `/EMR/` directory.

## Working Effectively

### Bootstrap and Setup
1. **Navigate to the EMR directory:**
   ```bash
   cd /home/runner/work/fast-fhir-mcp/fast-fhir-mcp/EMR
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```
   - Takes approximately 70 seconds. NEVER CANCEL.
   - Set timeout to 120+ seconds.
   - May show deprecation warnings - this is normal.

3. **Install testing dependencies (if needed):**
   ```bash
   npm install --save-dev jest @types/jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
   ```

### Development Workflow

#### Starting Development Server
```bash
npm run dev
```
- Server starts in ~6 seconds at http://localhost:3000
- Ready message: "✓ Ready in X.Xs"
- Server responds with HTTP 200 when operational
- Use Ctrl+C to stop the server

#### Building the Application
```bash
npm run build
```
- Builds successfully with system fonts instead of Google Fonts
- Build completes in ~45 seconds with success message "✓ Compiled successfully"
- **NEVER CANCEL**: Set timeout to 90+ seconds for safe completion
- May show Sentry warnings (non-blocking) and Playwright config errors if test dependencies aren't installed
- Also may show ESLint warnings in `FileUploader.tsx` and `PasskeyModal.tsx` (non-blocking)

#### Linting
```bash
npm run lint
```
- Takes ~3 seconds after initial ESLint configuration
- First run asks for ESLint configuration - select "Strict (recommended)"
- Known warnings in `FileUploader.tsx` and `PasskeyModal.tsx` - these are non-blocking
- Always run before committing changes

### Testing

#### Current Test Status
- **Jest Tests**: Configuration exists but requires setup (tests are commented out)
- **Playwright E2E Tests**: Configuration present but browser installation may fail due to network restrictions
- **Test Structure**: Located in `tests/` directory with comprehensive playbook

#### Available Test Commands
```bash
# Unit tests (currently disabled - see note below)
npm test

# E2E tests (requires browser installation)
npm run test:e2e

# Install Playwright browsers (may fail due to network restrictions)
npm run test:install
```

**TESTING LIMITATION**: The testing framework needs additional configuration to work properly. Jest tests are commented out in test files and Playwright browser downloads may fail due to network restrictions.

### Environment Configuration

#### Required Environment File
Create `.env.local` based on `.env.example`:
```bash
cp .env.example .env.local
```

#### Key Environment Variables
- `NEXT_PUBLIC_ENDPOINT`: Appwrite endpoint (default: https://cloud.appwrite.io/v1)
- `PROJECT_ID`: Appwrite project ID
- `API_KEY`: Appwrite API key  
- `DATABASE_ID`: Appwrite database ID
- `PATIENT_COLLECTION_ID`: Patient collection ID
- `APPOINTMENT_COLLECTION_ID`: Appointment collection ID
- `NEXT_PUBLIC_BUCKET_ID`: Storage bucket ID
- `NEXT_PUBLIC_ADMIN_PASSKEY`: Admin access key (default: 111111)

## Project Structure

### Key Directories
- `/EMR/` - Main Next.js healthcare application
- `/EMR/app/` - Next.js app router pages
- `/EMR/components/` - React components and forms  
- `/EMR/lib/` - Utilities, validation, and backend actions
- `/EMR/tests/` - Testing framework (Jest + Playwright)
- `/EMR/types/` - TypeScript type definitions
- `/docs/` - Project documentation (private)
- `/.github/` - GitHub workflows and configurations

### Important Files
- `EMR/package.json` - Dependencies and npm scripts
- `EMR/next.config.mjs` - Next.js configuration with Sentry
- `EMR/tailwind.config.ts` - Tailwind CSS configuration
- `EMR/playwright.config.ts` - E2E test configuration  
- `EMR/DEPLOYMENT.md` - Detailed deployment guide
- `EMR/tests/TESTING_PLAYBOOK.md` - Comprehensive testing strategy
- `README.md` - Project overview and architecture
- `ROADMAP.md` - Strategic development plan

## Known Issues and Limitations

### Network Restrictions
- **Playwright Browsers**: Download may fail from cdn.playwright.dev
- **External Services**: Various external services may be blocked in restricted environments

### Code Issues
- ESLint warnings in `FileUploader.tsx` and `PasskeyModal.tsx` (non-blocking)
- Sentry warnings due to missing auth tokens (non-blocking)
- Playwright config errors if test dependencies aren't installed

### Workarounds
1. **For development**: Use `npm run dev` for active development
2. **For testing**: Use manual testing workflows until test framework is configured
3. **For deployment**: Production builds now work reliably with system fonts

## Technology Stack

### Frontend
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI components
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React

### Backend & Services
- **BaaS**: Appwrite (legacy, transitioning to FHIR)
- **Monitoring**: Sentry integration
- **File Upload**: Appwrite Storage
- **Authentication**: Appwrite Auth

### Development Tools
- **Linting**: ESLint with Next.js configuration
- **Testing**: Jest (unit) + Playwright (E2E) - pending setup
- **Build**: Next.js build system
- **Package Manager**: npm

## Validation Scenarios

### Manual Testing Workflows
After making changes, always test these critical paths:

1. **Development Server Startup**:
   ```bash
   cd EMR && npm run dev
   ```
   - Verify server starts without errors
   - Check http://localhost:3000 responds with 200

2. **Basic Navigation**:
   - Home page loads without JavaScript errors
   - Patient registration form displays
   - Admin dashboard is accessible

3. **Form Validation**:
   - Test patient registration form validation
   - Verify required field enforcement
   - Check error message display

## Pre-Commit Checklist
- [ ] Run `npm run lint` - must pass without errors
- [ ] Test development server starts successfully  
- [ ] Manual test core functionality works
- [ ] No new TypeScript errors introduced
- [ ] Environment variables are properly configured

## Common Commands Reference

```bash
# Core development workflow
cd EMR
npm install                    # Install dependencies (70s, timeout: 120s)
npm run dev                   # Start dev server (6s)
npm run lint                  # Lint code (3s)
npm run build                 # Build for production (FAILS - see known issues)

# Testing (limited functionality)
npm test                      # Jest tests (currently disabled)
npm run test:e2e             # Playwright E2E (needs browser install)
npm run test:install         # Install browsers (may fail)

# Utility commands
curl http://localhost:3000   # Test server health
```

## Architecture Notes

### Current State (Legacy EMR)
- Next.js frontend with Appwrite backend
- Custom data models (non-FHIR compliant)
- Isolated healthcare system

### Target State (FHIR Integration)
- FHIR R4 compliant data models
- Microsoft FHIR Server integration
- MCP protocol for AI workflows
- Healthcare interoperability

## Documentation References
- **DEPLOYMENT.md**: Complete deployment instructions
- **TESTING_PLAYBOOK.md**: Comprehensive testing strategy  
- **ROADMAP.md**: Strategic development roadmap
- **PROJECT_HANDOVER.md**: Project status and handover details

## Performance Expectations
- **npm install**: ~70 seconds (NEVER CANCEL, timeout: 120s+)
- **Development server**: ~6 seconds startup
- **Linting**: ~3 seconds  
- **Production builds**: ~45 seconds (builds successfully, timeout: 90s+)
- **Network operations**: May timeout due to restrictions

Remember: This is a healthcare application handling sensitive data. Always prioritize security, validation, and compliance when making changes.