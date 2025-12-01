export enum StatusEnum {
  PLANNED = "planned",
  OPEN = "open",
  CLOSED = "closed",
  IN_PROGRESS = "in_progress",
  PAUSED = "paused",
  FINISHED = "finished",
  CANCELED = "canceled",
}

export type Status = {
  value: string
  label: string
  color: string
}

export const statuses: Record<StatusEnum, Status> = {
  planned: {
    value: "planned",
    label: "Planejada",
    color: "bg-slate-400",
  },
  open: {
    value: "open",
    label: "Aberta",
    color: "bg-green-500",
  },
  paused: {
    value: "paused",
    label: "Pausada",
    color: "bg-yellow-500",
  },
  closed: {
    value: "closed",
    label: "Fechada",
    color: "bg-red-500",
  },
  in_progress: {
    value: "in_progress",
    label: "Ensinando",
    color: "bg-blue-500",
  },
  finished: {
    value: "finished",
    label: "Finalizada",
    color: "bg-purple-500",
  },
  canceled: {
    value: "canceled",
    label: "Cancelada",
    color: "bg-gray-500",
  },
}