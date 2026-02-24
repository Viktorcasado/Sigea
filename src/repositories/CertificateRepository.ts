import { supabase } from '@/src/services/supabase';
import { Certificate, Event } from '@/src/types';

export const CertificateRepository = {
  async validate(code: string): Promise<{ certificate: Certificate; event: Event } | null> {
    // Usando a função RPC definida no banco de dados para validação
    const { data, error } = await supabase.rpc('validate_certificate', { p_codigo: code });

    if (error || !data || data.length === 0) {
      console.error('Erro na validação:', error);
      return null;
    }

    const result = data[0];

    // Mapeando o resultado para os tipos da aplicação
    const certificate: Certificate = {
      id: result.codigo_certificado,
      evento_titulo: result.evento_titulo,
      nome_participante: '', // O nome viria de uma consulta adicional se necessário
      data_emissao: result.emitido_em,
      codigo_validacao: result.codigo_certificado,
      carga_horaria_minutos: result.carga_horaria_total * 60,
      evento: {
        id: 0, // ID fictício pois o RPC retorna dados consolidados
        titulo: result.evento_titulo,
        descricao: '',
        instituicao: result.instituicao_sigla,
        campus: result.campus_nome,
        data_inicio: result.emitido_em,
        data_fim: result.emitido_em,
        local: result.campus_nome,
      }
    };

    return {
      certificate,
      event: certificate.evento
    };
  },

  async listByUser(userId: string): Promise<Certificate[]> {
    const { data, error } = await supabase
      .from('certificados')
      .select(`
        *,
        eventos (
          titulo,
          instituicao,
          campus
        )
      `)
      .eq('user_id', userId);

    if (error) throw error;

    return (data || []).map(item => ({
      id: item.id,
      evento_titulo: item.eventos.titulo,
      nome_participante: '', // Nome do usuário logado
      data_emissao: item.emitido_em,
      codigo_validacao: item.codigo_certificado,
      carga_horaria_minutos: item.carga_horaria * 60,
      evento: item.eventos
    }));
  }
};