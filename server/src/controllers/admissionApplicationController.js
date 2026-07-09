const { z } = require("zod");
const AdmissionApplication = require("../models/AdmissionApplication");
const AdmissionContent = require("../models/AdmissionContent");
const AdmissionPayment = require("../models/AdmissionPayment");
const asyncHandler = require("../middleware/asyncHandler");

const FIELD_GROUPS = [
  {
    title: "Pupil's Information",
    fields: [
      ["Application form reference", "applicationFormReference"],
      ["Surname", "surname"],
      ["First Name", "firstName"],
      ["Middle Name", "middleName"],
      ["Gender", "gender"],
      ["Date of Birth", "dateOfBirth"],
      ["Age", "age"],
      ["Place of Birth", "placeOfBirth"],
      ["Nationality", "nationality"],
      ["State of Origin", "stateOfOrigin"],
      ["Local Government Area", "localGovernmentArea"],
      ["Religion", "religion"],
      ["Denomination", "denomination"],
      ["Previous School Attended", "previousSchool"],
      ["Class Completed", "classCompleted"],
      ["Class Applying For", "classApplyingFor"],
      ["Home Address", "homeAddress"]
    ]
  },
  {
    title: "Parent/Guardian Information",
    fields: [
      ["Father Name", "father.name"],
      ["Father Occupation", "father.occupation"],
      ["Father Employer", "father.employer"],
      ["Father Phone Number", "father.phone"],
      ["Father Email Address", "father.email"],
      ["Mother Name", "mother.name"],
      ["Mother Occupation", "mother.occupation"],
      ["Mother Employer", "mother.employer"],
      ["Mother Phone Number", "mother.phone"],
      ["Mother Email Address", "mother.email"],
      ["Home Address", "parentHomeAddress"],
      ["Preferred Means of Communication", "preferredCommunication"]
    ]
  },
  {
    title: "Emergency Contacts",
    fields: [
      ["Parent/Guardian Contact 1 Name", "emergencyContactOne.name"],
      ["Parent/Guardian Contact 1 Relationship", "emergencyContactOne.relationship"],
      ["Parent/Guardian Contact 1 Phone Number", "emergencyContactOne.phone"],
      ["Parent/Guardian Contact 2 Name", "emergencyContactTwo.name"],
      ["Parent/Guardian Contact 2 Relationship", "emergencyContactTwo.relationship"],
      ["Parent/Guardian Contact 2 Phone Number", "emergencyContactTwo.phone"],
      ["Emergency Backup Name", "emergencyBackup.name"],
      ["Emergency Backup Relationship", "emergencyBackup.relationship"],
      ["Emergency Backup Phone Number", "emergencyBackup.phone"]
    ]
  },
  {
    title: "Medical Information",
    fields: [
      ["Child's Blood Group", "bloodGroup"],
      ["Genotype", "genotype"],
      ["Physician/Doctor's Name", "physicianName"],
      ["Hospital/Clinic", "hospitalClinic"],
      ["Physician's Phone Number", "physicianPhone"],
      ["Allergies", "allergies"],
      ["Allergy Details", "allergiesDetails"],
      ["Medical Condition Requiring Special Attention", "medicalCondition"],
      ["Medical Condition Details", "medicalConditionDetails"],
      ["Currently on Medication", "medication"],
      ["Medication Details", "medicationDetails"]
    ]
  },
  {
    title: "Academic and Behavioural Information",
    fields: [
      ["Repeated a Class", "repeatedClass"],
      ["Repeated Class Details", "repeatedClassDetails"],
      ["Suspended or Expelled", "suspendedOrExpelled"],
      ["Suspension/Expulsion Details", "suspendedOrExpelledDetails"],
      ["Learning Difficulty or Special Educational Need", "learningDifficulty"],
      ["Learning Difficulty Details", "learningDifficultyDetails"]
    ]
  },
  {
    title: "Documents Submitted",
    fields: [
      ["Documents Submitted", "documentsSubmitted"],
      ["Other Document", "otherDocument"]
    ]
  },
  {
    title: "Parent/Guardian Declaration",
    fields: [
      ["Parent/Guardian Name", "declarationName"],
      ["Signature", "declarationSignature"],
      ["Date", "declarationDate"]
    ]
  },
  {
    title: "For Official Use Only",
    fields: [
      ["Application Number", "officialApplicationNumber"],
      ["Date Received", "dateReceived"],
      ["Entrance Assessment Score", "assessmentScore"],
      ["Class Offered", "classOffered"],
      ["Admission Status", "admissionStatus"],
      ["Principal's Name", "principalName"],
      ["Principal's Signature", "principalSignature"],
      ["School Stamp", "schoolStamp"]
    ]
  }
];

