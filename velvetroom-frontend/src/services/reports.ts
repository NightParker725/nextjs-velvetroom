// src/services/reports.ts
import api from './api';

export async function downloadFullReport() {
  try {
    const response = await api.get('/reports/export/pdf', {
      responseType: 'blob',
    });


    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);


    const a = document.createElement('a');
    a.href = url;
    a.download = 'velvetroom_report.pdf';
    a.click();

    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.error(err);
    throw err;
  }
}
