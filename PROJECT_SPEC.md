# Full-Stack School Website With Admin CMS

You are building a complete, production-ready school website using React, Node.js, Express.js, and MongoDB.

This must not be a simple static school website. It must include a public website and a secure admin content management system where the school admin can edit website content without touching code.

The website must be professional, responsive, secure, and suitable for a real school.

## Tech Stack

Frontend:
- React
- React Router
- Tailwind CSS
- Axios
- React Hook Form
- React Icons or Lucide React
- Rich text editor for admin content editing

Backend:
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT authentication
- Bcrypt
- Multer or Cloudinary for image uploads
- Helmet
- CORS
- dotenv
- express-rate-limit
- compression
- express-validator or Zod

## Project Structure

Create two folders:

- `client`
- `server`

The client folder contains the React frontend.
The server folder contains the Node/Express/MongoDB backend.

## Core Requirement

Build a professional school website with:

1. Public-facing website
2. Secure admin dashboard
3. Full content management system
4. Blog/news management
5. Gallery management
6. Events management
7. Staff/leadership management
8. Testimonials management
9. FAQ management
10. Contact message management
11. Website settings management
12. Existing school portal integration

## Important Rule

Do not generate only a landing page.
Do not hardcode all website content.
All major website content must be editable from the admin dashboard.

## Public Website Pages

Create these public pages:

1. Home
2. About Us
3. Academics
4. Admissions
5. School Portal
6. Blog/News
7. Single Blog Post
8. Gallery
9. Events
10. Single Event
11. Staff/Leadership
12. FAQ
13. Contact
14. Privacy Policy
15. 404 Page

## Public Website Features

The public website must include:

- Responsive navbar
- Mobile hamburger menu
- School portal button
- Hero section
- About preview
- Why Choose Us section
- Academic programs preview
- Admissions call-to-action
- Latest news/blog posts
- Gallery preview
- Upcoming events preview
- Testimonials
- Contact section
- Footer with quick links and contact details
- WhatsApp contact button
- Social media links
- Google Map embed on contact page
- SEO-friendly page titles and descriptions

## School Portal Integration

The school already has an existing portal.

Add a "School Portal" button in:

- Header/navbar
- Home hero section
- Footer
- Dedicated School Portal page

The portal URL must be editable from the admin dashboard.

The portal button should open the existing portal in a new tab.

## Admin Dashboard

Create a secure admin dashboard at:

`/admin`

Admin dashboard must include:

1. Login
2. Dashboard overview
3. Website settings
4. Homepage content manager
5. Page content manager
6. Blog/news manager
7. Gallery manager
8. Events manager
9. Academics manager
10. Admissions manager
11. Staff manager
12. Testimonials manager
13. FAQ manager
14. Contact messages
15. Admin users
16. Change password
17. Logout

## Admin Dashboard Requirements

The admin dashboard must allow the school admin to:

- Edit school name
- Edit school motto
- Upload school logo
- Upload favicon
- Change primary and secondary colors
- Edit contact email
- Edit phone numbers
- Edit WhatsApp number
- Edit school address
- Edit social media links
- Edit existing school portal URL
- Edit homepage hero title
- Edit homepage hero subtitle
- Upload hero image
- Edit About page content
- Edit Mission statement
- Edit Vision statement
- Edit Core values
- Edit Admissions content
- Edit Academics content
- Create/edit/delete blog posts
- Create/edit/delete gallery images
- Create/edit/delete events
- Create/edit/delete staff members
- Create/edit/delete testimonials
- Create/edit/delete FAQs
- View and delete contact messages
- Edit footer text
- Edit SEO title and meta description

## Authentication

Implement secure admin authentication:

- Admin login with email and password
- Password hashing with bcrypt
- JWT authentication
- Protected admin routes
- Auth middleware
- Admin role middleware
- Change password feature
- Logout feature

Create default admin from environment variables:

```env
ADMIN_NAME=
ADMIN_EMAIL=
ADMIN_PASSWORD=
```

## Content Management System

Create a real CMS structure.

Do not make the admin dashboard cosmetic only.
Every admin form must connect to backend API routes and save to MongoDB.

The public website must fetch content from the backend API and display the saved content.

If admin edits content, the public website should reflect the change.

## Database Models

Create Mongoose models for:

1. User
2. SiteSettings
3. HomepageContent
4. PageContent
5. BlogPost
6. GalleryItem
7. Event
8. Testimonial
9. StaffMember
10. ContactMessage
11. AcademicProgram
12. AdmissionContent
13. FAQ

## Site Settings Model

Include:

- schoolName
- motto
- logo
- favicon
- primaryColor
- secondaryColor
- email
- phone
- whatsapp
- address
- portalUrl
- facebookUrl
- instagramUrl
- youtubeUrl
- tiktokUrl
- xUrl
- googleMapEmbed
- footerText
- seoTitle
- seoDescription

## Blog Features

The blog/news system must include:

Public:
- List published posts
- Single post page
- Search posts
- Filter by category
- Display featured image
- Display title, excerpt, date, category, author

Admin:
- Create post
- Edit post
- Delete post
- Publish/unpublish
- Save as draft
- Upload featured image
- Add category
- Add tags
- Rich text editor
- SEO title
- SEO description

Blog fields:
- title
- slug
- excerpt
- content
- featuredImage
- category
- tags
- author
- status: draft or published
- seoTitle
- seoDescription
- createdAt
- updatedAt

## Gallery Features

Public:
- View gallery
- Filter gallery by category
- Open image in modal/lightbox

Admin:
- Upload image
- Add title
- Add description
- Add category
- Edit image details
- Delete image
- Mark as featured

## Event Features

Public:
- View upcoming events
- View past events
- View single event details