const OFFICIAL_USE_FIELDS = new Set([
  "officialApplicationNumber",
  "dateReceived",
  "assessmentScore",
  "classOffered",
  "admissionStatus",
  "principalName",
  "principalSignature",
  "schoolStamp"
]);

const fieldValueSchema = z.union([
  z.string().max(3000),
  z.array(z.string().max(3000)).max(30)
]);

const applicationSchema = z.object({
  paymentReference: z.string().trim().max(80).optional(),
  formData: z
    .record(z.string().max(100).regex(/^[A-Za-z0-9.]+$/, "Invalid form field name"), fieldValueSchema)
    .refine((data) => Object.keys(data).length <= 100, "Too many form fields")
});

async function admissionSettings() {
  let settings = await AdmissionContent.findOne();
  if (!settings) settings = await AdmissionContent.create({});
  return settings;
}

function paymentRequired(settings) {
  return Boolean(settings.applicationFeeEnabled && Number(settings.applicationFeeAmount) > 0);
}

function amountSubunit(amount) {
  return Math.round(Number(amount || 0) * 100);
}

async function verifiedPaymentForApplication(settings, reference) {
  if (!paymentRequired(settings)) return null;
  if (!reference) {
    const error = new Error("Please complete payment before submitting the application.");
    error.statusCode = 402;
    throw error;
  }

  const payment = await AdmissionPayment.findOne({ reference });
  if (!payment || payment.status !== "paid") {
    const error = new Error("Payment has not been verified. Please complete payment before submitting.");
    error.statusCode = 402;
    throw error;
  }
  if (payment.usedAt) {
    const error = new Error("This payment reference has already been used for an application.");
    error.statusCode = 409;
    throw error;
  }
  if (payment.currency !== (settings.applicationFeeCurrency || "NGN") || payment.amountSubunit < amountSubunit(settings.applicationFeeAmount)) {
    const error = new Error("Payment amount does not match the current application fee.");
    error.statusCode = 402;
    throw error;
  }
  return payment;
}

function normalizeValue(value) {
  if (Array.isArray(value)) return value.map((item) => String(item || "").trim()).filter(Boolean);
  return String(value || "").trim();
}

function setNestedValue(target, key, value) {
  const path = key.split(".").filter(Boolean);
  if (!path.length) return;

  let cursor = target;
  path.slice(0, -1).forEach((part) => {
    if (!cursor[part] || typeof cursor[part] !== "object" || Array.isArray(cursor[part])) {
      cursor[part] = {};
    }
    cursor = cursor[part];
  });
  cursor[path[path.length - 1]] = normalizeValue(value);
}

function normalizeFormData(formData) {
  const normalized = {};
  Object.entries(formData).forEach(([key, value]) => {
    if (!OFFICIAL_USE_FIELDS.has(key)) setNestedValue(normalized, key, value);
  });
  return normalized;
}

function dataFromDoc(application) {
  if (application.formData instanceof Map) return Object.fromEntries(application.formData.entries());
  return application.formData || {};
}

function getFormValue(formData, key) {
  if (!formData || typeof formData !== "object") return undefined;
  if (Object.prototype.hasOwnProperty.call(formData, key)) return formData[key];
  return key.split(".").reduce((value, part) => {
    if (!value || typeof value !== "object") return undefined;
    return value[part];
  }, formData);
}

function stringValue(formData, key) {
  const value = getFormValue(formData, key);
  if (Array.isArray(value)) return value.filter(Boolean).join(", ");
  return String(value || "").trim();
}

function makeApplicationNumber() {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const suffix = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `ADM-${date}-${suffix}`;
}

