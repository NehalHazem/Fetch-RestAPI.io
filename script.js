const url = 'https://jsonplaceholder.typicode.com/users';
const tableBody = document.querySelector('.tbody');
const optionsBtn = document.querySelector('.output');
const modal = document.getElementById('myModal');
const name = document.getElementById('name');
const phone = document.getElementById('phone');
const website = document.getElementById('website');
const saveBTn = document.querySelector('.save');
const note = document.getElementById('note');
const alert = document.querySelector('.myAlert');
let isEditing = false;
let id;
let nameData;
let phoneData;
let websiteData;
let edit;

// GET All
window.addEventListener('load', getData);
function getData() {
    fetch(url)
    .then(res => {
        alert.style.display = 'block';
        note.innerHTML = `Method: GET, Status Code: ${res.status}`
        return res.json()
    })
    .then(data => {
        data.forEach(post => {
            tableBody.innerHTML += `
                <tr>
                    <td>${post.id}</th>
                    <td>${post.name}</th>
                    <td>${post.phone}</td>
                    <td>${post.website}</td>
                    <td><a class="btn my-btn edit"><i class="fa fa-pen"></i></a></td>
                    <td><a class="btn my-btn delete"><i class="fa fa-eraser"></i></a></td>
                </tr>
            `
        })
    });
}

// GET => PUT
tableBody.addEventListener('click', putData);
function putData(e) {
    if (e.target.parentElement.classList.contains('edit')) {
        id = e.target.parentElement.parentElement.parentElement.children[0].innerHTML;
        nameData = e.target.parentElement.parentElement.parentElement.children[1];
        phoneData = e.target.parentElement.parentElement.parentElement.children[2];
        websiteData = e.target.parentElement.parentElement.parentElement.children[3];
        edit = e.target.parentElement.parentElement.parentElement.children[4];
        fetch(`${url}/${id}`)
        .then(res => {
            alert.style.display = 'block';
            note.innerHTML = `Method: GET BY ID, Status Code: ${res.status}`
            return res.json()
        })
        .then(data => {
            name.value = data.name;
            phone.value = data.phone;
            website.value = data.website;
        });
        document.querySelector('.valid').style.display = 'none';
        isEditing = true;
        $('#myModal').modal('show');
    }
    e.preventDefault();
}

// New Record
function postData() {
    name.value = '';
    phone.value = '';
    website.value = '';
    document.querySelector('.valid').style.display = 'none';
    $('#myModal').modal('show');
}

// Submit => POST & PUT
saveBTn.addEventListener('click', saveData);
function saveData() {
    if (isEditing) {
        fetch(`${url}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                "name": `${name.value}`,
                "phone": `${phone.value}`,
                "website": `${website.value}`
            })
        })
        .then(res => {
            alert.style.display = 'block';
            note.innerHTML = `Method: PUT, Status Code: ${res.status}`
            return res.json()
        })
        .then(data => {
            nameData.innerHTML = data.name;
            phoneData.innerHTML = data.phone;
            websiteData.innerHTML = data.website;
            edit.innerHTML = `<i class="fas fa-ban"></i>`;
        });
        isEditing = false;
    } else {
        if (name.value !== '' && phone.value !== '' && website.value !== '') {
            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({
                    "name": `${name.value}`,
                    "phone": `${phone.value}`,
                    "website": `${website.value}`
                })
            })
            .then(res => {
                alert.style.display = 'block';
                note.innerHTML = `Method: POST, Status Code: ${res.status}`
                return res.json()
            })
            .then(data => 
                tableBody.innerHTML += `
                    <tr>
                        <td>${data.id}</th>
                        <td>${data.name}</th>
                        <td>${data.phone}</td>
                        <td>${data.website}</td>
                        <td><a class="btn my-btn"><i class="fas fa-ban"></i></a></td>
                        <td><a class="btn my-btn delete"><i class="fa fa-eraser"></i></a></td>
                    </tr>
                `
            );
            document.querySelector('.valid').style.display = 'none';
        } else {
            document.querySelector('.valid').style.display = 'block';
            return;
        }
    }
    $('#myModal').modal('hide');
}

// DELETE
tableBody.addEventListener('click', deleteData);
function deleteData(e) {
    if (e.target.parentElement.classList.contains('delete')) {
        id = e.target.parentElement.parentElement.parentElement.children[0].innerHTML;
        fetch(`${url}/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json'
            }
        })
        .then(res => {
            alert.style.display = 'block';
            note.innerHTML = `Method: DELETE, Status Code: ${res.status}`
            return res.json()
        });
        e.target.parentElement.parentElement.parentElement.style.display = 'none';
    }
    e.preventDefault();
}