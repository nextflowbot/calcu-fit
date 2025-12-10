import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { storage } from '../services/storage';
import { useApp } from '../App';
import { Screen, User } from '../types';
import { X, FileText, Check } from 'lucide-react';

// Terms Modal Component
const TermsModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  // Generate current date and time string
  const currentDateTime = new Date().toLocaleString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-2 text-slate-800">
            <FileText className="text-primary" size={20} />
            <h3 className="font-bold text-lg">Termos de Uso e Privacidade</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 text-sm text-gray-600 leading-relaxed space-y-4">
          <div className="mb-4 pb-4 border-b border-gray-100">
            <p className="font-bold text-lg text-slate-800">Termos de Uso, Política de Privacidade e Aviso Legal</p>
            <p className="mt-1">Aplicativo: <strong>CalcuFit</strong></p>
            <p>Última atualização: <strong>{currentDateTime}</strong></p>
          </div>

          <h4 className="font-bold text-slate-800 mt-4 text-base">1. Aviso Legal (Não Substitui Profissional de Saúde)</h4>
          <p>
            O CalcuFit é um aplicativo de acompanhamento nutricional e de hidratação.
            Ele <strong>não substitui orientação médica</strong>, diagnóstico, acompanhamento nutricional profissional ou tratamento de saúde.
          </p>
          <p className="mt-2">
            Sempre consulte um médico, nutricionista ou profissional qualificado antes de iniciar dietas, planos alimentares, rotinas de exercícios ou qualquer mudança no estilo de vida.
            Nunca ignore recomendações profissionais devido a informações encontradas no aplicativo.
          </p>

          <h4 className="font-bold text-slate-800 mt-4 text-base">2. Uso do Aplicativo</h4>
          <p>
            Ao utilizar o CalcuFit, você concorda com estes termos. Caso não concorde, deve interromper o uso imediatamente.
          </p>

          <h4 className="font-bold text-slate-800 mt-4 text-base">3. Armazenamento de Dados</h4>
          <p>
            O aplicativo armazena os dados localmente no dispositivo, utilizando armazenamento interno (LocalStorage/AsyncStorage).
          </p>
          <p className="mt-2">
            Ao limpar o cache, formatar o aparelho ou desinstalar o aplicativo, os dados podem ser perdidos permanentemente.
            Recomenda-se que o usuário faça backups manuais, quando necessário.
          </p>
          <p className="mt-2">
            Nenhum dado é enviado ou armazenado em servidores externos.
          </p>

          <h4 className="font-bold text-slate-800 mt-4 text-base">4. Coleta e Uso de Informações Pessoais</h4>
          <p>O CalcuFit pode coletar informações fornecidas voluntariamente, como:</p>
          <ul className="list-disc pl-5 mt-1 space-y-1">
            <li>Nome</li>
            <li>E-mail</li>
            <li>Preferências nutricionais</li>
            <li>Registros alimentares e de hidratação</li>
          </ul>
          <p className="mt-2">
            Esses dados são usados exclusivamente para o funcionamento interno do app.
            O CalcuFit não vende, não aluga e não compartilha informações pessoais com terceiros.
          </p>

          <h4 className="font-bold text-slate-800 mt-4 text-base">5. Permissões do Dispositivo</h4>
          <p>
            <strong>Câmera:</strong> utilizada apenas para funções relacionadas à análise de alimentos.
            Nenhuma foto é enviada a terceiros sem autorização do usuário.
          </p>

          <h4 className="font-bold text-slate-800 mt-4 text-base">6. Precisão das Informações Nutricionais</h4>
          <p>
            Os valores nutricionais exibidos no aplicativo — inclusive os estimados por IA — são aproximados e podem variar segundo marca, preparo e porções.
            Não garantimos precisão absoluta.
          </p>

          <h4 className="font-bold text-slate-800 mt-4 text-base">7. Responsabilidade do Usuário</h4>
          <p>O usuário concorda em:</p>
          <ul className="list-disc pl-5 mt-1 space-y-1">
            <li>Registrar informações corretas;</li>
            <li>Acompanhar suas próprias metas de saúde;</li>
            <li>Buscar orientação profissional sempre que necessário.</li>
          </ul>
          <p className="mt-2">
            O aplicativo não se responsabiliza por decisões individuais com base nos dados registrados.
          </p>

          <h4 className="font-bold text-slate-800 mt-4 text-base">8. Alterações nos Termos</h4>
          <p>
            O CalcuFit pode atualizar estes Termos a qualquer momento.
            O uso contínuo após alterações indica que você concorda com os novos termos.
          </p>

          <h4 className="font-bold text-slate-800 mt-4 text-base">9. Idade Mínima</h4>
          <p>
            O CalcuFit pode ser utilizado por pessoas com 13 anos ou mais, ou idade mínima equivalente no país do usuário.
          </p>

          <h4 className="font-bold text-slate-800 mt-4 text-base">10. Contato</h4>
          <p>Em caso de dúvidas, sugestões ou solicitações, entre em contato:</p>
          <div className="mt-2 p-4 bg-slate-50 rounded-xl border border-slate-100">
            <p className="flex items-center gap-2 mb-2">
              <span>📧</span> 
              <span className="font-medium">E-mail:</span> 
              <a href="mailto:suportecalcufit@gmail.com" className="text-primary hover:underline">suportecalcufit@gmail.com</a>
            </p>
            <p className="flex items-center gap-2">
              <span>📱</span> 
              <span className="font-medium">WhatsApp:</span> 
              <span>+55 11 96721-6205</span>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-gray-100 bg-gray-50 flex justify-end">
          <button 
            onClick={onClose}
            className="bg-primary hover:bg-primaryDark text-white px-6 py-2.5 rounded-xl font-medium transition-colors"
          >
            Li e Concordo
          </button>
        </div>
      </div>
    </div>
  );
};