Admin:
- Create event
- Edit event
- Delete event
- Upload event image
- Add date
- Add time
- Add location
- Add description

## Staff Features

Public:
- View staff/leadership members

Admin:
- Add staff
- Edit staff
- Delete staff
- Upload staff image
- Add name
- Add role
- Add biography
- Add qualification
- Add social links
- Set active/inactive

## Testimonial Features

Public:
- Display testimonials

Admin:
- Add testimonial
- Edit testimonial
- Delete testimonial
- Upload optional image
- Add person name
- Add role
- Set active/inactive

## Contact Features

Public contact form:

Fields:
- Full name
- Email
- Phone
- Subject
- Message

When submitted:
- Save to MongoDB
- Show success message
- Admin can view message in dashboard
- Admin can mark message as read
- Admin can delete message

## Image Upload

Implement image upload for:

- Logo
- Favicon
- Hero image
- Blog featured image
- Gallery images
- Event images
- Staff images
- Testimonial images

Use Cloudinary for production image storage.

Use environment variables:

```env
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

## API Routes

Create REST API routes for:

Auth:
- `POST /api/auth/login`
- `GET /api/auth/me`
- `PUT /api/auth/change-password`

Settings:
- `GET /api/settings`
- `PUT /api/settings`

Homepage:
- `GET /api/homepage`
- `PUT /api/homepage`

Pages:
- `GET /api/pages/:slug`
- `PUT /api/pages/:slug`

Blog:
- `GET /api/blogs`
- `GET /api/blogs/:slug`
- `POST /api/blogs`
- `PUT /api/blogs/:id`
- `DELETE /api/blogs/:id`

Gallery:
- `GET /api/gallery`
- `POST /api/gallery`
- `PUT /api/gallery/:id`
- `DELETE /api/gallery/:id`

Events:
- `GET /api/events`
- `GET /api/events/:slug`
- `POST /api/events`
- `PUT /api/events/:id`
- `DELETE /api/events/:id`

Testimonials:
- `GET /api/testimonials`
- `POST /api/testimonials`
- `PUT /api/testimonials/:id`
- `DELETE /api/testimonials/:id`

Staff:
- `GET /api/staff`
- `POST /api/staff`
- `PUT /api/staff/:id`
- `DELETE /api/staff/:id`

Contact:
- `POST /api/contact`
- `GET /api/contact`
- `PUT /api/contact/:id/read`
- `DELETE /api/contact/:id`

Academics:
- `GET /api/academics`
- `POST /api/academics`
- `PUT /api/academics/:id`
- `DELETE /api/academics/:id`

Admissions:
- `GET /api/admissions`
- `PUT /api/admissions`

FAQ:
- `GET /api/faqs`
- `POST /api/faqs`
- `PUT /api/faqs/:id`
- `DELETE /api/faqs/:id`

## Security Requirements

Backend must include:

- Helmet
- CORS
- Rate limiting on authentication routes
- Input validation
- Password hashing
- JWT authentication
- Protected admin routes
- Central error handler
- 404 handler
- Environment variables
- No hardcoded secrets
- Proper HTTP status codes

## Frontend Requirements

Create reusable components:

Public:
- Navbar
- Footer
- Hero
- Button
- SectionTitle
- BlogCard
- GalleryCard
- EventCard
- TestimonialCard
- StaffCard
- ContactForm
- Loader
- ErrorMessage
- SEO component

Admin:
- AdminLayout
- AdminSidebar
- AdminTopbar
- ProtectedRoute
- StatCard
- DataTable
- FormInput
- TextArea
- RichTextEditor
- ImageUpload
- ConfirmDeleteModal
- ToastNotification

## Admin User Experience

The admin dashboard should be easy for a non-technical person to use.

Use:
- Clear forms
- Save buttons
- Edit buttons
- Delete confirmations
- Success/error messages
- Loading indicators
- Tables for lists
- Preview images after upload
- Responsive layout

## Seed Data

Create a seed script that inserts:

- Default admin
- Default site settings
- Default homepage content
- Default About page
- Default Admissions content
- Default Academic programs
- Sample blog posts
- Sample gallery items
- Sample events
- Sample testimonials
- Sample staff
- Sample FAQs

The seed script should run with:

```bash
npm run seed
```

## Environment Variables

Server `.env`:

```env
PORT=5000
MONGO_URI=
JWT_SECRET=
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
ADMIN_NAME=
ADMIN_EMAIL=
ADMIN_PASSWORD=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

Client `.env`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## Package Scripts

Server:
- `npm run dev`
- `npm start`
- `npm run seed`

Client:
- `npm run dev`
- `npm run build`
- `npm run preview`

## Quality Requirements

The final project must:

- Run without errors
- Have complete CRUD operations
- Have real database integration
- Have working admin login
- Have protected admin pages
- Have working image upload
- Have public pages fetching data from API
- Be mobile responsive
- Be visually professional
- Include loading and error states
- Include form validation
- Include a README file
- Include deployment instructions

## Building Instructions

Do not build everything carelessly in one response.

First:
1. Create the folder structure.
2. Create the backend foundation.
3. Create database connection.
4. Create models.
5. Create authentication.
6. Create API routes.
7. Create seed script.
8. Create frontend foundation.
9. Create public website pages.
10. Create admin dashboard.
11. Connect frontend to backend.
12. Test all CRUD features.
13. Fix errors.
14. Add README.

After each major phase, check that the code works before continuing.

## Final Expectation

Generate a complete full-stack school website with a public website and admin CMS.

The admin must be able to manage:
- Website branding
- Homepage content
- About page
- Academics
- Admissions
- Portal link
- Blog/news
- Gallery
- Events
- Staff
- Testimonials
- FAQ
- Contact messages
- Footer content
- SEO settings

The school should be able to update its website without calling the developer for normal content changes.
