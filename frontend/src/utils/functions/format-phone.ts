export function formatPhone(phone: string): string {
    if (phone.length !== 10 && phone.length !== 11) {
        return phone;
    }

    return phone.replace(/^(\d{2})(\d{4,5})(\d{4})$/, "($1) $2-$3")
}