document.getElementById('carrito-icono').addEventListener('mouseover', function() {
    document.getElementById('carrito-lista').style.display = 'block';
});

document.getElementById('carrito-icono').addEventListener('click', function() {
    document.getElementById('carrito-lista').style.display = 'none';
});

Swal.fire({
    title: 'Atención!',
    text: 'Comprando esta semana participas del sorteo de unos parlantes Logitech Z607!',
    imageUrl: './img/sorteo.jpg',
    imageWidth: 300,
    imageHeight: 300,
    imageAlt: 'Custom image',
});

document.addEventListener("DOMContentLoaded", () => {
    const cartItems = document.getElementById("lista-carrito");
    const productsDiv = document.getElementById("lista-productos");
    const vaciarCarritoBtn = document.getElementById("vaciar-carrito");
    let productsArray = [];

    const CarritoDeCompras = {
        cart: [],

        addToCart: function (event) {
            event.preventDefault();
            const productId = event.target.getAttribute("data-id");
            const productName = event.target.parentElement.querySelector("h2").textContent;
            const productImage = event.target.parentElement.querySelector("img").src;
            const priceText = event.target.parentElement.querySelector(".precio").textContent;
            const productPrice = parseFloat(priceText.match(/[\d.]+/g).join(''));
            const productQuantity = parseInt(event.target.parentElement.querySelector(".cantidad-producto").value);

            if (isNaN(productPrice) || isNaN(productQuantity) || productQuantity <= 0) {
                alert("Por favor, ingrese una cantidad válida.");
                return;
            }

            const existingItem = this.cart.find(item => item.id === productId);
            if (existingItem) {
                existingItem.quantity += productQuantity;
            } else {
                const newItem = {
                    id: productId,
                    name: productName,
                    image: productImage,
                    price: productPrice,
                    quantity: productQuantity
                };
                this.cart.push(newItem);
            }
           
            this.updateCart();
            this.saveCart();
        },

        updateCart: function () {
            cartItems.innerHTML = "";
            let total = 0;
            this.cart.forEach(item => {
                const cartItem = document.createElement("li");
                cartItem.className = "submenu";
                cartItem.innerHTML = `
                    <div id="carrito">                            
                        <table id="lista-carrito" class="tabla">
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>Nombre</th>
                                    <th>Precio</th>
                                    <th>Cantidad</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><img src="${item.image}" width="100" /></td>
                                    <td>${item.name}</td>
                                    <td>$${item.price}</td>
                                    <td>${item.quantity}</td>
                                    <td><a href="#" class="btn btn-danger btn-sm remove-item" data-id="${item.id}">Eliminar</a></td>                                
                                </tr>
                            </tbody>
                        </table>                   
                    </div>
                `;
                cartItems.appendChild(cartItem);

                if (!isNaN(item.price) && !isNaN(item.quantity)) {
                    total += item.price * item.quantity;
                }
            });

            const totalPriceElement = document.createElement("p");
            totalPriceElement.innerHTML = `Total: $${total}`;
            totalPriceElement.style.cssText = "font-size: 18px; font-weight: bolder; text-align: center; margin-top: 40px";
            cartItems.appendChild(totalPriceElement);

            const removeButtons = document.querySelectorAll(".remove-item");
            removeButtons.forEach(button => {
                button.addEventListener("click", (event) => this.removeItem(event));
            });

            this.saveCart();
        },

        removeItem: function (event) {
            const itemId = event.target.getAttribute("data-id");
            const itemIndex = this.cart.findIndex(item => item.id === itemId);
            this.cart.splice(itemIndex, 1);
            
            this.updateCart();
            this.saveCart();
        },

        vaciarCarrito: function () {
            this.cart = [];            
            this.updateCart();
            this.saveCart();
        },

        saveCart: function () {
            localStorage.setItem("cart", JSON.stringify(this.cart));
        },

        loadCart: function () {
            const cartData = localStorage.getItem("cart");
            if (cartData) {
                this.cart = JSON.parse(cartData);
                this.updateCart();
            }
        }
    };

    fetch("data/productos.json")
        .then(response => response.json())
        .then(data => {
            productsArray = data;
            displayProducts(productsArray);
            CarritoDeCompras.loadCart();
        })
        .catch(error => console.error("Error al cargar los productos", error));

    function displayProducts(products) {
        productsDiv.innerHTML = "";
        products.forEach(product => {
            const productDiv = document.createElement("div");
            productDiv.className = "articulo";
            productDiv.innerHTML = `
                <div class="info-articulo">
                    <img class"imagenURL" src="img/${product.imagenURL}" alt="${product.nombre}">
                    <h2>${product.nombre}</h2>
                    <p class="precio">$${product.precio}</p>
                    <label for="cantidadProducto${product.id}">Cantidad:</label>
                    <input class="cantidad-producto" type="number" value="1" min="1"><br>
                    <a href="#" class="u-full-width button input agregar-carrito" data-id="${product.id}">Agregar Al Carrito</a>
                </div>
            `;
            productDiv.querySelector(".agregar-carrito").addEventListener("click", (event) => CarritoDeCompras.addToCart(event));
            productsDiv.appendChild(productDiv);
        });
    }

    vaciarCarritoBtn.addEventListener("click", () => CarritoDeCompras.vaciarCarrito());

    const darkModeToggle = document.getElementById("dark-mode-toggle");

    darkModeToggle.addEventListener("click", () => {        
        document.body.classList.toggle("dark-mode");        
    });

});
