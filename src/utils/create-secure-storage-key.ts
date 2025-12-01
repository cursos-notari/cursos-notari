import { createHash } from "crypto";

export const createSecureStorageKey = (email: string, classId: string): string => {
  const data = `${email}_${classId}`;
  // Se estiver no browser, use uma alternativa ao crypto
  if (typeof window !== 'undefined') {
    // Simples hash para browser (ou use uma lib como crypto-js)
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return `verification_state_${Math.abs(hash).toString(16)}`;
  }
  // Para Node.js (se precisar)
  return `verification_state_${createHash('md5').update(data).digest('hex').substring(0, 16)}`;
};