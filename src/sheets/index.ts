import { SheetRow } from "../types.js";
import { authenticateGoogleSheets } from "./config.js";

// getAllRows returns all the current rows of information in the sheet.
export async function getRows(): Promise<SheetRow[]> {
  const sheets = await authenticateGoogleSheets();

  const spreadsheetId = process.env.SPREADSHEET_ID;
  const range = "Sheet1!A1:E";

  // Read data from the Google Sheet
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  });

  const rows = response.data.values;

  if (!rows || rows.length === 0) {
    return [];
  }

  const dataRows = rows.slice(1);

  const sheetRows: SheetRow[] = dataRows.map((row) => ({
    link: row[0] || "",
    createdAt: row[1] || "",
    notes: row[2] || "",
    outcome: row[3] || "",
    status: row[4] || "",
  }));

  return sheetRows;
}

// writeNewRow adds a new row to the sheet with:
export async function writeNewRow(row: SheetRow): Promise<void> {
  const sheets = await authenticateGoogleSheets();

  const spreadsheetId = process.env.SPREADSHEET_ID;
  const range = "Sheet1";

  // Nice little addition the clears crap out of the way so we write to the correct row(s)
  await sheets.spreadsheets.values.clear({
    spreadsheetId,
    range: "Sheet1!G:ZZ",
  });

  const newRow = [row.link, row.createdAt, row.notes, row.outcome, row.status];

  // Append the new row to the sheet
  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range,
    valueInputOption: "RAW",
    requestBody: {
      values: [newRow],
    },
  });

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: "Sheet1!F1",
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [
        [
          '=ARRAYFORMULA(IF(LEN(B2:B), DATEVALUE(LEFT(B2:B, 10)) + TIMEVALUE(MID(B2:B, 12, 8)), ""))',
        ],
      ],
    },
  });

  console.log("New row added:", newRow);
}
