# EMR Testing Playbook
## Comprehensive Testing Strategy for CarePulse Healthcare Management System

### Overview
This testing playbook provides a systematic approach to validate all functionality of the CarePulse EMR system before implementing FHIR integration. The tests are organized by type and complexity to ensure thorough coverage of all features.

---

## Testing Environment Setup

### Prerequisites
1. **Node.js**: Version 18 or higher
2. **Package Manager**: npm or yarn
3. **Test Dependencies**: Install all testing packages
4. **Environment Variables**: Configure test environment
5. **Mock Data**: Ensure test fixtures are available

### Installation Commands
```bash
# Navigate to EMR directory
cd G:\projects\_School\fhir-mcp\EMR

# Install testing dependencies
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event
npm install --save-dev @playwright/test
npm install --save-dev @types/jest
npm install --save-dev jest jest-environment-jsdom

# Install Playwright browsers
npx playwright install
```

### Environment Configuration
Create `.env.test` file:
```env
NEXT_PUBLIC_ENDPOINT=http://localhost:1337/v1
PROJECT_ID=test-project-id
API_KEY=test-api-key
DATABASE_ID=test-database-id
PATIENT_COLLECTION_ID=test-patient-collection
DOCTOR_COLLECTION_ID=test-doctor-collection
APPOINTMENT_COLLECTION_ID=test-appointment-collection
NEXT_PUBLIC_BUCKET_ID=test-bucket-id
```

---

## Test Execution Strategy

### Phase 1: Unit Tests
**Purpose**: Validate individual components and functions in isolation
**Location**: `tests/unit/`
**Duration**: ~10 minutes

#### Test Categories:

1. **Validation Schemas (`validation.test.ts`)**
   - UserFormValidation schema
   - PatientFormValidation schema
   - CreateAppointmentSchema validation
   - Edge cases and error conditions

2. **Utility Functions**
   - Date formatting functions
   - Data parsing utilities
   - String manipulation helpers
   - Error handling utilities

3. **Constants and Configuration**
   - Doctor list validation
   - Form default values
   - Identification types
   - Status enumerations

#### Execution Commands:
```bash
# Run all unit tests
npm test tests/unit

# Run specific test file
npm test tests/unit/validation.test.ts

# Run with coverage
npm test tests/unit -- --coverage
```

#### Success Criteria:
- ✅ All validation schemas pass with valid data
- ✅ All validation schemas fail appropriately with invalid data
- ✅ Error messages are correct and user-friendly
- ✅ Edge cases are handled properly
- ✅ Code coverage > 90% for utility functions

---

### Phase 2: Integration Tests
**Purpose**: Test component interactions and API integrations
**Location**: `tests/integration/`
**Duration**: ~15 minutes

#### Test Categories:

1. **Patient Actions (`actions.test.ts`)**
   - User creation flow
   - Patient registration process
   - Patient data retrieval
   - Error handling scenarios

2. **Appointment Actions**
   - Appointment creation
   - Appointment listing and filtering
   - Status updates
   - Appointment cancellation

3. **File Upload Integration**
   - Document upload functionality
   - File validation
   - Storage integration
   - Error handling for large files

#### Execution Commands:
```bash
# Run all integration tests
npm test tests/integration

# Run with detailed output
npm test tests/integration -- --verbose

# Run specific action tests
npm test tests/integration/actions.test.ts
```

#### Success Criteria:
- ✅ All CRUD operations work correctly
- ✅ Appwrite integration functions properly
- ✅ Error handling is comprehensive
- ✅ File uploads work without errors
- ✅ Data relationships are maintained

---

### Phase 3: Component Tests
**Purpose**: Test React components with user interactions
**Location**: `tests/unit/components/`
**Duration**: ~20 minutes

#### Test Categories:

1. **Form Components**
   - PatientForm rendering and validation
   - AppointmentForm functionality
   - RegisterForm complete flow
   - CustomFormField behaviors

2. **UI Components**
   - StatCard display logic
   - StatusBadge variations
   - DataTable functionality
   - Modal interactions

3. **Layout Components**
   - Navigation elements
   - Responsive behavior
   - Theme switching
   - Loading states

