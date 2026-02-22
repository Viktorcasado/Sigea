"use client";

interface ShareData {
  title: string;
  text: string;
  url: string;
}

/**
 * Função universal para compartilhar conteúdo.
 * Tenta usar a API nativa do dispositivo ou copia para o clipboard.
 */
export const shareContent = async (data: ShareData, showToast?: (msg: string) => void) => {
  const sharePayload = {
    title: data.title,
    text: data.text,
    url: data.url,
  };

  if (navigator.share && navigator.canShare?.(sharePayload)) {
    try {
      await navigator.share(sharePayload);
    } catch (error) {
      // Se o usuário cancelar, não fazemos nada. Se for outro erro, tentamos copiar.
      if ((error as Error).name !== 'AbortError') {
        copyToClipboard(data.url, showToast);
      }
    }
  } else {
    copyToClipboard(data.url, showToast);
  }
};

const copyToClipboard = (text: string, showToast?: (msg: string) => void) => {
  navigator.clipboard.writeText(text).then(() => {
    if (showToast) {
      showToast('Link copiado para a área de transferência!');
    } else {
      alert('Link copiado!');
    }
  }).catch(() => {
    alert('Erro ao copiar link. Por favor, copie manualmente: ' + text);
  });
};

export const formatEventShare = (event: any) => {
  const baseUrl = window.location.origin;
  const url = `${baseUrl}/evento/${event.id}`;
  
  return {
    title: `SIGEA | ${event.titulo}`,
    text: `📌 Confira este evento: ${event.titulo}\n🏫 ${event.instituicao} - ${event.campus}\n📅 Data: ${new Date(event.dataInicio).toLocaleDateString('pt-BR')}\n\nInscreva-se pelo SIGEA:`,
    url
  };
};

export const formatActivityShare = (event: any, activity: any) => {
  const baseUrl = window.location.origin;
  const url = `${baseUrl}/evento/${event.id}?atividade=${activity.id}`;
  
  const startTime = new Date(activity.start_time).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  const date = new Date(activity.date).toLocaleDateString('pt-BR');

  return {
    title: `SIGEA | ${activity.title}`,
    text: `🗓️ Atividade: ${activity.title}\n📌 Evento: ${event.titulo}\n⏰ ${date} às ${startTime}\n\nVeja os detalhes no SIGEA:`,
    url
  };
};