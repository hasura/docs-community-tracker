import { google, sheets_v4 } from "googleapis";
import { JWT } from "google-auth-library";
import dotenv from "dotenv";
dotenv.config();

export const authenticateGoogleSheets = async (): Promise<sheets_v4.Sheets> => {
  const encodedCredentials = process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS;

  if (!encodedCredentials) {
    throw new Error(
      "Environment variable GOOGLE_SERVICE_ACCOUNT_CREDENTIALS is not set",
    );
  }

  const credentials = JSON.parse(
    Buffer.from(encodedCredentials, "base64").toString("utf8"),
  );

  const authClient = new JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  // Authenticate and initialize Sheets API
  const sheets = google.sheets({ version: "v4", auth: authClient });
  return sheets;
};
