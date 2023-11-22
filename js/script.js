const productos = {
  phones: [
    {
      id: 1,
      name: 'iPhone 10',
      price: 980,
      image: 'images/product-item1.jpg'
    },
    {
      id: 2,
      name: 'iPhone 11',
      price: 1100,
      image: 'images/product-item2.jpg'
    },
    {
      id: 3,
      name: 'iPhone 8',
      price: 790,
      image: 'images/product-item3.jpg'
    },
    {
      id: 4,
      name: 'iPhone 13',
      price: 1500,
      image: 'images/product-item4.jpg'
    },
    {
      id: 5,
      name: 'iPhone 12',
      price: 1300,
      image: 'images/product-item5.jpg'
    }
  ],
  watches: [
    {
      id: 6,
      name: 'Pink Watch',
      price: 870,
      image: 'images/product-item6.jpg'
    },
    {
      id: 7,
      name: 'Heavy Watch',
      price: 680,
      image: 'images/product-item7.jpg'
    },
    {
      id: 8,
      name: 'Spotted Watch',
      price: 750,
      image: 'images/product-item8.jpg'
    },
    {
      id: 9,
      name: 'Black Watch',
      price: 650,
      image: 'images/product-item9.jpg'
    },
    {
      id: 10,
      name: 'iWatch Serie 8',
      price: 1000,
      image: 'images/product-item10.jpg'
    }
  ]
};

