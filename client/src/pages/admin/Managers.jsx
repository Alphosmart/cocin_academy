import ResourceManager from "../../components/admin/ResourceManager";

const mediaHelp = "Upload a file, paste a direct image/video file link, or paste a YouTube/Vimeo link.";
const seoTitleHelp = "This is the page title shown in browser tabs and search results. Keep it clear, about 50-60 characters.";
const seoDescriptionHelp = "This short summary can appear under the title in search results. Aim for 140-160 characters.";

export const settingsFields = [
  { name: "schoolName", label: "School name" },
  { name: "motto", label: "Motto" },
  { name: "logo", label: "Logo", type: "image" },
  { name: "email", label: "Email" },
  { name: "phone", label: "Phone" },
  { name: "whatsapp", label: "WhatsApp" },
  { name: "address", label: "Address", type: "textarea" },
  { name: "facebookUrl", label: "Facebook link" },
  { name: "instagramUrl", label: "Instagram link" },
  { name: "youtubeUrl", label: "YouTube link" },
  { name: "tiktokUrl", label: "TikTok link" },
  { name: "xUrl", label: "X link" },
  { name: "footerText", label: "Footer text", type: "textarea" },
  { name: "seoTitle", label: "SEO title", group: "Search Preview", help: seoTitleHelp },
  { name: "seoDescription", label: "SEO description", type: "textarea", group: "Search Preview", help: seoDescriptionHelp }
];

export const homepageFields = [
  { name: "heroTitle", label: "Main headline", group: "Main Hero" },
  { name: "heroSubtitle", label: "Intro text", type: "textarea", group: "Main Hero" },
  { name: "heroMedia", label: "Main image or video", type: "media", mediaTypeField: "heroMediaType", group: "Main Hero", help: mediaHelp },
  { name: "heroMediaActive", label: "Show main image or video", type: "checkbox", defaultValue: true, group: "Main Hero" },
  {
    name: "heroSlides",
    label: "Homepage slideshow",
    type: "repeatable",
    group: "Homepage Slideshow",
    fields: [
      { name: "isActive", label: "Show this slide", type: "checkbox", defaultValue: true },
      { name: "title", label: "Heading" },
      { name: "subtitle", label: "Text", type: "textarea" },
      { name: "media", label: "Image or video", type: "media", mediaTypeField: "mediaType", help: mediaHelp }
    ]
  },
  { name: "aboutPreview", label: "About preview", type: "textarea", group: "About Preview" },
  { name: "whyChooseUs", label: "Why choose us cards", type: "repeatable", group: "Why Choose Us", fields: [{ name: "title", label: "Heading" }, { name: "description", label: "Text", type: "textarea" }] },
  { name: "admissionsCtaTitle", label: "Admissions heading", group: "Admissions Section" },
  { name: "admissionsCtaText", label: "Admissions text", type: "textarea", group: "Admissions Section" },
  { name: "seoTitle", label: "SEO title", group: "Search Preview", help: seoTitleHelp },
  { name: "seoDescription", label: "SEO description", type: "textarea", group: "Search Preview", help: seoDescriptionHelp }
];

export const blogFields = [
  { name: "title", label: "Title", required: true },
  { name: "excerpt", label: "Short summary", type: "textarea", required: true },
  { name: "content", label: "Main content", type: "richtext" },
  { name: "featuredImage", label: "Featured image", type: "image" },
  { name: "category", label: "Category" },
  { name: "status", label: "Visibility", type: "select", options: ["draft", "published"], defaultValue: "draft" },
  { name: "seoTitle", label: "SEO title", group: "Search Preview", help: seoTitleHelp },
  { name: "seoDescription", label: "SEO description", type: "textarea", group: "Search Preview", help: seoDescriptionHelp }
];

