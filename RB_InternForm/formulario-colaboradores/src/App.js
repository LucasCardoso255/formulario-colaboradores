// src/App.js
import React, { useState } from 'react';
import './App.css';

function App() {
    const [formData, setFormData] = useState({
        tempoColaboracao: '',
        turno: '',
        trabalhoSignificativo: '',
        trabalhoDesafiador: '',
        trabalhoEstressante: '',
        salarioAdequado: '',
        liderancaValorizaOpinioes: '',
        oportunidadeCrescimento: '',
        satisfacaoEncarregadosSupervisores: '',
        satisfacaoBeneficios: '',
        satisfacaoEmpregador: '',
        procuraraOutroEmprego: '',
        opiniaoCriticasSugestoes: ''
    });

    const [submitStatus, setSubmitStatus] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitStatus('submitting');

        const requiredFields = [
            'tempoColaboracao', 'turno', 'trabalhoSignificativo', 'trabalhoDesafiador',
            'trabalhoEstressante', 'salarioAdequado', 'liderancaValorizaOpinioes',
            'oportunidadeCrescimento', 'satisfacaoEncarregadosSupervisores',
            'satisfacaoBeneficios', 'satisfacaoEmpregador', 'procuraraOutroEmprego'
        ];

        for (const field of requiredFields) {
            if (!formData[field]) {
                alert(`Por favor, preencha o campo: ${field}`);
                setSubmitStatus(null);
                return;
            }
        }

        try {
            const response = await fetch('/api/submitAnonymousForm', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setSubmitStatus('success');
                setFormData({
                    tempoColaboracao: '',
                    turno: '',
                    trabalhoSignificativo: '',
                    trabalhoDesafiador: '',
                    trabalhoEstressante: '',
                    salarioAdequado: '',
                    liderancaValorizaOpinioes: '',
                    oportunidadeCrescimento: '',
                    satisfacaoEncarregadosSupervisores: '',
                    satisfacaoBeneficios: '',
                    satisfacaoEmpregador: '',
                    procuraraOutroEmprego: '',
                    opiniaoCriticasSugestoes: ''
                });
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erro ao enviar o formulário.');
            }
        } catch (error) {
            console.error('Erro ao enviar:', error);
            setSubmitStatus('error');
        }
    };

    const renderRatingOptions = (name) => {
        return (
            <div className="rating-options">
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <span key={num}>
                        <input
                            type="radio"
                            id={`<span class="math-inline">name</span>{num}`}
                            name={name}
                            value={num}
                            checked={formData[name] === String(num)}
                            onChange={handleChange}
                            required
                        />
                        <label htmlFor={`<span class="math-inline">\{name\}</span>{num}`}>{num}</label>
                    </span>
                ))}
            </div>
        );
    };

    return (
        <div className="container">
            <form onSubmit={handleSubmit} className="satisfaction-form">
                <div className="form-header">
                    {}
                    <img src="/1cabeçalho.PNG" alt="Logotipo Riobras - Pesquisa de Satisfação dos Colaboradores" className="header-image" />

                    <h1>PESQUISA DE SATISFAÇÃO DOS COLABORADORES</h1>
                    <p></p>
                    <h2>RIOBRAS INDUSTRIA E COMERCIO</h2>
                    <p></p>
                    <p>A Riobras necessita ouvir a sua opinião colaborador, para que possa tomar as decisões mais coerentes, onde o objetivo é tornar o ambiente de trabalho um ambiente tranquilo, alegre e agradável.</p>
                    <p>O foco é tornar a sua experiência na Riobras a melhor possível.</p>
                    <p>Mas para que o objetivo seja alcançado é necessário ouvirmos a sua opinião.</p>
                    <p>Diante disso, pedimos que você seja o mais transparente possível e baseado nas suas experiências conte-nos o seu grau de satisfação quanto aos principais pontos a serem analisados.</p>
                    <p><strong>Leia com atenção as perguntas do questionário abaixo e em uma escala (0 a 10), conte-nos sobre a relação de você colaborador com o seu local de trabalho:</strong></p>
                      <p></p>
                </div>

                <div className="form-group">
                    <label>1 - Há quanto tempo você é colaborador da RIOBRAS?</label>
                    <div className="radio-group">
                        <div>
                            <input type="radio" id="menos1ano" name="tempoColaboracao" value="Menos de 1 ano" checked={formData.tempoColaboracao === "Menos de 1 ano"} onChange={handleChange} required />
                            <label htmlFor="menos1ano">Menos de 1 ano</label>
                        </div>
                        <div>
                            <input type="radio" id="entre1e2anos" name="tempoColaboracao" value="Entre 1 e 2 anos" checked={formData.tempoColaboracao === "Entre 1 e 2 anos"} onChange={handleChange} />
                            <label htmlFor="entre1e2anos">Entre 1 e 2 anos</label>
                        </div>
                        <div>
                            <input type="radio" id="entre3e4anos" name="tempoColaboracao" value="Entre 3 e 4 anos" checked={formData.tempoColaboracao === "Entre 3 e 4 anos"} onChange={handleChange} />
                            <label htmlFor="entre3e4anos">Entre 3 e 4 anos</label>
                        </div>
                        <div>
                            <input type="radio" id="mais5anos" name="tempoColaboracao" value="Mais de 5 anos" checked={formData.tempoColaboracao === "Mais de 5 anos"} onChange={handleChange} />
                            <label htmlFor="mais5anos">Mais de 5 anos</label>
                        </div>
                    </div>
                </div>

                <div className="form-group">
                    <label>2 – Qual seu turno de trabalho na RIOBRAS?</label>
                    <div className="radio-group">
                        <div>
                            <input type="radio" id="turno1" name="turno" value="1º Turno" checked={formData.turno === "1º Turno"} onChange={handleChange} required />
                            <label htmlFor="turno1">1º Turno</label>
                        </div>
                        <div>
                            <input type="radio" id="turno2" name="turno" value="2º Turno" checked={formData.turno === "2º Turno"} onChange={handleChange} />
                            <label htmlFor="turno2">2º Turno</label>
                        </div>
                    </div>
                </div>

                <div className="form-group">
                    <label>3 – De 0 a 10 quanto você considera o seu trabalho significativo?</label>
                    {renderRatingOptions('trabalhoSignificativo')}
                </div>

                <div className="form-group">
                    <label>4 – De 0 a 10 quanto você considera o seu trabalho desafiador?</label>
                    {renderRatingOptions('trabalhoDesafiador')}
                </div>

                <div className="form-group">
                    <label>5 – De 0 a 10 quanto você considera o seu trabalho estressante?</label>
                    {renderRatingOptions('trabalhoEstressante')}
                </div>

                <div className="form-group">
                    <label>6 – De 0 a 10 quanto você considera o seu trabalho é adequado ao seu salário?</label>
                    {renderRatingOptions('salarioAdequado')}
                </div>

                <div className="form-group">
                    <label>7 – De 0 a 10 quanto você considera que a liderança valoriza as suas opiniões sobre o trabalho?</label>
                    {renderRatingOptions('liderancaValorizaOpinioes')}
                </div>

                <div className="form-group">
                    <label>8 – De 0 a 10 quanto você considera que está tendo a oportunidade de crescimento na sua carreira?</label>
                    {renderRatingOptions('oportunidadeCrescimento')}
                </div>

                <div className="form-group">
                    <label>9 – De 0 a 10 quanto você considera que está satisfeito com os seus encarregados e supervisores?</label>
                    {renderRatingOptions('satisfacaoEncarregadosSupervisores')}
                </div>

                <div className="form-group">
                    <label>10 – De 0 a 10 quanto você considera que está satisfeito com os seus benefícios que recebe?</label>
                    {renderRatingOptions('satisfacaoBeneficios')}
                </div>

                <div className="form-group">
                    <label>11 – De 0 a 10 quanto você considera que está satisfeito com o seu empregador (RIOBRAS)?</label>
                    {renderRatingOptions('satisfacaoEmpregador')}
                </div>

                <div className="form-group">
                    <label>12 – De 0 a 10 quanto você considera que num período de 6 meses procurará outro emprego?</label>
                    {renderRatingOptions('procuraraOutroEmprego')}
                </div>

                <div className="form-group">
                    <label htmlFor="opiniao">Deixe suas opiniões, críticas e sugestões para melhorias no ambiente de trabalho.</label>
                    <textarea
                        id="opiniao"
                        name="opiniaoCriticasSugestoes"
                        rows="5"
                        value={formData.opiniaoCriticasSugestoes}
                        onChange={handleChange}
                        placeholder="Sua opinião aqui..."
                    ></textarea>
                </div>

                <button type="submit" disabled={submitStatus === 'submitting'}>
                    {submitStatus === 'submitting' ? 'Enviando...' : 'Enviar Respostas'}
                </button>

                {submitStatus === 'success' && (
                    <p className="success-message">Obrigado! Sua opinião foi enviada com sucesso.</p>
                )}
                {submitStatus === 'error' && (
                    <p className="error-message">Houve um erro ao enviar sua opinião. Por favor, tente novamente.</p>
                )}
            </form>
        </div>
    );
}

export default App;