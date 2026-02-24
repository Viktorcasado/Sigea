import { Event, User, Certificate, Notification } from '../types';

export const mockUsers: User[] = [
  {
    id: 'user001',
    nome: 'Maria Silva (Gestora)',
    email: 'maria.silva@ifal.edu.br',
    cpf: '123.456.789-00',
    siape: '1234567',
    instituicao: 'IFAL',
    campus: 'Maceió',
    perfil: 'gestor',
    status: 'gestor',
  },
  {
    id: 'user002',
    nome: 'João Santos (Aluno)',
    email: 'joao.santos@aluno.ufal.br',
    cpf: '111.222.333-44',
    matricula: '2023123456',
    instituicao: 'UFAL',
    campus: 'A. C. Simões',
    perfil: 'aluno',
    status: 'ativo_vinculado',
  },
  {
    id: 'user003',
    nome: 'Ana Costa (Comunidade)',
    email: 'ana.costa@email.com',
    cpf: '555.666.777-88',
    perfil: 'comunidade_externa',
    status: 'ativo_comunidade',
  },
];

export const mockUser: User = mockUsers[0];

// Helper to format date for display
const formatDate = (date: Date) => {
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`;
}

export const mockEvents: Event[] = [
    {
        id: 1,
        titulo: 'Semana de Tecnologia',
        descricao: 'Um evento focado nas últimas tendências de desenvolvimento de software e IA.',
        instituicao: 'IFAL',
        campus: 'Maceió',
        data_inicio: new Date('2026-02-20').toISOString(),
        data_fim: new Date('2026-02-22').toISOString(),
        modalidade: 'Híbrido',
        local: 'Auditório Principal & Online',
        vagas: 200,
        status: 'rascunho',
    },
    { id: 2, titulo: 'Congresso de Biologia', instituicao: 'UFAL', campus: 'A. C. Simões', data_inicio: new Date(2024, 7, 25).toISOString(), data_fim: new Date(2024, 7, 27).toISOString(), modalidade: 'Online', vagas: 200, local: 'Google Meet', descricao: 'Descrição detalhada do congresso.', status: 'publicado' },
    { id: 3, titulo: 'Feira de Robótica', instituicao: 'IFAL', campus: 'Maceió', data_inicio: new Date(2024, 8, 1).toISOString(), data_fim: new Date(2024, 8, 2).toISOString(), modalidade: 'Híbrido', vagas: 100, local: 'Ginásio e YouTube', descricao: 'Descrição da feira de robótica.', status: 'publicado' },
    { id: 4, titulo: 'Palestra de Empreendedorismo', instituicao: 'Comunidade', campus: 'Online', data_inicio: new Date(2024, 8, 5).toISOString(), data_fim: new Date(2024, 8, 5).toISOString(), modalidade: 'Online', vagas: 0, local: 'Zoom', descricao: 'Palestra sobre como começar seu negócio.', status: 'encerrado' },
    { id: 5, titulo: 'Minicurso de Python', instituicao: 'UFAL', campus: 'Arapiraca', data_inicio: new Date(2024, 8, 10).toISOString(), data_fim: new Date(2024, 8, 11).toISOString(), modalidade: 'Presencial', vagas: 30, local: 'Lab. 4', descricao: 'Minicurso prático de Python para iniciantes.', status: 'publicado' },
];

export const mockProximosEventos = mockEvents.slice(0, 5);

export const mockAvisos = [
    {
        id: 'avs001',
        texto: 'As inscrições para o programa de monitoria terminam esta semana.',
    },
    {
        id: 'avs002',
        texto: 'Novo edital de auxílio estudantil publicado. Confira no site.',
    },
];



export const mockNotifications: Notification[] = [
  {
    id: 'notif001',
    userId: 'user001',
    titulo: 'Certificado Disponível',
    mensagem: 'Seu certificado para a \"Semana de TI\" já pode ser emitido.',
    tipo: 'certificado',
    lida: false,
    createdAt: new Date(new Date().setDate(new Date().getDate() - 1)),
    referenciaId: 'cert001',
  },
  {
    id: 'notif002',
    userId: 'user001',
    titulo: 'Evento Próximo',
    mensagem: 'O evento \"Congresso de Biologia\" começa amanhã!',
    tipo: 'evento',
    lida: false,
    createdAt: new Date(),
    referenciaId: 'evt02',
  },
  {
    id: 'notif003',
    userId: 'user001',
    titulo: 'Atualização do Sistema',
    mensagem: 'Atualizamos nossos Termos de Uso. Confira as novidades.',
    tipo: 'sistema',
    lida: true,
    createdAt: new Date(new Date().setDate(new Date().getDate() - 3)),
  },
];

export const mockCertificates: Certificate[] = [
  {
    id: 'cert001',
    evento_titulo: mockEvents[0].titulo,
    nome_participante: mockUser.nome,
    data_emissao: new Date(2024, 7, 25).toISOString(),
    codigo_validacao: 'SIGEA-0001-24',
    evento: mockEvents[0],
  },
];
