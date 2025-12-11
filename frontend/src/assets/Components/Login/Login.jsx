import { FaUser, FaLock } from "react-icons/fa";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // API URL - sempre localhost para desenvolvimento local
  const apiUrl = 'http://localhost:3333';
  
  console.log('Debug API URL:');
  console.log('Hostname:', window.location.hostname);
  console.log('Origin:', window.location.origin);
  console.log('apiUrl:', apiUrl);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(`${apiUrl}/login`, {
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
        navigate("/Home"); // redirecionamento usando React Router
      } else {
        alert(data.message || "Usuário ou senha inválidos");
      }

    } catch (error) {
      alert("Erro ao conectar com a API");
      console.error(error);
    }
  };


return (
<div className="login-page">
{/* Lado esquerdo */}
<div className="left-side">
<h2 className="logo">🌱 Plataforma <span>ESG</span></h2>
<p>Certificação Sustentável</p>

<div className="feature">
<span className="icon">🛡️</span>
<div>
<strong>Avaliação Completa</strong>
<p>Questionários detalhados sobre ESG</p>
</div>
</div>

<div className="feature">
<span className="icon">🏅</span>
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

<div className="tabs" role="tablist" aria-label="Entrar ou Cadastrar">
<button type="button" className="active" role="tab" aria-selected="true">
Entrar
</button>
<button type="button" role="tab" aria-selected="false">
Cadastrar
</button>
</div>

{/* Input e-mail */}
<div className="input-container">
<label htmlFor="email" className="sr-only">E-mail</label>
<FaUser className="icon" aria-hidden />
<input
id="email"
type="email"
placeholder="Seu e-mail"
value={username}
onChange={(e) => setUsername(e.target.value)}
required
/>
</div>

{/* Input senha */}
<div className="input-container">
<label htmlFor="password" className="sr-only">Senha</label>
<FaLock className="icon" aria-hidden />
<input
id="password"
type="password"
placeholder="Sua senha"
value={password}
onChange={(e) => setPassword(e.target.value)}
required
/>
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