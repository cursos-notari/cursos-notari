'use server'

import { cache } from "react";
import { PublicClass } from "@/types/interfaces/database/class";
import { cacheLife } from "next/cache";
import { createClient } from "@/lib/supabase/service";
import { PostgrestError } from "@supabase/supabase-js";
import { isValidUUID } from "@/utils/is-valid-UUID";

interface GetClassByIdReturn {
  success: boolean;
  data?: PublicClass;
  error?: PostgrestError | { message: string };
}

export const getClassById = cache(async (classId: string): Promise<GetClassByIdReturn> => {

  "use cache"

  cacheLife('seconds');

  if(!isValidUUID(classId)) return { success: false };

  const supabase = createClient();

  if(!supabase) return { success: false };

  const { data, error } = await supabase
    .from('open_classes')
    .select('*')
    .eq('id', classId)
    .maybeSingle()
  ;

  if (error) {
    return { 
      success: false,
      error: error
    };
  }

  return {
    success: true,
    data: data
  };
})