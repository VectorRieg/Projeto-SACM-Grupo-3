const KEY_BD = "@usuariosestudo";

var listaRegistros = {
    ultimoIdGerado: 0,
    usuarios: []
};

var FILTRO = ''

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
//--------------------------------------------------------------------------------
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
//--------------------------------------------------------------------------------
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