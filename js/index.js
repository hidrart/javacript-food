document.addEventListener('DOMContentLoaded', async (event) => {
    updateFood(await readData());
    await addFood();
});
const readData = async () => {
    const url = 'http://127.0.0.1:3000/foods/';
    const data = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
    }).then(response => response.json()).then(data => data).catch(console.log);
    return await data
}
const getData = async (id) => {
    const url = 'http://127.0.0.1:3000/foods/'
    const data = await fetch(url + id, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
    }).then(response => response.json()).then(data => data).catch(console.log);
    return await data
}
const putData = async (id, data) => {
    const url = 'http://127.0.0.1:3000/foods/';
    await fetch(url + id, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
}
const createData = async (data) => {
    const url = 'http://127.0.0.1:3000/foods/';
    await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
}
const deleteData = async (id) => {
    const url = 'http://127.0.0.1:3000/foods/';
    const response = await fetch(url + id, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
    });
}
const createAlert = (message, alerttype) => {
    var alert = document.createElement('div')
    var messageAlert = document.createElement('span')
    alert.setAttribute('id', 'alertInstance')
    alert.setAttribute('class', `alert ${alerttype} close`)
    alert.setAttribute('data-dismiss', 'alert');
    messageAlert.innerHTML = message;
    alert.appendChild(messageAlert)
    document.getElementById('myAlert').appendChild(alert)
    setTimeout(function() {
        document.getElementById('myAlert').innerHTML = ''
    }, 5000);
}
const addFood = async () => {
    'use strict'
    const data = await readData();
    const form = document.getElementById('foodForm');
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            createAlert("Data gagal di tambahkan", "alert-danger");
            setTimeout(function() {
                form.classList.remove('was-validated');
            }, 5000);
        } else {
            var food = {
                id: data.length + 1,
                nama: form.elements['nama'].value,
                harga: form.elements['harga'].value,
            }
            if (!isContain(data, food)) {
                createAlert("Data berhasil ditambahkan", "alert-success");
                await createData(food);
                form.reset();
                form.classList.remove('was-validated');
            } else {
                createAlert("Data sudah terdapat di Database", "alert-danger");
            }
        }
    });
    updateFood(await readData());
}
const editFood = async (id) => {
    'use strict'
    const data = await readData();
    const tempFood = await getData(id);
    const form = document.getElementById('editFoodForm');
    form.querySelector('#nama').setAttribute('value', `${tempFood.nama}`);
    form.querySelector('#harga').setAttribute('value', `${tempFood.harga}`);
    form.addEventListener('submit', async (event) => {
        event.preventDefault()
        event.stopPropagation()
        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            createAlert("Data gagal di ubah", "alert-danger");
            setTimeout(function() {
                form.classList.remove('was-validated');
            }, 5000);
        } else {
            var food = {
                id: tempFood.id,
                nama: form.elements['nama'].value,
                harga: form.elements['harga'].value,
            };
            if (!isContain(data, food)) {
                createAlert("Data berhasil diubah", "alert-success");
                await putData(tempFood.id, food);
                form.reset();
                form.classList.remove('was-validated');
            } else {
                createAlert("Data sudah terdapat di Database", "alert-danger");
            }
        }
    }, false);
    updateFood(await readData());
}
const updateFood = (data) => {
    var counter = 1
    var table = document.getElementById('foodTable').querySelector('tbody');
    table.innerHTML = '';
    data.forEach(food => {
        var row = table.insertRow(-1);
        row.insertCell(0).innerHTML = counter;
        row.insertCell(1).innerHTML = food.nama;
        row.insertCell(2).innerHTML = food.harga;
        // create delete button
        var del = document.createElement('button');
        del.setAttribute('class', 'btn btn-sm btn-outline-danger ms-3');
        del.setAttribute('onClick', `deleteFood(${food.id})`);
        del.innerHTML = '<i class="far fa-trash-alt"></i>';
        // create edit <button></button>
        var edit = document.createElement('button')
        edit.setAttribute('class', 'btn btn-sm btn-outline-dark ms-3')
        edit.setAttribute('data-bs-toggle', 'collapse')
        edit.setAttribute('data-bs-target', '#editFoodForm')
        edit.setAttribute('aria-expanded', 'false')
        edit.setAttribute('aria-controls', '#editFoodForm')
        edit.setAttribute('onClick', `editFood(${food.id})`);
        edit.innerHTML = '<i class="fas fa-edit"></i>';
        // append button to action column
        action = row.insertCell(3)
        action.setAttribute('class', 'text-end')
        action.appendChild(del)
        action.appendChild(edit)
        counter++;
    })
}
const deleteFood = async (id) => {
    const tempFood = await getData(id);
    await deleteData(tempFood.id);
    createAlert(`Data ${tempFood.nama} berhasil di hapus`, "alert-warning");
    updateFood(await readData());
}
const isContain = (data, food) => {
    var flag = false;
    data.forEach(item => {
        if (item.nama == food.nama) {
            flag = true;
        }
    });
    return flag;
}