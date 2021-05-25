let db;

// create a new db request for a "BudgetDB" database.
const request = indexedDB.open('budgetDB',1)

request.onupgradeneeded = function (event) {
 const db = event.target.result;
 db.createObjectStore ('budgetStore',{autoIncrement: true})
};

request.onsuccess = function (event) {
  db = event.target.result;

  if (navigator.onLine) {
    checkDb();
  }
};

request.onerror = function (event) {
  // log error here
  console.log(`an error connecting to db ${event.target.errorCode}`)
};

function saveRecord(record) {
  let transaction = db.transaction(['budgetStore'], 'readwrite');
  const store = transaction.objectStore('budgetStore');
  store.add(record);
}

function checkDb() {
  let transaction = db.transaction(['budgetStore'], 'readwrite');
  const store = transaction.objectStore('budgetStore');

  const getAll = store.getAll();

  getAll.onsuccess = function () {
    if (getAll.result.length > 0) {
      fetch('/api/transaction/bulk', {
        method: 'POST',
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then(() => {
          let transaction = db.transaction(['budgetStore'], 'readwrite');
          const store = transaction.objectStore('budgetStore');
          store.clear();
        });
    }
  };
}

// listen for app coming back online
window.addEventListener('online', checkDb);