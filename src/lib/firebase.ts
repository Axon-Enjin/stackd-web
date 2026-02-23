import { configs } from "@/configs/configs";
import {
  initializeApp,
  getApps,
  cert,
  ServiceAccount,
} from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
// import { getStorage } from "firebase-admin/storage";

// const FIREBASE_STORAGE_BUCKET = process.env.FIREBASE_STORAGE_BUCKET;
const serviceAccount = {
  project_id: configs.firebaseAdmin.projectId,
  client_email: configs.firebaseAdmin.clientEmail,
  private_key: configs.firebaseAdmin.privateKey,
};

const app = getApps().length
  ? getApps()[0]
  : initializeApp({
      credential: cert(serviceAccount as string | ServiceAccount),
      // storageBucket: configs.firebaseConfig.storageBucket,
    });

export const auth = getAuth(app);
export const db = getFirestore(app);
// export const storage = getStorage(app).bucket(
//   process.env.FIREBASE_STORAGE_BUCKET,
// );
