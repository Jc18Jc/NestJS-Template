export const maskEmail = (email: string): string => {
  if (!email || !email.includes('@')) {
    return null;
  }

  const [id, domain] = email.split('@');
  const idLength = id.length;

  if (idLength <= 3) {
    return null;
  }

  if (idLength <= 6) {
    return `${id.slice(0, 3)}${'*'.repeat(idLength - 3)}@${domain}`;
  }

  const half = Math.floor(idLength / 2);

  return `${id.slice(0, half)}${'*'.repeat(idLength - half)}@${domain}`; 
};