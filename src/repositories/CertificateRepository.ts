"use client";

import { supabase } from '@/src/integrations/supabase/client';

export interface ValidationResult {
  codigo_certificado: string;
  evento_titulo: string;
  instituicao_sigla: string;
  campus_nome: string;
  carga_horaria_total: number;
  emitido_em: string;
}

export const CertificateRepository = {
  async validate(code: string): Promise<ValidationResult | null> {
    const { data, error } = await supabase.rpc('validate_certificate', {
      p_codigo: code.trim()
    });

    if (error || !data || data.length === 0) {
      console.error("Erro na validação:", error);
      return null;
    }

    return data[0];
  }
};