"use client";

interface ShareData {
  title: string;
  text: string;
  url: string;
}

// Função auxiliar para ser usada dentro de componentes que têm acesso ao hook useToast
export const handleShare = async (data: ShareData, showToast: (msg: string) => void) => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: data.title,
        text: data.text,
        url: data.url,
      });
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        copyToClipboard(data.url, showToast);
      }
    }
  } else {
    copyToClipboard(data.url, showToast);
  }
};

const copyToClipboard = (text: string, showToast: (msg: string) => void) => {
  navigator.clipboard.writeText(text).then(() => {
    showToast('Link copiado para a área de transferência!');
  });
};

export const formatEventShare = (event: any) => {
  const baseUrl = window.location.origin;
  const url = `${baseUrl}/evento/${event.id}`;
  
  return {
    title: `SIGEA | ${event.titulo}`,
    text: `📌 ${event.titulo}\n🏫 ${event.instituicao} - ${event.campus}\n📅 ${new Date(event.dataInicio).toLocaleDateString('pt-BR')}\n🔗 Inscreva-se pelo SIGEA:`,
    url
  };
};

export const formatActivityShare = (event: any, activity: any) => {
  const baseUrl = window.location.origin;
  const url = `${baseUrl}/evento/${event.id}?atividade=${activity.id}`;
  
  const startTime = new Date(activity.start_time).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  const endTime = new Date(activity.end_time).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  const date = new Date(activity.date).toLocaleDateString('pt-BR');

  return {
    title: `SIGEA | ${activity.title}`,
    text: `🗓️ Atividade: ${activity.title}\n📌 Evento: ${event.titulo}\n⏰ ${date} • ${startTime}-${endTime}\n🔗 Veja no SIGEA:`,
    url
  };
};