// Firebase Config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Login / Signup
const loginForm = document.getElementById('loginForm');
loginForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    const email = loginForm.querySelector('input[type="email"]').value;
    const password = loginForm.querySelector('input[type="password"]').value;

    auth.signInWithEmailAndPassword(email,password)
    .then((userCredential)=>{ alert("Login Successful!"); })
    .catch((error)=>{
        // If user not exists, create account
        auth.createUserWithEmailAndPassword(email,password)
        .then((userCredential)=>{ alert("Account created & Logged in!"); })
        .catch(err=>{ alert(err.message); });
    });
});

// Favorites
function loadFavorites() {
    const favoritesContainer = document.getElementById('favoritesContainer');
    favoritesContainer.innerHTML = '';
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    if(favorites.length === 0){ favoritesContainer.innerHTML="<p>No favorites added yet.</p>"; return; }
    favorites.forEach(store=>{
        const favDiv=document.createElement('div'); favDiv.classList.add('favorite-item');
        favDiv.innerHTML=`<a href="${store.url}" target="_blank">${store.name}</a>`;
        favoritesContainer.appendChild(favDiv);
    });
}
function toggleFavorite(event, name, url){
    event.stopPropagation();
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const index = favorites.findIndex(f=>f.name===name);
    if(index>-1){ favorites.splice(index,1); } else { favorites.push({name,url}); }
    localStorage.setItem('favorites', JSON.stringify(favorites));
    loadFavorites();
}
document.addEventListener('DOMContentLoaded', loadFavorites);

// Search
function searchFilteredStores(){
    const query = document.getElementById('productSearch').value.trim();
    const selectedCategory = document.getElementById('categorySelect').value;
    const resultsContainer = document.getElementById('resultsContainer');
    resultsContainer.innerHTML = '';
    if(query===""){ alert("Please enter a product name."); return; }

    const stores=[
        {url:`https://www.amazon.in/s?k=${query}`,name:'Amazon',category:'electronics'},
        {url:`https://www.flipkart.com/search?q=${query}`,name:'Flipkart',category:'electronics'},
        {url:`https://www.myntra.com/search?q=${query}`,name:'Myntra',category:'fashion'},
        {url:`https://www.snapdeal.com/search?keyword=${query}`,name:'Snapdeal',category:'fashion'},
        {url:`https://www.ajio.com/search/?text=${query}`,name:'Ajio',category:'fashion'},
        {url:`https://www.shopclues.com/search?q=${query}`,name:'ShopClues',category:'fashion'},
        {url:`https://paytm.com/shop/search?q=${query}`,name:'Paytm',category:'electronics'},
        {url:`https://www.tatacliq.com/search/?search_text=${query}`,name:'TataCliq',category:'electronics'},
        {url:`https://www.croma.com/search/?text=${query}`,name:'Croma',category:'electronics'},
        {url:`https://www.ebay.in/sch/i.html?_nkw=${query}`,name:'eBay',category:'electronics'},
        {url:`https://www.aliexpress.com/wholesale?SearchText=${query}`,name:'AliExpress',category:'electronics'},
        {url:`https://www.bigbasket.com/catalogsearch/result/?q=${query}`,name:'BigBasket',category:'groceries'},
        {url:`https://www.nykaa.com/search/result/?q=${query}`,name:'Nykaa',category:'beauty'},
        {url:`https://www.reliancefreshdirect.in/search/?text=${query}`,name:'Reliance',category:'groceries'},
        {url:`https://www.pepperfry.com/site/search?q=${query}`,name:'Pepperfry',category:'home'}
    ];

    const filteredStores = stores.filter(store=>selectedCategory==='all'||store.category===selectedCategory);
    if(filteredStores.length===0){ resultsContainer.innerHTML="<p>No stores available for this category.</p>"; return; }

    filteredStores.forEach(store=>{
        const frameContainer=document.createElement('div'); frameContainer.classList.add('iframe-container');
        const title=document.createElement('h3'); title.innerText=store.name;
        const iframe=document.createElement('iframe'); iframe.src=store.url; iframe.width="100%"; iframe.height="600"; iframe.style.border="1px solid #ccc"; iframe.loading="lazy";
        frameContainer.appendChild(title); frameContainer.appendChild(iframe); resultsContainer.appendChild(frameContainer);
    });
}