#### Execution Commands:
```bash
# Run component tests
npm test tests/unit/components

# Run with watch mode for development
npm test tests/unit/components -- --watch

# Test specific component
npm test tests/unit/components/PatientForm.test.tsx
```

#### Success Criteria:
- ✅ All forms render without errors
- ✅ Form validation works in real-time
- ✅ User interactions trigger expected behaviors
- ✅ Components handle loading and error states
- ✅ Accessibility requirements are met

---

### Phase 4: End-to-End Tests
**Purpose**: Test complete user workflows in browser environment
**Location**: `tests/e2e/`
**Duration**: ~30 minutes

#### Test Scenarios:

1. **Patient Registration Flow**
   - Complete new patient signup
   - Form validation errors
   - Navigation between steps
   - Data persistence verification

2. **Appointment Booking Flow**
   - Doctor selection process
   - Date/time scheduling
   - Appointment confirmation
   - Calendar integration

3. **Admin Dashboard Flow**
   - Authentication/passkey entry
   - Appointment management
   - Statistics display
   - Data table interactions

4. **Cross-Browser Compatibility**
   - Chrome, Firefox, Safari testing
   - Mobile device simulation
   - Tablet responsiveness
   - Accessibility compliance

#### Execution Commands:
```bash
# Run all E2E tests
npx playwright test

# Run tests in headed mode (visible browser)
npx playwright test --headed

# Run specific test file
npx playwright test tests/e2e/patient-flow.spec.ts

# Run tests on specific browser
npx playwright test --project=chromium

# Generate test report
npx playwright show-report
```

#### Success Criteria:
- ✅ Complete user workflows function end-to-end
- ✅ No JavaScript errors in browser console
- ✅ All form submissions succeed
- ✅ Navigation flows work correctly
- ✅ Mobile responsiveness verified
- ✅ Accessibility standards met

---

## Manual Testing Checklist

### User Interface Testing
- [ ] **Visual Design**
  - Logo displays correctly
  - Color scheme matches healthcare branding
  - Fonts are readable and professional
  - Images load without errors
  - Icons are properly sized and aligned

- [ ] **Responsive Design**
  - Mobile view (320px - 768px)
  - Tablet view (768px - 1024px)
  - Desktop view (1024px+)
  - Layout adapts smoothly
  - Touch interactions work on mobile

- [ ] **Form Usability**
  - Tab order is logical
  - Error messages are clear
  - Required fields are marked
  - Auto-focus works properly
  - Form submission provides feedback

### Functional Testing
- [ ] **Patient Registration**
  - All required fields validate
  - Optional fields can be left empty
  - File upload works for documents
  - Consent checkboxes are required
  - Success message displays

- [ ] **Appointment Booking**
  - Doctor selection is required
  - Date/time picker functions
  - Future dates only allowed
  - Appointment reason is captured
  - Confirmation displays correctly

- [ ] **Admin Functions**
  - Passkey authentication works
  - Dashboard statistics are accurate
  - Appointment table displays data
  - Status filters function
  - Export functionality (if implemented)

### Security Testing
- [ ] **Input Validation**
  - SQL injection prevention
  - XSS attack prevention
  - File upload restrictions
  - Phone number format validation
  - Email format validation

- [ ] **Authentication**
  - Admin passkey is required
  - Session management works
  - Unauthorized access blocked
  - Password/passkey masking

### Performance Testing
- [ ] **Page Load Times**
  - Home page loads < 3 seconds
  - Form submissions < 2 seconds
  - Image loading optimized
  - No unnecessary re-renders

- [ ] **Error Handling**
  - Network errors handled gracefully
  - Invalid data shows appropriate errors
  - 404 pages display correctly
  - JavaScript errors don't crash app

---

## Test Data Requirements

