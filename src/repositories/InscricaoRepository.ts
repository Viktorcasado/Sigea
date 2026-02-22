"use client";

import { Inscricao, Event } from '@/src/types';
import { supabase } from '@/src/integrations/supabase/client';

export const InscricaoRepository = {
  async getStatus(eventId: string, userId: string): Promise<'inscrito' | 'cancelado' | null> {
    const { data, error } = await supabase
      .from('event_registrations')
      .select('status')
      .eq('event_id', eventId)
      .eq('user_id', userId)
      .maybeSingle();

    if (error) return null;
    return data ? (data.status as any) : null;
  },

  async listByEvento(eventId: string): Promise<Inscricao[]> {
    const { data, error } = await supabase
      .from('event_registrations')
      .select('*, profiles(full_name, email)')
      .eq('event_id', eventId);

    if (error) throw error;
    return data.map(reg => ({
      id: reg.id,
      eventoId: reg.event_id,
      userId: reg.user_id,
      status: reg.status,
      createdAt: new Date(reg.registered_at),
    }));
  },

  async listByUser(userId: string): Promise<Inscricao[]> {
    const { data, error } = await supabase
      .from('event_registrations')
      .select('*, events(*)')
      .eq('user_id', userId);

    if (error) throw error;
    return data.map(reg => ({
      id: reg.id,
      eventoId: reg.event_id,
      userId: reg.user_id,
      status: reg.status,
      createdAt: new Date(reg.registered_at),
      event: reg.events ? {
        id: reg.events.id,
        titulo: reg.events.title,
        dataInicio: new Date(reg.events.date),
        campus: reg.events.campus,
        instituicao: 'IFAL',
        status: 'publicado',
        carga_horaria: reg.events.workload || 0
      } as any : undefined
    }));
  },

  async createInscricao(eventId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('event_registrations')
      .insert({
        event_id: eventId,
        user_id: userId,
        status: 'confirmada',
        registered_at: new Date().toISOString()
      });

    if (error) throw error;
  },

  async cancelInscricao(eventId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('event_registrations')
      .delete()
      .eq('event_id', eventId)
      .eq('user_id', userId);

    if (error) throw error;
  },

  async countByEvento(eventId: string): Promise<number> {
    const { count, error } = await supabase
      .from('event_registrations')
      .select('*', { count: 'exact', head: true })
      .eq('event_id', eventId);

    if (error) return 0;
    return count || 0;
  },
};