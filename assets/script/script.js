const bookshelf = [];
const RENDER_EVENT = 'render-book';
const STORAGE_KEY = 'bookshelf-app';

let date = new Date().getDate();
let month = new Date().getMonth();
const year = new Date().getFullYear();

if (date < 10) {
     date = `0${date}`;
}
if (month < 10) {
     month = `0${month + 1}`
}

const headerTime = document.getElementById('header-time');
headerTime.innerText = `${date}/${month}/${year}`;

function isStorageExist() {
     if (typeof (Storage) !== null) {
          return true;
     }

     alert('Browser kamu tidak mendukung Local Storage');
     return false;
}

function loadDataFromStorage() {
     const serializedData = localStorage.getItem(STORAGE_KEY);
     let data = JSON.parse(serializedData);

     if (data !== null) {
          for (const book of data) {
               bookshelf.push(book);
          }
     }

     document.dispatchEvent(new Event(RENDER_EVENT))
}

function generateId() {
     return +new Date();
}

function generateBookObject(id, title, author, year, isComplete) {
     return {
          id,
          title,
          author,
          year,
          isComplete
     }
}

function saveData() {
     if (isStorageExist()) {
          const parsed = JSON.stringify(bookshelf);
          localStorage.setItem(STORAGE_KEY, parsed);
     }
}

function addBook() {
     const titleBook = document.getElementById('book-title').value;
     const authorBook = document.getElementById('book-author').value;
     const yearBook = Number(document.getElementById('book-year').value);
     const checked = document.getElementById('book-has-read').checked;

     const generateID = generateId();
     const bookObject = generateBookObject(generateID, titleBook, authorBook, yearBook, checked);
     bookshelf.push(bookObject);

     document.dispatchEvent(new Event(RENDER_EVENT));
     notifAdd(titleBook);
     saveData();
}

function findBook(bookId) {
     for (const bookItem of bookshelf) {
          if (bookItem.id === bookId) {
               return bookItem;
          }
     }
     return null;
}

function findBookIndex(bookId) {
     for (const index in bookshelf) {
          if (bookshelf[index].id === bookId) {
               return index;
          }
     }
     return -1;
}

function findBookName(bookId) {
     for (const index in bookshelf) {
          if (bookshelf[index].id === bookId) {
               return bookshelf[index].title;
          }
     }
     return null;
}

function isReadBookExist() {
     if (!document.querySelector('div#readBook-wrapper>div.bookshelf-listBook')) {
          document.getElementById('read').style.display = 'block';
     }
}

function isUnReadBookExist() {
     if (!document.querySelector('div#unreadBook-wrapper>div.bookshelf-listBook')) {
          document.getElementById('unread').style.display = 'block';
     }
}

function notifAdd(bookName) {
     const section = document.querySelector('.notif-section');
     const notifDiv = document.createElement('div');
     const img = document.createElement('img');
     const text = document.createElement('p');

     notifDiv.classList.add('show')
     img.setAttribute('src', 'assets/img/notifIcon.svg');
     text.innerHTML = `<b>Info:</b> Buku ${bookName} berhasil ditambahkan.`;

     notifDiv.append(img, text);
     section.append(notifDiv);

     setTimeout(() => {
          notifDiv.remove();
     }, 5000);
}

function notifRead(bookName) {
     const section = document.querySelector('.notif-section');
     const notifDiv = document.createElement('div');
     const img = document.createElement('img');
     const text = document.createElement('p');

     notifDiv.classList.add('show')
     img.setAttribute('src', 'assets/img/notifIcon.svg');
     text.innerHTML = `<b>Info:</b> Buku ${bookName} telah selesai dibaca.`;

     notifDiv.append(img, text);
     section.append(notifDiv);

     setTimeout(() => {
          notifDiv.remove();
     }, 5000);
}

function notifUnread(bookName) {
     const section = document.querySelector('.notif-section');
     const notifDiv = document.createElement('div');
     const img = document.createElement('img');
     const text = document.createElement('p');

     notifDiv.classList.add('show')
     img.setAttribute('src', 'assets/img/notifIcon.svg');
     text.innerHTML = `<b>Info:</b> Buku ${bookName} belum dibaca.`;

     notifDiv.append(img, text);
     section.append(notifDiv);

     setTimeout(() => {
          notifDiv.remove();
     }, 5000);
}

function notifDelete(bookName) {
     const section = document.querySelector('.notif-section');
     const notifDiv = document.createElement('div');
     const img = document.createElement('img');
     const text = document.createElement('p');

     notifDiv.classList.add('show')
     img.setAttribute('src', 'assets/img/notifIcon.svg');
     text.innerHTML = `<b>Info:</b> Buku ${bookName} berhasil dihapus.`;

     notifDiv.append(img, text);
     section.append(notifDiv);

     setTimeout(() => {
          notifDiv.remove();
     }, 5000);
}

