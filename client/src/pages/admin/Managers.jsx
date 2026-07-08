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
  { name: "seoTitle", label: "SEO title", group: "Search Preview", description: seoTitleHelp },
  { name: "seoDescription", label: "SEO description", type: "textarea", group: "Search Preview", description: seoDescriptionHelp }
];

export const homepageFields = [
  { name: "heroTitle", label: "Main headline", group: "Main Hero" },
  { name: "heroSubtitle", label: "Intro text", type: "textarea", group: "Main Hero" },
  { name: "heroMedia", label: "Main image or video", type: "media", mediaTypeField: "heroMediaType", group: "Main Hero", description: mediaHelp },
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
      { name: "media", label: "Image or video", type: "media", mediaTypeField: "mediaType", description: mediaHelp }
    ]
  },
  { name: "aboutPreview", label: "About preview", type: "textarea", group: "About Preview" },
  { name: "whyChooseUs", label: "Why choose us cards", type: "repeatable", group: "Why Choose Us", fields: [{ name: "title", label: "Heading" }, { name: "description", label: "Text", type: "textarea" }] },
  { name: "admissionsCtaTitle", label: "Admissions heading", group: "Admissions Section" },
  { name: "admissionsCtaText", label: "Admissions text", type: "textarea", group: "Admissions Section" },
  { name: "seoTitle", label: "SEO title", group: "Search Preview", description: seoTitleHelp },
  { name: "seoDescription", label: "SEO description", type: "textarea", group: "Search Preview", description: seoDescriptionHelp }
];

export const blogFields = [
  { name: "title", label: "Title", required: true },
  { name: "excerpt", label: "Short summary", type: "textarea", required: true },
  { name: "content", label: "Main content", type: "richtext" },
  { name: "featuredImage", label: "Featured image", type: "image" },
  { name: "category", label: "Category" },
  { name: "status", label: "Visibility", type: "select", options: ["draft", "published"], defaultValue: "draft" },
  { name: "seoTitle", label: "SEO title", group: "Search Preview", description: seoTitleHelp },
  { name: "seoDescription", label: "SEO description", type: "textarea", group: "Search Preview", description: seoDescriptionHelp }
];

export const galleryFields = [{ name: "title", label: "Title", required: true }, { name: "description", label: "Description", type: "textarea" }, { name: "image", label: "Image", type: "image", required: true }, { name: "category", label: "Category" }, { name: "featured", label: "Featured", type: "checkbox" }];
export const eventFields = [{ name: "title", label: "Title", required: true }, { name: "image", label: "Image", type: "image" }, { name: "date", label: "Date", type: "date", required: true }, { name: "time", label: "Time" }, { name: "location", label: "Location" }, { name: "description", label: "Description", type: "richtext" }];
export const academicFields = [{ name: "title", label: "Title", required: true }, { name: "level", label: "Level" }, { name: "description", label: "Description", type: "textarea" }, { name: "curriculum", label: "Curriculum / classes (one per line)", type: "textarea" }, { name: "image", label: "Image", type: "image" }, { name: "isActive", label: "Show on website", type: "checkbox", defaultValue: true }];
export const staffFields = [{ name: "name", label: "Name", required: true }, { name: "role", label: "Role", required: true }, { name: "biography", label: "Biography", type: "textarea" }, { name: "qualification", label: "Qualification" }, { name: "image", label: "Image", type: "image" }, { name: "email", label: "Email" }, { name: "isActive", label: "Show on website", type: "checkbox", defaultValue: true }];
export const testimonialFields = [{ name: "name", label: "Person name", required: true }, { name: "role", label: "Role" }, { name: "message", label: "Message", type: "textarea", required: true }, { name: "image", label: "Image", type: "image" }, { name: "isActive", label: "Show on website", type: "checkbox", defaultValue: true }];
export const faqFields = [{ name: "question", label: "Question", required: true }, { name: "answer", label: "Answer", type: "textarea", required: true }, { name: "category", label: "Category" }, { name: "isActive", label: "Show on website", type: "checkbox", defaultValue: true }];
export const admissionFields = [{ name: "title", label: "Title" }, { name: "content", label: "Content", type: "richtext" }, { name: "requirements", label: "Requirements (one per line)", type: "textarea" }, { name: "processSteps", label: "Admission steps", type: "repeatable", fields: [{ name: "title", label: "Step heading" }, { name: "description", label: "Step details", type: "textarea" }] }, { name: "ctaText", label: "Closing message" }, { name: "seoTitle", label: "SEO title", group: "Search Preview", description: seoTitleHelp }, { name: "seoDescription", label: "SEO description", type: "textarea", group: "Search Preview", description: seoDescriptionHelp }];
export const pageFields = [{ name: "title", label: "Title" }, { name: "excerpt", label: "Short summary", type: "textarea" }, { name: "content", label: "Content", type: "richtext" }, { name: "mission", label: "Mission", type: "textarea" }, { name: "vision", label: "Vision", type: "textarea" }, { name: "coreValues", label: "Core values (one per line)", type: "textarea" }, { name: "seoTitle", label: "SEO title", group: "Search Preview", description: seoTitleHelp }, { name: "seoDescription", label: "SEO description", type: "textarea", group: "Search Preview", description: seoDescriptionHelp }];
export const headOfSchoolFields = [{ name: "title", label: "Page title" }, { name: "principalName", label: "Head of School name" }, { name: "principalQualification", label: "Qualification / title" }, { name: "principalImage", label: "Photo", type: "image" }, { name: "content", label: "Welcome message", type: "richtext" }, { name: "seoTitle", label: "SEO title", group: "Search Preview", description: seoTitleHelp }, { name: "seoDescription", label: "SEO description", type: "textarea", group: "Search Preview", description: seoDescriptionHelp }];

