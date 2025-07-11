This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Institution Admin Onboarding

When you visit the site you will be presented with a form to onboard your
institution. Provide your **full name**, institution name, an admin email and
the domains used for student and faculty email addresses. Each domain has its
own field. After
submitting the form your request will be reviewed by the OverYonder admin.

The OverYonder admin can review these requests at `/oyadmin`. From this page the
admin may approve or decline each request, or click the Message button to email
the requester. When a request is approved the institution admin will be
redirected automatically to `/admin`.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.