function readBook(bookId) {
     const bookTarget = findBook(bookId);
     const bookName = findBookName(bookId);
     if (bookTarget === null) return;

     bookTarget.isComplete = true;
     document.dispatchEvent(new Event(RENDER_EVENT));
     isReadBookExist();
     isUnReadBookExist();
     notifRead(bookName);
     saveData();
}

function unreadBook(bookId) {
     const bookTarget = findBook(bookId);
     const bookName = findBookName(bookId);


     if (bookTarget === null) return;

     bookTarget.isComplete = false;
     document.dispatchEvent(new Event(RENDER_EVENT));
     isReadBookExist();
     isUnReadBookExist();
     notifUnread(bookName);
     saveData();
}

function deleteBook(bookId) {
     const bookTarget = findBookIndex(bookId);
     const bookName = findBookName(bookId);


     if (bookTarget === -1) return;

     if (confirm(`Anda akan menghapus buku ${bookName}. Hapus buku?`)) {
          bookshelf.splice(bookTarget, 1);
          notifDelete(bookName);
          document.dispatchEvent(new Event(RENDER_EVENT));
     }
     isReadBookExist();
     isUnReadBookExist();
     saveData();
}

function makeBook(bookObject) {
     const bookshelfWrapper = document.createElement('div');
     bookshelfWrapper.classList.add('bookshelf-listBook');
     bookshelfWrapper.setAttribute('id', `id-${bookObject.id}`)

     const bookshelfBook = document.createElement('div');
     const title = document.createElement('h4');
     const titleAuthor = document.createElement('p');
     const titleYear = document.createElement('p');
     title.innerText = bookObject.title;
     titleAuthor.innerText = `Penulis: ${bookObject.author}`;
     titleYear.innerText = `Tahun: ${bookObject.year}`;
     bookshelfBook.classList.add('bookshelf-book');
     bookshelfBook.append(title, titleAuthor, titleYear);

     const bookshelfButton = document.createElement('div');
     bookshelfButton.classList.add('bookshelf-button');

     bookshelfWrapper.append(bookshelfBook);

     if (!bookObject.isComplete) {
          const readButton = document.createElement('button');
          readButton.classList.add('bookshelf-read');
          readButton.innerText = 'Selesai Dibaca';

          readButton.addEventListener('click', () => {
               readBook(bookObject.id)
          });

          const deleteButton = document.createElement('button');
          deleteButton.classList.add('bookshelf-delete');
          deleteButton.innerText = 'Hapus Buku';

          deleteButton.addEventListener('click', () => {
               deleteBook(bookObject.id);
          });

          bookshelfButton.append(readButton, deleteButton);
          bookshelfWrapper.append(bookshelfButton);
     } else {
          const unreadButton = document.createElement('button');
          unreadButton.classList.add('bookshelf-unread');
          unreadButton.innerText = 'Belum Dibaca';

          unreadButton.addEventListener('click', () => {
               unreadBook(bookObject.id);
          });

          const deleteButton = document.createElement('button');
          deleteButton.classList.add('bookshelf-delete');
          deleteButton.innerText = 'Hapus Buku';

          deleteButton.addEventListener('click', () => {
               deleteBook(bookObject.id);
          });


          bookshelfButton.append(unreadButton, deleteButton);
          bookshelfWrapper.append(bookshelfButton);
     }

     return bookshelfWrapper;
}

function searchInput(event) {
     event.preventDefault();
     const searchInput = document.getElementById('search-book').value.toLowerCase();
     let itemBook = document.querySelectorAll('.bookshelf-listBook');

     for (const titleBook of itemBook) {
          const title = titleBook.children[0].children[0].textContent.toLocaleLowerCase();

          if (title.includes(searchInput)) {
               titleBook.setAttribute('style', 'display: block;');
          } else {
               titleBook.setAttribute('style', 'display: none !important;');
          }
     }
}

document.addEventListener(RENDER_EVENT, () => {
     const read = document.getElementById('readBook-wrapper');
     read.innerHTML = '';
     const unread = document.getElementById('unreadBook-wrapper');
     unread.innerHTML = '';

     for (const bookItem of bookshelf) {
          const bookElement = makeBook(bookItem);

          if (bookItem.isComplete) {
               document.getElementById('read').style.display = 'none';
               read.append(bookElement);
          } else {
               document.getElementById('unread').style.display = 'none';
               unread.append(bookElement);
          }
     }
});

document.addEventListener('DOMContentLoaded', () => {
     const formAdd = document.querySelector('form#input-book');
     formAdd.addEventListener('submit', (event) => {
          event.preventDefault();
          addBook();
          formAdd.reset();
     });

     const searchButton = document.querySelector('#search-submit');
     searchButton.addEventListener('click', searchInput);

     if (isStorageExist()) {
          loadDataFromStorage();
     }
});