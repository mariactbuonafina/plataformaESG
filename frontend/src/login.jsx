import {FaUser, FaLock} from "react-icons/fa"; import {useState} from "react"; 
import "./Login.css";

const Login = () => { 
  const[username, setUsername] = useState(""); 
  const[password, setPassword] = useState("");
  const[message, setMessage] = useState("");

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
           'Content-Type': 'application/json',
         },
         body: JSON.stringify({ username, password }),
       });
       
       const data = await response.json();
       
       if (data.success) {
         localStorage.setItem('token', data.token);
         localStorage.setItem('user', JSON.stringify(data.user));
         alert('Login realizado com sucesso!');
         // Redirecionar para a página principal ou dashboard
       } else {
         setMessage(data.message);
       }
     } catch (error) {
       setMessage('Erro ao fazer login');
     }
     }; 

     return (
       <div className='login-page'>
        {/*Lado Esquerdo da tela*/}
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
        
        {/*Lado Direito*/}
         <div className="right-side">
          <div className="login-card">
         <form onSubmit={handleSubmit}>
           <h1>Bem-vindo</h1>
            <p> Faça login ou crie sua conta</p> <div> 

            <div className="tabs">
            <button type="button" className="active">Entrar</button>
            <button type="button">Cadastrar</button>
          </div>

        <div className="input-container">
        <input type="email" placeholder='Seu e-mail' onChange={(e) => setUsername(e.target.value)}/>
         <FaUser className="icon" /> 
         </div> 
        </div>

         <div> 
           <div className="input-container">
          <input type="password" placeholder='Sua senha' onChange={(e) => setPassword(e.target.value)}/>
           <FaLock className="icon" /> 
           </div> 
          </div>

          {message && <p style={{color: 'red'}}>{message}</p>}

           <button type="submit" className="btn-login">Entrar</button>
          <a href="#" className="forgot-password">Esqueceu a senha?</a>
            </form> 
            </div> 
            </div>
            </div>
            ) 
          }; 
            export default Login