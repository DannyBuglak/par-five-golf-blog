# Par Five Golf Blog

A full-stack golf blogging platform for golf enthusiasts. Users can write and publish blog posts, browse community content, tag posts by topic, react with custom reactions, and comment on posts. Built with React and TypeScript on the frontend, Supabase and PostgreSQL on the backend.

## 🏌️ Live Demo

Visit the app: [Par Five Golf Blog](https://parfivegolfblog.com)

![Par Five Golf Blog Homepage](./public/homePageSnapshot.png)

## ✨ Features

### For Authors
- **Rich Text Editor** — Write blog posts with a full-featured editor (TipTap) supporting headings, lists, quotes, bold, italic, and more
- **Post Management** — Create, edit, publish, and delete your blog posts
- **Post Tags** — Tag your posts with relevant topics for better discoverability
- **Author Profiles** — Customize your profile with a bio and avatar
- **Draft & Publish** — Save posts as drafts before publishing

### For Readers
- **Feed** — Browse the latest posts from the community
- **Filtering & Sorting** — Filter posts by tags and sort by date, popularity, or comments
- **Reactions** — React to posts with custom emoji reactions
- **Comments** — Engage with authors and other readers through comments
- **User Profiles** — View author profiles and see all their posts
- **Responsive Design** — Fully mobile-responsive interface

### General
- **Email Authentication** — Sign up and log in with email confirmation
- **Forgot Password** — Reset your password via email
- **SEO Optimized** — Meta tags, Open Graph, and Twitter Card support for social sharing
- **404 Page** — Custom not found page
- **Contact Form** — Reach out via the contact page

## 🛠️ Tech Stack

### Frontend
- **React 18** — UI framework
- **TypeScript** — Type-safe JavaScript
- **Vite** — Fast build tool and dev server
- **React Router** — Client-side routing
- **TipTap** — Rich text editor
- **CSS** — Custom styling (no Tailwind or CSS-in-JS frameworks)

### Backend
- **Supabase** — Authentication, database, and storage
- **PostgreSQL** — Relational database
- **Vercel** — Deployment platform

### External Services
- **EmailJS** — Contact form email delivery
- **Supabase Storage** — Avatar image uploads

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account
- EmailJS account (for contact form)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/dannybuglak/par-five-golf-blog.git
   cd par-five-golf-blog
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_EMAILJS_SERVICE_ID=your_emailjs_service_id
   VITE_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
   VITE_EMAILJS_PUBLIC_KEY=your_emailjs_public_key
   ```

4. **Set up Supabase**
   - Create a new Supabase project
   - Run the SQL migrations to create tables (see Database Schema below)
   - Set up authentication providers (Email)
   - Configure email templates
   - Create an "avatars" storage bucket and set it to public
   - Set up RLS policies for the storage bucket

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:5173`

## 🗄️ Database Schema

### Tables

**profiles**
```sql
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  username text UNIQUE NOT NULL,
  bio text,
  avatar_url text,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);
```

**posts**
```sql
CREATE TABLE posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  slug text UNIQUE NOT NULL,
  author_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  is_published boolean DEFAULT false,
  signature text,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);
```

**tags**
```sql
CREATE TABLE tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  created_at timestamp DEFAULT now()
);
```

**post_tags**
```sql
CREATE TABLE post_tags (
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE,
  tag_id uuid REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);
```

**reactions**
```sql
CREATE TABLE reactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  emoji text NOT NULL,
  created_at timestamp DEFAULT now(),
  UNIQUE(post_id, user_id, emoji)
);
```

**comments**
```sql
CREATE TABLE comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);
```

## 🔐 Authentication

The app uses Supabase Authentication with:
- Email/Password sign up and login
- Email confirmation on sign up
- Forgot password flow with email reset link
- Protected routes that require authentication
- Session persistence using Supabase's built-in session management

## 📱 Responsive Design

The app is fully responsive with breakpoints at:
- Mobile: < 768px
- Tablet/Desktop: ≥ 768px

All pages use a consistent mobile-first design pattern with:
- Full-width layout on mobile with `padding: var(--spacing-md)`
- 75% centered width on desktop
- Responsive typography that scales appropriately
- Touch-friendly button sizes on mobile
- Conditional hover states using `@media (hover: hover)`

## 🎨 Design System

The app uses CSS custom properties for a consistent design:
- **Spacing**: `--spacing-xs` through `--spacing-xl`
- **Colors**: Primary green, secondary green, border, background, text colors
- **Typography**: Font sizes from `--font-size-sm` to `--font-size-2xl`
- **Radius**: Border radius tokens for consistency
- **Shadows**: Subtle shadows for depth

All colors and spacing are defined in `src/index.css` and reused throughout the app.

## 🔍 SEO

The app includes SEO optimization:
- Dynamic meta tags for all pages using the `useMetaTags` hook
- Open Graph tags for social media sharing
- Twitter Card tags for Twitter preview
- Canonical URLs to prevent duplicate content
- Article metadata for blog posts

## 📋 Key Pages

### Public Pages
- **Home** (`/`) — Landing page with carousel and navigation
- **Feed** (`/feed`) — Browse and filter blog posts
- **Post** (`/post/:slug`) — Read individual blog posts
- **Profile** (`/profile/:username`) — View author profiles
- **Contact** (`/contact`) — Contact form
- **Login** (`/login`) — User login
- **Sign Up** (`/signup`) — User registration
- **Forgot Password** (`/forgot-password`) — Reset password
- **Confirm Email** (`/confirm-email`) — Email verification
- **404** (`*`) — Not found page

### Protected Pages (Requires Authentication)
- **Write** (`/write`) — Create new blog posts
- **My Posts** (`/my-posts`) — Manage your posts
- **Edit Post** (`/edit/:slug`) — Edit a blog post
- **Edit Profile** (`/profile/edit`) — Update your profile

## 🚢 Deployment

The app is deployed on Vercel:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Vercel will automatically deploy on push to main

## 📝 Development

### Available Scripts

```bash
# Build for production
npm run dev
```

### Code Style

- TypeScript for type safety
- Component-based architecture
- Hooks for state management
- Feature-based folder structure
- BEM naming convention for CSS classes
- No inline styles or Tailwind (pure CSS)

## 🤝 Contributing

This is a personal project, but feel free to fork and customize for your own use!

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- [Supabase](https://supabase.com/) for the backend
- [TipTap](https://tiptap.dev/) for the rich text editor
- [React Router](https://reactrouter.com/) for routing
- [Vite](https://vitejs.dev/) for the build tool
- [EmailJS](https://www.emailjs.com/) for email services

## 📧 Contact

Have questions or suggestions? Reach out via the [contact page](https://parfivegolfblog.com/contact) or email directly.

---

Happy blogging! ⛳