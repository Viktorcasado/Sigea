import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CertificateSignerPage() {
  const navigate = useNavigate();
  const [form, setForm] = React.useState({
    nome: 'João Vítor',
    cargo: 'Diretor da EventosMD',
    instituicao: 'IFAL – Campus Marechal Deodoro',
    matricula: '',
    cidade: 'Marechal Deodoro – AL',
    data: new Date().toISOString().slice(0, 10),
    hora: new Date().toTimeString().slice(0, 5),
    codigo: 'SIG-ASS-2026-001',
    certificado: 'Certificamos que [NOME DO PARTICIPANTE] participou da atividade/evento com carga horária de [X HORAS], realizada nesta instituição, para os devidos fins.',
  });

  const [layout, setLayout] = React.useState('institucional');

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const assinaturaTexto = React.useMemo(() => {
    const dataBR = form.data ? new Date(`${form.data}T12:00:00`).toLocaleDateString('pt-BR') : '//____';

    if (layout === 'sistema') {
      return {
        linha1: `(Assinado digitalmente em ${dataBR} às ${form.hora || '__:__'})`,
        linha2: form.nome || 'NOME COMPLETO',
        linha3: form.cargo || 'CARGO',
        linha4: form.instituicao || 'INSTITUIÇÃO',
        linha5: form.matricula ? `Matrícula: ${form.matricula}` : '',
        linha6: form.codigo ? `Código de validação: ${form.codigo}` : '',
      };
    }

    if (layout === 'certificado') {
      return {
        linha1: '____________________________________',
        linha2: form.nome || 'NOME COMPLETO',
        linha3: form.cargo || 'CARGO',
        linha4: form.instituicao || 'INSTITUIÇÃO',
        linha5: '',
        linha6: '',
      };
    }

    return {
      linha1: `Assinado digitalmente em ${dataBR}${form.hora ? ` às ${form.hora}` : ''}`,
      linha2: form.nome || 'NOME COMPLETO',
      linha3: form.cargo || 'CARGO',
      linha4: form.instituicao || 'INSTITUIÇÃO',
      linha5: form.cidade || '',
      linha6: form.codigo ? `Validação: ${form.codigo}` : '',
    };
  }, [form, layout]);

  const imprimir = () => window.print();

  const copiarAssinatura = async () => {
    const texto = [
      assinaturaTexto.linha1,
      assinaturaTexto.linha2,
      assinaturaTexto.linha3,
      assinaturaTexto.linha4,
      assinaturaTexto.linha5,
      assinaturaTexto.linha6,
    ]
      .filter(Boolean)
      .join('\n');

    try {
      await navigator.clipboard.writeText(texto);
      alert('Assinatura copiada com sucesso.');
    } catch {
      alert('Não consegui copiar automaticamente.');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-900 print:bg-white">
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .print-area { box-shadow: none !important; border: none !important; margin: 0 !important; }
          body { background: white; }
        }
      `}</style>

      <div className="mx-auto grid max-w-7xl gap-6 p-4 md:grid-cols-[380px_1fr] md:p-6">
        <aside className="no-print rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center text-gray-600 hover:text-gray-900 font-semibold mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar
          </button>

          <div className="mb-5">
            <h1 className="text-2xl font-bold tracking-tight">Assinador</h1>
            <p className="mt-2 text-sm text-neutral-600">
              Monte sua assinatura institucional e visualize no certificado.
            </p>
          </div>

          <div className="space-y-4">
            <Field label="Nome completo">
              <input 
                className="w-full rounded-2xl border px-3 py-2 outline-none focus:ring-2" 
                value={form.nome} 
                onChange={(e) => handleChange('nome', e.target.value)} 
              />
            </Field>

            <Field label="Cargo">
              <input 
                className="w-full rounded-2xl border px-3 py-2 outline-none focus:ring-2" 
                value={form.cargo} 
                onChange={(e) => handleChange('cargo', e.target.value)} 
              />
            </Field>

            <Field label="Instituição / setor">
              <input 
                className="w-full rounded-2xl border px-3 py-2 outline-none focus:ring-2" 
                value={form.instituicao} 
                onChange={(e) => handleChange('instituicao', e.target.value)} 
              />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Data">
                <input 
                  type="date" 
                  className="w-full rounded-2xl border px-3 py-2 outline-none focus:ring-2" 
                  value={form.data} 
                  onChange={(e) => handleChange('data', e.target.value)} 
                />
              </Field>
              <Field label="Hora">
                <input 
                  type="time" 
                  className="w-full rounded-2xl border px-3 py-2 outline-none focus:ring-2" 
                  value={form.hora} 
                  onChange={(e) => handleChange('hora', e.target.value)} 
                />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Cidade">
                <input 
                  className="w-full rounded-2xl border px-3 py-2 outline-none focus:ring-2" 
                  value={form.cidade} 
                  onChange={(e) => handleChange('cidade', e.target.value)} 
                />
              </Field>
              <Field label="Matrícula">
                <input 
                  className="w-full rounded-2xl border px-3 py-2 outline-none focus:ring-2" 
                  value={form.matricula} 
                  onChange={(e) => handleChange('matricula', e.target.value)} 
                />
              </Field>
            </div>

            <Field label="Código de validação">
              <input 
                className="w-full rounded-2xl border px-3 py-2 outline-none focus:ring-2" 
                value={form.codigo} 
                onChange={(e) => handleChange('codigo', e.target.value)} 
              />
            </Field>

            <Field label="Texto do certificado">
              <textarea 
                rows={4} 
                className="w-full rounded-2xl border px-3 py-2 outline-none focus:ring-2" 
                value={form.certificado} 
                onChange={(e) => handleChange('certificado', e.target.value)} 
              />
            </Field>

            <Field label="Estilo da assinatura">
              <div className="grid grid-cols-1 gap-2">
                {[
                  ['institucional', 'Institucional'],
                  ['sistema', 'Padrão sistema'],
                  ['certificado', 'Linha clássica'],
                ].map(([id, label]) => (
                  <button
                    key={id}
                    onClick={() => setLayout(id)}
                    className={`rounded-2xl border px-3 py-2 text-sm font-medium transition ${layout === id ? 'bg-neutral-900 text-white' : 'bg-white hover:bg-neutral-50'}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </Field>

            <div className="grid grid-cols-1 gap-3 pt-2">
              <button 
                onClick={copiarAssinatura} 
                className="rounded-2xl bg-neutral-900 px-4 py-3 font-semibold text-white shadow-sm transition hover:opacity-90"
              >
                Copiar assinatura
              </button>
              <button 
                onClick={imprimir} 
                className="rounded-2xl border px-4 py-3 font-semibold transition hover:bg-neutral-50"
              >
                Imprimir / PDF
              </button>
            </div>
          </div>
        </aside>

        <main className="print-area rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-black/5 md:p-10">
          <div className="mx-auto max-w-4xl">
            <div className="mb-8 flex items-start justify-between gap-4 border-b pb-5">
              <div>
                <div className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">Modelo de certificado</div>
                <h2 className="mt-2 text-3xl font-bold tracking-tight">Certificado</h2>
              </div>
              <div className="rounded-2xl border px-4 py-2 text-right text-sm text-neutral-600">
                <div>{form.cidade}</div>
                <div>{form.data ? new Date(`${form.data}T12:00:00`).toLocaleDateString('pt-BR') : '__/__/____'}</div>
              </div>
            </div>

            <div className="min-h-[240px] text-justify text-[18px] leading-8 text-neutral-800">
              {form.certificado}
            </div>

            <div className="mt-20 grid gap-8 md:grid-cols-2">
              <div className="rounded-3xl border border-dashed p-6">
                <div className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500">
                  Prévia da assinatura
                </div>

                <div className="space-y-1 text-neutral-900">
                  <div className="text-sm text-neutral-600">{assinaturaTexto.linha1}</div>
                  <div className="pt-2 text-lg font-bold uppercase tracking-wide">{assinaturaTexto.linha2}</div>
                  <div className="text-base">{assinaturaTexto.linha3}</div>
                  <div className="text-base">{assinaturaTexto.linha4}</div>
                  {assinaturaTexto.linha5 ? <div className="text-sm text-neutral-600">{assinaturaTexto.linha5}</div> : null}
                  {assinaturaTexto.linha6 ? <div className="text-sm text-neutral-600">{assinaturaTexto.linha6}</div> : null}
                </div>
              </div>

              <div className="rounded-3xl bg-neutral-50 p-6">
                <div className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500">
                  Como usar
                </div>
                <div className="space-y-3 text-sm leading-6 text-neutral-700">
                  <p>1. Preencha seus dados no painel à esquerda.</p>
                  <p>2. Escolha o estilo mais próximo do padrão que você usa.</p>
                  <p>3. Copie a assinatura para colar em certificados e documentos.</p>
                  <p>4. Se quiser gerar arquivo, use o botão de impressão e salve em PDF.</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="mb-2 text-sm font-medium text-neutral-700">{label}</div>
      {children}
    </label>
  );
}
