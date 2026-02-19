"use client";

import { Certificate, Event } from '@/src/types';
import { mockCertificates, mockEvents } from '@/src/data/mock';

export const CertificateRepository = {
  async validate(code: string): Promise<{ certificate: Certificate; event: Event } | null> {
    // Simula busca no banco de dados
    const certificate = mockCertificates.find(
      c => c.codigo.toUpperCase() === code.trim().toUpperCase()
    );

    if (!certificate) return null;

    const event = mockEvents.find(e => e.id === certificate.eventId);
    if (!event) return null;

    return { certificate, event };
  }
};