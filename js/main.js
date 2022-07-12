"use strict";

let pages;
let page = 0;
let search = "js";

let pageNum = document.querySelector(".pageNum")
let prewBtn = document.querySelector(".prewBtn");
let nextBtn = document.querySelector(".nextBtn");
let logOutBtn = document.querySelector(".logOut");
let searchResult = document.querySelector(".resultNum");
let pagesBtn = document.querySelector(".pageBtn");
let sortBtn = document.querySelector(".sortBtn");
let bookList = document.querySelector(".bookList");
let elSearch = document.querySelector(".search");
let elForm =  document.querySelector(".form");
let bookmarkBtn = document.querySelector(".bookmarkBtn");
let bookmarkList = document.querySelector(".bookmarklist");
let elPagenation = document.querySelector(".pagination")

let localData = JSON.parse(window.localStorage.getItem("bookmarkedBooks"));
let bookmarks = localData || [];

let localToken = window.localStorage.getItem("token");
if (!localToken) {
  window.location.replace("login.html");
}



sortBtn.addEventListener("click", function(){

  fetch(`https://www.googleapis.com/books/v1/volumes?q=${search}&startIndex=${page}&orderBy=newest`).then((response)=> response.json()).then((data)=> renderBooks(data, bookList))
});



logOutBtn.addEventListener("click", function(){
  window.localStorage.removeItem("token");
  window.location.replace("login.html");
})


let bookmarkedbooks = function(arr, element){

  arr.forEach((bookmark)=>{
    let bookmarkBox = `
      <div class="bookmarkedBook rounded d-flex justify-content-between">
        <div class="contents">
          <h5>${bookmark?.volumeInfo.title}</h5>
          <p class="opacity-75">${bookmark?.volumeInfo?.authors?.join(", ") || "not found"}</p>
        </div>
        <div class="buttons d-flex align-items-center">
          <a class="btn readBook" target="blank" href="${bookmark.volumeInfo?.previewLink}">
          </a>
          <button data-bookmark-id="${bookmark.id}" class="p-0 btn delBookmark">
          </button>
        </div>
      </div>
    `;
    window.localStorage.setItem("bookmarkedBooks", JSON.stringify(bookmarks))
    element.insertAdjacentHTML("beforeend", bookmarkBox)
  })
}
bookmarkedbooks(bookmarks, bookmarkList);


bookmarkList.addEventListener("click", function(evt){
  let removeBookmark = evt.target.dataset.bookmarkId;
  if(evt.target.matches(".delBookmark")){
    let findDelIndex = bookmarks.findIndex((book) => book.id === removeBookmark);

    console.log(removeBookmark);

    bookmarks.splice(findDelIndex, 1);

    bookmarkList.innerHTML = null;
    window.localStorage.setItem("bookmarkedBooks", JSON.stringify(bookmarks));

    if(bookmarks.length ===0) {
      window.localStorage.removeItem("bookmarkedBooks")
    }
    bookmarkedbooks(bookmarks, bookmarkList)
  }
})


// let modal = function(){

// }

let paginate = function(page) {
  let pages = Math.ceil(page / 10);

  elPagenation.innerHTML = null;

  for(var i = 0; i < pages; i++){
    let html = `
    <li class="btn pageBtn btn-outline-info p-1 mx-2">${i}</li>
    `;

    
    elPagenation.insertAdjacentHTML("beforeend", html)
  }
  if(page === i){
    pagesBtn.classList.remove("btn-outline-info")
    pagesBtn.setAttribute("class", "btn-primary");

  }
}

prewBtn.addEventListener("click", function(){
  if(page >= 1){
    page--;
    getBooks();
    console.log("++++++");
  }
})

nextBtn.addEventListener("click", function(){
  if(page < pages){
    page++;
    getBooks();
    console.log("------");
  }
});

elPagenation.addEventListener("click", function(evt){
  if(evt.target.matches(".pageBtn")){
    var getPage = evt.target.innerHTML;
    page = getPage;
    getBooks()
  }
})


let renderBooks = function(arr){
  bookList.innerHTML = null;
  pages = arr.totalItems

  paginate(pages)
  let newarr = arr.items;

  // console.log(arr.items);
  newarr.forEach((book) => {
    try{
      let rendering = `
        <li class="books__item card mb-3 px-3 py-2">
          <div class="books__item__inner  d-flex flex-column justify-content-around p-1" style="width: 18rem;">
            <div class="d-flex cardImg justify-content-center align-items-center mb-3">
              <img src="${book?.volumeInfo?.imageLinks.smallThumbnail || book?.volumeInfo?.imageLinks.thumbnail}" class="rounded" height="190" width="128"/>
            </div>
            <div class="  d-flex flex-column justify-content-between">
              <h4 class="card__title">${book.volumeInfo.title}n</h4>
              <p class="book-author m-0 opacity-50">${book.volumeInfo.authors?.join(", ")}y</p>
              <p class="book-year opacity-50">${book.volumeInfo?.publishedDate || "Not found"}</p>
              <div class="d-flex justify-content-between">
                <button class="btn bookmarkBtn btn-success w-50" data-book-id="${book.id}">Bookmark</button>
                <button class="btn btn-outline-info w-50">More info</button>
              </div>
                <a href="${book.volumeInfo?.previewLink}" class="btn mt-2 btn-primary d-block w-100" target="blank">Read</a>
            
            </div>
          </div>
        </li>
      `;
      searchResult.textContent = pages;
      bookList.insertAdjacentHTML('beforeend', rendering);
    }catch(err){
      if(!book?.volumeInfo?.imageLinks.smallThumbnail){
        console.log("error");
      }
    }
  });

  bookList.addEventListener("click", function(evt){
    if(evt.target.matches(".bookmarkBtn")){
      
      let bookmarkId = evt.target.dataset.bookId;
      let findBookmark = newarr.find((book)=> book.id === bookmarkId
      );

      

      if(!bookmarks.includes(findBookmark)){
        window.localStorage.setItem("bookmarkedBooks", JSON.stringify(bookmarks)
      );
        bookmarks.push(findBookmark)
      };

      window.localStorage.setItem("bookmarkedBooks", JSON.stringify(bookmarks)
      );

      bookmarkList.innerHTML = null;

      bookmarkedbooks(bookmarks, bookmarkList)
    }
  })
 
};

let getBooks = async function(){
  try {
    let response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${search}&startIndex=${page}`);
    let data = await response.json();
    pageNum.textContent = page;
    renderBooks(data, bookList)
  }catch (err){
    console.log("img not found");
    bookList.textContent = "Not found"
  }
}

elForm.addEventListener("submit", function(evt){
  evt.preventDefault();
  search = elSearch.value;
  getBooks()
})
getBooks()

