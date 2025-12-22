'use server'

import { cache } from "react";
import { PublicClass } from "@/types/interfaces/database/class";
import { cacheLife } from "next/cache";
import { createServiceClient } from "@/supabase/service-client";

interface GetClassByIdReturn {
  success: boolean;
  data?: PublicClass;
}

export const getClassById = cache(async (classId: string): Promise<GetClassByIdReturn> => {

  "use cache"

  cacheLife('seconds');

  const supabase = createServiceClient();

  if(!supabase) return { success: false }

  const { data, error } = await supabase
    .from('open_classes')
    .select('*')
    .eq('id', classId)
    .maybeSingle()
  ;

  if (error) {
    console.error(`${error.code}:`, error.message);
    return { success: false };
  }

  return {
    success: true,
    data: data
  };
})