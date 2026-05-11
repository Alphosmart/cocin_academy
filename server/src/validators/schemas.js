const { z } = require("zod");

// Common field validators
const urlField = z.string().url().optional().or(z.literal(""));
const imageField = z.string().url().optional().or(z.literal(""));
const titleField = z.string().min(1).max(200);
const slugField = z.string().min(1).max(200).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase with hyphens");
const dateField = z.string().datetime().or(z.date());

// Blog validation
const blogSchema = z.object({
  body: z.object({
    title: titleField,
    slug: slugField,
    excerpt: z.string().min(1).max(500),
    content: z.string().min(10),
    featuredImage: imageField,
    category: z.string().max(100).optional(),
    tags: z.array(z.string()).optional(),
    author: z.string().max(100).optional(),
    status: z.enum(["draft", "published"]).optional(),
    seoTitle: z.string().max(60).optional(),
    seoDescription: z.string().max(160).optional()
  })
});

// Gallery validation
const gallerySchema = z.object({
  body: z.object({
    title: titleField,
    description: z.string().max(500).optional(),
    image: imageField.refine(val => val !== "", "Image is required"),
    category: z.string().max(100).optional(),
    featured: z.boolean().optional()
  })
});

// Events validation
const eventSchema = z.object({
  body: z.object({
    title: titleField,
    slug: slugField.optional(),
    image: imageField.optional(),
    date: dateField,
    time: z.string().optional(),
    location: z.string().max(200).optional(),
    description: z.string().optional()
  })
});

// Staff validation
const staffSchema = z.object({
  body: z.object({
    name: titleField,
    role: z.string().min(1).max(100),
    biography: z.string().max(1000).optional(),
    qualification: z.string().max(200).optional(),
    image: imageField.optional(),
    email: z.string().email().optional(),
    linkedinUrl: urlField,
    xUrl: urlField,
    order: z.number().optional(),
    isActive: z.boolean().optional()
  })
});

// FAQ validation
const faqSchema = z.object({
  body: z.object({
    question: z.string().min(5).max(300),
    answer: z.string().min(10).max(2000),
    category: z.string().max(100).optional(),
    order: z.number().optional(),
    isActive: z.boolean().optional()
  })
});

// Testimonial validation
const testimonialSchema = z.object({
  body: z.object({
    name: titleField,
    role: z.string().max(100).optional(),
    message: z.string().min(10).max(500),
    image: imageField.optional(),
    isActive: z.boolean().optional()
  })
});

// Academic validation
const academicSchema = z.object({
  body: z.object({
    title: titleField,
    level: z.string().max(100).optional(),
    description: z.string().max(1000).optional(),
    image: imageField.optional(),
    order: z.number().optional(),
    isActive: z.boolean().optional()
  })
});

// Page validation
const pageSchema = z.object({
  body: z.object({
    title: titleField,
    excerpt: z.string().max(500).optional(),
    content: z.string().optional(),
    mission: z.string().max(1000).optional(),
    vision: z.string().max(1000).optional(),
    coreValues: z.array(z.string()).optional(),
    seoTitle: z.string().max(60).optional(),
    seoDescription: z.string().max(160).optional()
  })
});

// Homepage validation
const homepageSchema = z.object({
  body: z.object({
    heroTitle: z.string().max(200).optional(),
    heroSubtitle: z.string().max(500).optional(),
    heroMedia: z.string().optional(),
    heroMediaType: z.enum(["image", "video"]).optional(),
    heroMediaActive: z.boolean().optional(),
    heroSlides: z.array(z.object({
      isActive: z.boolean().optional(),
      title: z.string().max(200).optional(),
      subtitle: z.string().max(500).optional(),
      media: z.string().optional(),
      mediaType: z.enum(["image", "video"]).optional(),
      ctaLabel: z.string().max(100).optional(),
      ctaLink: z.string().optional()
    })).optional(),
    aboutPreview: z.string().max(1000).optional(),
    whyChooseUs: z.array(z.object({
      title: z.string().max(100).optional(),
      description: z.string().max(500).optional()
    })).optional(),
    admissionsCtaTitle: z.string().max(200).optional(),
    admissionsCtaText: z.string().max(500).optional(),
    seoTitle: z.string().max(60).optional(),
    seoDescription: z.string().max(160).optional()
  })
});

// Admissions validation
const admissionSchema = z.object({
  body: z.object({
    title: z.string().max(200).optional(),
    content: z.string().optional(),
    requirements: z.array(z.string()).optional(),
    processSteps: z.array(z.object({
      title: z.string().max(100).optional(),
      description: z.string().max(500).optional()
    })).optional(),
    ctaText: z.string().max(200).optional(),
    seoTitle: z.string().max(60).optional(),
    seoDescription: z.string().max(160).optional()
  })
});

// Settings validation
const settingsSchema = z.object({
  body: z.object({
    schoolName: z.string().max(200).optional(),
    motto: z.string().max(200).optional(),
    logo: imageField,
    favicon: imageField,
    primaryColor: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
    secondaryColor: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
    email: z.string().email().optional(),
    phone: z.string().max(100).optional(),
    whatsapp: z.string().max(20).optional(),
    address: z.string().max(500).optional(),
    facebookUrl: urlField,
    instagramUrl: urlField,
    youtubeUrl: urlField,
    tiktokUrl: urlField,
    xUrl: urlField,
    googleMapEmbed: z.string().max(500).optional(),
    footerText: z.string().max(500).optional(),
    seoTitle: z.string().max(60).optional(),
    seoDescription: z.string().max(160).optional()
  })
});

module.exports = {
  blogSchema,
  gallerySchema,
  eventSchema,
  staffSchema,
  faqSchema,
  testimonialSchema,
  academicSchema,
  pageSchema,
  homepageSchema,
  admissionSchema,
  settingsSchema
};
