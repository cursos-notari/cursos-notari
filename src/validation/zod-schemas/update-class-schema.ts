import { z } from 'zod'
import { cleanClassSchema, requiredDateSchema } from './clean-class-schema'
import { combineDateAndTime } from '@/utils/format-data-from-class-form';
import { StatusEnum, statuses } from '@/constants/statuses';

// tipo inferido do schema limpo com data de abertura como date
export type UpdateClassFormData = z.infer<typeof cleanClassSchema> & {
  openingDate: Date;
};


// tipo transformado onde classDays é um array de dates em vez de objetos com date e time
export type TransformedUpdateClassFormData = Omit<UpdateClassFormData, 'classDays'> & {
  classDays: Date[];
};

/**
 * função para criar schema de validação para atualização de turmas
 * aplica validações específicas baseadas no status atual da turma
 * 
 * @param currentStatus - status atual da turma
 * @param occupiedSeats - número de alunos já inscritos (opcional)
 * @returns schema zod configurado com validações contextuais
 */
export const updateClassFormSchema = (currentStatus: StatusEnum, occupiedSeats?: number) => {
  return cleanClassSchema.extend({
    openingDate: requiredDateSchema
  })
    // validação: data de fechamento deve ser posterior à data de abertura
    .refine(data => {
      if (data.openingDate && data.closingDate) {
        return data.closingDate > data.openingDate;
      }
      return true;
    }, {
      message: "A data de fechamento deve ser posterior à data de abertura.",
      path: ["closingDate"],
    })
    // validação: datas das aulas devem ser posteriores ao fechamento das inscrições
    .refine(data => {
      if (data.closingDate && data.classDays) {
        return data.classDays.every(day => {
          if (!day.date) return true;
          return day.date > data.closingDate!;
        });
      }
      return true;
    }, {
      message: "As datas das aulas devem ser posteriores à data de fechamento das inscrições.",
      path: ["classDays"],
    })
    // validação: não permitir dias duplicados de aula
    .refine(data => {
      if (data.classDays && data.classDays.length >= 2) {
        const definedDates = data.classDays
          .map(day => day.date)
          .filter(Boolean);
        const uniqueDays = new Set(
          definedDates.map(date => date.toISOString().split('T')[0])
        );
        return uniqueDays.size === definedDates.length;
      }
      return true;
    }, {
      message: "Não é permitido repetir o mesmo dia de aula.",
      path: ["classDays"],
    })
    // validação: datas das aulas devem estar em ordem cronológica
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
    // validação: turma "aberta" deve ter data de início válida (hoje ou passado)
    .refine(data => {
      if (data.status === 'open' && data.openingDate) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const openingDay = new Date(data.openingDate);
        openingDay.setHours(0, 0, 0, 0);
        return openingDay <= today;
      }
      return true;
    }, {
      message: 'Uma turma não pode ser "Aberta" com uma data de início no futuro.',
      path: ["status"],
    })
    // validação: turma "planejada" deve ter data de início no futuro
    .refine(data => {
      if (data.status === 'planned' && data.openingDate) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return data.openingDate > today;
      }
      return true;
    }, {
      message: "Uma turma 'Planejada' deve ter uma data de início no futuro.",
      path: ["status"],
    })
    // validação: para turmas planejadas, não permitir data de abertura no passado
    .refine(data => {
      if (currentStatus === StatusEnum.PLANNED && data.openingDate) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const openingDay = new Date(data.openingDate);
        openingDay.setHours(0, 0, 0, 0);
        return openingDay >= today;
      }
      return true;
    }, {
      message: "A data de abertura deve ser hoje ou uma data posterior.",
      path: ["openingDate"],
    })
    // validação: número de vagas não pode ser menor que alunos já inscritos
    .refine(data => {
      if (occupiedSeats !== undefined && data.vacancies) {
        return Number(data.vacancies) >= occupiedSeats;
      }
      return true;
    }, {
      message: `O número de vagas não pode ser menor que ${occupiedSeats || 0} (alunos já inscritos).`,
      path: ["vacancies"],
    })
    // validação: reabertura de turma pausada deve ter data de fechamento futura
    .refine(data => {
      if (currentStatus === StatusEnum.PAUSED && data.status === StatusEnum.OPEN) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return data.closingDate > today;
      }
      return true;
    }, {
      message: "Para reabrir a turma, você deve definir uma data de fechamento no futuro.",
      path: ["closingDate"],
    })
    // validação complexa: controle de transições de status válidas
    .superRefine((data, ctx) => {
      // status antes do envio do form
      const currentLabel = statuses[currentStatus].label;
      // status após o envio do form
      const targetStatus = data.status as StatusEnum;
      // label do status enviado no form
      const targetLabel = statuses[targetStatus]?.label || targetStatus;

      let isInvalid = false;
      let customMessage = "";

      // matriz de transições válidas baseada no status atual
      switch (currentStatus) {
        case StatusEnum.OPEN:
          // turma aberta pode ir para: aberta, fechada, cancelada ou pausada
          const validForOpen = [StatusEnum.OPEN, StatusEnum.CLOSED, StatusEnum.CANCELED, StatusEnum.PAUSED];
          if (!validForOpen.includes(targetStatus)) isInvalid = true;
          break;

        case StatusEnum.PLANNED:
          // turma planejada pode ir para: planejada ou aberta
          const validForPlanned = [StatusEnum.PLANNED, StatusEnum.OPEN];
          if (!validForPlanned.includes(targetStatus)) isInvalid = true;
          break;

        case StatusEnum.CLOSED:
          // turma fechada pode ir para: fechada, em progresso ou cancelada
          const validForClosed = [StatusEnum.CLOSED, StatusEnum.IN_PROGRESS, StatusEnum.CANCELED];
          if (!validForClosed.includes(targetStatus)) isInvalid = true;
          break;

        case StatusEnum.IN_PROGRESS:
          // turma em progresso pode ir para: em progresso, finalizada ou cancelada
          const validForInProgress = [StatusEnum.IN_PROGRESS, StatusEnum.FINISHED, StatusEnum.CANCELED];
          if (!validForInProgress.includes(targetStatus)) isInvalid = true;
          break;

        case StatusEnum.PAUSED: {
          const firstClassDate = data.classDays[0]?.date;
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          // lógica especial para turmas pausadas: depende se as aulas já começaram
          if (firstClassDate && firstClassDate < today) {
            // se a primeira aula já passou, só pode iniciar ou cancelar
            customMessage = "A data da primeira aula já passou. Você deve iniciar a turma ou cancelá-la.";
            const validStatuses = [StatusEnum.IN_PROGRESS, StatusEnum.CANCELED];
            if (!validStatuses.includes(targetStatus)) {
              isInvalid = true;
            }
          } else {
            // se as aulas ainda não começaram, pode voltar para outros status
            const validForPaused = [StatusEnum.PAUSED, StatusEnum.OPEN, StatusEnum.CLOSED, StatusEnum.CANCELED];
            if (!validForPaused.includes(targetStatus)) {
              isInvalid = true;
            }
          }
          break;
        }

        case StatusEnum.CANCELED:
          // turma cancelada não pode ter status alterado
          if (targetStatus !== StatusEnum.CANCELED) {
            isInvalid = true;
            customMessage = "Uma turma cancelada não pode ter seu status alterado.";
          }
          break;

        case StatusEnum.FINISHED:
          // turma finalizada não pode ter status alterado
          if (targetStatus !== StatusEnum.FINISHED) {
            isInvalid = true;
            customMessage = "Uma turma finalizada não pode ter seu status alterado.";
          }
          break;
      }

      // adiciona erro se a transição for inválida
      if (isInvalid) {
        const message = customMessage || `Uma turma "${currentLabel}" não pode ser marcada como "${targetLabel}".`;
        ctx.addIssue({ code: "custom", message, path: ["status"] });
      }
    })
};

/**
 * função para criar schema transformado com validação baseada no status atual
 * converte os objetos classDays (date + time) em arrays de date combinados
 * 
 * @param currentStatus - status atual da turma
 * @param occupiedSeats - número de alunos já inscritos (opcional)
 * @returns schema zod que transforma os dados após validação
 */
export const transformedUpdateClassFormSchema = (currentStatus: StatusEnum, occupiedSeats?: number) => {
  return updateClassFormSchema(currentStatus, occupiedSeats)
    .transform((data) => {
      return {
        ...data,
        // combina date e time em objetos date únicos
        classDays: data.classDays.map(day =>
          combineDateAndTime(day.date, day.time)
        )
      }
    });
};