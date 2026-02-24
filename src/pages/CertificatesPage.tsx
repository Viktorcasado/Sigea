import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BadgeCheck, Download, Copy, Loader2, Award } from 'lucide-react';
import { useUser } from '@/src/contexts/UserContext';
import { CertificateRepository } from '@/src/repositories/CertificateRepository';
import { Certificate, Event } from '@/src/types';
import jsPDF from 'jspdf';
import QRCode from 'qrcode';

const generatePdf = async (certificate: Certificate, event?: Event) => {
    const doc = new jsPDF();
    const validationUrl = `${window.location.origin}/validar-certificado?codigo=${certificate.codigo_validacao}`;

    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('SIGEA - Certificado de Participação', 105, 20, { align: 'center' });

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Certificamos que o participante participou do evento:`, 105, 40, { align: 'center' });

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(certificate.evento_titulo, 105, 55, { align: 'center' });

    if (event) {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(`Realizado por: ${event.instituicao || 'IFAL'} - ${event.campus || ''}`, 105, 65, { align: 'center' });
    }

    doc.text(`Emitido em: ${new Date(certificate.data_emissao).toLocaleDateString('pt-BR')}`, 105, 85, { align: 'center' });
    doc.setFont('courier', 'bold');
    doc.text(`Código de Validação: ${certificate.codigo_validacao}`, 105, 100, { align: 'center' });

    try {
        const qrCodeDataUrl = await QRCode.toDataURL(validationUrl);
        doc.addImage(qrCodeDataUrl, 'PNG', 85, 110, 40, 40);
    } catch (err) {
        console.error('Failed to generate QR code', err);
    }

    doc.save(`certificado-${certificate.id}.pdf`);
};

const CertificateCard = ({ certificate }: { certificate: Certificate }) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(certificate.codigo_validacao);
    alert('Código copiado!');
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
        <div className="flex-grow">
          <h3 className="font-bold text-gray-900 text-lg leading-tight">{certificate.evento_titulo}</h3>
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-500 mt-3">
            <span className="flex items-center gap-1">
              Emissão: <strong>{new Date(certificate.data_emissao).toLocaleDateString('pt-BR')}</strong>
            </span>
            <span className="flex items-center gap-1">
              Carga Horária: <strong>{Math.floor(certificate.carga_horaria_minutos / 60)}h</strong>
            </span>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <code className="text-xs font-mono bg-gray-100 text-gray-600 px-2 py-1 rounded-md">
              {certificate.codigo_validacao}
            </code>
            <button onClick={copyToClipboard} className="p-1.5 text-gray-400 hover:text-indigo-600 transition-colors">
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>
        <button 
          onClick={() => generatePdf(certificate, certificate.evento)} 
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-50 text-indigo-600 font-bold rounded-xl hover:bg-indigo-100 transition-colors"
        >
          <Download className="w-5 h-5" />
          Baixar PDF
        </button>
      </div>
    </div>
  );
};

export default function CertificatesPage() {
  const { user } = useUser();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      CertificateRepository.listByUser(user.id)
        .then(setCertificates)
        .finally(() => setLoading(false));
    }
  }, [user]);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Meus Certificados</h1>
        <p className="text-gray-500 mt-1">Acesse e valide suas participações em eventos acadêmicos.</p>
      </header>

      <Link to="/validar-certificado" className="flex items-center justify-center gap-3 w-full bg-white border-2 border-dashed border-gray-200 text-gray-600 font-bold px-4 py-6 rounded-2xl hover:border-indigo-300 hover:text-indigo-600 transition-all group">
        <BadgeCheck className="w-6 h-6 group-hover:scale-110 transition-transform" />
        Validar um certificado externo
      </Link>

      <main className="space-y-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Loader2 className="w-10 h-10 animate-spin mb-4" />
            <p className="font-medium">Buscando seus certificados...</p>
          </div>
        ) : certificates.length > 0 ? (
          certificates.map(cert => (
            <CertificateCard key={cert.id} certificate={cert} />
          ))
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Nenhum certificado ainda</h3>
            <p className="text-gray-500 mt-2 max-w-xs mx-auto">
              Participe de eventos e confirme sua presença para receber seus certificados digitais aqui.
            </p>
            <Link to="/explorar" className="mt-6 inline-block text-indigo-600 font-bold hover:underline">
              Explorar eventos disponíveis
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}