# COCIN Academy Admin Dashboard Guide

This guide explains how to use the School CMS admin dashboard to manage the public website.

## Access

Production admin URL:

```text
https://cocinacademy.vercel.app/school-office/access
```

Local admin URL:

```text
http://localhost:5173/school-office/access
```

Log in with an active admin email and password. After finishing work, use **Logout** from the sidebar.

## General Editing Workflow

Most dashboard sections work the same way:

1. Open a section from the left sidebar.
2. Fill in or edit the form fields.
3. Use **Save changes**, **Create**, or **Update**.
4. For list-based sections, use **Edit** to modify an item and **Delete** to remove it.

For image fields, you can upload an image file or paste an image URL. Supported image uploads are JPG, PNG, WebP, and GIF.

For media fields, you can upload either an image or a video, or paste a media URL. Supported video uploads are MP4, WebM, and MOV. Keep videos short and compressed for faster page loading.

## Overview

The **Overview** page shows quick counts for major content areas:

- Blog posts
- Gallery items
- Events
- Staff
- Contact messages
- Academic programs

Use this page as a quick health check for the website content.

## Settings

Use **Settings** to manage global website information:

- School name and motto
- Logo and favicon
- Primary and secondary colors
- Email, phone, WhatsApp, and address
- Social media links
- Google Map embed
- Footer text
- SEO title and SEO description

These values appear across the public website, especially in the header, footer, contact page, and search previews.

## Homepage

Use **Homepage** to control the public home page:

- Hero title and subtitle
- Hero media, which can be an image or video
- Hero carousel slides
- About preview
- Why Choose Us items
- Admissions call-to-action
- Homepage SEO fields

For carousel slides, click **Add** to create each slide. Each slide can have a title, subtitle, media file or URL, button label, and button link.

If the hero media is a video, the homepage uses it as the hero background. You can upload a local video file from the admin dashboard or paste a direct video URL. If you paste a URL manually, select whether it is an image or video.

Carousel slides can be managed individually:

- Use **Show main hero media** to show or hide the main hero media without deleting it.
- Use **Active** to show or hide a slide without deleting it.
- Edit the slide fields directly, then click **Save changes**.
- Use **Remove media** to clear the image or video from a slide.
- Use **Remove item** to delete a slide from the carousel.

## Pages

Use **Pages** to edit static website pages:

- About page
- Privacy Policy

The About page includes content, mission, vision, and core values. The Privacy Policy uses simpler page content fields.

Rich text fields support basic formatting such as bold, italic, and lists.

## Blog

Use **Blog** to manage news and article posts.

Main fields:

- Title
- Slug
- Excerpt
- Content
- Featured image
- Category
- Tags
- Author
- Status
- SEO title and description

Set **Status** to `published` when the post should appear publicly. Use `draft` for work that should remain hidden from public visitors.

The slug is the URL-friendly part of the post link. Use lowercase words separated by hyphens, for example:

```text
school-open-day-2026
```

## Gallery

Use **Gallery** to manage photos shown on the gallery page.

Fields:

- Title
- Description
- Image
- Category
- Featured

Use **Featured** for images that should receive extra attention where the design supports featured content.

## Events

Use **Events** to publish upcoming or past school events.

Fields:

- Title
- Slug
- Image
- Date
- Time
- Location
- Description

Use clear event titles and accurate dates. The public event page uses the date and location to help parents and visitors understand when and where the event happens.

## Academics

Use **Academics** to manage academic programs.

Fields:

- Title
- Level
- Description
- Image
- Order
- Active

Use **Order** to control display order. Lower numbers appear earlier. Disable **Active** if a program should be hidden without deleting it.

## Admissions

Use **Admissions** to manage admissions page content.

Fields:

- Title
- Content
- Requirements
- Process steps
- CTA text
- SEO title and description

Enter requirements one per line. For process steps, click **Add** and enter the step title and description.

## Staff

Use **Staff** to manage staff and leadership profiles.

Fields:

- Name
- Role
- Biography
- Qualification
- Image
- Email
- LinkedIn URL
- X URL
- Order
- Active

Use **Order** to control display order. Disable **Active** to hide a staff member without deleting the profile.

## Testimonials

Use **Testimonials** to manage quotes from parents, students, or community members.

Fields:

- Person name
- Role
- Message
- Image
- Active

Keep testimonials concise and accurate. Disable **Active** to hide a testimonial without deleting it.

## FAQ

Use **FAQ** to manage frequently asked questions.

Fields:

- Question
- Answer
- Category
- Order
- Active

Use categories to group related questions, such as Admissions, Academics, Fees, or General. Use **Order** to control display sequence.

## Messages

Use **Messages** to review contact form submissions from the public website.

Each message shows:

- Name
- Email
- Phone, if provided
- Subject
- Message
- Read status

Use **Read** after following up with a message. Use **Delete** only when the message is no longer needed.

## Admin Users

Use **Admin Users** to manage who can access the dashboard.

Fields:

- Name
- Email
- Password
- Active

Only create accounts for trusted staff. Disable **Active** to block an account without deleting it. Use strong passwords and avoid sharing accounts.

## Change Password

Use **Change Password** to update your own admin password.

Enter:

- Current password
- New password

Passwords must be at least 8 characters. Use a unique password that is not reused on other websites.

## Content Tips

- Keep titles short and clear.
- Use high-quality images with good lighting.
- Avoid uploading very large images when possible.
- Keep SEO titles and descriptions specific to the page.
- Use `published` only when blog content is ready for public viewing.
- Prefer hiding items with **Active** before deleting them permanently.

## Security Notes

- Do not share admin passwords.
- Log out after using a shared computer.
- Do not paste unknown scripts or unsafe HTML into rich text fields.
- Upload only trusted image files.
- Remove admin access for users who no longer need it.
