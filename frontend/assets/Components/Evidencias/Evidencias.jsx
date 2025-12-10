import {useNavigate} from 'react-router-dom';
import React, { useState, useCallback } from 'react';
import './Evidencias.css';
import { Upload, Check, X } from 'lucide-react'; 
import nuvemIcon from "../img/nuvem.png";

const UploadedFilesList = ({ files, onDelete }) => {
  if (files.length === 0) return null;

  return (
    <div className="uploaded-files-section">
      <h3>Arquivos Enviados</h3>
      <ul className="file-list">
        {files.map((file, index) => (
          <li key={index} className="file-item">
            <div className="file-details-group">
                <span className="file-icon">📄</span>
                <span className="file-name">{file.name}</span>
                <span className="file-size">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                <span className="file-status">✅</span>
            </div>
            
            <button 
              className="delete-button" 
              // Chamamos a função onDelete passando o índice do arquivo a ser excluído
              onClick={() => onDelete(index)}
              title={`Excluir ${file.name}`}
            >
              <X size={16} /> 
            </button>
          </li>
        ))}
      </ul>
      <p className="arquivos-info">Total de {files.length} arquivo(s) adicionado(s).</p>
    </div>
  );
};

const ESGEvidenciasUpload = () => {
  const navigate = useNavigate ();
  
  const handleBack = () => {
  navigate (-1);  
  };

  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  // Mock da função de lidar com a adição de arquivos
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    handleFiles(files);
  };

  const MAX_SIZE_MB = 10;

const handleFiles = (files) => {
const validFiles = [];

files.forEach(file => {
const sizeMB = file.size / 1024 / 1024;
if (sizeMB <= MAX_SIZE_MB) {
validFiles.push({ name: file.name, size: file.size });
} else {
alert(`O arquivo ${file.name} excede o limite de ${MAX_SIZE_MB}MB.`);
}
});

setUploadedFiles(prev => [...prev, ...validFiles]);
};
  // FUNÇÃO: Lógica para deletar um arquivo
  const handleDeleteFile = useCallback((fileIndexToDelete) => {
    // Filtra a lista, mantendo apenas os arquivos cujo índice NÃO é o índice a ser excluído
    setUploadedFiles(prev => 
      prev.filter((_, index) => index !== fileIndexToDelete)
    );
  }, []);

  // Funções de Drag and Drop
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  }, []);

  // Simular clique no input file (mantido)
  const fileInputRef = React.useRef(null);
  const handleAreaClick = () => {
    fileInputRef.current?.click();
  };

  const documentosSugeridos = [
    'Política de Sustentabilidade',
    'Certificações Ambientais',
    'Relatório de Impacto Social',
    'Relatório de Diversidade',
    'Código de Ética',
    'Plano de Gestão de Resíduos'
  ];

  return (
    <div className="app-container">
      <div className="header-bar">
        <button className="back-button" onClick={handleBack}>
          <span className="arrow">←</span> Voltar
        </button>
        <div className="title-area">
          <h1>Evidências ESG</h1>
          <p>Documentos de comprovação</p>
        </div>
      </div>

      <div className="upload-card">
        <div className="card-header">
          <div className="nuvem">
           <img src={nuvemIcon} alt="" />
          </div>
          <h2>Upload de Evidências</h2>
          <p className="subtitle">
            Faça upload dos documentos que comprovam suas práticas sustentáveis,
            políticas de governança e iniciativas sociais
          </p>
        </div>

        <div
          className={`drop-area ${isDragOver ? 'drag-over' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleAreaClick}
          role= "button"
          tabIndex={0}
          onKeyDown={(e) => (e.key === "Enter" || e.key === "") && handleAreaClick()}
        >
            {/* ... Drop Area Input e Textos mantidos ... */}
            <input
                type="file"
                multiple
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: 'none' }}
                accept=".pdf, .doc, .docx, .xls, .xlsx, .jpg, .jpeg, .png"
            />
            <Upload size={40} className="upload-icon" />
            <p className="drag-text">Arraste seus arquivos aqui</p>
            <p className="click-text">ou clique para selecionar do seu dispositivo</p>
            <div className="file-types-info">
                <span>PDF</span>
                <span>Word</span>
                <span>Excel</span>
                <span>Imagens</span>
                <span className="size-limit">Até 10MB</span>
            </div>
        </div>

        {/* Componente de lista, agora passando a função de delete */}
        <UploadedFilesList 
            files={uploadedFiles} 
            onDelete={handleDeleteFile} 
        />

        {/* ... Documentos Sugeridos mantidos ... */}
        <div className="suggested-docs">
          <div className="suggested-header">
            <span className="doc-icon">📄</span>
            <h3>Documentos Sugeridos</h3>
          </div>
          <div className="docs-list">
            {documentosSugeridos.map((doc, index) => (
              <div key={index} className="doc-item">
                • {doc}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="footer-bar">
        <button className="finish-upload-button">
          Concluir Upload <Check size={16} />
        </button>
      </div>
    </div>
  );
};

export default ESGEvidenciasUpload;