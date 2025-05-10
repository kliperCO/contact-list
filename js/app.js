const form = document.getElementById("contact-form");
const nameInput = document.getElementById("name");
const phoneInput = document.getElementById("phone");
const contactList = document.getElementById("contact-list");
const emptyMsg = document.getElementById("empty-msg");
const openGroupsSidebarButton = document.getElementById("open-groups-sidebar");
const closeGroupsSidebarButton = document.getElementById("close-groups-sidebar");
const groupsSidebar = document.getElementById("groups-sidebar");
const contactListContainer = document.getElementById("contact-list-container");
const overlay = document.getElementById("overlay");
const groupsListElement = document.getElementById("groups-list");
const addGroupButton = document.getElementById("add-group-button");
const saveGroupsButton = document.getElementById("save-groups-button");

let contacts = JSON.parse(localStorage.getItem("contacts")) || [];
let contactGroups = JSON.parse(localStorage.getItem("contactGroups")) || ["Друзья", "Коллеги"]; // Изначальные группы

function renderContacts() {
    contactList.innerHTML = "";
    if (contacts.length === 0) {
        emptyMsg.style.display = "block";
        return;
    }
    emptyMsg.style.display = "none";

    contacts.forEach((contact, index) => {
        const li = document.createElement("li");
        li.className = "list-group-item d-flex justify-content-between align-items-center";
        li.innerHTML = `
            <div>
                <strong>${contact.name}</strong><br />
                <small>${contact.phone}</small>
            </div>
            <button class="btn btn-sm btn-outline-danger" onclick="deleteContact(${index})">Удалить</button>
        `;
        contactList.appendChild(li);
    });
}

function saveContacts() {
    localStorage.setItem("contacts", JSON.stringify(contacts));
}

function deleteContact(index) {
    contacts.splice(index, 1);
    saveContacts();
    renderContacts();
}

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();
    const phoneRegex = /^\+?\d{7,15}$/;

    nameInput.classList.remove("is-invalid");
    phoneInput.classList.remove("is-invalid");

    let valid = true;

    if (!name) {
        nameInput.classList.add("is-invalid");
        valid = false;
    }

    if (!phoneRegex.test(phone)) {
        phoneInput.classList.add("is-invalid");
        valid = false;
    }

    if (!valid) return;

    contacts.push({ name, phone });
    saveContacts();
    renderContacts();
    form.reset();

    const modal = bootstrap.Modal.getInstance(document.getElementById("addContactModal"));
    modal.hide();
});

// Функции для работы с группами
function renderGroups() {
    groupsListElement.innerHTML = "";
    contactGroups.forEach((group, index) => {
        const li = document.createElement("li");
        li.className = "list-group-item d-flex justify-content-between align-items-center";
        li.innerHTML = `
            <span>${group}</span>
            <button class="btn btn-sm btn-outline-danger" onclick="deleteGroup(${index})">
                <img src="images/delete.svg" alt="Удалить" width="16" height="16">
            </button>
        `;
        groupsListElement.appendChild(li);
    });
}

function saveGroups() {
    localStorage.setItem("contactGroups", JSON.stringify(contactGroups));
}

function deleteGroup(index) {
    contactGroups.splice(index, 1);
    saveGroups();
    renderGroups();
}

addGroupButton.addEventListener("click", () => {
    const newGroupName = prompt("Введите название новой группы:");
    if (newGroupName && newGroupName.trim() !== "") {
        contactGroups.push(newGroupName.trim());
        saveGroups();
        renderGroups();
    }
});

saveGroupsButton.addEventListener("click", () => {
    saveGroups();
    closeGroupsSidebar(); // Закрыть панель после сохранения
});

function openGroupsSidebar() {
    groupsSidebar.classList.add("open");
    contactListContainer.classList.add("sidebar-open", "inactive");
    overlay.style.display = "block";
}

function closeGroupsSidebar() {
    groupsSidebar.classList.remove("open");
    contactListContainer.classList.remove("sidebar-open", "inactive");
    overlay.style.display = "none";
}

openGroupsSidebarButton.addEventListener("click", openGroupsSidebar);
closeGroupsSidebarButton.addEventListener("click", closeGroupsSidebar);
overlay.addEventListener("click", closeGroupsSidebar); // Закрытие по клику на оверлей

// Инициализация
renderContacts();
renderGroups();