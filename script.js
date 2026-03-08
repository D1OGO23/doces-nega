// ================================
// VARIÁVEIS
// ================================
let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
let total = 0;

const botoesAdicionar = document.querySelectorAll(".btn-adicionar");
const listaCarrinho = document.getElementById("lista-carrinho");
const totalElemento = document.getElementById("total");
const contadorCarrinho = document.getElementById("contador-carrinho");

const carrinhoElemento = document.getElementById("carrinho");
const overlay = document.getElementById("overlay");
const botaoCarrinho = document.getElementById("botao-carrinho");

// ================================
// FUNÇÕES PRINCIPAIS
// ================================
function abrirCarrinho() {
    carrinhoElemento.classList.add("ativo");
    overlay.classList.add("ativo");
}

function fecharCarrinho() {
    carrinhoElemento.classList.remove("ativo");
    overlay.classList.remove("ativo");
}

function salvarCarrinho() {
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
}

function atualizarCarrinho() {
    listaCarrinho.innerHTML = "";

    total = carrinho.reduce((acc, item) => acc + item.preco * item.quantidade, 0);

    carrinho.forEach((item, index) => {
        const li = document.createElement("li");
        li.textContent = `${item.nome} x${item.quantidade} - R$ ${(item.preco * item.quantidade).toFixed(2)}`;

        const btnRemover = document.createElement("button");
        btnRemover.textContent = "❌";
        btnRemover.addEventListener("click", () => removerItem(index));
        li.appendChild(btnRemover);

        listaCarrinho.appendChild(li);
    });

    totalElemento.textContent = total.toFixed(2);

    const quantidadeTotal = carrinho.reduce((acc, item) => acc + item.quantidade, 0);

    // Atualizar contador no modal
    if (contadorCarrinho) contadorCarrinho.textContent = quantidadeTotal;

    // Atualizar contador do botão flutuante
    if (botaoCarrinho) {
        botaoCarrinho.innerHTML = `🛒 Carrinho <span id="contador-carrinho">${quantidadeTotal}</span>`;
    }
}

function removerItem(index) {
    carrinho.splice(index, 1);
    salvarCarrinho();
    atualizarCarrinho();
}

function limparCarrinho() {
    carrinho = [];
    salvarCarrinho();
    atualizarCarrinho();
}

function finalizarPedido() {
    if (carrinho.length === 0) {
        alert("Seu carrinho está vazio!");
        return;
    }

    let mensagem = "Pedido - Doces da Nega%0A%0A";
    carrinho.forEach(item => {
        mensagem += `• ${item.nome} x${item.quantidade} - R$ ${(item.preco * item.quantidade).toFixed(2)}%0A`;
    });
    mensagem += `%0ATotal: R$ ${total.toFixed(2)}`;

    const telefone = "5511934595886";
    const url = `https://wa.me/${telefone}?text=${mensagem}`;
    window.open(url, "_blank");

    limparCarrinho();
}

// ================================
// EVENTOS
// ================================

// Abrir carrinho ao clicar no botão flutuante
if (botaoCarrinho) botaoCarrinho.addEventListener("click", abrirCarrinho);

// Fechar carrinho ao clicar no overlay
if (overlay) overlay.addEventListener("click", fecharCarrinho);

// Adicionar produtos ao carrinho
botoesAdicionar.forEach(botao => {
    botao.addEventListener("click", () => {
        const nome = botao.dataset.nome;
        const preco = parseFloat(botao.dataset.preco.replace(",", ".")) || 0;

        const itemExistente = carrinho.find(item => item.nome === nome);

        if (itemExistente) {
            itemExistente.quantidade++;
        } else {
            carrinho.push({
                nome: nome,
                preco: preco,
                quantidade: 1
            });
        }

        salvarCarrinho();
        atualizarCarrinho();

        // Feedback visual no botão
        botao.innerText = "✅ Adicionado";
        botao.disabled = true;
        botao.classList.add("adicionado");
        setTimeout(() => {
            botao.innerText = "Adicionar";
            botao.disabled = false;
            botao.classList.remove("adicionado");
        }, 1500);
    });
});

// ================================
// FILTRO DE CATEGORIAS
// ================================
const botoesCategoria = document.querySelectorAll(".lista-categorias button");
const produtos = document.querySelectorAll(".produto");

botoesCategoria.forEach(botao => {
    botao.addEventListener("click", () => {
        const categoria = botao.dataset.categoria;

        produtos.forEach(produto => {
            produto.style.display = (categoria === "todos" || produto.dataset.categoria === categoria) ? "block" : "none";
        });

        // Adicionar classe ativo ao botão selecionado
        botoesCategoria.forEach(btn => btn.classList.remove("ativo"));
        botao.classList.add("ativo");
    });
});

// ================================
// INICIALIZAÇÃO
// ================================
atualizarCarrinho();