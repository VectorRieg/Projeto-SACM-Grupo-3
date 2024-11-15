const KEY_BD = "@usuariosestudo";
const KEY_BD2 = "@gruposestudo";
var listaRegistros = {
    ultimoIdGerado: 0,
    usuarios: []
};
var FILTRO = ''
//🔽Parte do Santiago🔽-----------------------------------------------------------
// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // Animação suave para links de navegação
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Somente adicione 'active' ao link atual
            document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
            this.classList.add('active');
            
            // Se o href começa com #, então não redirecione
            if (href.startsWith("#")) {
                e.preventDefault(); // Evita redirecionar para seções
            }
        });
    });
});
// Función para mostrar mensaje de confirmación en formularios
function confirmarEnvio(event) {
    event.preventDefault();
    if (confirm('¿Estás seguro de enviar el formulario?')) {
        event.target.submit();
    }
} 
// Desplazamiento suave para enlaces de anclaje
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        target.scrollIntoView({
            behavior: 'smooth'
        });
    });
});
//🔽Parte do Perfil🔽-------------------------------------------------------------
function salvarNovoUsuario(nome, cpf, email, senha) {
    // Tenta obter a lista de usuários do localStorage
    let listaRegistros = JSON.parse(localStorage.getItem(KEY_BD));
    // Se não houver registros anteriores, cria uma nova lista
    if (!listaRegistros || !Array.isArray(listaRegistros.usuarios)) {
        listaRegistros = { usuarios: [] };
    }
    // Cria um novo objeto de usuário com os dados informados
    const novoUsuario = {
        nome,
        cpf,
        email,
        senha
    };
    // Adiciona o novo usuário à lista
    listaRegistros.usuarios.push(novoUsuario);
    // Salva a lista atualizada de volta no localStorage
    localStorage.setItem(KEY_BD, JSON.stringify(listaRegistros));
    alert("Novo usuário cadastrado com sucesso!");
}
// Função para Editar o perfil do usuário
function editProfile() {
    const name = prompt("Digite seu novo nome:", document.getElementById("profile-name").innerText);
    const bio = prompt("Digite sua nova bio:", document.getElementById("profile-bio").innerText);
    const email = prompt("Digite seu novo email:", document.getElementById("profile-email").innerText);
    const phone = prompt("Digite seu novo telefone:", document.getElementById("profile-phone").innerText);
    const location = prompt("Digite sua nova localização:", document.getElementById("profile-location").innerText);
    // Atualizar informações de perfil
    if (name) document.getElementById("profile-name").innerText = name;
    if (bio) document.getElementById("profile-bio").innerText = bio;    
    if (email) document.getElementById("profile-email").innerText = email;
    if (phone) document.getElementById("profile-phone").innerText = phone;
    if (location) document.getElementById("profile-location").innerText = location;
    // Salvar as informações no localStorage
    saveProfileData();
}
// Função para salvar os dados do perfil no localStorage
function saveProfileData() {
    const profileData = {
        name: document.getElementById("profile-name").innerText,
        bio: document.getElementById("profile-bio").innerText,
        email: document.getElementById("profile-email").innerText,
        phone: document.getElementById("profile-phone").innerText,
        location: document.getElementById("profile-location").innerText,
        activities: JSON.parse(localStorage.getItem("profileData"))?.activities || []
    };
    localStorage.setItem("profileData", JSON.stringify(profileData));
}
// Função para editar as atividades recentes
function editActivities() {
    const activities = JSON.parse(localStorage.getItem("profileData"))?.activities || [];
    const newActivity = prompt("Digite uma nova atividade:");
    if (newActivity) {
        activities.push(newActivity);
        localStorage.setItem("profileData", JSON.stringify({
            ...JSON.parse(localStorage.getItem("profileData")),
            activities: activities
        }));
        loadActivities(); // Atualiza a exibição das atividades
    }
}
// Função para remover uma atividade
function removeActivity(index) {
    const activities = JSON.parse(localStorage.getItem("profileData"))?.activities || [];
    activities.splice(index, 1); // Remove a atividade no índice especificado
    localStorage.setItem("profileData", JSON.stringify({
        ...JSON.parse(localStorage.getItem("profileData")),
        activities: activities
    }));
    loadActivities(); // Atualiza a exibição das atividades
}
// Função para carregar o perfil e as atividades do localStorage
function loadProfile() {
    const savedProfile = JSON.parse(localStorage.getItem("profileData"));
    if (savedProfile) {
        document.getElementById("profile-name").innerText = savedProfile.name || "Seu Nome";
        document.getElementById("profile-bio").innerText = savedProfile.bio || "Sua bio aqui.";
        document.getElementById("profile-email").innerText = savedProfile.email || "seuemail@example.com";
        document.getElementById("profile-phone").innerText = savedProfile.phone || "(00) 12345-6789";
        document.getElementById("profile-location").innerText = savedProfile.location || "Sua cidade, país";
        // Carregar atividades
        loadActivities(savedProfile.activities);
    }
}
// Função para sair da conta
function logout() {
    localStorage.removeItem("loggedIn");
    alert("Você saiu da sua conta.");
    window.location.href = "entrar.html";
}