(function($) {

    "use strict";

    let cartProducts = [];
    let discountApplied = false;

    let addToCart = (productId) => {
      const allProducts = productos['watches'].concat(productos['phones'])
      const productoSeleccionado = allProducts.find((p)=> p.id == productId)
      
      if(cartProducts.some((p) => p.id == productoSeleccionado.id)){
        productoSeleccionado.qty += 1;

        document.querySelector(`#cart-qty-${productoSeleccionado.id}`).textContent = productoSeleccionado.qty

      } else {
        cartProducts.push(productoSeleccionado)
        productoSeleccionado.qty = 1;

        Toastify({
          text: "🤑 Producto Agregado",
          className: "info",
          close: true,
          style: {
            background: "green",
          }
        }).showToast();
        
        let parent = document.createElement('div')
        parent.className = "d-flex flex-row justify-content-between align-items-center p-2 bg-white mt-4 px-3 rounded"
        
        parent.innerHTML +=  `
          <div class="mr-1"><img class="rounded" src="${productoSeleccionado.image}" width="70"></div>
          <div class="d-flex flex-column align-items-center product-details"><span
              class="font-weight-bold">${productoSeleccionado.name}</span>
          </div>
          <div class="d-flex flex-row align-items-center qty">
            
            <span>QTY: </span><h5 id="cart-qty-${productoSeleccionado.id}" class="text-grey mt-1 mr-1 ml-1">${productoSeleccionado.qty}</h5>
            
          </div>
          <div>
            <h5 class="text-grey">$${productoSeleccionado.price}</h5>
          </div>
          <div class="d-flex align-items-center"><i id="remove-${productoSeleccionado.id}" class="remove-product fa fa-trash mb-1 text-danger"></i></div>
        `

      document.querySelector('#lista-carrito').appendChild(parent)

      let btnDelete = document.getElementById(`remove-${productoSeleccionado.id}`)
      
      btnDelete.addEventListener('click', ()=>{
        if(productoSeleccionado.qty == 1){
          btnDelete.parentElement.parentElement.remove()
          cartProducts = cartProducts.filter(p => p.id != productoSeleccionado.id)
          Toastify({
            text: "❌ Producto Eliminado",
            className: "info",
            style: {
              background: "red",
            }
          }).showToast();
        } else {
          productoSeleccionado.qty -= 1;
          document.querySelector(`#cart-qty-${productoSeleccionado.id}`).textContent = productoSeleccionado.qty
        }
        updateCartTotalAmout()
      })
    
      }
      updateCartTotalAmout()
    }

    let buyBtn = document.getElementById('buy-action')
    buyBtn.addEventListener('click', ()=>{
      document.getElementById('lista-carrito').innerHTML = ""
      cartProducts = []
      document.getElementById('total-price').textContent = 0
      document.getElementById('input-discount').removeAttribute('disabled')
      document.getElementById('btn-discount').removeAttribute('disabled')
      document.getElementById('input-discount').value = ""
      document.getElementById('cualquiera')?.remove()

      Swal.fire({
        title: "Compra procesada!",
        text: "Gracias por tus dolares!",
        icon: "success"
      });

    })

    let btnDiscount = document.getElementById('btn-discount')
    btnDiscount.addEventListener('click', () => {
      let totalPrice = cartProducts.reduce((acc, el) => acc + (el.qty * el.price), 0)
      if(document.getElementById('input-discount').value.toLowerCase() == "aprendeprogramando"){
        document.getElementById('input-discount').setAttribute('disabled', '' )
        btnDiscount.setAttribute('disabled', '' )
        let discountNotification = document.createElement('span')
        discountNotification.id = "cualquiera"
        discountNotification.textContent = "Se aplicó un descuento de 20%"
        btnDiscount.parentElement.appendChild(discountNotification)
        totalPrice = totalPrice - totalPrice * .20
        discountApplied = true
        document.getElementById('total-price').innerHTML = totalPrice

        Toastify({
          text: "🤑 Descuento Aplicado",
          className: "info",
          close: true,
          style: {
            background: "green",
          }
        }).showToast();
      }
    })

    function updateCartTotalAmout(){
      document.getElementById('input-discount').removeAttribute('disabled')
      document.getElementById('btn-discount').removeAttribute('disabled')
      document.getElementById('input-discount').value = ""
      document.getElementById('cualquiera')?.remove()

      if(discountApplied){
        Toastify({
          text: "❌ Descuento Eliminado",
          className: "info",
          close: true,
          style: {
            background: "red",
          }
        }).showToast();
      }

      let totalPrice = cartProducts.reduce((acc, el) => acc + (el.qty * el.price), 0); 

      document.querySelector('#product-counter').textContent = cartProducts.reduce((acc, el) => acc + el.qty, 0);

      document.getElementById('total-price').innerHTML =  totalPrice

    }

    let createProductHtmlElement = (product)=>{
      const element = document.createElement("div")
      element.className = 'swiper-slide'
      element.innerHTML = `
      <div class="product-card position-relative">
        <div class="image-holder">
          <img src="${product.image}" alt="product-item" class="img-fluid">
        </div>
        <div class="cart-concern position-absolute">
          <div class="cart-button d-flex">
            <button data-id="${product.id}" class="addToCart btn btn-medium btn-black">Agregar<svg class="cart-outline"><use xlink:href="#cart-outline"></use></svg></button>
          </div>
        </div>
        <div class="card-detail d-flex justify-content-between align-items-baseline pt-3">
          <h3 class="card-title text-uppercase">
            <a href="#">${product.name}</a>
          </h3>
          <span class="item-price text-primary">$${product.price}</span>
        </div>
      </div>
      `
      return element
    }

    let printMobiles = () => {
      productos.phones.forEach((watch)=>{
        const htmlEl = createProductHtmlElement(watch)
        document.querySelector('#mobile-products .swiper-wrapper').appendChild(htmlEl)
      })
    }

    printMobiles()

    let printWatches = () => {
      productos.watches.forEach((watch)=>{
        const htmlEl = createProductHtmlElement(watch)
        document.querySelector('#smart-watches .swiper-wrapper').appendChild(htmlEl)
      })
      
    }

    printWatches()

    let bindAddToCart = () => {
      const buttons = document.querySelectorAll('.addToCart')
      buttons.forEach((btn)=>{
        btn.addEventListener('click', ()=>addToCart(btn.dataset.id))
      })
    }

    bindAddToCart()

    var searchPopup = function() {
      // open search box
      $('#header-nav').on('click', '.search-button', function(e) {
        $('.search-popup').toggleClass('is-visible');
      });

      $('#header-nav').on('click', '.btn-close-search', function(e) {
        $('.search-popup').toggleClass('is-visible');
      });
      
      $(".search-popup-trigger").on("click", function(b) {
          b.preventDefault();
          $(".search-popup").addClass("is-visible"),
          setTimeout(function() {
              $(".search-popup").find("#search-popup").focus()
          }, 350)
      }),
      $(".search-popup").on("click", function(b) {
          ($(b.target).is(".search-popup-close") || $(b.target).is(".search-popup-close svg") || $(b.target).is(".search-popup-close path") || $(b.target).is(".search-popup")) && (b.preventDefault(),
          $(this).removeClass("is-visible"))
      }),
      $(document).keyup(function(b) {
          "27" === b.which && $(".search-popup").removeClass("is-visible")
      })
    }

    var initProductQty = function(){

      $('.product-qty').each(function(){

        var $el_product = $(this);
        var quantity = 0;

        $el_product.find('.quantity-right-plus').click(function(e){
            e.preventDefault();
            var quantity = parseInt($el_product.find('#quantity').val());
            $el_product.find('#quantity').val(quantity + 1);
        });

        $el_product.find('.quantity-left-minus').click(function(e){
            e.preventDefault();
            var quantity = parseInt($el_product.find('#quantity').val());
            if(quantity>0){
              $el_product.find('#quantity').val(quantity - 1);
            }
        });

      });

    }

    $(document).ready(function() {

      searchPopup();
      initProductQty();

      var swiper = new Swiper(".main-swiper", {
        speed: 500,
        navigation: {
          nextEl: ".swiper-arrow-prev",
          prevEl: ".swiper-arrow-next",
        },
      });         

      var swiper = new Swiper(".product-swiper", {
        slidesPerView: 4,
        spaceBetween: 10,
        pagination: {
          el: "#mobile-products .swiper-pagination",
          clickable: true,
        },
        breakpoints: {
          0: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          980: {
            slidesPerView: 4,
            spaceBetween: 20,
          }
        },
      });      

      var swiper = new Swiper(".product-watch-swiper", {
        slidesPerView: 4,
        spaceBetween: 10,
        pagination: {
          el: "#smart-watches .swiper-pagination",
          clickable: true,
        },
        breakpoints: {
          0: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          980: {
            slidesPerView: 4,
            spaceBetween: 20,
          }
        },
      }); 


    });

})(jQuery);