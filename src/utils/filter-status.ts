import { StatusEnum, statuses } from '@/constants/statuses';
import { Class } from '@/types/interfaces/database/class';

export function filterStatus(classData: Class) {
  switch (classData.status) {
    case StatusEnum.OPEN: {
      // options: open, closed, canceled
      const { planned, in_progress, finished, ...filtered } = statuses;
      return filtered;
    }
    case StatusEnum.PLANNED: {
      // options: planned, open, canceled
      const { closed, in_progress, paused, finished, canceled, ...filtered } = statuses;
      return filtered;
    }
    case StatusEnum.CLOSED: {
      // options: closed, in_progress, canceled
      const { planned, finished, paused, open, ...filtered } = statuses;
      return filtered;
    }
    case StatusEnum.IN_PROGRESS: {
      // options: in_progress, finished, canceled
      const { planned, open, closed, paused, ...filtered } = statuses;
      return filtered;
    }
    case StatusEnum.PAUSED: {
      const firstClassDate = classData.schedules && classData.schedules[0]
        ? new Date(classData.schedules[0])
        : null;
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // se a data da primeira aula já passou, só permite iniciar ou cancelar a turma.
      if (firstClassDate && firstClassDate < today) {
        const { planned, open, closed, paused, finished, ...filtered } = statuses;
        return filtered;
      } else {
        const { finished, in_progress, planned, ...filtered } = statuses;
        return filtered;
      }
    }
    case StatusEnum.FINISHED: {
      // status final - não permite alteração
      const { planned, open, closed, in_progress, paused, canceled, ...filtered } = statuses;
      return filtered;
    }
    case StatusEnum.CANCELED: {
      // status final - não permite alteração
      const { planned, open, closed, in_progress, paused, finished, ...filtered } = statuses;
      return filtered;
    }
    default:
      return statuses;
  }
}