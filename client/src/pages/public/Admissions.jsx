import { CreditCard, FileText, Printer, RotateCcw, Send, Upload, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useOutletContext } from "react-router-dom";
import http from "../../api/http";
import { useApi } from "../../hooks/useApi";
import Loader from "../../components/public/Loader";
import ErrorMessage from "../../components/public/ErrorMessage";
import { defaultAdmissions } from "../../data/defaultContent";

const pupilFields = [
  ["Surname", "surname", "text", true],
  ["First Name", "firstName", "text", true],
  ["Middle Name", "middleName"],
  ["Date of Birth", "dateOfBirth", "date", true],
  ["Age", "age"],
  ["Place of Birth", "placeOfBirth"],
  ["Nationality", "nationality"],
  ["State of Origin", "stateOfOrigin"],
  ["Local Government Area", "localGovernmentArea"],
  ["Religion", "religion"],
  ["Denomination", "denomination"],
  ["Previous School Attended", "previousSchool"],
  ["Class Completed", "classCompleted"],
  ["Class Applying For", "classApplyingFor", "text", true]
];

const parentFields = [
  ["Name", "name"],
  ["Occupation", "occupation"],
  ["Employer", "employer"],
  ["Phone Number", "phone"],
  ["Email Address", "email", "email"]
];

const emergencyGroups = [
  ["Parent/Guardian Contact 1", "emergencyContactOne"],
  ["Parent/Guardian Contact 2", "emergencyContactTwo"],
  ["Emergency Contact (If Parents Cannot Be Reached)", "emergencyBackup"]
];

const documentOptions = [
  "Birth Certificate",
  "Previous School Report Card/Transcript",
  "Passport Photographs (2)",
  "Immunization Record",
  "Transfer Letter (if applicable)"
];

const officialUseFields = [
  ["Application Number", "officialApplicationNumber"],
  ["Date Received", "dateReceived", "date"],
  ["Entrance Assessment Score", "assessmentScore"],
  ["Class Offered", "classOffered"],
  ["Principal's Name", "principalName"],
  ["Principal's Signature", "principalSignature"],
  ["School Stamp", "schoolStamp", "text", "md:col-span-2"]
];

const PAYMENT_UNAVAILABLE_MESSAGE = "Online payment is temporarily unavailable. Please contact the school office or try again later.";
const PRIVATE_PAYMENT_ERROR_PATTERN = /paystack|secret[_\s-]?key|authorization|api[_\s-]?key/i;
const DOCUMENT_ACCEPT = "application/pdf,image/jpeg,image/png,image/webp,image/gif";
const MAX_ADMISSION_DOCUMENTS = 8;

function formatFee(amount, currency = "NGN") {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    maximumFractionDigits: 0
  }).format(Number(amount || 0));
}

function customerPaymentErrorMessage(err, fallback = PAYMENT_UNAVAILABLE_MESSAGE) {
  const message = err.response?.data?.message || err.message || "";
  if (!message || PRIVATE_PAYMENT_ERROR_PATTERN.test(message)) return fallback;
  return message;
}

