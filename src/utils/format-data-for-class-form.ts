import { Class } from "@/types/interfaces/database/class";

const formatSchedulesForClassForm = (schedules: string[] | null | undefined) => {
  // se não houverem dias de aula retorna um valor default
  if (!schedules || schedules.length === 0) {
    return [{ date: null!, time: "" }];
  }
  return schedules.map(schedule => {
    // cria objeto com a string de data
    const dateObj = new Date(schedule);

    // aqui fica a data
    const date = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate());

    // aqui fica a hora
    const time = new Intl.DateTimeFormat("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false, // garante formato 24h
    }).format(dateObj);
    
    return { date, time };
  });
};

export const formatDataForClassForm = (classData: Class) => {
  return {
    className: classData.name,
    description: classData.description || "",
    openingDate: classData.opening_date ? new Date(`${classData.opening_date}T00:00:00`) : new Date(),
    closingDate: classData.closing_date ? new Date(`${classData.closing_date}T00:00:00`) : new Date(),
    status: classData.status || "planned",
    vacancies: classData.total_seats,
    registrationFee: classData.registration_fee,
    address: classData.address,
    classDays: formatSchedulesForClassForm(classData.schedules)
  }
};