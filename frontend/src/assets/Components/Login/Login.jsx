import { FaUser, FaLock } from "react-icons/fa";
import { useState } from "react";
import "./Login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('https://effective-disco-r45xvrwv4r4cwxwx-3333.app.github.dev/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert("Login realizado com sucesso!");
        localStorage.setItem("user", JSON.stringify(data.user));
        window.location.href = "/Inicio"; // redirecionamento
      } else {
        alert(data.message || "Usuário ou senha inválidos");
      }

    } catch (error) {
      alert("Erro ao conectar com a API");
      console.error(error);
    }
  };

  return (
    <div className='login-page'>
      {/* Lado esquerdo */}
      <div className="left-side">
        <h2 className="logo"><img src="src/assets/logo.png"/> Plataforma <span>ESG</span></h2>
        <span className="subtitulo">Certificação Sustentável</span>
        <div className="feature">
          <span className="icon"><img src="src/assets/Group 16.png" alt="" /></span>
          <div>
            <strong>Avaliação Completa</strong>
            <p>Questionários detalhados sobre ESG</p>
          </div>
        </div>
        <div className="feature">
          <span className="icon"><img src="src/assets/Group 17.png" alt="" /></span>
          <div>
            <strong>Certificação Oficial</strong>
            <p>Selos Bronze, Prata e Ouro</p>
          </div>
        </div>
        <p className="cta">Junte-se a empresas que já fazem a diferença</p>
      </div>

      {/* Lado direito */}
      <div className="right-side">
        <div className="login-card">
          <form onSubmit={handleSubmit}>
            <h1>Bem-vindo</h1>
            <p>Faça login ou crie sua conta</p>

            <div className="tabs">
              <button type="button" className="active">Entrar</button>
              <button type="button">Cadastrar</button>
            </div>

            <div className="input-container">
              <input type="email" placeholder='Seu e-mail' onChange={(e) => setUsername(e.target.value)} />
              <FaUser className="icon" />
            </div>

            <div className="input-container">
              <input type="password" placeholder='Sua senha' onChange={(e) => setPassword(e.target.value)} />
              <FaLock className="icon" />
            </div>

            <button type="submit" className="btn-login">Entrar</button>
            <a href="#" className="forgot-password">Esqueceu a senha?</a>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
