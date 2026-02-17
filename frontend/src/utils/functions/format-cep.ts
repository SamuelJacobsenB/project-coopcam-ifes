export function formatCEP(cep: string): string {
    const cleanedCEP = cep.replace(/\D/g, "");

    if (cleanedCEP.length !== 8) {
        return cep;
    }
    
    return cleanedCEP.replace(/(\d{5})(\d{3})/, "$1-$2");
}