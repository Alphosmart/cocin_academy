import ResourceManager from "../../components/admin/ResourceManager";

export const settingsFields = [
  { name: "schoolName", label: "School name" }, { name: "motto", label: "Motto" }, { name: "logo", label: "Logo", type: "image" }, { name: "favicon", label: "Favicon", type: "image" },
  { name: "primaryColor", label: "Primary color", type: "color" }, { name: "secondaryColor", label: "Secondary color", type: "color" }, { name: "email", label: "Email" }, { name: "phone", label: "Phone" },
  { name: "whatsapp", label: "WhatsApp" }, { name: "address", label: "Address", type: "textarea" }, { name: "facebookUrl", label: "Facebook URL" },
  { name: "instagramUrl", label: "Instagram URL" }, { name: "youtubeUrl", label: "YouTube URL" }, { name: "tiktokUrl", label: "TikTok URL" }, { name: "xUrl", label: "X URL" },
  { name: "googleMapEmbed", label: "Google Map embed", type: "textarea" }, { name: "footerText", label: "Footer text", type: "textarea" }, { name: "seoTitle", label: "SEO title" }, { name: "seoDescription", label: "SEO description", type: "textarea" }
];

export const homepageFields = [
  { name: "heroTitle", label: "Hero title", group: "Main Hero" }, { name: "heroSubtitle", label: "Hero subtitle", type: "textarea", group: "Main Hero" }, { name: "heroMedia", label: "Hero media", type: "media", mediaTypeField: "heroMediaType", group: "Main Hero" }, { name: "heroMediaActive", label: "Show main hero media", type: "checkbox", defaultValue: true, group: "Main Hero" },
  { name: "heroSlides", label: "Hero carousel slides", type: "repeatable", group: "Hero Carousel", fields: [{ name: "isActive", label: "Active", type: "checkbox", defaultValue: true }, { name: "title", label: "Title" }, { name: "subtitle", label: "Subtitle", type: "textarea" }, { name: "media", label: "Media", type: "media", mediaTypeField: "mediaType" }, { name: "ctaLabel", label: "Button label" }, { name: "ctaLink", label: "Button link" }] },
  { name: "aboutPreview", label: "About preview", type: "textarea", group: "About Preview" },
  { name: "whyChooseUs", label: "Why Choose Us items", type: "repeatable", group: "Why Choose Us", fields: [{ name: "title", label: "Title" }, { name: "description", label: "Description", type: "textarea" }] },
  { name: "admissionsCtaTitle", label: "Admissions CTA title", group: "Admissions CTA" }, { name: "admissionsCtaText", label: "Admissions CTA text", type: "textarea", group: "Admissions CTA" },
  { name: "seoTitle", label: "SEO title", group: "SEO" }, { name: "seoDescription", label: "SEO description", type: "textarea", group: "SEO" }
];

export const blogFields = [
  { name: "title", label: "Title" }, { name: "slug", label: "Slug" }, { name: "excerpt", label: "Excerpt", type: "textarea" }, { name: "content", label: "Content", type: "richtext" },
  { name: "featuredImage", label: "Featured image", type: "image" }, { name: "category", label: "Category" }, { name: "tags", label: "Tags (comma-separated)" }, { name: "author", label: "Author" },
  { name: "status", label: "Status", type: "select", options: ["draft", "published"], defaultValue: "draft" }, { name: "seoTitle", label: "SEO title" }, { name: "seoDescription", label: "SEO description", type: "textarea" }
];

export const galleryFields = [{ name: "title", label: "Title", required: true }, { name: "description", label: "Description", type: "textarea" }, { name: "image", label: "Image", type: "image", required: true }, { name: "category", label: "Category" }, { name: "featured", label: "Featured", type: "checkbox" }];
export const eventFields = [{ name: "title", label: "Title", required: true }, { name: "slug", label: "Slug" }, { name: "image", label: "Image", type: "image" }, { name: "date", label: "Date", type: "date", required: true }, { name: "time", label: "Time" }, { name: "location", label: "Location" }, { name: "description", label: "Description", type: "richtext" }];
export const academicFields = [{ name: "title", label: "Title", required: true }, { name: "level", label: "Level" }, { name: "description", label: "Description", type: "textarea" }, { name: "image", label: "Image", type: "image" }, { name: "order", label: "Order", type: "number" }, { name: "isActive", label: "Active", type: "checkbox", defaultValue: true }];
export const staffFields = [{ name: "name", label: "Name", required: true }, { name: "role", label: "Role", required: true }, { name: "biography", label: "Biography", type: "textarea" }, { name: "qualification", label: "Qualification" }, { name: "image", label: "Image", type: "image" }, { name: "email", label: "Email" }, { name: "linkedinUrl", label: "LinkedIn URL" }, { name: "xUrl", label: "X URL" }, { name: "order", label: "Order", type: "number" }, { name: "isActive", label: "Active", type: "checkbox", defaultValue: true }];
export const testimonialFields = [{ name: "name", label: "Person name", required: true }, { name: "role", label: "Role" }, { name: "message", label: "Message", type: "textarea", required: true }, { name: "image", label: "Image", type: "image" }, { name: "isActive", label: "Active", type: "checkbox", defaultValue: true }];
export const faqFields = [{ name: "question", label: "Question", required: true }, { name: "answer", label: "Answer", type: "textarea", required: true }, { name: "category", label: "Category" }, { name: "order", label: "Order", type: "number" }, { name: "isActive", label: "Active", type: "checkbox", defaultValue: true }];
export const admissionFields = [{ name: "title", label: "Title" }, { name: "content", label: "Content", type: "richtext" }, { name: "requirements", label: "Requirements (one per line)", type: "textarea" }, { name: "processSteps", label: "Process steps", type: "repeatable", fields: [{ name: "title", label: "Step title" }, { name: "description", label: "Step description", type: "textarea" }] }, { name: "ctaText", label: "CTA text" }, { name: "seoTitle", label: "SEO title" }, { name: "seoDescription", label: "SEO description", type: "textarea" }];
export const pageFields = [{ name: "title", label: "Title" }, { name: "excerpt", label: "Excerpt", type: "textarea" }, { name: "content", label: "Content", type: "richtext" }, { name: "mission", label: "Mission", type: "textarea" }, { name: "vision", label: "Vision", type: "textarea" }, { name: "coreValues", label: "Core values (one per line)", type: "textarea" }, { name: "seoTitle", label: "SEO title" }, { name: "seoDescription", label: "SEO description", type: "textarea" }];

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
