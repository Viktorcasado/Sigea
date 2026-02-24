import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BadgeCheck, Download, Copy, Loader2, Award, ArrowRight } from 'lucide-react';
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
    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-6">
        <div className="flex-grow">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                <Award className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="font-black text-gray-900 text-lg tracking-tight leading-tight">{certificate.evento_titulo}</h3>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-bold text-gray-400 ml-13">
            <span className="flex items-center gap-2">
              Emissão: <span className="text-gray-600">{new Date(certificate.data_emissao).toLocaleDateString('pt-BR')}</span>
            </span>
            <span className="flex items-center gap-2">
              Carga Horária: <span className="text-gray-600">{Math.floor(certificate.carga_horaria_minutos / 60)}h</span>
            </span>
          </div>
          <div className="mt-4 flex items-center gap-2 ml-13">
            <code className="text-[10px] font-black font-mono bg-gray-50 text-gray-500 px-3 py-1.5 rounded-lg border border-gray-100 uppercase tracking-widest">
              {certificate.codigo_validacao}
            </code>
            <button onClick={copyToClipboard} className="p-2 text-gray-400 hover:text-indigo-600 transition-colors">
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>
        <button 
          onClick={() => generatePdf(certificate, certificate.evento)} 
          className="flex items-center justify-center gap-3 px-6 py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95"
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
    <div className="space-y-10 pb-12">
      <header>
        <h1 className="text-4xl font-black text-gray-900 tracking-tighter">Meus Certificados</h1>
        <p className="text-gray-500 font-bold mt-1">Acesse e valide suas participações em eventos acadêmicos.</p>
      </header>

      <Link to="/validar-certificado" className="flex items-center justify-center gap-4 w-full bg-white border-2 border-dashed border-gray-200 text-gray-500 font-black px-6 py-8 rounded-[2.5rem] hover:border-indigo-300 hover:text-indigo-600 transition-all group">
        <BadgeCheck className="w-7 h-7 group-hover:scale-110 transition-transform" />
        Validar um certificado externo
      </Link>

      <main className="space-y-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Loader2 className="w-10 h-10 animate-spin mb-4" />
            <p className="font-bold">Buscando seus certificados...</p>
          </div>
        ) : certificates.length > 0 ? (
          certificates.map(cert => (
            <CertificateCard key={cert.id} certificate={cert} />
          ))
        ) : (
          <div className="text-center py-20 bg-white rounded-[3rem] border border-gray-100 shadow-sm">
            <div className="w-24 h-24 bg-gray-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
              <Award className="w-12 h-12 text-gray-200" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 tracking-tight">Nenhum certificado ainda</h3>
            <p className="text-gray-500 font-bold mt-2 max-w-xs mx-auto">
              Participe de eventos e confirme sua presença para receber seus certificados digitais aqui.
            </p>
            <Link to="/explorar" className="mt-8 inline-flex items-center gap-2 text-indigo-600 font-black hover:underline">
              Explorar eventos disponíveis <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}