function loadActivities() {
    const activitiesList = document.querySelector('.profile-activities ul');
    activitiesList.innerHTML = ''; // Limpa a lista atual
    const activities = JSON.parse(localStorage.getItem("profileData"))?.activities || [];
    activities.forEach((activity, index) => {
        const li = document.createElement('li');
        li.innerText = activity;
        // Criar botão para remover a atividade
        const removeBtn = document.createElement('button');
        removeBtn.innerText = "Remover";
        removeBtn.classList.add('remove-btn');  // Adiciona a classe remove-btn para o estilo
        removeBtn.onclick = () => removeActivity(index); // Passa o índice para a função de remover
        li.appendChild(removeBtn); // Adiciona o botão à lista
        activitiesList.appendChild(li);
    });
}
//🔽Local Storage + Cadastrarse + Entrar + Lista de Usuarios🔽----------------------------------
function gravarBD(){
    localStorage.setItem(KEY_BD, JSON.stringify(listaRegistros) )
}
function lerBD(){
    const data = localStorage.getItem(KEY_BD)
    if(data){
        listaRegistros = JSON.parse(data)
    }
    desenhar()
}
function pesquisar(value){
    FILTRO = value;
    desenhar()
}
// Cria uma Linha na Tabela
function desenhar(){
    const tbody = document.getElementById('listaRegistrosBody');
    if (tbody) {
        let data = listaRegistros.usuarios;
        if (FILTRO.trim()) {
            const expReg = new RegExp(FILTRO.trim().replace(/[^\d\w]+/g, '.*'), 'i');
            data = data.filter(usuario => {
                return expReg.test(usuario.nome) || expReg.test(usuario.cpf) || expReg.test(usuario.email) || expReg.test(usuario.senha);
            });
        }
        data = data
            .sort((a, b) => {
                return a.nome < b.nome ? -1 : 1;
            })
            .map(usuario => {
                return `<tr>
                        <td>${usuario.id}</td>
                        <td>${usuario.nome}</td>
                        <td>${usuario.cpf}</td>
                        <td>${usuario.email}</td>
                        <td>${usuario.senha}</td>
                        <td>
                            <button onclick='vizualizar("cadastro", false, ${usuario.id})'>Editar</button>
                            <button class='vermelho' onclick='perguntarSeDeleta(${usuario.id})'>Deletar</button>
                        </td>
                    </tr>`;
            });
        tbody.innerHTML = data.join('');
    }
}
function insertUsuario(nome, cpf, email, senha){
    const id = listaRegistros.ultimoIdGerado + 1;
    listaRegistros.ultimoIdGerado = id;
    listaRegistros.usuarios.push({
        id, nome, cpf, email, senha
    })
    gravarBD()
    desenhar()
    vizualizar('lista')
}
function editUsuario(id, nome, cpf, email, senha){
    var usuario = listaRegistros.usuarios.find(usuario => usuario.id == id);
    if (usuario) {
        usuario.nome = nome;
        usuario.cpf = cpf;
        usuario.email = email;
        usuario.senha = senha;
        gravarBD();
        desenhar();
        vizualizar('lista');
    }
}
function deleteUsuario(id){
    listaRegistros.usuarios = listaRegistros.usuarios.filter( usuario => {
        return usuario.id != id
    } )
    gravarBD()
    desenhar()
}
function perguntarSeDeleta(id){
    if(confirm('Quer deletar o registro de id '+id)){
        deleteUsuario(id)
    }
}
function limparEdicao(){
    document.getElementById('nome').value = ''
    document.getElementById('cpf').value = ''
    document.getElementById('email').value = ''
    document.getElementById('senha').value = ''
}
function vizualizar(pagina, novo=false, id=null){
    document.body.setAttribute('page', pagina);
    if (pagina === 'cadastro') {
        if (novo) limparEdicao();
        if (id) {
            const usuario = listaRegistros.usuarios.find(usuario => usuario.id == id);
            if (usuario) {
                document.getElementById('id').value = usuario.id;
                document.getElementById('nome').value = usuario.nome;
                document.getElementById('cpf').value = usuario.cpf;
                document.getElementById('email').value = usuario.email;
                document.getElementById('senha').value = usuario.senha;
            }
        }
        document.getElementById('nome').focus();
    }
}
function submeter(e) {
    e.preventDefault();
    const data = {
        id: document.getElementById('id').value,
        nome: document.getElementById('nome').value,
        cpf: document.getElementById('cpf').value,
        email: document.getElementById('email').value,
        senha: document.getElementById('senha').value,
    };
    if (data.id) {
        editUsuario(data.id, data.nome, data.cpf, data.email, data.senha);
    } else {
        insertUsuario(data.nome, data.cpf, data.email, data.senha);
    }
}
window.addEventListener('load', () => {
    lerBD()
    document.getElementById('cadastroRegistro').addEventListener('submit', submeter)
    document.getElementById('inputPesquisa').addEventListener('keyup', e => {
        pesquisar(e.target.value)
    })

})
//🔽Parte da Lista de Grupos🔽------------------------------------------------------------------
// Função para atualizar a exibição da lista de grupos
function atualizarListaDeGrupos() {
    const GrupoRegistrosBody = document.getElementById('GrupoRegistrosBody');
    const grupos = JSON.parse(localStorage.getItem('grupos') || '[]');
    GrupoRegistrosBody.innerHTML = '';
    grupos.forEach(grupo => {
        const linha = document.createElement('div');
        linha.innerHTML = `
            <div>Nome do Grupo: 
            ${grupo.nomeG}
            </div>
            <div>Nome do Líder: 
            ${grupo.nomeL}
            </div>
            <div>Email: 
            ${grupo.email}
            </div>
            <button onclick="editarGrupo(${grupo.id})">Editar</button>
            <button onclick="excluirGrupo(${grupo.id})" class="vermelho">Excluir</button>
        `;
        GrupoRegistrosBody.appendChild(linha);
    });
}
// Função para salvar um novo grupo ou atualizar um grupo existente
function salvarGrupo() {
    // Obtém os valores dos campos do formulário
    const nomeGrupo = document.getElementById('NomeG').value;
    const nomeLider = document.getElementById('nomeL').value;
    const email = document.getElementById('email').value;
    // Checar se os campos estão preenchidos
    if (!nomeGrupo || !nomeLider || !email) {
        alert('Por favor, preencha todos os campos!');
        return;
    }
    // Recupera a lista de grupos do localStorage ou inicia como uma lista vazia
    const grupos = JSON.parse(localStorage.getItem('KEY_BD2')) || [];
    // Adiciona um novo grupo à lista
    grupos.push({
        nomeG: nomeGrupo,
        nomeL: nomeLider,
        email: email,
        members: [] // Adicione membros aqui se necessário
    });
    // Salva a lista atualizada no localStorage
    localStorage.setItem('KEY_BD2', JSON.stringify(grupos));
    // Limpa os campos do formulário
    document.getElementById('NomeG').value = '';
    document.getElementById('nomeL').value = '';
    document.getElementById('email').value = '';
    // Atualiza a exibição da lista de grupos e volta para a lista
    loadGroupList();
    gvizualizar('g-lista');
}
function loadGroupList() {
    // Recupera os grupos do localStorage
    const grupos = JSON.parse(localStorage.getItem('KEY_BD2')) || [];
    const gruposcontainer = document.getElementById('gruposcontainer');
    // Limpa o container antes de popular com os dados
    gruposcontainer.innerHTML = '';
    // Itera pelos grupos e cria elementos HTML para exibi-los
    grupos.forEach(grupo => {
        const grupoDiv = document.createElement('div');
        grupoDiv.className = 'grupo-item';
        grupoDiv.innerHTML = `
            <h3>${grupo.nomeG}</h3>
            <div><p><strong>Líder:</strong> ${grupo.nomeL}</p></div>
            <div><p><strong>Email:</strong> ${grupo.email}</p></div>
            <div><p><strong>Membros:</strong> ${grupo.members.join(', ')}</p></div>
        `;
        gruposcontainer.appendChild(grupoDiv);
    });
}
// Editar um grupo existente
function editarGrupo(index) {
    const grupos = JSON.parse(localStorage.getItem('grupos')) || [];
    const grupo = grupos[index];

    document.getElementById("nomeG").value = grupo.nomeG;
    document.getElementById("nomeL").value = grupo.nomeL;
    document.getElementById("email").value = grupo.email;
    document.getElementById("indexEdicao").value = index;

    gVizualizar("g-cadastro", true);
}
// Função para excluir um grupo
function removerGrupo(index) {
    let grupos = JSON.parse(localStorage.getItem('grupos')) || [];
    grupos.splice(index, 1);
    localStorage.setItem('grupos', JSON.stringify(grupos));
    carregarGrupos();
}
// Função para alternar entre modos de visualização
function gvizualizar(view, cadastro = false) {
    document.body.setAttribute('page', view);
    if (cadastro) {
        document.getElementById("g-cadastroRegistro").reset();
    }
}
// Carregar grupos do localStorage
function carregarGrupos() {
    const grupos = JSON.parse(localStorage.getItem('grupos')) || [];
    const grupoRegistrosBody = document.getElementById("GrupoRegistrosBody");
    grupoRegistrosBody.innerHTML = "";
    grupos.forEach((grupo, index) => {
        const grupoDiv = document.createElement("div");
        grupoDiv.classList.add("grupo-registro"); 
        grupoDiv.innerHTML = `
            <div>
            ${grupo.nome}
            </div>
            <div>
            ${grupo.cpf}
            </div>
            <div>
            ${grupo.email}
            </div>
            <button onclick="editarGrupo(${index})">Editar</button>
            <button class="vermelho" onclick="removerGrupo(${index})">Remover</button>
        `;
        grupoRegistrosBody.appendChild(grupoDiv);
    });
}
// Pesquisa de grupos
document.getElementById("inputPesquisa").addEventListener("input", function () {
    const termoPesquisa = this.value.toLowerCase();
    const grupos = JSON.parse(localStorage.getItem('grupos')) || [];
    const grupoRegistrosBody = document.getElementById("GrupoRegistrosBody");
    grupoRegistrosBody.innerHTML = "";
    grupos
        .filter(grupo => grupo.nomeG.toLowerCase().includes(termoPesquisa) || grupo.email.toLowerCase().includes(termoPesquisa))
        .forEach((grupo, index) => {
            const grupoDiv = document.createElement("div");
            grupoDiv.classList.add("grupo-registro");      
            grupoDiv.innerHTML = `
                <div>
                ${grupo.nomeG}
                </div>
                <div>
                ${grupo.nomeL}
                </div>
                <div>
                ${grupo.email}
                </div>
                <button onclick="editarGrupo(${index})">Editar</button>
                <button class="vermelho" onclick="removerGrupo(${index})">Remover</button>
            `;
            grupoRegistrosBody.appendChild(grupoDiv);
        });
});
// Inicializa a lista de grupos ao carregar a página
document.addEventListener('DOMContentLoaded', atualizarListaDeGrupos);
// Inicializar carregando grupos
carregarGrupos();
function gdesenhar() {
    const tbody = document.getElementById('GruposRegistrosBody');
    if (tbody) {
        let data = JSON.parse(localStorage.getItem('grupos')) || []; // Obtém os grupos do localStorage
        if (FILTRO.trim()) {
            // Se houver filtro, filtra os grupos conforme o nome ou e-mail
            const expReg = new RegExp(FILTRO.trim().replace(/[^\d\w]+/g, '.*'), 'i');
            data = data.filter(grupo => {
                return expReg.test(grupo.nomeG) || expReg.test(grupo.nomeL) || expReg.test(grupo.email);
            });
        }   
        // Ordena os grupos pelo nome
        data = data.sort((a, b) => {
            return a.nomeG < b.nomeG ? -1 : 1;
        });
        // Desenha cada grupo na tabela ou lista
        const grupoElements = data.map((grupo, index) => {
            return `<div class="grupo-item">
                        <div><strong>Nome do Grupo:</strong>
                        ${grupo.nomeG}
                        </div>
                        <div><strong>Nome do Líder:</strong>
                        ${grupo.nomeL}
                        </div>
                        <div><strong>Email:</strong>
                        ${grupo.email}
                        </div>
                        <div>
                            <button onclick="editarGrupo(${index})">Editar</button>
                            <button class="vermelho" onclick="removerGrupo(${index})">Excluir</button>
                        </div>
                    </div>`;
        });
        // Insere os grupos na página
        tbody.innerHTML = grupoElements.join('');
    }
}
document.addEventListener('DOMContentLoaded', function() {
    const inputPesquisa = document.getElementById("inputPesquisa");
    if (inputPesquisa) {
        inputPesquisa.addEventListener("input", function () {
            const termoPesquisa = this.value.toLowerCase();
            const grupos = JSON.parse(localStorage.getItem('grupos')) || [];
            const grupoRegistrosBody = document.getElementById("GrupoRegistrosBody");
            grupoRegistrosBody.innerHTML = "";
            grupos
                .filter(grupo => grupo.nomeG.toLowerCase().includes(termoPesquisa) || grupo.email.toLowerCase().includes(termoPesquisa))
                .forEach((grupo, index) => {
                    const grupoDiv = document.createElement("div");
                    grupoDiv.classList.add("grupo-registro");
                    grupoDiv.innerHTML = `
                        <div>
                        ${grupo.nomeG}
                        </div>
                        <div>
                        ${grupo.nomeL}
                        </div>
                        <div>
                        ${grupo.email}
                        </div>
                        <button onclick="editarGrupo(${index})">Editar</button>
                        <button class="vermelho" onclick="removerGrupo(${index})">Remover</button>
                    `;
                    grupoRegistrosBody.appendChild(grupoDiv);
                });
        });
    } else {
        console.error('Elemento de pesquisa não encontrado.');
    }
  });
  window.onload = loadGroupList;