export function SettingsManager() { return <ResourceManager title="Website Settings" intro="Your school's name, logo, contact details, and social links. These appear across the whole website. Fill in the boxes and click Save changes — there is no list here because there is only one set of settings." endpoint="/settings" fields={settingsFields} singleton />; }
export function HomepageManager() { return <ResourceManager title="Homepage Content" intro="Everything visitors see first on your home page: the big hero banner, the rotating slideshow, and the sections below it. Edit the boxes and click Save changes to update the live home page." endpoint="/homepage" fields={homepageFields} singleton />; }
export function BlogManager() { return <ResourceManager title="Blog and News" intro="Write news posts and articles. Fill in the form and click Create to add one — it appears in the list below. Set Visibility to 'published' when you want visitors to see it; keep it as 'draft' while you are still working." endpoint="/blogs" fields={blogFields} columns={["title", "category", "status"]} />; }
export function GalleryManager() { return <ResourceManager title="Gallery" intro="Add photos to your website gallery. Fill in a title, upload an image, then click Create. Each photo you add shows up in the list below, where you can edit or delete it." endpoint="/gallery" fields={galleryFields} columns={["title", "category", "featured"]} />; }
export function EventManager() { return <ResourceManager title="Events" intro="Add upcoming events with a date, time, and location. Fill in the form and click Create. Events appear in the list below and on the public Events page." endpoint="/events" fields={eventFields} columns={["title", "date", "location"]} />; }
export function AcademicManager() { return <ResourceManager title="Academics" intro="List the academic programmes or classes your school offers. Fill in the form and click Create. Untick 'Show on website' to hide one without deleting it." endpoint="/academics" fields={academicFields} columns={["title", "level", "isActive"]} />; }
export function AdmissionsManager() { return <ResourceManager title="Admissions" intro="The content of your public Admissions page — requirements, steps to apply, and a closing message. Edit the boxes and click Save changes." endpoint="/admissions" fields={admissionFields} singleton />; }
export function StaffManager() { return <ResourceManager title="Staff" intro="Add teachers and staff members with their photo and role. Fill in the form and click Create. Untick 'Show on website' to hide someone without deleting them. Use Reorder to change the order they appear in." endpoint="/staff" fields={staffFields} columns={["name", "role", "isActive"]} />; }
export function TestimonialManager() { return <ResourceManager title="Testimonials" intro="Add quotes from parents or students. Fill in the form and click Create. Untick 'Show on website' to hide one without deleting it." endpoint="/testimonials" fields={testimonialFields} columns={["name", "role", "isActive"]} />; }
export function FAQManager() { return <ResourceManager title="FAQ" intro="Add frequently asked questions and their answers. Fill in the form and click Create. Use Reorder to change the order they appear in on the public FAQ page." endpoint="/faqs" fields={faqFields} columns={["question", "category", "isActive"]} />; }
export function PageManager() {
  return (
    <div className="grid gap-8">
      <ResourceManager title="About Page" intro="The content of your public About page. Edit the boxes and click Save changes to update it." endpoint="/pages/about" fields={pageFields} singleton />
      <ResourceManager title="Head of School" intro="The welcome message and photo shown on your public Head of School page. Fill in the boxes and click Save changes." endpoint="/pages/head-of-school-welcome" fields={headOfSchoolFields} singleton />
      <ResourceManager title="Privacy Policy" intro="The content of your public Privacy Policy page. Edit the boxes and click Save changes to update it." endpoint="/pages/privacy-policy" fields={pageFields.filter((field) => !["mission", "vision", "coreValues"].includes(field.name))} singleton />
    </div>
  );
}
