# School Website CMS

A full-stack school website with a public React site and a protected admin CMS. Public pages fetch content from the Express API, and admin edits are saved to MongoDB.

## Stack

- React, React Router, Tailwind CSS, Axios, React Hook Form, Lucide React
- Node.js, Express.js, MongoDB, Mongoose
- JWT authentication, bcrypt password hashing
- Helmet, CORS, compression, auth rate limiting
- Cloudinary image uploads

## Project Structure

```text
client/   React public website and admin dashboard
server/   Express API, MongoDB models, auth, seed script
```

The original implementation brief is saved in [PROJECT_SPEC.md](./PROJECT_SPEC.md).

## Setup

1. Install dependencies:

```bash
cd server
npm install
cd ../client
npm install
```

2. Create environment files:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

3. Fill in `server/.env`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/cocin_academy
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
ADMIN_NAME=School Admin
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=ChangeMe123!
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

4. Seed the database:

```bash
cd server
npm run seed
```

5. Start the API and client in separate terminals:

```bash
cd server
npm run dev
```

```bash
cd client
npm run dev
```

Open `http://localhost:5173`.

## Admin

Admin dashboard: `http://localhost:5173/admin`

Use the credentials from:

```env
ADMIN_EMAIL=
ADMIN_PASSWORD=
```

The dashboard manages:

- Website settings, branding, colors, contact details, SEO, footer
- Homepage content and hero image
- About page content, mission, vision, values
- Admissions content
- Academic programs
- Blog/news posts with draft/published status
- Gallery images with categories and featured status
- Events
- Staff/leadership
- Testimonials
- FAQs
- Contact messages
- Admin users and password changes

## API Routes

Public and admin routes are available under `/api`:

- `POST /api/auth/login`
- `GET /api/auth/me`
- `PUT /api/auth/change-password`
- `GET|PUT /api/settings`
- `GET|PUT /api/homepage`
- `GET|PUT /api/pages/:slug`
- `/api/blogs`
- `/api/gallery`
- `/api/events`
- `/api/testimonials`
- `/api/staff`
- `/api/contact`
- `/api/academics`
- `GET|PUT /api/admissions`
- `/api/faqs`
- `POST /api/uploads`
- `/api/users`

Mutating CMS routes require a Bearer token from admin login.

## Image Uploads

Image uploads use Cloudinary. Add these values in `server/.env`:

```env
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

The admin image fields also accept pasted image URLs, which is useful while developing locally.

## Deployment

Backend:

1. Create a MongoDB Atlas database.
2. Configure production environment variables.
3. Deploy `server` to Render, Railway, Fly.io, or another Node host.
4. Set `CLIENT_URL` to the deployed frontend URL.
5. Run `npm run seed` once, or create the first admin through a protected deployment task.

Frontend:

1. Set `VITE_API_BASE_URL=https://your-api-domain.com/api`.
2. Run `npm run build`.
3. Deploy `client/dist` to Netlify, Vercel, Cloudflare Pages, or static hosting.

## Verification

Completed checks:

- Backend app load: `node -e "require('./src/app'); console.log('backend app loaded')"`
- Frontend production build: `npm run build`
- Client dependency audit is clean after replacing the vulnerable Quill dependency.
