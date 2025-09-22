import React, { useState } from 'react';
import './App.css';
import logotipoSvg from './assets/Logotipos.svg';
import iconSvg from './assets/icon.svg';
import imagePng from './assets/image.png';


function App() {
  // Estados para os campos do formulário
  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState(''); // NOVO ESTADO
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmeSenha, setConfirmeSenha] = useState('');

  // Estados para validação e feedback da API
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState(null);

  // Estados para a visibilidade da senha
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const [confirmeSenhaVisivel, setConfirmeSenhaVisivel] = useState(false);

  // Manipulador de evento genérico para os inputs
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    switch (id) {
      case 'nome':
        setNome(value);
        break;
      case 'sobrenome': // NOVO CASE
        setSobrenome(value);
        break;
      case 'email':
        setEmail(value);
        break;
      case 'telefone':
        setTelefone(value);
        break;
      case 'senha':
        setSenha(value);
        break;
      case 'confirme-senha':
        setConfirmeSenha(value);
        break;
      default:
        break;
    }
  };

  // Funções para alternar a visibilidade da senha
  const toggleSenhaVisivel = () => {
    setSenhaVisivel(!senhaVisivel);
  };
  const toggleConfirmeSenhaVisivel = () => {
    setConfirmeSenhaVisivel(!confirmeSenhaVisivel);
  };

  // Função de validação dos campos
  const validate = () => {
    const newErrors = {};
    if (!nome) newErrors.nome = 'Nome é obrigatório.'; // ALTERAÇÃO
    if (!sobrenome) newErrors.sobrenome = 'Sobrenome é obrigatório.'; // NOVA VALIDAÇÃO
    if (!email) {
      newErrors.email = 'E-mail é obrigatório.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'E-mail inválido.';
    }
    if (!telefone) newErrors.telefone = 'Telefone é obrigatório.';
    if (!senha) {
      newErrors.senha = 'Senha é obrigatória.';
    } else if (senha.length < 8) {
      newErrors.senha = 'A senha deve ter no mínimo 8 caracteres.';
    }
    if (!confirmeSenha) {
      newErrors.confirmeSenha = 'Confirme sua senha.';
    } else if (senha !== confirmeSenha) {
      newErrors.confirmeSenha = 'As senhas não coincidem.';
    }
    return newErrors;
  };

  // Função para lidar com o envio do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    setErrors(validationErrors);
    
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setApiError(null);
    setSuccess(false);
    setLoading(true);

    // Mapeando os dados para os campos da API
    const formData = {
      name: nome,
      last_name: sobrenome, // NOVO CAMPO
      email: email,
      phone: telefone,
      password: senha,
      // O campo confirm_password não é necessário na requisição da API
    };

    try {
  const response = await fetch('https://flow.ecto.tools/webhook/79e12507-621e-4880-bb5a-9fd8c15a4b61', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': '9fMD5VvEzQShteBFutyWw33f'
    },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    let errorMessage = 'Erro ao cadastrar a conta.';
    try {
      const errorData = await response.json();
      if (errorData.message) errorMessage = errorData.message;
    } catch (jsonError) {
      console.warn('Resposta da API não é JSON válido', jsonError);
    }
    throw new Error(errorMessage);
  }

  setSuccess(true);
  console.log('Conta cadastrada com sucesso!');
  
  setNome('');
  setSobrenome('');
  setEmail('');
  setTelefone('');
  setSenha('');
  setConfirmeSenha('');
  setErrors({});

} catch (err) {
  setApiError(err.message);
  console.error('Falha no envio:', err);
} finally {
  setLoading(false);
}

  };

  return (
    <main className="wrapper">
      <div className="container">
        <section className="conteudo">
          <header className="cabecalho">
            <img className="logotipo" src={logotipoSvg} alt="Logotipo Ecto" />
            <button type="button" className="falar-especialista">Falar com um especialista</button>
          </header>

          <div className="apresentacao__conteudo">
            <img className="icone" src={iconSvg} alt="Ícone" />
            <h1 className="criar-conta">Criar nova conta</h1>
            <h2 className="observacao">Preencha os campos do formulário abaixo para criar uma nova conta na Ecto Tools:</h2>

            <form className="formulario-conta" onSubmit={handleSubmit}>
              <div className="nome-wrapper"> {/* NOVO WRAPPER PARA OS CAMPOS DE NOME */}
                <div className="input-grupo">
                  <label htmlFor="nome">Nome</label>
                  <input type="text" id="nome" placeholder="Escreva seu nome" value={nome} onChange={handleInputChange} />
                  {errors.nome && <p className="error-message">{errors.nome}</p>}
                </div>
                <div className="input-grupo">
                  <label htmlFor="sobrenome">Sobrenome</label>
                  <input type="text" id="sobrenome" placeholder="Escreva seu sobrenome" value={sobrenome} onChange={handleInputChange} />
                  {errors.sobrenome && <p className="error-message">{errors.sobrenome}</p>}
                </div>
              </div>

              <label htmlFor="email">E-mail</label>
              <input type="email" id="email" placeholder="exemplo@email.com" value={email} onChange={handleInputChange} />
              {errors.email && <p className="error-message">{errors.email}</p>}

              <label htmlFor="telefone">Telefone</label>
              <input type="tel" id="telefone" placeholder="+55 (00) 0000-0000" value={telefone} onChange={handleInputChange} />
              {errors.telefone && <p className="error-message">{errors.telefone}</p>}

              <div className="senha-wrapper">
                <div className="input-grupo">
                  <label htmlFor="senha">Senha</label>
                  <div className="input-campo">
                    <input type={senhaVisivel ? 'text' : 'password'} id="senha" placeholder="•••••••••" value={senha} onChange={handleInputChange} />
                    <button type="button" className="mostrar-senha" onClick={toggleSenhaVisivel}>{senhaVisivel ? 'Ocultar' : 'Mostrar'}</button>
                  </div>
                  {errors.senha && <p className="error-message">{errors.senha}</p>}
                </div>
                <div className="input-grupo">
                  <label htmlFor="confirme-senha">Confirme sua senha</label>
                  <div className="input-campo">
                    <input type={confirmeSenhaVisivel ? 'text' : 'password'} id="confirme-senha" placeholder="•••••••••" value={confirmeSenha} onChange={handleInputChange} />
                    <button type="button" className="mostrar-senha" onClick={toggleConfirmeSenhaVisivel}>{confirmeSenhaVisivel ? 'Ocultar' : 'Mostrar'}</button>
                  </div>
                  {errors.confirmeSenha && <p className="error-message">{errors.confirmeSenha}</p>}
                </div>
              </div>

              <button type="submit" className="conta" disabled={loading}>
                {loading ? 'Cadastrando...' : 'Cadastrar conta'}
              </button>
            </form>
            
            {/* Mensagens de feedback */}
            {success && <p className="success-message">Conta criada com sucesso!</p>}
            {apiError && <p className="api-error-message">{apiError}</p>}
          </div>

          <footer className="rodape">
            <div className="rodape__links">
              <ul>
                <li><a href="#">Políticas de privacidade</a></li>
                <li><a href="#">Termos de uso</a></li>
              </ul>
            </div>
            <div className="rodape__data">
              <p>Teste de estágio 2025</p>
            </div>
          </footer>
        </section>

        <section className="apresentacao__imagem-wrapper">
          <img className="apresentacao__imagem" src={imagePng} alt="Imagem ilustrativa" />
          <div className="imagem__texto">
            <h3>Tudo em um só lugar</h3>
            <p>Tenha visibilidade total da operação de SEO, mídia e conteúdo com a Ecto Tools - nossa plataforma exclusiva para acompanhar entregas, dados e performance em tempo real.</p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default App;