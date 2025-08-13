// Test fixtures for consistent test data
export const mockPatientData = {
  basic: {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1234567890',
  },
  registration: {
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '+1987654321',
    birthDate: new Date('1990-01-15'),
    gender: 'Female' as const,
    address: '123 Main St, Anytown, ST 12345',
    occupation: 'Software Engineer',
    emergencyContactName: 'John Smith',
    emergencyContactNumber: '+1555666777',
    primaryPhysician: 'Dr. Green',
    insuranceProvider: 'HealthCare Plus',
    insurancePolicyNumber: 'HC123456789',
    allergies: 'Penicillin, Peanuts',
    currentMedication: 'Lisinopril 10mg daily',
    familyMedicalHistory: 'Diabetes (father), Hypertension (mother)',
    pastMedicalHistory: 'Appendectomy 2015, Broken arm 2010',
    identificationType: 'Driver\'s License',
    identificationNumber: 'DL123456789',
    privacyConsent: true,
    treatmentConsent: true,
    disclosureConsent: true,
  },
  invalid: {
    name: 'A', // Too short
    email: 'invalid-email',
    phone: '123', // Invalid format
    birthDate: new Date('2050-01-01'), // Future date
    gender: 'Invalid' as any,
    address: '123', // Too short
    occupation: 'A', // Too short
    emergencyContactName: 'A',
    emergencyContactNumber: '123',
    primaryPhysician: '',
    insuranceProvider: 'A',
    insurancePolicyNumber: 'A',
    privacyConsent: false,
    treatmentConsent: false,
    disclosureConsent: false,
  }
}

export const mockAppointmentData = {
  valid: {
    userId: 'user-123',
    patient: 'patient-123',
    primaryPhysician: 'Dr. Green',
    reason: 'Annual checkup',
    schedule: new Date('2025-09-01T10:00:00Z'),
    status: 'scheduled' as const,
    note: 'Patient requested morning appointment',
  },
  pending: {
    userId: 'user-456',
    patient: 'patient-456',
    primaryPhysician: 'Dr. Cameron',
    reason: 'Follow-up consultation',
    schedule: new Date('2025-09-02T14:00:00Z'),
    status: 'pending' as const,
    note: 'Waiting for insurance approval',
  },
  cancelled: {
    userId: 'user-789',
    patient: 'patient-789',
    primaryPhysician: 'Dr. Lee',
    reason: 'Emergency consultation',
    schedule: new Date('2025-08-30T16:00:00Z'),
    status: 'cancelled' as const,
    note: 'Patient cancelled due to illness',
    cancellationReason: 'Patient has flu symptoms',
  }
}

export const mockDoctorData = [
  {
    image: '/assets/images/dr-green.png',
    name: 'Dr. John Green',
    specialty: 'Family Medicine',
  },
  {
    image: '/assets/images/dr-cameron.png',
    name: 'Dr. Leila Cameron',
    specialty: 'Cardiology',
  },
  {
    image: '/assets/images/dr-lee.png',
    name: 'Dr. Peter Lee',
    specialty: 'Pediatrics',
  }
]

export const mockAppwriteResponses = {
  createUser: {
    $id: 'user-123',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1234567890',
    $createdAt: '2025-08-13T10:00:00.000Z',
    $updatedAt: '2025-08-13T10:00:00.000Z',
  },
  createPatient: {
    $id: 'patient-123',
    userId: 'user-123',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1234567890',
    birthDate: '1990-01-15',
    gender: 'Male',
    address: '123 Main St',
    $createdAt: '2025-08-13T10:00:00.000Z',
    $updatedAt: '2025-08-13T10:00:00.000Z',
  },
  createAppointment: {
    $id: 'appointment-123',
    userId: 'user-123',
    patient: 'patient-123',
    primaryPhysician: 'Dr. Green',
    reason: 'Annual checkup',
    schedule: '2025-09-01T10:00:00.000Z',
    status: 'scheduled',
    $createdAt: '2025-08-13T10:00:00.000Z',
    $updatedAt: '2025-08-13T10:00:00.000Z',
  },
  appointmentsList: {
    total: 3,
    documents: [
      mockAppointmentData.valid,
      mockAppointmentData.pending,
      mockAppointmentData.cancelled,
    ]
  }
}

export const mockFileUpload = {
  validFile: new File(['fake-content'], 'test-document.pdf', {
    type: 'application/pdf',
  }),
  invalidFile: new File(['fake-content'], 'test-image.exe', {
    type: 'application/x-executable',
  }),
  largeFile: new File([new ArrayBuffer(10 * 1024 * 1024)], 'large-file.pdf', {
    type: 'application/pdf',
  }),
}
