import { Download, ExternalLink, Eye, Paperclip, Trash2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import http from "../../api/http";
import { useApi } from "../../hooks/useApi";
import ConfirmDeleteModal from "../../components/admin/ConfirmDeleteModal";

const fieldGroups = [
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
    title: "Documents and Declaration",
    fields: [
      ["Documents Submitted", "documentsSubmitted"],
      ["Other Document", "otherDocument"],
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

function formatDate(value) {
  if (!value) return "Unknown date";
  return new Date(value).toLocaleString();
}

function formatFee(amount, currency = "NGN") {
  if (!Number(amount)) return "-";
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    maximumFractionDigits: 0
  }).format(Number(amount));
}

function formatFileSize(bytes = 0) {
  if (!bytes) return "";
  if (bytes < 1024 * 1024) return `${Math.ceil(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFormValue(formData, key) {
  if (!formData || typeof formData !== "object") return undefined;
  if (Object.prototype.hasOwnProperty.call(formData, key)) return formData[key];
  return key.split(".").reduce((value, part) => {
    if (!value || typeof value !== "object") return undefined;
    return value[part];
  }, formData);
}

function displayValue(formData, key) {
  const value = getFormValue(formData, key);
  if (Array.isArray(value)) return value.filter(Boolean).join(", ") || "-";
  return String(value || "-");
}

function fileNameFromDisposition(header) {
  const match = /filename="?([^"]+)"?/i.exec(header || "");
  return match?.[1] || "";
}

export default function AdmissionApplications() {
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [downloadingId, setDownloadingId] = useState("");
  const { data = [], loading, error, reload } = useApi(() => http.get("/admission-applications"), []);

  async function downloadApplication(application) {
    setDownloadingId(application._id);
    try {
      const response = await http.get(`/admission-applications/${application._id}/download`, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([response.data], { type: "text/html" }));
      const link = document.createElement("a");
      link.href = url;
      link.download = fileNameFromDisposition(response.headers["content-disposition"]) || `${application.applicationNumber || "admission-application"}.html`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      toast.error(err.response?.data?.message || "Unable to download application");
    } finally {
      setDownloadingId("");
    }
  }

  async function removeApplication() {
    if (!pendingDelete) return;
    try {
      await http.delete(`/admission-applications/${pendingDelete._id}`);
      toast.success("Application deleted");
      if (selectedApplication?._id === pendingDelete._id) setSelectedApplication(null);
      setPendingDelete(null);
      reload();
    } catch (err) {
      toast.error(err.response?.data?.message || "Unable to delete application");
    }
  }

  return (
    <div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-black">Admission Forms</h1>
          <p className="mt-2 text-sm text-slate-600">Review and download applications submitted from the public Admissions page.</p>
        </div>
      </div>

      <div className="card mt-6 overflow-x-auto">
        {loading ? (
          <p className="p-5">Loading...</p>
        ) : error ? (
          <p className="p-5 text-red-600">{error}</p>
        ) : !data.length ? (
          <p className="p-5 text-slate-500">No admission applications have been submitted yet.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="p-3">Applicant</th>
                <th className="p-3">Application No.</th>
                <th className="p-3">Class</th>
                <th className="p-3">Payment</th>
                <th className="p-3">Documents</th>
                <th className="p-3">Contact</th>
                <th className="p-3">Submitted</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((application) => (
                <tr className="border-t align-top" key={application._id}>
                  <td className="p-3 font-medium">{application.applicantName}</td>
                  <td className="p-3">{application.applicationNumber}</td>
                  <td className="p-3">{application.classApplyingFor || "-"}</td>
                  <td className="p-3">
                    <span className="block font-medium">{formatFee(application.feePaid, application.feeCurrency)}</span>
                    {application.paymentReference ? <span className="mt-1 block text-xs text-slate-500">{application.paymentReference}</span> : <span className="mt-1 block text-xs text-slate-400">No payment</span>}
                  </td>
                  <td className="p-3">
                    {application.documents?.length ? (
                      <span className="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
                        <Paperclip size={14} />
                        {application.documents.length}
                      </span>
                    ) : (
                      <span className="text-slate-400">None</span>
                    )}
                  </td>
                  <td className="p-3">
                    {application.applicantEmail ? <a className="block text-slate-600 hover:text-brand" href={`mailto:${application.applicantEmail}`}>{application.applicantEmail}</a> : <span className="block text-slate-400">No email</span>}
                    {application.applicantPhone ? <a className="mt-1 block text-slate-600 hover:text-brand" href={`tel:${application.applicantPhone}`}>{application.applicantPhone}</a> : <span className="mt-1 block text-slate-400">No phone</span>}
                  </td>
                  <td className="p-3">{formatDate(application.createdAt)}</td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-2">
                      <button className="btn-secondary px-3 py-1" type="button" onClick={() => setSelectedApplication(application)}>
                        <Eye size={16} />
                        View
                      </button>
                      <button className="btn-secondary px-3 py-1" type="button" onClick={() => downloadApplication(application)} disabled={downloadingId === application._id}>
                        <Download size={16} />
                        {downloadingId === application._id ? "Downloading" : "Download"}
                      </button>
                      <button className="btn-secondary border-red-200 px-3 py-1 text-red-600 hover:bg-red-50" type="button" onClick={() => setPendingDelete(application)}>
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selectedApplication && (
        <section className="card mt-6 p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-xl font-bold">{selectedApplication.applicantName}</h2>
              <p className="mt-1 text-sm text-slate-600">{selectedApplication.applicationNumber} - submitted {formatDate(selectedApplication.createdAt)}</p>
              {selectedApplication.paymentReference && (
                <p className="mt-1 text-sm font-medium text-emerald-700">
                  Payment: {formatFee(selectedApplication.feePaid, selectedApplication.feeCurrency)} - {selectedApplication.paymentReference}
                </p>
              )}
            </div>
            <button className="btn-primary" type="button" onClick={() => downloadApplication(selectedApplication)} disabled={downloadingId === selectedApplication._id}>
              <Download size={18} />
              Download form
            </button>
          </div>

          <div className="mt-6 grid gap-6">
            <div>
              <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-brand">Uploaded Documents</h3>
              {selectedApplication.documents?.length ? (
                <div className="grid gap-2 md:grid-cols-2">
                  {selectedApplication.documents.map((document, index) => (
                    <a
                      key={`${document.url}-${index}`}
                      className="flex min-w-0 items-center justify-between gap-3 rounded-md border border-slate-200 bg-slate-50 p-3 text-sm transition hover:border-brand hover:bg-white"
                      href={document.url}
                      rel="noreferrer"
                      target="_blank"
                    >
                      <span className="min-w-0">
                        <span className="block font-semibold text-slate-900">{document.label || "Admission document"}</span>
                        <span className="mt-1 block truncate text-xs text-slate-500">{document.originalName || document.url}</span>
                        {document.size ? <span className="mt-1 block text-xs text-slate-400">{formatFileSize(document.size)}</span> : null}
                      </span>
                      <ExternalLink className="shrink-0 text-slate-500" size={16} />
                    </a>
                  ))}
                </div>
              ) : (
                <p className="rounded-md border border-slate-200 bg-slate-50 p-3 text-sm text-slate-500">No documents were uploaded with this application.</p>
              )}
            </div>
            {fieldGroups.map((group) => (
              <div key={group.title}>
                <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-brand">{group.title}</h3>
                <dl className="grid gap-3 sm:grid-cols-2">
                  {group.fields.map(([label, key]) => (
                    <div key={key} className="rounded-md border border-slate-200 bg-slate-50 p-3">
                      <dt className="text-xs font-semibold uppercase text-slate-500">{label}</dt>
                      <dd className="mt-1 whitespace-pre-wrap text-sm text-slate-900">{displayValue(selectedApplication.formData, key)}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </div>
        </section>
      )}

      <ConfirmDeleteModal
        open={Boolean(pendingDelete)}
        title="Delete admission form?"
        message={`Delete the submitted form from ${pendingDelete?.applicantName || "this applicant"}?`}
        onCancel={() => setPendingDelete(null)}
        onConfirm={removeApplication}
      />
    </div>
  );
}
