// src/services/authService.js
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const SPREADSHEET_ID = import.meta.env.VITE_SPREADSHEET_ID;
const LAB_EMAIL = import.meta.env.VITE_LAB_EMAIL || 'seu-email-laboratorio@unifor.br';
const APPS_SCRIPT_URL = import.meta.env.VITE_APPS_SCRIPT_URL;

/**
 * Login seguro via Apps Script
 * @param {string} matricula - Matrícula do aluno
 * @param {string} senha - Senha do aluno
 * @returns {Object} Dados do usuário logado
 */
export async function loginUser(matricula, senha) {
    try {
        if (!matricula || !senha) {
            throw new Error('Matrícula e senha são obrigatórios');
        }

        if (!APPS_SCRIPT_URL) {
            throw new Error('Sistema não configurado. Contate o administrador.');
        }

        const payload = {
            acao: 'verificarSenha',
            matricula,
            senha
        };

        const response = await fetch(APPS_SCRIPT_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error('Erro ao conectar com o servidor');
        }

        const data = await response.json();

        if (!data.sucesso) {
            throw new Error(data.mensagem || 'Credenciais inválidas');
        }

        const userData = {
            nome: data.nome,
            matricula,
            email: data.email,
            loginTime: new Date().toISOString(),
        };

        sessionStorage.setItem('user', JSON.stringify(userData));
        sessionStorage.setItem('loginTime', new Date().getTime().toString());

        return userData;

    } catch (error) {
        console.error('❌ Erro no login:', error.message);
        throw error;
    }
}

/**
 * Registra novo aluno e solicita acesso
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

        if (!APPS_SCRIPT_URL) {
            console.error('APPS_SCRIPT_URL não configurada:', APPS_SCRIPT_URL);
            throw new Error('Sistema não configurado. Verifique as variáveis de ambiente.');
        }

        console.log('📤 Enviando solicitação de registro para:', APPS_SCRIPT_URL);

        const payload = {
            acao: 'solicitarAcesso',
            nome: nome.trim(),
            matricula: matricula.trim(),
            email: email.trim()
        };

        console.log('📦 Payload:', payload);

        const response = await fetch(APPS_SCRIPT_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        console.log('📥 Status da resposta:', response.status, response.statusText);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Erro HTTP:', errorText);
            throw new Error(`Erro ao enviar solicitação: ${response.status}`);
        }

        const responseText = await response.text();
        console.log('📄 Resposta bruta:', responseText.substring(0, 200));

        let data;
        try {
            data = JSON.parse(responseText);
        } catch (parseError) {
            console.error('❌ Erro ao fazer parse JSON:', parseError);
            console.error('Texto recebido:', responseText);
            throw new Error('Resposta do servidor inválida');
        }

        console.log('✅ Dados parseados:', data);

        if (!data.sucesso) {
            throw new Error(data.mensagem || 'Erro ao processar solicitação');
        }

        return {
            sucesso: true,
            mensagem: data.mensagem || 'Solicitação enviada! Aguarde a validação do laboratório.'
        };

    } catch (error) {
        console.error('❌ Erro no registro:', error.message);
        throw error;
    }
}

/**
 * Alterna a senha do aluno
 * @param {string} matricula - Matrícula do aluno
 * @param {string} senhaAtual - Senha atual
 * @param {string} novaSenha - Nova senha
 * @returns {Object} Status da alteração
 */
export async function changePassword(matricula, senhaAtual, novaSenha) {
    try {
        if (!matricula || !senhaAtual || !novaSenha) {
            throw new Error('Preencha todos os campos');
        }

        if (novaSenha.length < 6) {
            throw new Error('A nova senha deve ter pelo menos 6 caracteres');
        }

        if (novaSenha === senhaAtual) {
            throw new Error('A nova senha não pode ser igual à atual');
        }

        if (!APPS_SCRIPT_URL) {
            throw new Error('URL do Apps Script não configurada');
        }

        const payload = {
            acao: 'mudarSenhaAluno',
            matricula,
            senhaAtual,
            novaSenha
        };

        const response = await fetch(APPS_SCRIPT_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }

        const data = await response.json();

        if (!data.sucesso) {
            throw new Error(data.mensagem || 'Erro ao alterar senha');
        }

        // Faz logout após alterar senha
        logout();

        return {
            sucesso: true,
            mensagem: 'Senha alterada com sucesso! Faça login novamente.'
        };

    } catch (error) {
        console.error('❌ Erro ao trocar senha:', error.message);
        throw error;
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
 * Verifica se a API está configurada corretamente
 * @returns {Object} Status das configurações
 */
export function checkApiConfig() {
    return {
        apiKeyConfigured: !!API_KEY && API_KEY !== 'sua_chave_api_aqui',
        spreadsheetConfigured: !!SPREADSHEET_ID,
        labEmailConfigured: !!LAB_EMAIL && LAB_EMAIL !== 'seu-email-laboratorio@unifor.br',
        appsScriptConfigured: !!APPS_SCRIPT_URL,
        allConfigured: !!(API_KEY && SPREADSHEET_ID && LAB_EMAIL && APPS_SCRIPT_URL),
        labEmail: LAB_EMAIL
    };
}