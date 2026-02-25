// All fillable profile fields from Prisma schema (excluding system fields: id, email, createdAt, updatedAt, relations)
const ALL_FIELDS = {
  patient: [
    { key: "firstName", label: "First Name", required: true },
    { key: "lastName", label: "Last Name", required: true },
    { key: "mobile", label: "Phone Number", required: true },
    { key: "gender", label: "Gender", required: true },
    { key: "dateOfBirth", label: "Date of Birth", required: true },
    { key: "city", label: "City", required: true },
    { key: "country", label: "Country", required: true },
    { key: "bloodGroup", label: "Blood Group" },
    { key: "state", label: "State" },
    { key: "zipCode", label: "Zip Code" },
    { key: "address", label: "Address" },
    { key: "img", label: "Profile Image" },
  ],
  doctor: [
    { key: "firstName", label: "First Name", required: true },
    { key: "lastName", label: "Last Name", required: true },
    { key: "phone", label: "Phone Number", required: true },
    { key: "gender", label: "Gender", required: true },
    { key: "specialization", label: "Specialization", required: true },
    { key: "city", label: "City", required: true },
    { key: "country", label: "Country", required: true },
    { key: "dob", label: "Date of Birth" },
    { key: "biography", label: "Biography" },
    { key: "clinicName", label: "Clinic Name" },
    { key: "clinicAddress", label: "Clinic Address" },
    { key: "address", label: "Address" },
    { key: "state", label: "State" },
    { key: "postalCode", label: "Postal Code" },
    { key: "price", label: "Appointment Fee" },
    { key: "services", label: "Services" },
    { key: "degree", label: "Degree" },
    { key: "college", label: "College" },
    { key: "completionYear", label: "Year of Completion" },
    { key: "experienceHospitalName", label: "Hospital Name" },
    { key: "experienceStart", label: "Experience From" },
    { key: "experienceEnd", label: "Experience To" },
    { key: "designation", label: "Designation" },
    { key: "award", label: "Awards" },
    { key: "awardYear", label: "Award Year" },
    { key: "registration", label: "Registration" },
    { key: "year", label: "Registration Year" },
    { key: "linkedin", label: "LinkedIn" },
    { key: "facebook", label: "Facebook" },
    { key: "instagram", label: "Instagram" },
    { key: "twitter", label: "Twitter" },
    { key: "img", label: "Profile Image" },
  ],
};

export function getProfileCompletion(data, role) {
  const fields = ALL_FIELDS[role];
  if (!fields || !data) {
    return {
      percentage: 100,
      filledCount: 0,
      totalCount: 0,
      missingFields: [],
      missingRequired: [],
      requiredComplete: true,
      isComplete: true,
    };
  }

  const totalCount = fields.length;
  const missingFields = fields.filter((f) => !data[f.key]).map((f) => f.label);
  const missingRequired = fields
    .filter((f) => f.required && !data[f.key])
    .map((f) => f.label);
  const filledCount = totalCount - missingFields.length;
  const percentage = Math.round((filledCount / totalCount) * 100);

  return {
    percentage,
    filledCount,
    totalCount,
    missingFields,
    missingRequired,
    requiredComplete: missingRequired.length === 0,
    isComplete: missingFields.length === 0,
  };
}
