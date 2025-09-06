import type { Role, Template, WeeklyPreference } from "../"

export interface User {
    id: string
    template_id: string
    weekly_preference_id: string

    name: string
    email: string
    password: string
    roles: Role[]

    cpf: string
    phone: string
    adress: string
    cep: string

    template: Template | null
    weekly_preference: WeeklyPreference | null

    created_at: Date
    updated_at: Date
}