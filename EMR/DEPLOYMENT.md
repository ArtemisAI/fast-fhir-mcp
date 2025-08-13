# EMR Deployment Guide

## Step 1: EMR Foundation Setup

This guide will help you deploy the CarePulse EMR system step by step, ensuring each component works before moving to the next.

### Prerequisites
- Node.js 18+ installed
- Git
- Appwrite account (cloud.appwrite.io)
- VS Code (recommended)

## Phase 1: Basic EMR Deployment

### 1.1 Environment Setup

1. **Copy environment template:**
   ```bash
   cp .env.example .env.local
   ```

2. **Set up Appwrite Project:**
   - Go to [Appwrite Console](https://cloud.appwrite.io)
   - Create a new project
   - Copy the Project ID and Endpoint
   - Generate an API key with full permissions

3. **Configure Environment Variables:**
   Edit `.env.local` with your Appwrite credentials:
   ```
   NEXT_PUBLIC_ENDPOINT=https://cloud.appwrite.io/v1
   PROJECT_ID=your_actual_project_id
   API_KEY=your_actual_api_key
   # etc...
   ```

### 1.2 Database Setup

Create the following collections in your Appwrite project:

#### Patients Collection
```json
{
  "name": "patients",
  "permissions": ["read", "write"],
  "attributes": [
    {"key": "name", "type": "string", "size": 255, "required": true},
    {"key": "email", "type": "string", "size": 255, "required": true},
    {"key": "phone", "type": "string", "size": 20, "required": true},
    {"key": "birthDate", "type": "datetime", "required": true},
    {"key": "gender", "type": "string", "size": 10, "required": true},
    {"key": "address", "type": "string", "size": 500, "required": true},
    {"key": "occupation", "type": "string", "size": 100, "required": false},
    {"key": "emergencyContactName", "type": "string", "size": 255, "required": true},
    {"key": "emergencyContactNumber", "type": "string", "size": 20, "required": true},
    {"key": "primaryPhysician", "type": "string", "size": 255, "required": true},
    {"key": "insuranceProvider", "type": "string", "size": 255, "required": false},
    {"key": "insurancePolicyNumber", "type": "string", "size": 100, "required": false},
    {"key": "allergies", "type": "string", "size": 1000, "required": false},
    {"key": "currentMedication", "type": "string", "size": 1000, "required": false},
    {"key": "familyMedicalHistory", "type": "string", "size": 1000, "required": false},
    {"key": "pastMedicalHistory", "type": "string", "size": 1000, "required": false},
    {"key": "identificationType", "type": "string", "size": 50, "required": true},
    {"key": "identificationNumber", "type": "string", "size": 100, "required": true},
    {"key": "identificationDocument", "type": "string", "size": 255, "required": false},
    {"key": "privacyConsent", "type": "boolean", "required": true},
    {"key": "treatmentConsent", "type": "boolean", "required": true},
    {"key": "disclosureConsent", "type": "boolean", "required": true}
  ]
}
```

#### Doctors Collection
```json
{
  "name": "doctors",
  "permissions": ["read"],
  "attributes": [
    {"key": "name", "type": "string", "size": 255, "required": true},
    {"key": "image", "type": "string", "size": 255, "required": true},
    {"key": "specialty", "type": "string", "size": 100, "required": true}
  ]
}
```

#### Appointments Collection
```json
{
  "name": "appointments",
  "permissions": ["read", "write"],
  "attributes": [
    {"key": "patient", "type": "string", "size": 255, "required": true},
    {"key": "schedule", "type": "datetime", "required": true},
    {"key": "reason", "type": "string", "size": 500, "required": true},
    {"key": "note", "type": "string", "size": 1000, "required": false},
    {"key": "primaryPhysician", "type": "string", "size": 255, "required": true},
    {"key": "status", "type": "string", "size": 20, "required": true},
    {"key": "userId", "type": "string", "size": 255, "required": true},
    {"key": "cancellationReason", "type": "string", "size": 500, "required": false}
  ]
}
```

### 1.3 Storage Setup

Create a storage bucket for patient documents:
1. Go to Storage in Appwrite Console
2. Create a new bucket named "patient-documents"
3. Set permissions to allow read/write for authenticated users
4. Copy the bucket ID to your environment variables

### 1.4 Initial Deployment

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run development server:**
   ```bash
   npm run dev
   ```

3. **Test basic functionality:**
   - Visit http://localhost:3000
   - Try patient registration form
   - Check if data saves to Appwrite

### 1.5 Testing Phase

Run the comprehensive test suite:

```bash
# Unit tests
npm run test:unit

# Integration tests
npm run test:integration

# E2E tests (install Playwright first)
npm run test:install
npm run test:e2e

# All tests
npm run test:all
```

## Phase 2: Data Validation

Once EMR is running, validate:

1. **Patient Registration Flow:**
   - Complete patient form
   - Verify data in Appwrite console
   - Test file upload functionality

2. **Appointment Management:**
   - Create appointments
   - Test status changes
   - Verify admin dashboard

3. **Data Integrity:**
   - Run validation tests
   - Check required field enforcement
   - Test form error handling

## Phase 3: Production Readiness

Before moving to FHIR integration:

1. **Performance Testing:**
   - Load test with multiple patients
   - Monitor response times
   - Check memory usage

2. **Security Validation:**
   - Test authentication flows
   - Verify data encryption
   - Check access controls

3. **Backup Strategy:**
   - Export existing data
   - Test data recovery
   - Document migration procedures

## Next Steps

Once EMR is stable and tested:
- **Phase 4**: Database Migration Planning
- **Phase 5**: FHIR Server Setup
- **Phase 6**: API Integration
- **Phase 7**: MCP Gateway Development

## Troubleshooting

### Common Issues

1. **Environment Variables Not Loading:**
   - Ensure `.env.local` is in EMR root directory
   - Restart development server after changes
   - Check for typos in variable names

2. **Appwrite Connection Errors:**
   - Verify project ID and endpoint
   - Check API key permissions
   - Ensure network connectivity

3. **Build Errors:**
   - Clear `.next` cache: `rm -rf .next`
   - Reinstall dependencies: `rm -rf node_modules && npm install`
   - Check TypeScript errors: `npm run lint`

### Health Check Commands

```bash
# Check if app builds
npm run build

# Test database connection
npm run test:integration

# Validate forms
npm run test:unit

# Check E2E flows
npm run test:e2e
```
