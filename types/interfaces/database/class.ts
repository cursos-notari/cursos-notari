import { StatusEnum } from "@/constants/statuses";

export interface Class {
  id: string;
  name: string;
  description?: string | null;

  opening_date: string;
  closing_date: string;

  total_seats: number;
  occupied_seats: number;

  registration_fee: number;
  address: string;

  status: StatusEnum;

  updated_at: string;
  created_at: string;

  schedules?: string[] | null;
}

export interface ClassFormWithDays {
  classDays: Array<{
    date: Date;
    time: string;
  }>;
}

export interface PublicClass {
  id: string;
  name: string;
  address: string;
  total_seats: number;
  occupied_seats: number;
  opening_date: string;
  closing_date: string;
  registration_fee: number;
  schedules: string[];
}