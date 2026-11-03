const dishes=[
{id:1,name:"Garlic Butter Prawns",category:"Bestsellers",type:"Seafood",price:389,emoji:"🦐",tag:"HOUSE FAVOURITE",desc:"Juicy prawns tossed in our rich garlic butter sauce."},
{id:2,name:"Seafood Boil Bowl",category:"Bestsellers",type:"Seafood",price:549,emoji:"🦀",tag:"BESTSELLER",desc:"A generous coastal mix with corn, potatoes and spice."},
{id:3,name:"Crispy Fish & Rice",category:"Meals",type:"Meals",price:229,emoji:"🐟",tag:"COMFORT FOOD",desc:"Golden fried fish, fluffy rice and house dipping sauce."},
{id:4,name:"Calamari Crunch",category:"Sides",type:"Sides",price:189,emoji:"🦑",tag:"SHAREABLE",desc:"Lightly battered calamari with a citrus mayo dip."},
{id:5,name:"Chili Crab Special",category:"Seafood",type:"Seafood",price:599,emoji:"🦀",tag:"SPICY & BOLD",desc:"Crab in a sweet, savoury and gently spicy sauce."},
{id:6,name:"Shrimp Fried Rice",category:"Meals",type:"Meals",price:199,emoji:"🍤",tag:"QUICK BITE",desc:"Wok-fried rice with shrimp, egg and spring onion."}
];
let cart=JSON.parse(localStorage.getItem("tapsea-cart")||"[]"),category="All",search="";
const peso=n=>"₱"+n.toLocaleString("en-PH");
const grid=document.getElementById("menuGrid");
function renderMenu(){const filtered=dishes.filter(d=>(category==="All"||category==="Bestsellers"&&d.category==="Bestsellers"||category===d.type)&&(`${d.name} ${d.desc}`.toLowerCase().includes(search)));grid.innerHTML=filtered.length?filtered.map(d=>`<article class="food-card"><div class="food-art"><small>${d.tag}</small><span>${d.emoji}</span></div><div class="food-info"><h3>${d.name}</h3><p>${d.desc}</p><div class="food-bottom"><strong>${peso(d.price)}</strong><button class="add-btn" data-add="${d.id}" aria-label="Add ${d.name}">+</button></div></div></article>`).join(""):`<p>No dishes found. Try another search.</p>`}
function save(){localStorage.setItem("tapsea-cart",JSON.stringify(cart));renderCart()}
function add(id){const item=cart.find(x=>x.id===id);item?item.qty++:cart.push({id,qty:1});save();toast("Added to your order")}
function change(id,delta){const item=cart.find(x=>x.id===id);if(!item)return;item.qty+=delta;if(item.qty<1)cart=cart.filter(x=>x.id!==id);save()}
function renderCart(){const count=cart.reduce((s,x)=>s+x.qty,0),total=cart.reduce((s,x)=>s+dishes.find(d=>d.id===x.id).price*x.qty,0);document.getElementById("cartCount").textContent=count;document.getElementById("drawerCount").textContent=count;document.getElementById("subtotal").textContent=peso(total);document.getElementById("checkoutTotal").textContent=peso(total);document.getElementById("cartEmpty").style.display=count?"none":"block";document.querySelector(".cart-bottom").style.display=count?"block":"none";document.getElementById("cartItems").innerHTML=cart.map(x=>{const d=dishes.find(y=>y.id===x.id);return `<div class="cart-line"><div class="cart-thumb">${d.emoji}</div><div><h4>${d.name}</h4><small>${peso(d.price)} each</small><div class="qty"><button data-change="${d.id}" data-delta="-1">−</button><b>${x.qty}</b><button data-change="${d.id}" data-delta="1">+</button></div></div><strong class="line-price">${peso(d.price*x.qty)}</strong></div>`}).join("")}
const drawer=document.getElementById("cartDrawer"),overlay=document.getElementById("overlay"),modal=document.getElementById("checkoutModal");
function openCart(){drawer.classList.add("open");overlay.classList.add("show")}function closeCart(){drawer.classList.remove("open");overlay.classList.remove("show")}
function toast(msg){const el=document.getElementById("toast");el.textContent=msg;el.classList.add("show");setTimeout(()=>el.classList.remove("show"),2200)}
grid.addEventListener("click",e=>{const b=e.target.closest("[data-add]");if(b)add(+b.dataset.add)});
document.getElementById("categories").addEventListener("click",e=>{const b=e.target.closest("[data-category]");if(!b)return;category=b.dataset.category;document.querySelectorAll(".chip").forEach(x=>x.classList.toggle("active",x===b));renderMenu()});
document.getElementById("searchInput").addEventListener("input",e=>{search=e.target.value.toLowerCase();renderMenu()});
document.getElementById("searchToggle").onclick=()=>{document.getElementById("searchBox").scrollIntoView({behavior:"smooth"});document.getElementById("searchInput").focus()};
document.getElementById("openCart").onclick=openCart;document.getElementById("closeCart").onclick=closeCart;document.getElementById("backToMenu").onclick=closeCart;overlay.onclick=closeCart;
document.getElementById("cartItems").addEventListener("click",e=>{const b=e.target.closest("[data-change]");if(b)change(+b.dataset.change,+b.dataset.delta)});
document.getElementById("checkoutBtn").onclick=()=>{closeCart();modal.classList.add("show")};document.getElementById("closeCheckout").onclick=()=>modal.classList.remove("show");
document.getElementById("checkoutForm").addEventListener("submit",e=>{e.preventDefault();const data=Object.fromEntries(new FormData(e.target));const order={number:"TS"+Date.now().toString().slice(-6),customer:data.name,phone:data.phone,address:data.address,payment:data.payment,items:cart,total:cart.reduce((s,x)=>s+dishes.find(d=>d.id===x.id).price*x.qty,0),created:new Date().toISOString()};const orders=JSON.parse(localStorage.getItem("tapsea-orders")||"[]");orders.push(order);localStorage.setItem("tapsea-orders",JSON.stringify(orders));cart=[];save();e.target.reset();modal.classList.remove("show");toast("Order "+order.number+" placed! Demo only.");});
document.getElementById("mobileMenu").onclick=()=>document.getElementById("menu").scrollIntoView({behavior:"smooth"});
renderMenu();renderCart();