### Valid Test Data Sets
```javascript
// Patient Registration
const validPatient = {
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+1234567890",
  birthDate: "1990-01-15",
  gender: "Male",
  address: "123 Main St, Anytown, ST 12345",
  occupation: "Software Engineer",
  emergencyContactName: "Jane Doe",
  emergencyContactNumber: "+1987654321",
  primaryPhysician: "Dr. Green",
  insuranceProvider: "HealthCare Plus",
  insurancePolicyNumber: "HC123456789"
}

// Appointment Booking
const validAppointment = {
  primaryPhysician: "Dr. Cameron",
  reason: "Annual checkup",
  schedule: "2025-09-01T10:00:00Z",
  note: "Patient prefers morning appointments"
}
```

### Invalid Test Data Sets
```javascript
// Invalid Patient Data
const invalidPatient = {
  name: "A", // Too short
  email: "invalid-email", // Invalid format
  phone: "123", // Invalid format
  birthDate: "2050-01-01", // Future date
  gender: "Invalid", // Not in enum
  // ... other invalid fields
}
```

### File Upload Test Files
- **Valid PDF**: Test document (< 5MB)
- **Invalid Format**: .exe file (should be rejected)
- **Large File**: > 10MB file (should be rejected)
- **Empty File**: 0 bytes (should be rejected)

---

## Test Execution Schedule

### Daily Testing (Development Phase)
1. **Morning**: Run unit tests before coding
2. **Mid-day**: Run integration tests after feature completion
3. **Evening**: Quick smoke test on main flows

### Weekly Testing (Integration Phase)
1. **Monday**: Full test suite execution
2. **Wednesday**: Component and UI testing
3. **Friday**: E2E testing and manual verification

### Pre-FHIR Integration Testing
1. **Week 1**: Complete unit test coverage
2. **Week 2**: Integration test validation
3. **Week 3**: E2E test scenarios
4. **Week 4**: Performance and security testing

---

## Bug Reporting Template

### Bug Report Format
```markdown
**Bug ID**: [Auto-generated or manual ID]
**Date**: [Date found]
**Tester**: [Your name]
**Environment**: [Browser, OS, Device]

**Summary**: [Brief description]

**Steps to Reproduce**:
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Expected Result**: [What should happen]
**Actual Result**: [What actually happened]

**Severity**: [Critical/High/Medium/Low]
**Priority**: [P1/P2/P3/P4]

**Screenshots**: [Attach if applicable]
**Browser Console Errors**: [Copy any errors]

**Additional Notes**: [Any other relevant information]
```

### Severity Levels
- **Critical**: System crashes, data loss, security issues
- **High**: Major functionality broken, blocking workflows
- **Medium**: Minor functionality issues, workarounds available
- **Low**: Cosmetic issues, minor inconveniences

---

## Success Metrics

### Test Coverage Targets
- **Unit Tests**: > 90% code coverage
- **Integration Tests**: > 80% API endpoint coverage
- **E2E Tests**: 100% critical user path coverage
- **Manual Tests**: 100% UI component coverage

### Performance Benchmarks
- **Page Load**: < 3 seconds (home page)
- **Form Submission**: < 2 seconds
- **API Response**: < 1 second
- **File Upload**: < 5 seconds (5MB file)

### Quality Gates
- [ ] Zero critical bugs
- [ ] < 5 high priority bugs
- [ ] All accessibility requirements met
- [ ] All security tests passed
- [ ] Cross-browser compatibility verified
- [ ] Mobile responsiveness confirmed

---

## Post-Testing Actions

### Test Results Documentation
1. **Test Summary Report**: Overall pass/fail rates
2. **Bug Summary Report**: Issues found and status
3. **Performance Report**: Benchmark comparisons
4. **Coverage Report**: Code and functionality coverage

### Pre-FHIR Integration Checklist
- [ ] All critical bugs resolved
- [ ] Performance benchmarks met
- [ ] Security vulnerabilities addressed
- [ ] Documentation updated
- [ ] Test suite ready for FHIR testing

### Handoff to FHIR Integration Phase
1. **Stable Baseline**: Confirmed working EMR system
2. **Test Infrastructure**: Ready for FHIR test additions
3. **Documentation**: Complete test coverage documentation
4. **Known Issues**: Documented and triaged issue list

---

*This playbook ensures the EMR system is thoroughly tested and stable before beginning FHIR integration work. Execute all test phases systematically to identify and resolve issues early in the development cycle.*
