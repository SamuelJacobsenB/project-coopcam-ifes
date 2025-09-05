export interface BusReservationRequestDTO {
    user_id: string;

    date: Date;
    period: string;
    attended: boolean | null;
}

export interface BusReservationUpdateDTO {
    date: Date | null;
    period: string | null;
    attended: boolean | null;
}