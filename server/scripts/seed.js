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

const placeholder = (text) => `https://placehold.co/1200x800/302F62/ffffff?text=${encodeURIComponent(text)}`;

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
    schoolName: "COCIN Academy",
    motto: "Building lives on the Solid Rock",
    logo: "",
    favicon: "",
    primaryColor: "#302F62",
    secondaryColor: "#E72125",
    email: "cocinacademy07@gmail.com",
    phone: "07046272361, 09018690022, 08180705629",
    whatsapp: "+2347046272361",
    address: "900241 Cadastral Street, Plot 5/7 Durumi District, Area 1, F.C.T. Abuja",
    facebookUrl: "https://www.facebook.com/cocinacademyabuja1",
    instagramUrl: "https://www.instagram.com/cocinacademy/",
    youtubeUrl: "",
    googleMapEmbed: "",
    footerText: "Training children through total education, one child at a time for Christ.",
    seoTitle: "COCIN Academy Abuja",
    seoDescription: "A Biblically-based Christian school in Abuja serving learners from Prekindergarten to Grade 12."
  });

  await HomepageContent.create({
    heroTitle: "COCIN Academy",
    heroSubtitle: "A Biblically-based learning community preparing the hearts, minds, and spirits of learners in the image of Jesus Christ.",
    heroImage: placeholder("COCIN Academy"),
    heroSlides: [
      {
        title: "COCIN Academy",
        subtitle: "A Biblically-based learning community preparing the hearts, minds, and spirits of learners in the image of Jesus Christ.",
        image: placeholder("COCIN Academy"),
        ctaLabel: "Admissions",
        ctaLink: "/admissions"
      },
      {
        title: "Mastery-based education from Prekindergarten to Grade 12",
        subtitle: "Individualized learning, strong academics, Scripture memory, and practical character training help each learner grow.",
        image: placeholder("Mastery Learning"),
        ctaLabel: "Academics",
        ctaLink: "/academics"
      },
      {
        title: "One child at a time for Christ",
        subtitle: "Chapel, devotion, discipleship, and the 90 character traits of Jesus Christ shape our daily school life.",
        image: placeholder("Faith and Learning"),
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
  });

  await PageContent.create([
    {
      slug: "about",
      title: "About Us",
      excerpt: "A Biblically-based Christian learning community.",
      content: "COCIN Academy provides a Biblically-based worldview of learning that prepares the hearts, minds, and spirits of all learners.",
      mission: "The school seeks to build lives on the Solid Rock, Christ Jesus our Lord, and to be involved in true Christian education for children, meeting their spiritual, social, mental, and physical needs.",
      vision: "Training children through total education, which is only found in Christ Jesus: a holistic education, one child at a time for Christ.",
      coreValues: ["Faith", "Excellence", "Integrity", "Service"]
    },
    {
      slug: "privacy-policy",
      title: "Privacy Policy",
      content: "We collect only the information needed to respond to enquiries and operate school services responsibly."
    }
  ]);

  await AdmissionContent.create({
    title: "Admissions",
    content: "Enrollment for all grades is through a diagnostic test. Reading Readiness and Learning to Read/Grade 1 placements are guided by Academic Information instructional manuals.",
    requirements: ["Completed online application form", "Birth certificate", "Immunization record", "Previous school records", "Soft copy of the applicant's passport photograph"],
    processSteps: [
      { title: "Apply", description: "Fill out the online application form." },
      { title: "Submit Documents", description: "Submit all required documents for review." },
      { title: "Orientation", description: "Attend the compulsory parents orientation programme for all new families." },
      { title: "Interview", description: "Attend a parent-student interview." },
      { title: "Confirmation", description: "Receive admission confirmation from the school." }
    ],
    ctaText: "Speak with admissions"
  });

  await AcademicProgram.create([
    { title: "Prekindergarten", level: "Prekindergarten", description: "Early foundations for young learners beginning school in a Christ-centred environment.", image: placeholder("Prekindergarten"), order: 1 },
    { title: "Reading Readiness to Grade 6", level: "Primary", description: "Mastery-based learning in core subjects, Scripture memory, and character development.", image: placeholder("Primary"), order: 2 },
    { title: "Middle and High School", level: "Secondary", description: "Grade 7 to Grade 12 academics with electives, conventions, service, and college-level options for advanced students.", image: placeholder("High School"), order: 3 }
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
    { name: "School Principal", role: "Principal", qualification: "COCIN Academy Leadership", biography: "The Principal leads the school community in Christian education, discipline, academic growth, and partnership with families.", image: placeholder("Principal"), order: 1 },
    { name: "School Chaplain", role: "Chaplain", qualification: "COCIN Church Ministry", biography: "The Chaplain supports chapel, discipleship, Bible memory work, and spiritual growth across the school community.", image: placeholder("Chaplain"), order: 2 }
  ]);

  await Testimonial.create([
    { name: "COCIN Academy Parent", role: "Parent", message: "The teachers are attentive, and my child has grown in confidence, discipline, and love for God's Word.", image: placeholder("Parent") },
    { name: "COCIN Academy Learner", role: "Student", message: "The school helps me grow in my academics, character, and faith.", image: placeholder("Learner") }
  ]);

  await FAQ.create([
    { question: "How do I apply?", answer: "Complete the enquiry form or contact admissions to schedule a visit.", category: "Admissions", order: 1 },
    { question: "Can I book a school tour?", answer: "Yes. Send a message through the contact form or call the school office.", category: "Admissions", order: 2 }
  ]);

  console.log("Seed completed");
  await mongoose.disconnect();
}

seed().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
