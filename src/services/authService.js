// src/services/authService.js
// SOLUÇÃO DEFINITIVA: JSONP - Funciona 100% com Google Apps Script

const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const SPREADSHEET_ID = import.meta.env.VITE_SPREADSHEET_ID;
const LAB_EMAIL = import.meta.env.VITE_LAB_EMAIL || 'labomidia@unifor.br';
const APPS_SCRIPT_URL = import.meta.env.VITE_APPS_SCRIPT_URL;

/**
 * SOLUÇÃO JSONP - Bypassa CORS completamente
 * Cria um script tag que carrega a resposta do Google Apps Script
 */
function chamarGoogleScriptJSONP(acao, dados = {}) {
    return new Promise((resolve, reject) => {
        try {
            if (!APPS_SCRIPT_URL) {
                reject(new Error('URL do Apps Script não configurada'));
                return;
            }


            // Cria um callback único
            const callbackName = `jsonp_callback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

            // Registra o callback global
            window[callbackName] = function (data) {

                // Limpa
                delete window[callbackName];
                document.body.removeChild(script);

                resolve(data);
            };

            // Monta os parâmetros
            const params = new URLSearchParams({
                acao,
                callback: callbackName,
                ...dados
            });

            const url = `${APPS_SCRIPT_URL}?${params.toString()}`;


            // Cria script tag
            const script = document.createElement('script');
            script.src = url;

            script.onerror = function () {
                console.error('❌ Erro ao carregar script');
                delete window[callbackName];
                reject(new Error('Falha ao conectar com o servidor'));
            };

            // Timeout de 30 segundos
            const timeout = setTimeout(() => {
                console.error('⏰ Timeout');
                delete window[callbackName];
                document.body.removeChild(script);
                reject(new Error('Tempo esgotado. Tente novamente.'));
            }, 30000);

            script.onload = function () {
                clearTimeout(timeout);
            };

            document.body.appendChild(script);

        } catch (error) {
            console.error('❌ Erro ao criar requisição:', error);
            reject(error);
        }
    });
}

/**
 * Login seguro via Apps Script
 */
export async function loginUser(matricula, senha) {
    try {
        if (!matricula || !senha) {
            throw new Error('Matrícula e senha são obrigatórios');
        }

        if (!APPS_SCRIPT_URL) {
            throw new Error('Sistema não configurado. Contate o administrador.');
        }

        const resultado = await chamarGoogleScriptJSONP('verificarSenha', {
            matricula: matricula.trim(),
            senha: senha
        });

        if (!resultado.sucesso) {
            throw new Error(resultado.mensagem || 'Credenciais inválidas');
        }

        const userData = {
            nome: resultado.nome,
            matricula: matricula.trim(),
            email: resultado.email,
            loginTime: new Date().toISOString(),
        };

        sessionStorage.setItem('user', JSON.stringify(userData));
        sessionStorage.setItem('loginTime', new Date().getTime().toString());

        console.log('✅ Login realizado com sucesso');
        return userData;

    } catch (error) {
        console.error('❌ Erro no login:', error.message);
        throw error;
    }
}

/**
 * Registra novo aluno e solicita acesso
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
            throw new Error('Sistema não configurado. Verifique as variáveis de ambiente.');
        }

        console.log('📤 Enviando solicitação de registro...');

        const resultado = await chamarGoogleScriptJSONP('solicitarAcesso', {
            nome: nome.trim(),
            matricula: matricula.trim(),
            email: email.trim()
        });

        if (!resultado.sucesso) {
            throw new Error(resultado.mensagem || 'Erro ao processar solicitação');
        }

        console.log('✅ Solicitação enviada com sucesso');

        return {
            sucesso: true,
            mensagem: resultado.mensagem || 'Solicitação enviada! Aguarde a validação do laboratório.'
        };

    } catch (error) {
        console.error('❌ Erro no registro:', error.message);
        throw error;
    }
}

/**
 * Altera a senha do aluno
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

        console.log('🔐 Alterando senha...');

        const resultado = await chamarGoogleScriptJSONP('mudarSenhaAluno', {
            matricula: matricula.trim(),
            senhaAtual,
            novaSenha
        });

        if (!resultado.sucesso) {
            throw new Error(resultado.mensagem || 'Erro ao alterar senha');
        }

        console.log('✅ Senha alterada com sucesso');

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
 * Testa a conexão com o Google Apps Script
 */
export async function testarConexao() {
    try {
        if (!APPS_SCRIPT_URL) {
            throw new Error('URL do Apps Script não configurada');
        }

        console.log('🔍 Testando conexão...');

        const resultado = await chamarGoogleScriptJSONP('testar');

        if (resultado.sucesso) {
            console.log('✅ Conexão OK!');
        } else {
            console.log('⚠️ Conexão com problemas:', resultado.mensagem);
        }

        return resultado;

    } catch (error) {
        console.error('❌ Erro ao testar conexão:', error.message);
        return {
            sucesso: false,
            mensagem: error.message
        };
    }
}

/**
 * Obtém o usuário logado
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
 */
export function checkApiConfig() {
    return {
        apiKeyConfigured: !!API_KEY && API_KEY !== 'sua_chave_api_aqui',
        spreadsheetConfigured: !!SPREADSHEET_ID,
        labEmailConfigured: !!LAB_EMAIL && LAB_EMAIL !== 'seu-email-laboratorio@unifor.br',
        appsScriptConfigured: !!APPS_SCRIPT_URL,
        allConfigured: !!(API_KEY && SPREADSHEET_ID && LAB_EMAIL && APPS_SCRIPT_URL),
        labEmail: LAB_EMAIL,
        appsScriptUrl: APPS_SCRIPT_URL
    };
}