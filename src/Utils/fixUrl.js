export const cleanImageUrl = (url) => {
  if (!url) return null;

  // Regex 1: untuk mendeteksi URL yang mengandung "/storage/https://..."
  const wrappedUrlPattern = /^.*\/storage\/(https?:\/\/.+)$/i;

  // Regex 2: untuk mendeteksi URL normal langsung
  const normalUrlPattern = /^https?:\/\/.+$/i;

  if (wrappedUrlPattern.test(url)) {
    const matches = url.match(wrappedUrlPattern);
    return matches[1]; // hasil ekstraksi https://...
  }

  if (normalUrlPattern.test(url)) {
    return url; // sudah normal
  }

  // Selain itu, return null atau bisa juga return url jika ingin lebih toleran
  return null;
};
