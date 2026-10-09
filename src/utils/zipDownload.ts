export async function downloadSourceZip(): Promise<boolean> {
  try {
    const a = document.createElement('a');
    a.href = '/vpn-app-source.zip';
    a.download = 'vpn-app-source.zip';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    return true;
  } catch (error) {
    console.error('Failed to download zip:', error);
    return false;
  }
}
