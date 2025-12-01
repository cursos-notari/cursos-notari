-- SQL Function para buscar turmas que devem iniciar hoje
create or replace function get_classes_starting_today () RETURNS table (id UUID, name TEXT, first_class_date DATE) as $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.name,
    MIN(s.schedule_date::DATE) as first_class_date
  FROM classes c
  JOIN class_schedules s ON c.id = s.class_id
  WHERE 
    c.status = 'open'
    AND MIN(s.schedule_date::DATE) = CURRENT_DATE
  GROUP BY c.id, c.name;
END;
$$ LANGUAGE plpgsql;

-- Função para automatizar TODOS os status de uma vez
create or replace function auto_update_class_statuses () RETURNS JSON as $$
DECLARE
  result JSON;
  opened_count INT := 0;
  closed_count INT := 0;
  started_count INT := 0;
BEGIN
  -- Abrir turmas planejadas
  UPDATE classes 
  SET status = 'open'
  WHERE status = 'planned' 
    AND opening_date <= CURRENT_DATE;
  
  GET DIAGNOSTICS opened_count = ROW_COUNT;
  
  -- Fechar turmas abertas
  UPDATE classes 
  SET status = 'closed'
  WHERE status = 'open' 
    AND closing_date < CURRENT_DATE;
  
  GET DIAGNOSTICS closed_count = ROW_COUNT;
  
  -- Iniciar turmas (primeira aula)
  UPDATE classes 
  SET status = 'in_progress'
  WHERE status = 'open' 
    AND id IN (
      SELECT c.id 
      FROM classes c
      JOIN class_schedules s ON c.id = s.class_id
      WHERE s.schedule_date::DATE = CURRENT_DATE
      GROUP BY c.id
    );
  
  GET DIAGNOSTICS started_count = ROW_COUNT;
  
  result := json_build_object(
    'opened', opened_count,
    'closed', closed_count,
    'started', started_count,
    'success', true
  );
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;