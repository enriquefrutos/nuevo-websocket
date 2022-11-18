const socket = io();


function enviarMsg() {
    const msgParaEnvio = document.getElementById("inputMsg").value;
    const email = document.getElementById("input-email").value;
    socket.emit("msg", { email: email, mensaje: msgParaEnvio });
    return false;
}


socket.on("msg-list", (data) => {
    console.log("msg-list" + data);
    let html = '';
    data.forEach(item => {
        html +=
            `
        <div>
        <p>${item.timestamp} ${item.email} dice: <br> <span> ${item.mensaje}</span> </p>
        </div> 
        `
    })
    document.getElementById("mgs-area").innerHTML = html;

});



function postProducto() {
    const nombreProducto = document.getElementById("nombreProducto").value;
    const precioProducto = document.getElementById("precioProducto").value;
    const urlProducto = document.getElementById("urlProducto").value;
    socket.emit("product", { title: nombreProducto, price: precioProducto, thumbnail: urlProducto });
    return false;
}

socket.on("product-list", (data) => {
    console.log("product-list:" + data);
    let html = '';
    data.forEach(item => {
        html +=
            `
        <div>
            <img src="${item.thumbnail}" class="imagen"/>
            <p>ID: ${item.id}</p>
            <p>Producto: ${item.title}</p>
            <p>Precio: $ ${item.price}</p>
        </div>
        `
    })
    document.getElementById("productsContainer").innerHTML = html;

});



document.getElementById("myAnchor").addEventListener("click", function (event) {
    event.preventDefault()



});



