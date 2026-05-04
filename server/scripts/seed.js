require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../src/config/db");
const User = require("../src/models/User");
const SiteSettings = require("../src/models/SiteSettings");
const HomepageContent = require("../src/models/HomepageContent");
const PageContent = require("../src/models/PageContent");
const BlogPost = require("../src/models/BlogPost");
const GalleryItem = require("../src/models/GalleryItem");
const Event = require("../src/models/Event");
const Testimonial = require("../src/models/Testimonial");
const StaffMember = require("../src/models/StaffMember");
const AcademicProgram = require("../src/models/AcademicProgram");
const AdmissionContent = require("../src/models/AdmissionContent");
const FAQ = require("../src/models/FAQ");

const placeholder = (text) => `https://placehold.co/1200x800/0f766e/ffffff?text=${encodeURIComponent(text)}`;

async function seed() {
  await connectDB();

  await Promise.all([
    User.deleteMany(),
    SiteSettings.deleteMany(),
    HomepageContent.deleteMany(),
    PageContent.deleteMany(),
    BlogPost.deleteMany(),
    GalleryItem.deleteMany(),
    Event.deleteMany(),
    Testimonial.deleteMany(),
    StaffMember.deleteMany(),
    AcademicProgram.deleteMany(),
    AdmissionContent.deleteMany(),
    FAQ.deleteMany()
  ]);

  await User.create({
    name: process.env.ADMIN_NAME || "School Admin",
    email: process.env.ADMIN_EMAIL || "admin@example.com",
    password: process.env.ADMIN_PASSWORD || "ChangeMe123!"
  });

  await SiteSettings.create({
    schoolName: "Bright Future Academy",
    motto: "Learning today, leading tomorrow",
    logo: placeholder("Logo"),
    favicon: placeholder("Icon"),
    primaryColor: "#0f766e",
    secondaryColor: "#f59e0b",
    email: "info@brightfuture.edu",
    phone: "+234 800 000 0000",
    whatsapp: "+2348000000000",
    address: "1 Education Road, Lagos, Nigeria",
    portalUrl: "https://portal.example.com",
    facebookUrl: "https://facebook.com",
    instagramUrl: "https://instagram.com",
    youtubeUrl: "https://youtube.com",
    googleMapEmbed: "",
    footerText: "Nurturing confident learners and responsible leaders.",
    seoTitle: "Bright Future Academy",
    seoDescription: "A professional school committed to academic excellence and character."
  });

  await HomepageContent.create({
    heroTitle: "A school where character and excellence grow together",
    heroSubtitle: "Bright Future Academy gives every learner the structure, care, and inspiration to thrive.",
    heroImage: placeholder("Students"),
    heroSlides: [
      {
        title: "A school where character and excellence grow together",
        subtitle: "Bright Future Academy gives every learner the structure, care, and inspiration to thrive.",
        image: placeholder("Students"),
        ctaLabel: "Admissions",
        ctaLink: "/admissions"
      },
      {
        title: "Balanced learning for confident young leaders",
        subtitle: "Strong academics, practical creativity, sports, and values help each learner discover their best path.",
        image: placeholder("Learning"),
        ctaLabel: "Academics",
        ctaLink: "/academics"
      },
      {
        title: "A safe community where families feel at home",
        subtitle: "Our teachers partner with parents to support growth, discipline, curiosity, and joy in learning.",
        image: placeholder("Community"),
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
  });

  await PageContent.create([
    {
      slug: "about",
      title: "About Us",
      excerpt: "A caring learning community with high expectations.",
      content: "Bright Future Academy partners with families to raise curious, disciplined, and compassionate learners.",
      mission: "To educate learners through excellent teaching, strong values, and meaningful opportunities.",
      vision: "To be a leading school known for character, innovation, and academic distinction.",
      coreValues: ["Integrity", "Excellence", "Respect", "Service", "Curiosity"]
    },
    {
      slug: "privacy-policy",
      title: "Privacy Policy",
      content: "We collect only the information needed to respond to enquiries and operate school services responsibly."
    }
  ]);

  await AdmissionContent.create({
    title: "Admissions",
    content: "Our admissions process is friendly, transparent, and designed to help families make a confident decision.",
    requirements: ["Completed application form", "Previous school records", "Birth certificate", "Two passport photographs"],
    processSteps: [
      { title: "Enquire", description: "Contact us or visit the school." },
      { title: "Assessment", description: "Schedule an age-appropriate placement assessment." },
      { title: "Enrollment", description: "Complete registration and orientation." }
    ],
    ctaText: "Speak with admissions"
  });

  await AcademicProgram.create([
    { title: "Early Years", level: "Nursery", description: "Play-rich foundations for literacy, numeracy, and social confidence.", image: placeholder("Early Years"), order: 1 },
    { title: "Primary School", level: "Primary", description: "Strong core subjects with arts, technology, sports, and leadership.", image: placeholder("Primary"), order: 2 },
    { title: "Junior Secondary", level: "Secondary", description: "Focused preparation for higher study, independence, and responsibility.", image: placeholder("Secondary"), order: 3 }
  ]);

  await BlogPost.create([
    {
      title: "Students Shine at Inter-School Science Fair",
      excerpt: "Our science club earned top recognition for practical problem-solving projects.",
      content: "<p>Students presented creative solutions in renewable energy, water filtration, and robotics.</p>",
      featuredImage: placeholder("Science Fair"),
      category: "News",
      tags: ["science", "awards"],
      author: "School Admin",
      status: "published"
    },
    {
      title: "New Library Resources Now Available",
      excerpt: "The school library has expanded its reading and research collection.",
      content: "<p>Learners now have access to more fiction, reference texts, and digital resources.</p>",
      featuredImage: placeholder("Library"),
      category: "Academics",
      tags: ["library", "reading"],
      author: "School Admin",
      status: "published"
    }
  ]);

  await GalleryItem.create([
    { title: "Morning Assembly", description: "A calm start to the school day.", image: placeholder("Assembly"), category: "Campus", featured: true },
    { title: "Sports Day", description: "Students building teamwork through sport.", image: placeholder("Sports"), category: "Events", featured: true },
    { title: "Art Studio", description: "Creative learning in action.", image: placeholder("Art"), category: "Creativity" }
  ]);

  await Event.create([
    { title: "Open Day", date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14), time: "10:00 AM", location: "School Hall", description: "Tour the campus and meet our staff.", image: placeholder("Open Day") },
    { title: "Cultural Day", date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 40), time: "11:00 AM", location: "Main Field", description: "A celebration of heritage, language, food, and music.", image: placeholder("Cultural Day") }
  ]);

  await StaffMember.create([
    { name: "Mrs. Ada Williams", role: "Principal", qualification: "M.Ed Educational Leadership", biography: "Ada leads with warmth, clarity, and a deep belief in every learner.", image: placeholder("Principal"), order: 1 },
    { name: "Mr. Tunde Okafor", role: "Head of Academics", qualification: "B.Sc, PGDE", biography: "Tunde coordinates curriculum quality and teacher development.", image: placeholder("Academics"), order: 2 }
  ]);

  await Testimonial.create([
    { name: "Mrs. E. Johnson", role: "Parent", message: "The teachers are attentive, and my child has grown in confidence and discipline.", image: placeholder("Parent") },
    { name: "Daniel A.", role: "Alumnus", message: "Bright Future gave me the habits and courage I still rely on today.", image: placeholder("Alumnus") }
  ]);

  await FAQ.create([
    { question: "How do I apply?", answer: "Complete the enquiry form or contact admissions to schedule a visit.", category: "Admissions", order: 1 },
    { question: "Does the school have a portal?", answer: "Yes. Parents and students can use the School Portal button to access the existing portal.", category: "Portal", order: 2 },
    { question: "Can I book a school tour?", answer: "Yes. Send a message through the contact form or call the school office.", category: "Admissions", order: 3 }
  ]);

  console.log("Seed completed");
  await mongoose.disconnect();
}

seed().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
