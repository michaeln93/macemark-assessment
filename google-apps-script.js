/**
 * Google Apps Script — Macemark Assessment Submissions
 *
 * SETUP INSTRUCTIONS:
 *
 * 1. Go to https://script.google.com and create a new project
 * 2. Paste this entire file as the script content
 * 3. Click "Deploy" > "New deployment"
 * 4. Select type: "Web app"
 * 5. Set "Execute as": Me
 * 6. Set "Who has access": Anyone
 * 7. Click "Deploy" and copy the web app URL
 * 8. Paste that URL into index.html as the SUBMIT_URL value
 * 9. The script will auto-create a Google Sheet called "Macemark Assessments"
 *
 * To set up the Results Viewer (results.html):
 * 1. Open the "Macemark Assessments" Google Sheet
 * 2. Go to File > Share > Publish to web
 * 3. Select "Sheet1" and format "CSV"
 * 4. Click Publish and copy the URL
 * 5. Paste that URL into results.html as the SHEET_URL value
 */

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = getOrCreateSheet();
    const sheet = ss.getSheetByName('Sheet1');

    // Add row
    sheet.appendRow([
      new Date().toLocaleString('en-AU', {timeZone: 'Australia/Sydney'}),
      data.facility?.name || '',
      data.facility?.contactPerson || '',
      data.facility?.contactEmail || '',
      data.facility?.contactPhone || '',
      data.facility?.facilityType || '',
      data.facility?.staffCount || '',
      JSON.stringify(data.cssd || {}),
      JSON.stringify(data.endoscopy || {}),
      JSON.stringify(data.consumables || {}),
      JSON.stringify(data.compliance || {}),
      (data.gaps || []).length,
      (data.gaps || []).join(' | '),
      (data.recommendations || []).length,
      (data.recommendations || []).map(r => r.product).join(' | '),
      data.summary || ''
    ]);

    return ContentService.createTextOutput(JSON.stringify({status: 'ok'}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({status: 'error', message: err.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function getOrCreateSheet() {
  const name = 'Macemark Assessments';
  const files = DriveApp.getFilesByName(name);

  if (files.hasNext()) {
    return SpreadsheetApp.open(files.next());
  }

  // Create new spreadsheet with headers
  const ss = SpreadsheetApp.create(name);
  const sheet = ss.getActiveSheet();
  sheet.appendRow([
    'timestamp',
    'facility_name',
    'contact_person',
    'contact_email',
    'contact_phone',
    'facility_type',
    'staff_count',
    'cssd_json',
    'endoscopy_json',
    'consumables_json',
    'compliance_json',
    'gap_count',
    'gaps',
    'rec_count',
    'recommendations',
    'summary'
  ]);

  // Format header row
  sheet.getRange(1, 1, 1, 16).setFontWeight('bold').setBackground('#1b3a5c').setFontColor('white');
  sheet.setFrozenRows(1);

  // Auto-resize columns
  for (let i = 1; i <= 16; i++) {
    sheet.autoResizeColumn(i);
  }

  return ss;
}

// Test function — run this to verify the sheet is created correctly
function testSetup() {
  const ss = getOrCreateSheet();
  Logger.log('Sheet URL: ' + ss.getUrl());
  Logger.log('Setup complete!');
}
