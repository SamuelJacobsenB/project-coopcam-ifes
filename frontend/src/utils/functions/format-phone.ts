export function formatPhone(phone: string): string {
  const cleanedPhone = phone.replace(/\D/g, "");

  if (cleanedPhone.length !== 10 && cleanedPhone.length !== 11) {
    return cleanedPhone;
  }

  return cleanedPhone.replace(/^(\d{2})(\d{4,5})(\d{4})$/, "($1) $2-$3");
}