export const SignUp: React.FC = () => {
  const { setUser, setScreen } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  
  // Terms State
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  
  const [error, setError] = useState('');

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password || !confirmPass) {
      setError('Preencha todos os campos.');
      return;
    }
    if (password !== confirmPass) {
      setError('As senhas não coincidem.');
      return;
    }
    if (!acceptedTerms) {
      setError('Você deve aceitar os Termos de Uso para continuar.');
      return;
    }

    const users = storage.getUsers();
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      setError('E-mail já cadastrado.');
      return;
    }

    const newUser: User = {
      id: uuidv4(),
      name,
      email,
      password,
      settings: {
        calorieGoal: 2000,
        waterGoal: 2000,
      },
      records: {
        food: [],
        water: [],
      },
    };

    users.push(newUser);
    storage.saveUsers(users);
    storage.saveCurrentUser(newUser);
    setUser(newUser);
    setScreen(Screen.HOME);
  };

  return (
    <>
      {showTermsModal && <TermsModal onClose={() => setShowTermsModal(false)} />}
      
      <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-background">
        <div className="w-full max-w-sm">
          <h1 className="text-3xl font-bold text-primary mb-2 text-center">Criar conta</h1>
          <p className="text-gray-400 text-center mb-8 text-sm">Comece sua jornada saudável hoje</p>

          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Nome completo"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                type="email"
                placeholder="E-mail"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Senha"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <input
                type="password"
                placeholder="Confirmar senha"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white"
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
              />
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start gap-3 px-1 py-2">
              <div className="relative flex items-center mt-0.5">
                <input
                  type="checkbox"
                  id="terms"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-gray-300 transition-all checked:border-primary checked:bg-primary hover:border-primary/50"
                />
                <Check
                  size={12}
                  strokeWidth={3}
                  className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 transition-opacity peer-checked:opacity-100"
                />
              </div>
              <label htmlFor="terms" className="text-sm text-gray-500 cursor-pointer select-none leading-tight">
                Eu li e concordo com os{' '}
                <button
                  type="button"
                  onClick={() => setShowTermsModal(true)}
                  className="text-primary font-semibold hover:underline"
                >
                  Termos de Uso
                </button>
                {' '}e Política de Privacidade do CalcuFit.
              </label>
            </div>

            {error && (
              <div className="bg-red-50 text-red-500 text-sm px-4 py-3 rounded-xl text-center border border-red-100">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-primary hover:bg-primaryDark text-white font-semibold py-3.5 rounded-xl transition-colors shadow-lg shadow-primary/30 mt-2"
            >
              Cadastrar
            </button>
          </form>

          <div className="mt-8 text-center">
            <button
              onClick={() => setScreen(Screen.LOGIN)}
              className="text-primary hover:text-primaryDark font-medium text-sm transition-colors"
            >
              Já tem conta? <span className="underline">Entrar</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};