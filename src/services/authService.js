// src/services/authService.js
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const SPREADSHEET_ID = import.meta.env.VITE_SPREADSHEET_ID;
const LAB_EMAIL = import.meta.env.VITE_LAB_EMAIL || 'seu-email-laboratorio@unifor.br';
const APPS_SCRIPT_URL = import.meta.env.VITE_APPS_SCRIPT_URL;

/**
 * Busca todos os alunos da planilha
 */
async function fetchAllStudents() {
    try {
        if (!API_KEY || API_KEY === 'sua_chave_api_aqui') {
            throw new Error('Configure a VITE_GOOGLE_API_KEY no arquivo .env');
        }

        if (!SPREADSHEET_ID) {
            throw new Error('Configure a VITE_SPREADSHEET_ID no arquivo .env');
        }

        const range = 'Alunos!A2:D1000';
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${range}?key=${API_KEY}`;

        const response = await fetch(url);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || 'Erro ao carregar alunos');
        }

        const data = await response.json();
        const rows = data.values || [];

        if (!rows || rows.length === 0) {
            return [];
        }


        const headersRange = 'Alunos!A1:D1';
        const headersUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${headersRange}?key=${API_KEY}`;
        const headersResponse = await fetch(headersUrl);
        const headersData = await headersResponse.json();
        const headers = headersData.values ? headersData.values[0] : ['Nome', 'Matrícula', 'Email', 'Senha'];


        const students = rows.map(row => {
            const student = {};
            headers.forEach((header, index) => {
                student[header] = row[index] || '';
            });
            return student;
        });

        return students;

    } catch (error) {
        console.error('Erro ao buscar alunos:', error);
        throw error;
    }
}

/**
 * 
 * @param {string} matricula - Matrícula do aluno
 * @param {string} senha - Senha do aluno
 * @returns {Object} Dados do usuário logado
 */
export async function loginUser(matricula, senha) {
    try {
        const students = await fetchAllStudents();

        if (students.length === 0) {
            throw new Error('Nenhum aluno cadastrado');
        }


        const aluno = students.find(student =>
            student['Matrícula']?.toString().trim() === matricula.toString().trim()
        );

        if (!aluno) {
            throw new Error('Dados não encontrados.');
        }


        if (!aluno['Senha'] || aluno['Senha']?.toString().trim() === '') {
            throw new Error('Sua conta ainda não foi ativada. Aguarde a validação do laboratório.');
        }


        const senhaArmazenada = aluno['Senha']?.toString().trim() || '';

        if (senhaArmazenada !== senha) {
            throw new Error('Dados Incorretos. Tente novamente.');
        }


        const userData = {
            nome: aluno['Nome']?.trim() || '',
            matricula: aluno['Matrícula']?.trim() || '',
            email: aluno['Email']?.trim() || '',
            loginTime: new Date().toISOString(),
        };

        sessionStorage.setItem('user', JSON.stringify(userData));
        sessionStorage.setItem('loginTime', new Date().getTime().toString());

        console.log('✅ Login bem-sucedido:', userData.nome);

        return userData;

    } catch (error) {
        console.error('❌ Erro no login:', error.message);
        throw error;
    }
}

/**
 * Registra novo aluno e envia email de solicitação
 * @param {string} nome - Nome completo do aluno
 * @param {string} matricula - Matrícula do aluno
 * @param {string} email - Email do aluno
 * @returns {Object} Status da solicitação
 */
export async function registerNewAluno(nome, matricula, email) {
    try {
        if (!nome || !matricula || !email) {
            throw new Error('Preencha todos os campos obrigatórios');
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new Error('Email inválido');
        }

        if (!/^\d+$/.test(matricula)) {
            throw new Error('Matrícula deve conter apenas números');
        }

        // Verifica se o aluno já existe
        await verificarAlunoExistente(matricula, email);

        // Prepara dados para o email
        const assunto = encodeURIComponent('Solicitação de Acesso - Banco de Talentos Unifor');
        const corpo = encodeURIComponent(`
Novo aluno solicitando acesso ao Banco de Talentos:

Nome: ${nome}
Matrícula: ${matricula}
Email: ${email}

    `);


        window.location.href = `mailto:${LAB_EMAIL}?subject=${assunto}&body=${corpo}`;

        const registroTemp = {
            nome,
            matricula,
            email,
            dataSolicitacao: new Date().toISOString(),
            status: 'pendente'
        };

        localStorage.setItem(`registro_${matricula}`, JSON.stringify(registroTemp));

        console.log('📧 Email de solicitação preparado para:', LAB_EMAIL);

        return {
            sucesso: true,
            mensagem: 'Solicitação enviada! Aguarde a validação pelo laboratório.',
            email: LAB_EMAIL
        };

    } catch (error) {
        console.error('❌ Erro no registro:', error.message);
        throw error;
    }
}

