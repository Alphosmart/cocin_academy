import logoUrl from "../pages/public/assets/logo.jpeg";

const image = (text) => `https://placehold.co/1200x800/60939e/ffffff?text=${encodeURIComponent(text)}`;

const futureDate = (days) => new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();

export const defaultSettings = {
  schoolName: "COCIN Academy",
  motto: "Building lives on the Solid Rock",
  logo: logoUrl,
  favicon: logoUrl,
  primaryColor: "#60939e",
  secondaryColor: "#752636",
  email: "cocinacademy07@gmail.com",
  phone: "07046272361, 09018690022, 08180705629",
  whatsapp: "+2347046272361",
  address: "900241 Cadastral Street, Plot 5/7 Durumi District, Area 1, F.C.T. Abuja",
  portalUrl: "#",
  facebookUrl: "https://www.facebook.com/cocinacademyabuja1",
  instagramUrl: "https://www.instagram.com/cocinacademy/",
  youtubeUrl: "https://youtube.com",
  googleMapEmbed: "",
  footerText: "Training children through total education, one child at a time for Christ.",
  seoTitle: "COCIN Academy Abuja",
  seoDescription: "A Biblically-based Christian school in Abuja serving learners from Prekindergarten to Grade 12."
};

export const defaultHomepage = {
  heroTitle: "COCIN Academy",
  heroSubtitle: "A Biblically-based learning community preparing the hearts, minds, and spirits of learners in the image of Jesus Christ.",
  heroImage: image("COCIN Academy"),
  heroSlides: [
    {
      title: "COCIN Academy",
      subtitle: "A Biblically-based learning community preparing the hearts, minds, and spirits of learners in the image of Jesus Christ.",
      image: image("COCIN Academy"),
      ctaLabel: "Admissions",
      ctaLink: "/admissions"
    },
    {
      title: "Mastery-based education from Prekindergarten to Grade 12",
      subtitle: "Individualized learning, strong academics, Scripture memory, and practical character training help each learner grow.",
      image: image("Mastery Learning"),
      ctaLabel: "Academics",
      ctaLink: "/academics"
    },
    {
      title: "One child at a time for Christ",
      subtitle: "Chapel, devotion, discipleship, and the 90 character traits of Jesus Christ shape our daily school life.",
      image: image("Faith and Learning"),
      ctaLabel: "Contact Us",
      ctaLink: "/contact"
    }
  ],
  aboutPreview: "Welcome to COCIN Academy, where we provide a Biblically-based worldview of learning that prepares the hearts, minds, and spirits of all our learners. Our mission is to transform each learner in the image of Jesus Christ, the world's foremost example.",
  whyChooseUs: [
    { title: "Biblically-based Curriculum", description: "Biblical principles, Scripture memory, and wisdom principles are integrated into school programmes." },
    { title: "Godly Character Training", description: "Learners study the A.C.E. character programme and the 90 character traits of Jesus Christ." },
    { title: "Mastery-based Learning", description: "Built-in reinforcement and individualized learning help students progress with confidence." },
    { title: "Critical Thinking", description: "Academic work develops thinking skills while nurturing faith, service, and social growth." },
    { title: "Socialization", description: "Students grow through chapel, learning centre devotion, conventions, clubs, sports, and service." },
    { title: "Whole-child Care", description: "The school supports the spiritual, social, mental, and physical needs of every learner." }
  ],
  admissionsCtaTitle: "Admissions are open",
  admissionsCtaText: "Enrollment for all grades is through a diagnostic test, with early reading programmes placed through Academic Information manuals."
};

export const defaultAcademics = [
  { _id: "default-academics-prekindergarten", title: "Prekindergarten", level: "Prekindergarten", description: "Early foundations for young learners beginning school in a Christ-centred environment.", image: image("Prekindergarten") },
  { _id: "default-academics-primary", title: "Reading Readiness to Grade 6", level: "Primary", description: "Mastery-based learning in core subjects, Scripture memory, and character development.", image: image("Primary") },
  { _id: "default-academics-secondary", title: "Middle and High School", level: "Secondary", description: "Grade 7 to Grade 12 academics with electives, conventions, service, and college-level options for advanced students.", image: image("High School") }
];

export const defaultAdmissions = {
  title: "Admissions",
  content: "<p>Enrollment for all grades is through a diagnostic test. Reading Readiness and Learning to Read/Grade 1 placements are guided by Academic Information instructional manuals.</p>",
  requirements: ["Completed online application form", "Birth certificate", "Immunization record", "Previous school records", "Soft copy of the applicant's passport photograph"],
  processSteps: [
    { title: "Apply", description: "Fill out the online application form." },
    { title: "Submit Documents", description: "Submit all required documents for review." },
    { title: "Orientation", description: "Attend the compulsory parents orientation programme for all new families." },
    { title: "Interview", description: "Attend a parent-student interview." },
    { title: "Confirmation", description: "Receive admission confirmation from the school." }
  ],
  ctaText: "Speak with admissions"
};

export const defaultPages = {
  about: {
    title: "About Us",
    excerpt: "A Biblically-based Christian learning community.",
    content: "COCIN Academy provides a Biblically-based worldview of learning that prepares the hearts, minds, and spirits of all learners.",
    mission: "The school seeks to build lives on the Solid Rock, Christ Jesus our Lord, and to be involved in true Christian education for children, meeting their spiritual, social, mental, and physical needs.",
    vision: "Training children through total education, which is only found in Christ Jesus: a holistic education, one child at a time for Christ.",
    coreValues: ["Faith", "Excellence", "Integrity", "Service"]
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