export const galleryFields = [{ name: "title", label: "Title", required: true }, { name: "description", label: "Description", type: "textarea" }, { name: "image", label: "Image", type: "image", required: true }, { name: "category", label: "Category" }, { name: "featured", label: "Featured", type: "checkbox" }];
export const eventFields = [{ name: "title", label: "Title", required: true }, { name: "image", label: "Image", type: "image" }, { name: "date", label: "Date", type: "date", required: true }, { name: "time", label: "Time" }, { name: "location", label: "Location" }, { name: "description", label: "Description", type: "richtext" }];
export const academicFields = [{ name: "title", label: "Title", required: true }, { name: "level", label: "Level" }, { name: "description", label: "Description", type: "textarea" }, { name: "image", label: "Image", type: "image" }, { name: "isActive", label: "Show on website", type: "checkbox", defaultValue: true }];
export const staffFields = [{ name: "name", label: "Name", required: true }, { name: "role", label: "Role", required: true }, { name: "biography", label: "Biography", type: "textarea" }, { name: "qualification", label: "Qualification" }, { name: "image", label: "Image", type: "image" }, { name: "email", label: "Email" }, { name: "isActive", label: "Show on website", type: "checkbox", defaultValue: true }];
export const testimonialFields = [{ name: "name", label: "Person name", required: true }, { name: "role", label: "Role" }, { name: "message", label: "Message", type: "textarea", required: true }, { name: "image", label: "Image", type: "image" }, { name: "isActive", label: "Show on website", type: "checkbox", defaultValue: true }];
export const faqFields = [{ name: "question", label: "Question", required: true }, { name: "answer", label: "Answer", type: "textarea", required: true }, { name: "category", label: "Category" }, { name: "isActive", label: "Show on website", type: "checkbox", defaultValue: true }];
export const admissionFields = [{ name: "title", label: "Title" }, { name: "content", label: "Content", type: "richtext" }, { name: "requirements", label: "Requirements (one per line)", type: "textarea" }, { name: "processSteps", label: "Admission steps", type: "repeatable", fields: [{ name: "title", label: "Step heading" }, { name: "description", label: "Step details", type: "textarea" }] }, { name: "ctaText", label: "Closing message" }, { name: "seoTitle", label: "SEO title", group: "Search Preview", help: seoTitleHelp }, { name: "seoDescription", label: "SEO description", type: "textarea", group: "Search Preview", help: seoDescriptionHelp }];
export const pageFields = [{ name: "title", label: "Title" }, { name: "excerpt", label: "Short summary", type: "textarea" }, { name: "content", label: "Content", type: "richtext" }, { name: "mission", label: "Mission", type: "textarea" }, { name: "vision", label: "Vision", type: "textarea" }, { name: "coreValues", label: "Core values (one per line)", type: "textarea" }, { name: "seoTitle", label: "SEO title", group: "Search Preview", help: seoTitleHelp }, { name: "seoDescription", label: "SEO description", type: "textarea", group: "Search Preview", help: seoDescriptionHelp }];

export function SettingsManager() { return <ResourceManager title="Website Settings" endpoint="/settings" fields={settingsFields} singleton />; }
export function HomepageManager() { return <ResourceManager title="Homepage Content" endpoint="/homepage" fields={homepageFields} singleton />; }
export function BlogManager() { return <ResourceManager title="Blog and News" endpoint="/blogs" fields={blogFields} columns={["title", "category", "status"]} />; }
export function GalleryManager() { return <ResourceManager title="Gallery" endpoint="/gallery" fields={galleryFields} columns={["title", "category", "featured"]} />; }
export function EventManager() { return <ResourceManager title="Events" endpoint="/events" fields={eventFields} columns={["title", "date", "location"]} />; }
export function AcademicManager() { return <ResourceManager title="Academics" endpoint="/academics" fields={academicFields} columns={["title", "level", "isActive"]} />; }
export function AdmissionsManager() { return <ResourceManager title="Admissions" endpoint="/admissions" fields={admissionFields} singleton />; }
export function StaffManager() { return <ResourceManager title="Staff" endpoint="/staff" fields={staffFields} columns={["name", "role", "isActive"]} />; }
export function TestimonialManager() { return <ResourceManager title="Testimonials" endpoint="/testimonials" fields={testimonialFields} columns={["name", "role", "isActive"]} />; }
export function FAQManager() { return <ResourceManager title="FAQ" endpoint="/faqs" fields={faqFields} columns={["question", "category", "isActive"]} />; }
export function PageManager() {
  return (
    <div className="grid gap-8">
      <ResourceManager title="About Page" endpoint="/pages/about" fields={pageFields} singleton />
      <ResourceManager title="Privacy Policy" endpoint="/pages/privacy-policy" fields={pageFields.filter((field) => !["mission", "vision", "coreValues"].includes(field.name))} singleton />
    </div>
  );
}
