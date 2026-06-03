// Bancos de caracteres
const CARACTERES = {
    maiusculas: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    minusculas: 'abcdefghijklmnopqrstuvwxyz',
    numeros: '0123456789',
    simbolos: '!@#$%^&*()_+-=[]{}|;:,.<>?'
};

// Limites de caracteres
const MIN_CARACTERES = 4;
const MAX_CARACTERES = 32;

// Elementos do DOM
const campoSenha = document.getElementById('campo-senha');
const contadorValor = document.getElementById('contador-valor');
const btnMenos = document.getElementById('btn-menos');
const btnMais = document.getElementById('btn-mais');
const btnGerar = document.getElementById('btn-gerar');
const btnCopiar = document.getElementById('btn-copiar');
const forcaProgresso = document.getElementById('forca-progresso');
const toast = document.getElementById('toast');

// Checkboxes
const checkMaiusculas = document.getElementById('maiusculas');
const checkMinusculas = document.getElementById('minusculas');
const checkNumeros = document.getElementById('numeros');
const checkSimbolos = document.getElementById('simbolos');

// Estado inicial
let numeroCaracteres = 12;

// Funcao para gerar senha
function gerarSenha() {
    let caracteresPermitidos = '';
    let tiposAtivos = 0;
    
    // Verificar quais opcoes estao ativas
    if (checkMaiusculas.checked) {
        caracteresPermitidos += CARACTERES.maiusculas;
        tiposAtivos++;
    }
    if (checkMinusculas.checked) {
        caracteresPermitidos += CARACTERES.minusculas;
        tiposAtivos++;
    }
    if (checkNumeros.checked) {
        caracteresPermitidos += CARACTERES.numeros;
        tiposAtivos++;
    }
    if (checkSimbolos.checked) {
        caracteresPermitidos += CARACTERES.simbolos;
        tiposAtivos++;
    }
    
    // Validacao: pelo menos uma opcao deve estar marcada
    if (tiposAtivos === 0) {
        checkMinusculas.checked = true;
        caracteresPermitidos = CARACTERES.minusculas;
        tiposAtivos = 1;
    }
    
    // Gerar a senha
    let senha = '';
    for (let i = 0; i < numeroCaracteres; i++) {
        const indiceAleatorio = Math.floor(Math.random() * caracteresPermitidos.length);
        senha += caracteresPermitidos[indiceAleatorio];
    }
    
    // Exibir a senha
    campoSenha.value = senha;
    
    // Atualizar a forca da senha
    atualizarForca(tiposAtivos);
}

// Funcao para atualizar a barra de forca
function atualizarForca(tiposAtivos) {
    // Remover classes anteriores
    forcaProgresso.className = 'forca-progresso';
    
    // Remover classe active de todos os labels
    document.querySelectorAll('.forca-label').forEach(label => {
        label.classList.remove('active');
    });
    
    let forca = '';
    
    // Regras de forca:
    // Fraca: menos de 8 caracteres OU apenas 1 tipo
    // Media: 8-11 caracteres E 2-3 tipos
    // Forte: 12+ caracteres E 3-4 tipos
    
    if (numeroCaracteres < 8 || tiposAtivos === 1) {
        forca = 'fraca';
    } else if (numeroCaracteres < 12 || tiposAtivos < 3) {
        forca = 'media';
    } else {
        forca = 'forte';
    }
    
    forcaProgresso.classList.add(forca);
    document.querySelector(`.forca-label[data-strength="${forca}"]`).classList.add('active');
}

// Funcao para copiar senha
function copiarSenha() {
    if (campoSenha.value) {
        navigator.clipboard.writeText(campoSenha.value).then(() => {
            mostrarToast();
        });
    }
}

// Funcao para mostrar toast
function mostrarToast() {
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2000);
}

// Funcao para atualizar o contador na tela
function atualizarContador() {
    contadorValor.textContent = numeroCaracteres;
}

// Funcao para garantir que pelo menos uma opcao esta marcada
function validarCheckboxes(checkboxAlterado) {
    const checkboxes = [checkMaiusculas, checkMinusculas, checkNumeros, checkSimbolos];
    const marcados = checkboxes.filter(cb => cb.checked);
    
    // Se nenhum estiver marcado, remarcar o que foi desmarcado
    if (marcados.length === 0) {
        checkboxAlterado.checked = true;
    }
}

// Event Listeners

// Botao diminuir
btnMenos.addEventListener('click', () => {
    if (numeroCaracteres > MIN_CARACTERES) {
        numeroCaracteres--;
        atualizarContador();
        gerarSenha();
    }
});

// Botao aumentar
btnMais.addEventListener('click', () => {
    if (numeroCaracteres < MAX_CARACTERES) {
        numeroCaracteres++;
        atualizarContador();
        gerarSenha();
    }
});

// Botao gerar
btnGerar.addEventListener('click', gerarSenha);

// Botao copiar
btnCopiar.addEventListener('click', copiarSenha);

// Checkboxes - gerar nova senha quando alterados
[checkMaiusculas, checkMinusculas, checkNumeros, checkSimbolos].forEach(checkbox => {
    checkbox.addEventListener('change', (e) => {
        validarCheckboxes(e.target);
        gerarSenha();
    });
});

// Gerar senha inicial ao carregar a pagina
document.addEventListener('DOMContentLoaded', () => {
    gerarSenha();
});