/**
 * Verifica se o aluno já existe na planilha
 * @param {string} matricula - Matrícula do aluno
 * @param {string} email - Email do aluno
 * @throws {Error} Se o aluno já existe
 */
async function verificarAlunoExistente(matricula, email) {
    try {
        const students = await fetchAllStudents();

        const alunoExistente = students.find(student =>
            student['Matrícula']?.toString().trim() === matricula.toString().trim() ||
            student['Email']?.toString().toLowerCase().trim() === email.toLowerCase().trim()
        );

        if (alunoExistente) {
            throw new Error('Esta matrícula ou email já está registrado');
        }

    } catch (error) {
        if (error.message.includes('já está registrado')) {
            throw error;
        }

        console.warn('Aviso ao verificar aluno:', error.message);
    }
}

/**
 * Obtém o usuário logado
 * @returns {Object|null} Dados do usuário ou null se não logado
 */
export function getLoggedUser() {
    try {
        const userStr = sessionStorage.getItem('user');
        if (!userStr) return null;

        const user = JSON.parse(userStr);

        const loginTime = sessionStorage.getItem('loginTime');
        if (loginTime) {
            const horasPassadas = (new Date().getTime() - parseInt(loginTime)) / (1000 * 60 * 60);
            if (horasPassadas > 24) {
                logout();
                return null;
            }
        }

        return user;
    } catch (error) {
        console.error('Erro ao obter usuário logado:', error);
        return null;
    }
}

/**
 * Faz logout do aluno
 */
export function logout() {
    try {
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('loginTime');
        console.log('✅ Logout realizado');
    } catch (error) {
        console.error('Erro ao fazer logout:', error);
    }
}

/**
 * Alterna a senha do aluno
 * Requer a URL do Apps Script configurada no .env
 */
export async function changePassword(matricula, senhaAtual, novaSenha) {
    try {
        if (!matricula || !senhaAtual || !novaSenha) {
            throw new Error("Preencha todos os campos");
        }

        if (novaSenha.length < 4) {
            throw new Error("A nova senha deve ter pelo menos 4 caracteres");
        }

        if (novaSenha === senhaAtual) {
            throw new Error("A nova senha não pode ser igual à atual");
        }

        if (!APPS_SCRIPT_URL) {
            throw new Error("URL do Apps Script não configurada. Contate o administrador.");
        }


        const payload = {
            acao: 'mudarSenha',
            matricula,
            senhaAtual,
            novaSenha
        };

        const response = await fetch(APPS_SCRIPT_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }

        const data = await response.json();

        if (!data.sucesso) {
            throw new Error(data.mensagem || "Erro ao alterar senha");
        }

        console.log('✅ Senha alterada com sucesso');


        logout();

        return {
            sucesso: true,
            mensagem: data.mensagem
        };

    } catch (error) {
        console.error("❌ Erro ao trocar senha:", error.message);
        throw error;
    }
}

/**
 * Verifica a senha do aluno
 */
export async function verifyPassword(matricula, senha) {
    try {
        if (!matricula || !senha) {
            throw new Error("Matrícula e senha são obrigatórios");
        }

        if (!APPS_SCRIPT_URL) {
            throw new Error("URL do Apps Script não configurada");
        }

        const payload = {
            acao: 'verificarSenha',
            matricula,
            senha
        };

        const response = await fetch(APPS_SCRIPT_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }

        const data = await response.json();
        return data.sucesso;

    } catch (error) {
        console.error("❌ Erro ao verificar senha:", error.message);
        return false;
    }
}

/**
 * Obtém as configurações da API
 * @returns {Object} Status das configurações
 */
export function checkApiConfig() {
    return {
        apiKeyConfigured: !!API_KEY && API_KEY !== 'sua_chave_api_aqui',
        spreadsheetConfigured: !!SPREADSHEET_ID,
        labEmailConfigured: LAB_EMAIL !== 'labomidia@unifor.br',
        appsScriptConfigured: !!APPS_SCRIPT_URL,
        allConfigured: !!(API_KEY && SPREADSHEET_ID && LAB_EMAIL && APPS_SCRIPT_URL),
        labEmail: LAB_EMAIL
    };
}

