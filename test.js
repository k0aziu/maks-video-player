const fs = require('fs');
const { drive_v3: drive } = require('googleapis');

// konfiguracja autoryzacji dla Google Drive API
const auth = new google.auth.GoogleAuth({
  keyFile: 'ścieżka/do/klucza.json',
  scopes: ['https://www.googleapis.com/auth/drive.readonly'],
});

// utworzenie instancji Google Drive API
const driveClient = await drive({
  version: 'v3',
  auth,
});

// ID pliku na Google Drive
const fileId = 'tutaj_wpisz_id_pliku';

// pobranie pliku
const response = await driveClient.files.get({ fileId, alt: 'media' }, { responseType: 'stream' });
const dest = fs.createWriteStream('./image.png');

// zapisanie pliku do lokalnego systemu plików
await new Promise((resolve, reject) => {
  response.data
    .on('end', () => {
      console.log('Plik został pobrany.');
      resolve();
    })
    .on('error', reject)
    .pipe(dest);
});
