// Shared by the contact form (browser) and /api/contact (server).
export const CONTACT_LIMITS = { name: 80, email: 120, subject: 120, message: 3000 } as const;
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const SUBJECT_SUGGESTIONS = ["New project", "Collaboration", "Feedback", "Just saying hi"];
