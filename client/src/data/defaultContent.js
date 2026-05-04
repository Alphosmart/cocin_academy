const image = (text) => `https://placehold.co/1200x800/0f766e/ffffff?text=${encodeURIComponent(text)}`;

const futureDate = (days) => new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();

export const defaultSettings = {
  schoolName: "Bright Future Academy",
  motto: "Learning today, leading tomorrow",
  logo: "",
  primaryColor: "#0f766e",
  secondaryColor: "#f59e0b",
  email: "info@brightfuture.edu",
  phone: "+234 800 000 0000",
  whatsapp: "+2348000000000",
  address: "1 Education Road, Lagos, Nigeria",
  portalUrl: "#",
  facebookUrl: "https://facebook.com",
  instagramUrl: "https://instagram.com",
  youtubeUrl: "https://youtube.com",
  googleMapEmbed: "",
  footerText: "Nurturing confident learners and responsible leaders.",
  seoTitle: "Bright Future Academy",
  seoDescription: "A professional school committed to academic excellence and character."
};

export const defaultHomepage = {
  heroTitle: "A school where character and excellence grow together",
  heroSubtitle: "Bright Future Academy gives every learner the structure, care, and inspiration to thrive.",
  heroImage: image("Students"),
  heroSlides: [
    {
      title: "A school where character and excellence grow together",
      subtitle: "Bright Future Academy gives every learner the structure, care, and inspiration to thrive.",
      image: image("Students"),
      ctaLabel: "Admissions",
      ctaLink: "/admissions"
    },
    {
      title: "Balanced learning for confident young leaders",
      subtitle: "Strong academics, practical creativity, sports, and values help each learner discover their best path.",
      image: image("Learning"),
      ctaLabel: "Academics",
      ctaLink: "/academics"
    },
    {
      title: "A safe community where families feel at home",
      subtitle: "Our teachers partner with parents to support growth, discipline, curiosity, and joy in learning.",
      image: image("Community"),
      ctaLabel: "Contact Us",
      ctaLink: "/contact"
    }
  ],
  aboutPreview: "We combine strong academics, attentive pastoral care, and practical leadership opportunities in a safe learning community.",
  whyChooseUs: [
    { title: "Experienced Teachers", description: "Dedicated educators who know every learner by name." },
    { title: "Balanced Curriculum", description: "Academics, creativity, technology, sports, and character formation." },
    { title: "Safe Environment", description: "A welcoming campus designed for focus, confidence, and growth." }
  ],
  admissionsCtaTitle: "Applications are open",
  admissionsCtaText: "Meet our admissions team and discover the right class placement for your child."
};

export const defaultAcademics = [
  { _id: "default-academics-early-years", title: "Early Years", level: "Nursery", description: "Play-rich foundations for literacy, numeracy, and social confidence.", image: image("Early Years") },
  { _id: "default-academics-primary", title: "Primary School", level: "Primary", description: "Strong core subjects with arts, technology, sports, and leadership.", image: image("Primary") },
  { _id: "default-academics-secondary", title: "Junior Secondary", level: "Secondary", description: "Focused preparation for higher study, independence, and responsibility.", image: image("Secondary") }
];

export const defaultAdmissions = {
  title: "Admissions",
  content: "<p>Our admissions process is friendly, transparent, and designed to help families make a confident decision.</p>",
  requirements: ["Completed application form", "Previous school records", "Birth certificate", "Two passport photographs"],
  processSteps: [
    { title: "Enquire", description: "Contact us or visit the school." },
    { title: "Assessment", description: "Schedule an age-appropriate placement assessment." },
    { title: "Enrollment", description: "Complete registration and orientation." }
  ],
  ctaText: "Speak with admissions"
};

export const defaultPages = {
  about: {
    title: "About Us",
    excerpt: "A caring learning community with high expectations.",
    content: "Bright Future Academy partners with families to raise curious, disciplined, and compassionate learners.",
    mission: "To educate learners through excellent teaching, strong values, and meaningful opportunities.",
    vision: "To be a leading school known for character, innovation, and academic distinction.",
    coreValues: ["Integrity", "Excellence", "Respect", "Service", "Curiosity"]
  },
  "privacy-policy": {
    title: "Privacy Policy",
    content: "We collect only the information needed to respond to enquiries and operate school services responsibly."
  }
};

export const defaultBlogs = [
  {
    _id: "default-blog-science-fair",
    slug: "students-shine-at-inter-school-science-fair",
    title: "Students Shine at Inter-School Science Fair",
    excerpt: "Our science club earned top recognition for practical problem-solving projects.",
    content: "<p>Students presented creative solutions in renewable energy, water filtration, and robotics.</p>",
    featuredImage: image("Science Fair"),
    category: "News",
    author: "School Admin",
    status: "published",
    createdAt: new Date().toISOString()
  },
  {
    _id: "default-blog-library-resources",
    slug: "new-library-resources-now-available",
    title: "New Library Resources Now Available",
    excerpt: "The school library has expanded its reading and research collection.",
    content: "<p>Learners now have access to more fiction, reference texts, and digital resources.</p>",
    featuredImage: image("Library"),
    category: "Academics",
    author: "School Admin",
    status: "published",
    createdAt: new Date().toISOString()
  }
];

export const defaultGallery = [
  { _id: "default-gallery-assembly", title: "Morning Assembly", description: "A calm start to the school day.", image: image("Assembly"), category: "Campus", featured: true },
  { _id: "default-gallery-sports", title: "Sports Day", description: "Students building teamwork through sport.", image: image("Sports"), category: "Events", featured: true },
  { _id: "default-gallery-art", title: "Art Studio", description: "Creative learning in action.", image: image("Art"), category: "Creativity", featured: true }
];

export const defaultEvents = [
  { _id: "default-event-open-day", slug: "open-day", title: "Open Day", date: futureDate(14), time: "10:00 AM", location: "School Hall", description: "<p>Tour the campus and meet our staff.</p>", image: image("Open Day") },
  { _id: "default-event-cultural-day", slug: "cultural-day", title: "Cultural Day", date: futureDate(40), time: "11:00 AM", location: "Main Field", description: "<p>A celebration of heritage, language, food, and music.</p>", image: image("Cultural Day") }
];

export const defaultTestimonials = [
  { _id: "default-testimonial-parent", name: "Mrs. E. Johnson", role: "Parent", message: "The teachers are attentive, and my child has grown in confidence and discipline." },
  { _id: "default-testimonial-alumnus", name: "Daniel A.", role: "Alumnus", message: "Bright Future gave me the habits and courage I still rely on today." }
];

export const defaultStaff = [
  { _id: "default-staff-principal", name: "Mrs. Ada Williams", role: "Principal", qualification: "M.Ed Educational Leadership", biography: "Ada leads with warmth, clarity, and a deep belief in every learner.", image: image("Principal") },
  { _id: "default-staff-academics", name: "Mr. Tunde Okafor", role: "Head of Academics", qualification: "B.Sc, PGDE", biography: "Tunde coordinates curriculum quality and teacher development.", image: image("Academics") }
];

export const defaultFaqs = [
  { _id: "default-faq-apply", question: "How do I apply?", answer: "Complete the enquiry form or contact admissions to schedule a visit.", category: "Admissions" },
  { _id: "default-faq-portal", question: "Does the school have a portal?", answer: "Yes. Parents and students can use the School Portal button to access the existing portal.", category: "Portal" },
  { _id: "default-faq-tour", question: "Can I book a school tour?", answer: "Yes. Send a message through the contact form or call the school office.", category: "Admissions" }
];
