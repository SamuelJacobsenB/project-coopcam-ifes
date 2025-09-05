export interface AvailableOverrideRequestDTO {
    date: Date;
    reason: string;
}

export interface AvailableOverrideUpdateDTO {
    date: Date | null;
    reason: string | null;
}