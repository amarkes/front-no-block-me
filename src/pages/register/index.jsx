import { useState, useContext } from 'react';
import AuthContext from '@/context/AuthContext';
import { Link } from 'react-router-dom';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import styles from './styles.module.css';
import registerImage from '../../assets/login_home.png';
import { toast } from 'react-toastify';

const RegisterPage = ({ setIsLogin }) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState('');
  const { register } = useContext(AuthContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!acceptTerms) {
      toast.error('Você precisa aceitar os termos de uso!');
      return;
    }
    if (!email || !password || !username) {
      toast.error('Preencha todos os campos!');
      return;
    }
    register(email, password, username);
  };

  return (
    <div className={styles.registerContainer}>
      <div className={styles.registerCardContainer}>
        <div className={styles.registerCard}>
          <div className={styles.headerText}>
            <h2 className={styles.title}>Cadastre-se agora mesmo!</h2>
            <div className={styles.divider}>
              <span className={styles.line}></span>
              <span className={styles.text}>Será um prazer ter você com a gente!</span>
              <span className={styles.line}></span>
            </div>
          </div>
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <div className={styles.inputWrapper}>
                <label htmlFor="email" className={[styles.label, `dark:text-white`].join(' ')}>Insira um email válido</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.input}
                />
              </div>
              <div className={styles.inputWrapper}>
                <label htmlFor="gender" className={[styles.label, `dark:text-white`].join(' ')}>
                  Insira uma senha
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={styles.input}
                />
              </div>
              <div className={styles.inputWrapper}>
                <label htmlFor="username" className={[styles.label, `dark:text-white`].join(' ')}>Insira seu nome completo</label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={styles.input}
                />
              </div>
              <div className={styles.inputWrapper}>
                <label htmlFor="acceptTerms" className={[styles.label, `dark:text-white`].join(' ')}>
                  <input
                    id="acceptTerms"
                    name="acceptTerms"
                    type="checkbox"
                    required
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className={styles.checkbox}
                  />
                  Eu aceito os <Dialog>
                    <DialogTrigger asChild>
                      <button className={styles.link}>
                        termos e condições
                      </button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg bg-white">
                      <DialogHeader>
                        <DialogTitle>Termos e Condições</DialogTitle>
                        <DialogDescription />
                        {/* <DialogDescription> */}
                        <div className={styles.modalContent}>
                          <h1>Termos de Uso</h1>

                          <h2>1. Aceitação dos Termos</h2>
                          <p>
                            Ao criar uma conta e usar o nosso site, app, ou serviços, você concorda com os Termos de Uso descritos neste documento. Se não concordar com algum dos termos, você não deve usar o Serviço.
                          </p>
                          <br />
                          <h2>2. Idade Mínima</h2>
                          <p>
                            Você deve ter pelo menos 18 anos para usar este site. Ao criar uma conta, você confirma que tem idade suficiente para acessar o Serviço.
                          </p>
                          <br />
                          <h2>3. Criação e Uso da Conta</h2>
                          <ul>
                            <li>Você é responsável por garantir que as informações fornecidas no momento do cadastro sejam verdadeiras, precisas e atualizadas.</li>
                            <li>É proibido criar contas falsas, representar terceiros sem autorização ou criar múltiplas contas.</li>
                          </ul>
                          <br />
                          <h2>4. Compartilhamento de Dados e Fotos</h2>
                          <ul>
                            <li>
                              Você pode compartilhar dados pessoais e fotos em seu perfil. Ao fazê-lo, você concede a uma licença limitada para exibir essas informações em conformidade com a funcionalidade do Serviço.
                            </li>
                            <li>É estritamente proibido postar conteúdos que:
                              <ul>
                                <li>Sejam ofensivos, pornográficos, violentos ou discriminatórios.</li>
                                <li>Contenham informações falsas ou enganosas.</li>
                                <li>Violam direitos de propriedade intelectual ou privacidade de terceiros.</li>
                              </ul>
                            </li>
                          </ul>
                          <br />
                          <h2>5. Privacidade e Segurança</h2>
                          <p>
                            Nós ultilizamos medidas de segurança para proteger seus dados. No entanto, você reconhece que nenhuma transmissão de dados pela internet é completamente segura, e utiliza o Serviço por sua conta e risco.
                          </p>
                          <p>
                            Seus dados pessoais serão tratados conforme nossa <a href="#">Política de Privacidade</a>.
                          </p>
                          <br />
                          <h2>6. Conduta do Usuário</h2>
                          <ul>
                            <li>É proibido usar o Serviço para:
                              <ul>
                                <li>Assediar, intimidar ou prejudicar outros usuários.</li>
                                <li>Enviar mensagens não solicitadas (spam) ou realizar atividades fraudulentas.</li>
                                <li>Realizar qualquer ação que comprometa a integridade ou o funcionamento do Serviço.</li>
                              </ul>
                            </li>
                            <li>Você é exclusivamente responsável pelo conteúdo que compartilha e pelas interações que realiza na plataforma.</li>
                          </ul>
                          <br />
                          <h2>7. Denúncias e Moderação</h2>
                          <p>
                            Possuimos uma equipe de moderação para revisar denúncias de comportamentos ou conteúdos inadequados.
                          </p>
                          <p>
                            Os usuários podem denunciar perfis ou conteúdos que violem os Termos de Uso. Nós reservamos o direito de suspender ou banir usuários que desrespeitem as regras.
                          </p>
                          <br />
                          <h2>8. Cancelamento e Exclusão de Conta</h2>
                          <p>
                            Você pode cancelar sua conta a qualquer momento. Ao excluir sua conta, seus dados e fotos serão removidos do Serviço, mas podem permanecer armazenados por um período limitado para fins legais ou de backup.
                          </p>
                          <p>
                            Nós reservamos o direito de suspender ou excluir contas que violarem os Termos de Uso.
                          </p>
                          <br />
                          <h2>9. Limitação de Responsabilidade</h2>
                          <p>
                            Nós não se responsabiliza por:
                          </p>
                          <ul>
                            <li>Atos ou conteúdos compartilhados por outros usuários.</li>
                            <li>Perdas ou danos decorrentes de interações entre usuários dentro ou fora do Serviço.</li>
                            <li>Violação de dados devido a ataques cibernéticos ou falhas técnicas.</li>
                          </ul>
                          <br />
                          <h2>10. Alterações nos Termos de Uso</h2>
                          <p>
                            Podemos atualizar estes Termos de Uso periodicamente. Você será notificado sobre alterações importantes e deverá revisar os Termos atualizados. O uso contínuo do Serviço após alterações indica a aceitação dos novos Termos.
                          </p>
                          <br />
                          <h2>11. Contato</h2>
                          <p>
                            Se você tiver dúvidas sobre estes Termos de Uso, entre em contato conosco.
                          </p>
                        </div>
                        {/* </DialogDescription> */}
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                </label>
              </div>



            </div>

            <div>
              <button
                disabled={!acceptTerms}
                type="submit"
                className={styles.submitButton}
              >
                Continue
              </button>
              <span className={styles.textInfo}>Ao clicar em continuar, você declara que leu e aceita os Termos de Uso</span>
            </div>

            <div className={styles.footerText}>
              Já tem uma conta? <Link to="/login" className={styles.link}>Entrar</Link>
            </div>
          </form>
        </div>

        <div className={styles.loginIllustration}>
          <h2 className={styles.illustrationTitle}>Crie sua conta e faça parte dessa comunidade!</h2>
          <p className={styles.illustrationText}>
          Ao se cadastrar, você terá acesso a todas as funcionalidades da plataforma.
          </p>
          <img
            src={registerImage}
            alt="Illustration"
            className={styles.illustrationImage}
          />
        </div>
      </div>

    </div>
  );
}

export default RegisterPage;