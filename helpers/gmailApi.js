const { google } = require('googleapis');

const CLIENT_ID = process.env.CLIENT_ID_GOOGLE;
const CLIENT_SECRET = process.env.CLIENT_SECRET_GOOGLE;
const REDIRECT_URI = process.env.GMAIL_REDIRECT_URI;
const REFRESH_TOKEN = process.env.GMAIL_REFRESH_TOKEN;

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

function makeRawEmail(to, subject, bodyText) {
  const messageLines = [
    `From: Geh Suites <reservas@gehsuites.com>`,
    `To: ${to}`,
    `Subject: ${subject}`,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset="UTF-8"',
    '',
    bodyText,
  ];
  return messageLines.join('\r\n');
}

function toBase64Url(str) {
  return Buffer.from(str)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

const sendGmailMessage = async (to, subject, bodyText) => {
  const raw = makeRawEmail(to, subject, bodyText);
  const encoded = toBase64Url(raw);
  const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

  const res = await gmail.users.messages.send({
    userId: 'me',
    requestBody: { raw: encoded },
  });

  return res.data;
};

module.exports = { sendGmailMessage };