function formatFileSize(bytes = 0) {
  if (!bytes) return "";
  if (bytes < 1024 * 1024) return `${Math.ceil(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function documentEntries(documentFiles) {
  return Object.entries(documentFiles).flatMap(([label, files]) => (files || []).map((file) => ({ label, file })));
}

function clearPaymentQuery() {
  window.history.replaceState({}, "", window.location.pathname);
}

function Section({ letter, title, children }) {
  return (
    <section className="break-inside-avoid border-t border-slate-200 px-5 py-6 sm:px-8 print:border-slate-300 print:px-0 print:py-4">
      <h2 className="mb-5 text-base font-black text-brand print:text-sm print:text-black">
        {letter}. {title}
      </h2>
      {children}
    </section>
  );
}

function TextField({ label, name, type = "text", className = "", required = false, disabled = false }) {
  return (
    <label className={`grid gap-1.5 ${className}`}>
      <span className="text-sm font-semibold text-slate-700 print:text-xs print:text-black">{label}</span>
      <input
        className="h-11 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none transition focus:border-brand focus:ring-2 focus:ring-[#dff4fc] disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500 print:h-8 print:rounded-none print:border-0 print:border-b print:border-slate-500 print:bg-white print:px-0 print:text-black print:focus:ring-0"
        disabled={disabled}
        name={name}
        required={required}
        type={type}
      />
    </label>
  );
}

function TextArea({ label, name, className = "", rows = 3 }) {
  return (
    <label className={`grid gap-1.5 ${className}`}>
      <span className="text-sm font-semibold text-slate-700 print:text-xs print:text-black">{label}</span>
      <textarea
        className="min-h-24 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition focus:border-brand focus:ring-2 focus:ring-[#dff4fc] print:min-h-16 print:rounded-none print:border-0 print:border-b print:border-slate-500 print:px-0 print:focus:ring-0"
        name={name}
        rows={rows}
      />
    </label>
  );
}

function CheckboxGroup({ legend, name, options, className = "", inputType = "checkbox", disabled = false }) {
  return (
    <fieldset className={`grid gap-2 ${className}`}>
      {legend && <legend className="text-sm font-semibold text-slate-700 print:text-xs print:text-black">{legend}</legend>}
      <div className="flex flex-wrap gap-3">
        {options.map((option) => (
          <label key={option} className="inline-flex min-h-10 items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 has-[:disabled]:text-slate-400 print:min-h-7 print:border-0 print:bg-white print:px-0 print:text-black">
            <input
              className="h-4 w-4 rounded border-slate-400 text-brand focus:ring-brand print:text-black"
              disabled={disabled}
              name={name}
              type={inputType}
              value={option}
            />
            <span>{option}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function DocumentUploadGroup({ documentFiles, onSelect, onRemove }) {
  const selectedCount = documentEntries(documentFiles).length;

  return (
    <div className="mt-6 grid gap-4 print:hidden">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <h3 className="text-sm font-bold text-slate-950">Upload documents</h3>
        <p className="text-xs font-semibold text-slate-500">{selectedCount}/{MAX_ADMISSION_DOCUMENTS} selected</p>
      </div>
      <p className="text-sm text-slate-600">PDF or image files only. Each file can be up to 8 MB.</p>
      <div className="grid gap-3 md:grid-cols-2">
        {documentOptions.map((option) => {
          const files = documentFiles[option] || [];
          return (
            <div key={option} className="rounded-md border border-slate-200 bg-slate-50 p-3">
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-semibold text-slate-800">{option}</p>
                {files.length > 0 && <span className="shrink-0 rounded bg-white px-2 py-0.5 text-xs font-semibold text-brand">{files.length}</span>}
              </div>
              <label className="mt-3 flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-slate-300 bg-white px-3 text-sm font-semibold text-slate-700 transition hover:border-brand hover:text-brand">
                <Upload size={16} />
                Select file
                <input
                  className="sr-only"
                  accept={DOCUMENT_ACCEPT}
                  multiple
                  type="file"
                  onChange={(event) => {
                    onSelect(option, event.target.files);
                    event.target.value = "";
                  }}
                />
              </label>
              {files.length > 0 && (
                <ul className="mt-3 grid gap-2">
                  {files.map((file, index) => (
                    <li key={`${file.name}-${file.size}-${index}`} className="flex min-w-0 items-center justify-between gap-2 rounded bg-white px-2 py-1.5 text-xs text-slate-600">
                      <span className="min-w-0 truncate">{file.name}</span>
                      <span className="shrink-0 text-slate-400">{formatFileSize(file.size)}</span>
                      <button className="shrink-0 rounded p-1 text-slate-500 hover:bg-red-50 hover:text-red-600" type="button" aria-label={`Remove ${file.name}`} onClick={() => onRemove(option, index)}>
                        <X size={14} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ParentBlock({ title, prefix }) {
  return (
    <div className="grid gap-4">
      <h3 className="text-sm font-bold text-slate-950 print:text-xs">{title}</h3>
      <div className="grid gap-4 md:grid-cols-2">
        {parentFields.map(([label, field, type]) => (
          <TextField key={field} label={label} name={`${prefix}.${field}`} type={type} />
        ))}
      </div>
    </div>
  );
}

function EmergencyBlock({ title, prefix }) {
  return (
    <div className="grid gap-4 rounded-md border border-slate-200 p-4 print:rounded-none print:border-slate-300 print:p-3">
      <h3 className="text-sm font-bold text-slate-950 print:text-xs">{title}</h3>
      <TextField label="Name" name={`${prefix}.name`} />
      <TextField label="Relationship" name={`${prefix}.relationship`} />
      <TextField label="Phone Number" name={`${prefix}.phone`} />
    </div>
  );
}

function YesNoQuestion({ question, name, followUpLabel }) {
  return (
    <div className="grid gap-3 rounded-md border border-slate-200 p-4 print:rounded-none print:border-slate-300 print:p-3">
      <CheckboxGroup legend={question} name={name} options={["Yes", "No"]} inputType="radio" />
      <TextArea label={followUpLabel} name={`${name}Details`} rows={2} />
    </div>
  );
}

function serializeApplicationForm(form) {
  const values = {};
  const formData = new FormData(form);

  formData.forEach((value, key) => {
    const nextValue = typeof value === "string" ? value.trim() : "";
    if (values[key] === undefined) {
      values[key] = nextValue;
    } else if (Array.isArray(values[key])) {
      values[key].push(nextValue);
    } else {
      values[key] = [values[key], nextValue];
    }
  });

  return values;
}

export default function Admissions() {
  const { settings } = useOutletContext() || {};
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isInitializingPayment, setIsInitializingPayment] = useState(false);
  const [isVerifyingPayment, setIsVerifyingPayment] = useState(false);
  const [submittedApplication, setSubmittedApplication] = useState(null);
  const [paymentReference, setPaymentReference] = useState("");
  const [paymentForm, setPaymentForm] = useState({ fullName: "", email: "", phone: "" });
  const [documentFiles, setDocumentFiles] = useState({});
  const [paymentSettingsLoaded, setPaymentSettingsLoaded] = useState(false);
  const [paymentSettingsError, setPaymentSettingsError] = useState("");
  const formRef = useRef(null);
  const paymentRef = useRef(null);
  const { data, loading, error, setData } = useApi(() => http.get("/admissions"), [], { fallbackData: defaultAdmissions, cacheKey: "admissions" });

  const paymentRequired = Boolean(data?.applicationFeeEnabled && Number(data?.applicationFeeAmount) > 0);
  const canAccessApplicationForm = !paymentRequired || Boolean(paymentReference);
  const shouldShowApplicationForm = showApplicationForm && paymentSettingsLoaded && canAccessApplicationForm;
  const feeLabel = formatFee(data?.applicationFeeAmount, data?.applicationFeeCurrency || "NGN");
  const applyButtonLabel = "Apply";

  useEffect(() => {
    let active = true;

    async function loadFreshPaymentSettings() {
      setPaymentSettingsLoaded(false);
      setPaymentSettingsError("");
      try {
        const response = await http.get("/admissions", { params: { _: Date.now() } });
        if (!active) return;
        setData(response.data);
        setPaymentSettingsLoaded(true);
      } catch (err) {
        if (!active) return;
        setPaymentSettingsError("Unable to confirm the current admission payment setting. Please refresh and try again.");
        setShowApplicationForm(false);
      }
    }

    loadFreshPaymentSettings();
    return () => {
      active = false;
    };
  }, [setData]);

  useEffect(() => {
    if (!paymentSettingsLoaded || !paymentRequired || paymentReference || isVerifyingPayment) return;
    const params = new URLSearchParams(window.location.search);
    const reference = params.get("reference") || params.get("trxref");
    if (!reference) return;

    async function verifyReturnedPayment() {
      setIsVerifyingPayment(true);
      try {
        const response = await http.get(`/admission-payments/verify/${encodeURIComponent(reference)}`);
        if (response.data?.paid && !response.data?.used) {
          setPaymentReference(response.data.reference);
          setShowPaymentForm(false);
          setShowApplicationForm(true);
          toast.success("Payment verified. You can now complete the application form.");
          clearPaymentQuery();
          window.requestAnimationFrame(() => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
        } else {
          setShowPaymentForm(true);
          clearPaymentQuery();
          toast.error(response.data?.used ? "This payment has already been used." : "Payment was not successful.");
        }
      } catch (err) {
        setShowPaymentForm(true);
        clearPaymentQuery();
        toast.error(customerPaymentErrorMessage(err, "Unable to verify payment."));
      } finally {
        setIsVerifyingPayment(false);
      }
    }

    verifyReturnedPayment();
  }, [paymentSettingsLoaded, paymentRequired, paymentReference, isVerifyingPayment]);

  useEffect(() => {
    if (showApplicationForm && (!paymentSettingsLoaded || !canAccessApplicationForm)) {
      setShowApplicationForm(false);
      setShowPaymentForm(paymentSettingsLoaded && paymentRequired);
    }
  }, [canAccessApplicationForm, paymentSettingsLoaded, paymentRequired, showApplicationForm]);

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;

  function openApplicationForm() {
    if (!paymentSettingsLoaded) {
      toast.error(paymentSettingsError || "Checking payment requirement. Please wait.");
      return;
    }
    if (paymentSettingsError) {
      toast.error(paymentSettingsError);
      return;
    }
    if (!canAccessApplicationForm) {
      setShowPaymentForm(true);
      setShowApplicationForm(false);
      window.requestAnimationFrame(() => {
        paymentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
      return;
    }
    setShowApplicationForm(true);
    setShowPaymentForm(false);
    window.requestAnimationFrame(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function selectDocumentFiles(label, fileList) {
    const files = Array.from(fileList || []);
    const otherCount = Object.entries(documentFiles).reduce((sum, [key, value]) => (key === label ? sum : sum + (value?.length || 0)), 0);
    const availableSlots = Math.max(MAX_ADMISSION_DOCUMENTS - otherCount, 0);
    const acceptedFiles = files.slice(0, availableSlots);

    if (files.length > acceptedFiles.length) {
      toast.error(`Upload up to ${MAX_ADMISSION_DOCUMENTS} documents.`);
    }

    setDocumentFiles((current) => {
      const next = { ...current };
      if (acceptedFiles.length) next[label] = acceptedFiles;
      else delete next[label];
      return next;
    });
  }

  function removeDocumentFile(label, index) {
    setDocumentFiles((current) => {
      const nextFiles = (current[label] || []).filter((_, fileIndex) => fileIndex !== index);
      const next = { ...current };
      if (nextFiles.length) next[label] = nextFiles;
      else delete next[label];
      return next;
    });
  }

  function resetApplicationForm() {
    setSubmittedApplication(null);
    setDocumentFiles({});
  }

  async function startPayment(event) {
    event.preventDefault();
    setIsInitializingPayment(true);
    try {
      const response = await http.post("/admission-payments/initialize", paymentForm);
      if (!response.data?.authorizationUrl) throw new Error("Payment link was not returned.");
      window.location.href = response.data.authorizationUrl;
    } catch (err) {
      toast.error(customerPaymentErrorMessage(err, "Unable to start payment. Please try again."));
    } finally {
      setIsInitializingPayment(false);
    }
  }

  async function submitApplication(event) {
    event.preventDefault();
    if (!canAccessApplicationForm) {
      setShowApplicationForm(false);
      setShowPaymentForm(paymentRequired);
      toast.error("Please complete payment before accessing the application form.");
      window.requestAnimationFrame(() => paymentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
      return;
    }

    const uploadedDocuments = documentEntries(documentFiles);
    if (uploadedDocuments.length > MAX_ADMISSION_DOCUMENTS) {
      toast.error(`Upload up to ${MAX_ADMISSION_DOCUMENTS} documents.`);
      return;
    }

    setIsSubmitting(true);
    setSubmittedApplication(null);

    try {
      const payload = new FormData();
      if (paymentReference) payload.append("paymentReference", paymentReference);
      payload.append("formData", JSON.stringify(serializeApplicationForm(event.currentTarget)));
      payload.append("documentLabels", JSON.stringify(uploadedDocuments.map(({ label }) => label)));
      uploadedDocuments.forEach(({ file }) => payload.append("documents", file));

      const response = await http.post("/admission-applications", payload);
      setSubmittedApplication(response.data);
      toast.success("Application submitted successfully");
    } catch (err) {
      if (err.response?.status === 402) {
        setShowApplicationForm(false);
        setShowPaymentForm(true);
        window.requestAnimationFrame(() => paymentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
      }
      toast.error(err.response?.data?.message || "Unable to submit application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="bg-slate-50 print:bg-white">
      <section className="container-pad py-12 print:max-w-none print:px-0 print:py-0">
        <div className="mb-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px] print:hidden">
          <div>
            <p className="text-sm font-bold text-accent">Admissions</p>
            <h1 className="mt-2 text-4xl font-black text-slate-950">{data.title}</h1>
            <article className="prose mt-5 max-w-none" dangerouslySetInnerHTML={{ __html: data.content }} />
            <button
              aria-controls="admissions-application-form"
              aria-expanded={showApplicationForm}
              className="btn-primary mt-6 px-6 py-3 text-base"
              disabled={!paymentSettingsLoaded || Boolean(paymentSettingsError) || isVerifyingPayment}
              type="button"
              onClick={openApplicationForm}
            >
              <FileText size={18} />
              {applyButtonLabel}
            </button>
            {paymentSettingsError && <p className="mt-3 text-sm font-semibold text-red-600">{paymentSettingsError}</p>}
            {paymentReference && (
              <p className="mt-3 text-sm font-semibold text-emerald-700">Payment verified. Reference: {paymentReference}</p>
            )}
          </div>
          <div className="card p-6">
            <h2 className="text-xl font-bold text-slate-950">Documents to prepare</h2>
            <ul className="mt-4 grid gap-2 text-sm text-slate-700">
              {documentOptions.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {isVerifyingPayment && (
          <div className="card mx-auto mb-8 max-w-3xl p-6 text-sm font-semibold text-slate-700 print:hidden">
            Verifying your payment...
          </div>
        )}

        {showPaymentForm && !paymentReference && (
          <form ref={paymentRef} className="card mx-auto mb-8 grid max-w-3xl gap-5 p-6 print:hidden" onSubmit={startPayment}>
            <div>
              <p className="text-sm font-bold text-accent">Application payment</p>
              <h2 className="mt-1 text-2xl font-black text-slate-950">Pay {feeLabel} to access the form</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">After payment is confirmed, the application form will open automatically.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="sm:col-span-2">
                <span className="label">Payer full name</span>
                <input
                  className="input"
                  required
                  value={paymentForm.fullName}
                  onChange={(event) => setPaymentForm((current) => ({ ...current, fullName: event.target.value }))}
                />
              </label>
              <label>
                <span className="label">Email</span>
                <input
                  className="input"
                  required
                  type="email"
                  value={paymentForm.email}
                  onChange={(event) => setPaymentForm((current) => ({ ...current, email: event.target.value }))}
                />
              </label>
              <label>
                <span className="label">Phone</span>
                <input
                  className="input"
                  value={paymentForm.phone}
                  onChange={(event) => setPaymentForm((current) => ({ ...current, phone: event.target.value }))}
                />
              </label>
            </div>
            <button className="btn-primary px-6 py-3" type="submit" disabled={isInitializingPayment}>
              <CreditCard size={18} />
              {isInitializingPayment ? "Opening payment..." : `Pay ${feeLabel}`}
            </button>
          </form>
        )}

        {shouldShowApplicationForm && <form id="admissions-application-form" ref={formRef} className="card mx-auto max-w-5xl overflow-hidden border-slate-300 bg-white print:max-w-none print:overflow-visible print:rounded-none print:border-0 print:shadow-none" onSubmit={submitApplication}>
          <div className="flex flex-col gap-4 border-b border-slate-200 bg-white px-5 py-6 sm:px-8 print:border-slate-300 print:px-0 print:py-0 print:pb-4">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-center gap-4">
                {settings?.logo && <img src={settings.logo} alt="" className="h-16 w-16 rounded-md border border-slate-200 bg-white object-contain p-1 print:h-14 print:w-14" />}
                <div>
                  <h2 className="text-3xl font-black text-slate-950 print:text-2xl">COCIN ACADEMY</h2>
                  <p className="mt-1 text-sm font-medium text-slate-600 print:text-xs print:text-black">Area One, Garki, Abuja, FCT.</p>
                </div>
              </div>
              <div className="flex gap-2 print:hidden">
                <button className="btn-secondary" type="reset" onClick={resetApplicationForm}>
                  <RotateCcw size={18} />
                  Clear
                </button>
                <button className="btn-primary" type="button" onClick={() => window.print()}>
                  <Printer size={18} />
                  Print
                </button>
              </div>
            </div>

            <label className="grid gap-2 text-center sm:flex sm:items-end sm:justify-center">
              <span className="text-lg font-black text-brand print:text-base print:text-black">Student&apos;s Application Form for Admission</span>
              <input
                aria-label="Application form reference"
                className="mx-auto h-9 w-full max-w-xs rounded-md border border-slate-300 px-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-[#dff4fc] sm:w-64 print:h-7 print:rounded-none print:border-0 print:border-b print:border-slate-500 print:px-0 print:focus:ring-0"
                name="applicationFormReference"
                type="text"
              />
            </label>
            <p className="text-center text-sm font-semibold text-slate-700 print:text-xs print:text-black">Motto: Becoming Like Christ</p>
          </div>

          <Section letter="A" title="Pupil's Information">
            <div className="grid gap-4 md:grid-cols-2">
              {pupilFields.slice(0, 3).map(([label, name, type, required]) => (
                <TextField key={name} label={label} name={name} required={required} type={type} />
              ))}
              <CheckboxGroup legend="Gender" name="gender" options={["Male", "Female"]} inputType="radio" />
              {pupilFields.slice(3).map(([label, name, type, required]) => (
                <TextField key={name} label={label} name={name} required={required} type={type} />
              ))}
              <TextArea className="md:col-span-2" label="Home Address" name="homeAddress" rows={2} />
            </div>
          </Section>

          <Section letter="B" title="Parent/Guardian Information">
            <div className="grid gap-7">
              <ParentBlock title="Father" prefix="father" />
              <ParentBlock title="Mother" prefix="mother" />
              <div className="grid gap-4">
                <h3 className="text-sm font-bold text-slate-950 print:text-xs">Home Information</h3>
                <TextArea label="Home Address" name="parentHomeAddress" rows={2} />
                <CheckboxGroup legend="Preferred Means of Communication" name="preferredCommunication" options={["Phone Call", "SMS", "WhatsApp", "Email"]} />
              </div>
            </div>
          </Section>

          <Section letter="C" title="Emergency Contacts">
            <div className="grid gap-4 lg:grid-cols-3">
              {emergencyGroups.map(([title, prefix]) => (
                <EmergencyBlock key={prefix} title={title} prefix={prefix} />
              ))}
            </div>
          </Section>

          <Section letter="D" title="Medical Information">
            <div className="grid gap-4 md:grid-cols-2">
              <TextField label="Child's Blood Group" name="bloodGroup" />
              <TextField label="Genotype" name="genotype" />
              <TextField label="Physician/Doctor's Name" name="physicianName" />
              <TextField label="Hospital/Clinic" name="hospitalClinic" />
              <TextField className="md:col-span-2" label="Physician's Phone Number" name="physicianPhone" />
            </div>
            <div className="mt-5 grid gap-4">
              <YesNoQuestion question="Does your child have any allergies?" name="allergies" followUpLabel="If Yes, specify" />
              <YesNoQuestion question="Does your child have any medical condition requiring special attention?" name="medicalCondition" followUpLabel="If Yes, explain" />
              <YesNoQuestion question="Is your child currently on any medication?" name="medication" followUpLabel="If Yes, state" />
            </div>
          </Section>

          <Section letter="E" title="Academic & Behavioural Information">
            <div className="grid gap-4">
              <YesNoQuestion question="Has the child ever repeated a class?" name="repeatedClass" followUpLabel="If Yes, specify" />
              <YesNoQuestion question="Has the child ever been suspended or expelled from school?" name="suspendedOrExpelled" followUpLabel="If Yes, explain" />
              <YesNoQuestion question="Does the child have any learning difficulty or special educational need?" name="learningDifficulty" followUpLabel="If Yes, please explain" />
            </div>
          </Section>

          <Section letter="F" title="Documents Submitted">
            <div className="grid gap-3 md:grid-cols-2">
              {documentOptions.map((item) => (
                <CheckboxGroup key={item} name="documentsSubmitted" options={[item]} />
              ))}
              <TextField label="Other" name="otherDocument" />
            </div>
            <DocumentUploadGroup documentFiles={documentFiles} onRemove={removeDocumentFile} onSelect={selectDocumentFiles} />
          </Section>

          <Section letter="G" title="Parent/Guardian Declaration">
            <p className="max-w-4xl text-sm leading-7 text-slate-700 print:text-xs print:leading-6 print:text-black">
              I certify that the information provided in this application form is true and complete to the best of my knowledge.
              I agree to abide by the rules, regulations, and policies of COCIN Academy. I also authorize the school to seek
              immediate medical attention for my child in the event of an emergency if I or my emergency contacts cannot be reached.
            </p>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              <TextField label="Parent/Guardian Name" name="declarationName" />
              <TextField label="Signature" name="declarationSignature" />
              <TextField label="Date" name="declarationDate" type="date" />
            </div>
          </Section>

          <Section letter="H" title="For Official Use Only">
            <div className="grid gap-4 md:grid-cols-2">
              {officialUseFields.map(([label, name, type, className]) => (
                <TextField key={name} className={className} disabled label={label} name={name} type={type} />
              ))}
              <CheckboxGroup className="md:col-span-2" disabled legend="Admission Status" name="admissionStatus" options={["Approved", "Pending", "Not Approved"]} inputType="radio" />
            </div>
          </Section>

          <div className="flex flex-col gap-4 border-t border-slate-200 px-5 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8 print:hidden">
            {submittedApplication ? (
              <p className="text-sm font-semibold text-emerald-700">
                Submitted successfully. Application number: {submittedApplication.applicationNumber}
              </p>
            ) : (
              <p className="text-sm text-slate-600">Review the form before submitting. The school office will receive the completed application.</p>
            )}
            <button className="btn-primary px-6 py-3" type="submit" disabled={isSubmitting}>
              <Send size={18} />
              {isSubmitting ? "Submitting..." : "Submit application"}
            </button>
          </div>
        </form>}
      </section>
    </main>
  );
}
