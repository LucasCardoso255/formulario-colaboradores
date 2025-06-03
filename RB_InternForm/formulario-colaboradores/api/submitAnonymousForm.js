const { google } = require('googleapis');

const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const {
        tempoColaboracao,
        turno,
        trabalhoSignificativo,
        trabalhoDesafiador,
        trabalhoEstressante,
        salarioAdequado,
        liderancaValorizaOpinioes,
        oportunidadeCrescimento,
        satisfacaoEncarregadosSupervisores,
        satisfacaoBeneficios,
        satisfacaoEmpregador,
        procuraraOutroEmprego,
        opiniaoCriticasSugestoes
    } = req.body;

    if (!SPREADSHEET_ID) {
        return res.status(500).json({ message: 'Erro de configuração: GOOGLE_SHEET_ID não definido.' });
    }

    try {
        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
                private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
            },
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const sheets = google.sheets({ version: 'v4', auth });

        const timestamp = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });

        const rowData = [
            timestamp,
            tempoColaboracao,
            turno,
            trabalhoSignificativo,
            trabalhoDesafiador,
            trabalhoEstressante,
            salarioAdequado,
            liderancaValorizaOpinioes,
            oportunidadeCrescimento,
            satisfacaoEncarregadosSupervisores,
            satisfacaoBeneficios,
            satisfacaoEmpregador,
            procuraraOutroEmprego,
            opiniaoCriticasSugestoes
        ];

        await sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: 'RespostasINTERNAS!A:N',
            valueInputOption: 'USER_ENTERED',
            resource: {
                values: [rowData],
            },
        });

        res.status(200).json({ message: 'Dados enviados com sucesso!' });
    } catch (error) {
        console.error('Erro ao adicionar dados na planilha:', error.message);
        res.status(500).json({ message: 'Erro ao enviar dados para o Google Sheets.', error: error.message });
    }
};