function applicantName(formData) {
  return [stringValue(formData, "surname"), stringValue(formData, "firstName"), stringValue(formData, "middleName")]
    .filter(Boolean)
    .join(" ");
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function safeFileName(value) {
  const safe = String(value || "admission-application")
    .trim()
    .replace(/[^A-Za-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
  return safe || "admission-application";
}

function renderApplicationHtml(application) {
  const formData = dataFromDoc(application);
  const submittedAt = application.createdAt ? new Date(application.createdAt).toLocaleString("en-NG") : "";
  const sections = FIELD_GROUPS.map((group) => {
    const rows = group.fields.map(([label, key]) => `
      <tr>
        <th>${escapeHtml(label)}</th>
        <td>${escapeHtml(stringValue(formData, key))}</td>
      </tr>
    `).join("");

    return `
      <section>
        <h2>${escapeHtml(group.title)}</h2>
        <table>${rows}</table>
      </section>
    `;
  }).join("");

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(application.applicationNumber)} - Admission Application</title>
  <style>
    body { color: #0f172a; font-family: Arial, sans-serif; margin: 32px; }
    header { border-bottom: 2px solid #1f2a5c; margin-bottom: 24px; padding-bottom: 16px; }
    h1 { font-size: 24px; margin: 0 0 8px; }
    h2 { background: #eef8fc; color: #1f2a5c; font-size: 16px; margin: 28px 0 0; padding: 10px 12px; }
    p { margin: 4px 0; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #cbd5e1; font-size: 13px; padding: 9px 10px; text-align: left; vertical-align: top; }
    th { background: #f8fafc; width: 34%; }
    @media print { body { margin: 18px; } h2 { break-after: avoid; } tr { break-inside: avoid; } }
  </style>
</head>
<body>
  <header>
    <h1>COCIN Academy Admission Application</h1>
    <p><strong>Application number:</strong> ${escapeHtml(application.applicationNumber)}</p>
    <p><strong>Applicant:</strong> ${escapeHtml(application.applicantName)}</p>
    <p><strong>Submitted:</strong> ${escapeHtml(submittedAt)}</p>
  </header>
  ${sections}
</body>
</html>`;
}

exports.createApplication = asyncHandler(async (req, res) => {
  const parsed = applicationSchema.parse(req.body);
  const settings = await admissionSettings();
  const payment = await verifiedPaymentForApplication(settings, parsed.paymentReference);
  const formData = normalizeFormData(parsed.formData);
  const name = applicantName(formData);

  if (!name) return res.status(400).json({ message: "Please enter the pupil's name before submitting." });
  if (!stringValue(formData, "classApplyingFor")) return res.status(400).json({ message: "Please enter the class applying for before submitting." });

  const application = await AdmissionApplication.create({
    applicationNumber: makeApplicationNumber(),
    applicantName: name,
    applicantEmail: stringValue(formData, "father.email") || stringValue(formData, "mother.email"),
    applicantPhone: stringValue(formData, "father.phone") || stringValue(formData, "mother.phone"),
    classApplyingFor: stringValue(formData, "classApplyingFor"),
    payment: payment?._id,
    paymentReference: payment?.reference,
    feePaid: payment?.amount || 0,
    feeCurrency: payment?.currency || settings.applicationFeeCurrency || "NGN",
    formData
  });

  if (payment) {
    payment.usedAt = new Date();
    payment.application = application._id;
    await payment.save();
  }

  res.status(201).json({
    message: "Application submitted successfully",
    id: application._id,
    applicationNumber: application.applicationNumber
  });
});

exports.listApplications = asyncHandler(async (req, res) => {
  res.json(await AdmissionApplication.find().sort("-createdAt"));
});

exports.getApplication = asyncHandler(async (req, res) => {
  const application = await AdmissionApplication.findById(req.params.id);
  if (!application) return res.status(404).json({ message: "Application not found" });
  res.json(application);
});

exports.downloadApplication = asyncHandler(async (req, res) => {
  const application = await AdmissionApplication.findById(req.params.id);
  if (!application) return res.status(404).json({ message: "Application not found" });

  const fileName = `${safeFileName(application.applicationNumber)}-${safeFileName(application.applicantName)}.html`;
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
  res.send(renderApplicationHtml(application));
});

exports.deleteApplication = asyncHandler(async (req, res) => {
  const application = await AdmissionApplication.findByIdAndDelete(req.params.id);
  if (!application) return res.status(404).json({ message: "Application not found" });
  res.locals.audit = { resourceId: application._id, title: application.applicantName };
  res.json({ message: "Deleted successfully" });
});
