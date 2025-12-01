import { z } from "zod";
import { cleanClassSchema } from "./clean-class-schema";
import { combineDateAndTime } from "@/utils/format-data-from-class-form";

export const createClassSchema = cleanClassSchema
  // override: esse schema só aceita os status planned ou open, não todos os status.
  .extend({
    status: z.enum(["planned", "open"], {
      error: (issue) => {
        if (issue.code === 'invalid_value') {
          return { message: "Esse campo é obrigatório." };
        }

        return { message: "Status deve ser 'Planejado' ou 'Aberto'." };
      }
    }),
  })
  // valida se a data de fechamento é posterior à data de abertura.
  .refine(data => {
    if (data.openingDate && data.closingDate) {
      return data.closingDate > data.openingDate;
    }

    return true;
  }, {
    message: "A data de fechamento deve ser posterior à data de abertura.",
    path: ["closingDate"],
  })
  // valida se os dias de aula são posteriores à data de fechamento.
  .refine(data => {
    if (data.closingDate && data.classDays) {
      return data.classDays.every(day => {
        if (!day.date) return true;
        return day.date > data.closingDate;
      });
    }

    return true;
  }, {
    message: "As datas das aulas devem ser posteriores à data de fechamento das inscrições.",
    path: ["classDays"],
  })
  // valida se os dias de aula não se repetem.
  .refine(data => {
    if (data.classDays && data.classDays.length >= 2) {
      const definedDates = data.classDays
        .map(day => day.date)
        // .filter(Boolean) remove valores falsy (null, undefined, "", 0, false, etc.)
        .filter(Boolean);

      // se não há datas válidas suficientes, não há duplicatas
      if (definedDates.length < 2) return true;

      const uniqueDays = new Set(
        // .split('T')[0] pega só a parte da data
        definedDates.map(date => date.toISOString().split('T')[0])
      );
      // se uma data se repete, não seria incluída no Set e os comprimentos seriam diferentes
      return uniqueDays.size === definedDates.length;
    }

    return true
  }, {
    message: "Não é permitido repetir o mesmo dia de aula.",
    path: ["classDays"],
  })
  // valida se os dias foram colocados em ordem cronológica.
  .refine(data => {
    if (data.classDays && data.classDays.length >= 2) {
      for (let i = 1; i < data.classDays.length; i++) {
        const prevDate = data.classDays[i - 1].date;
        const currDate = data.classDays[i].date;
        if (prevDate && currDate && currDate <= prevDate) {
          return false;
        }
      }
    }
    return true;
  }, {
    message: "As datas das aulas devem estar em ordem cronológica.",
    path: ["classDays"],
  })
  // valida se a data de abertura é correspondente ao status 'Aberta'
  .refine(data => {
    if (data.status === 'open' && data.openingDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const openingDay = new Date(data.openingDate);
      openingDay.setHours(0, 0, 0, 0);
      return openingDay <= today;
    }

    return true
  }, {
    message: "Uma turma não pode ser 'Aberta' com uma data de abertura no futuro.",
    path: ["status"],
  })
  // valida se a data de abertura é correspondente ao status 'Planejada'
  .refine(data => {
    if (data.status === 'planned' && data.openingDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return data.openingDate > today;
    }

    return true;
  }, {
    message: "Uma turma 'Planejada' deve ter uma data de abertura no futuro.",
    path: ["status"],
  })
  // transforma os dias de aula de [{ data, time }] para Date[]
  .transform((data) => {
    return {
      ...data,
      classDays: data.classDays.map(day =>
        combineDateAndTime(day.date, day.time)
      )
    }
  });

// dias de aula no formato { data, time }
export type CreateClassFormData = z.input<typeof createClassSchema>;

// dias de aula no formato Date[]
export type TransformedCreateClassFormData = z.output<typeof createClassSchema>;