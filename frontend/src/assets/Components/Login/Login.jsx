import { FaUser, FaLock } from "react-icons/fa";
import { useState } from "react";
import "./Login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassoword] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:3333/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username,
          password
        })
      });

      const data = await response.json();
      // Exemplo: mostrar resposta da API
      alert("Resposta da API: " + JSON.stringify(data));
    } catch (error) {
      alert("Erro ao conectar com a API");
    }
  };

  return (
    <div className='login-page'>
      {/*Lado Esquerdo da tela*/}
      <div className="left-side">
        <h2 className="logo">
          <img src="src/assets/logo.png" /> Plataforma <span>ESG</span>
        </h2>
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

      {/*Lado Direito*/}
      <div className="right-side">
        <div className="login-card">
          <form onSubmit={handleSubmit}>
            <h1>Bem-vindo</h1>
            <p> Faça login ou crie sua conta</p>
            <div>
              <div className="tabs">
                <button type="button" className="active">Entrar</button>
                <button type="button">Cadastrar</button>
              </div>

              <div className="input-container">
                <input type="email" placeholder='Seu e-mail' onChange={(e) => setUsername(e.target.value)} />
                <FaUser className="icon" />
              </div>
            </div>

            <div>
              <div className="input-container">
                <input type="password" placeholder='Sua senha' onChange={(e) => setPassoword(e.target.value)} />
                <FaLock className="icon" />
              </div>
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