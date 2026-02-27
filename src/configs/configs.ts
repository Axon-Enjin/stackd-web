export const configs = {
  firebaseAdmin: {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    // storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  },

  supabase: {
    projectUrl: process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL,
    publishableKey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    secretKey: process.env.SUPABASE_SECRET_KEY,
    schema: "client_stackd" as "client_stackd",
    storageBucket: "client_stackd" as "client_stackd",
  },

  googleAuth: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
    adminCalendarId:
      process.env.GOOGLE_API_ADMIN_CALENDAR_ID || "sales@axonenjin.com",
  },

  environment: process.env.NEXT_PUBLIC_ENVIRONMENT || "PRODUCTION",
};
