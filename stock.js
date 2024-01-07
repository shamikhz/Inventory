//   for stock page
function toggleForm() {
    const stockForm = document.getElementById('stock-form');
    const toggleButton = document.getElementById('toggleStockForm');

    if (stockForm.style.display === 'none') {
        stockForm.style.display = 'block';
        toggleButton.textContent = 'Close Form';

    } else {
        stockForm.style.display = 'none';
        toggleButton.textContent = 'Add Stock';
    }
}

function calculateTotal() {
    const quantity = parseFloat(document.getElementById('quantity').value);
    const sellingPrice = parseFloat(document.getElementById('selling-price').value);
    const total = quantity * sellingPrice;

    if (!isNaN(total)) {
        document.getElementById('total-price').value = total.toFixed(2);
    } else {
        document.getElementById('total-price').value = 'Invalid values';
    }
}

function addToStock() {
    const date = document.getElementById('date').value;
    const product = document.getElementById('product').value;
    const quantity = document.getElementById('quantity').value;
    const purchasePrice = document.getElementById('purchase-price').value;
    const sellingPrice = document.getElementById('selling-price').value;
    const totalPrice = document.getElementById('total-price').value;

    // Creating an object to hold the form data
    const formData = { date, product, quantity, purchasePrice, sellingPrice, totalPrice };

    // Storing form data in local storage
    let Stocks = JSON.parse(localStorage.getItem('Stocks')) || [];
    Stocks.push(formData);
    localStorage.setItem('Stocks', JSON.stringify(Stocks));

    // Reset the form after submission
    document.getElementById('stock-form').reset();
    toggleForm();


    displayItems();

    updateChart();

 }
 
 

function displayItems() {
    const Stocks = JSON.parse(localStorage.getItem('Stocks')) || [];
    const Sells = JSON.parse(localStorage.getItem('Sells')) || [];

    // Create a map to store product names and their quantities from Stocks
    const stockMap = new Map();

    // Aggregate quantities by product name from Stocks
    Stocks.forEach(stock => {
        const { product, quantity } = stock;
        if (stockMap.has(product)) {
            stockMap.set(product, stockMap.get(product) + parseInt(quantity));
        } else {
            stockMap.set(product, parseInt(quantity));
        }
    });

    // Subtract quantities sold from Sells
    Sells.forEach(sell => {
        const { item, qty } = sell;
        if (stockMap.has(item)) {
            stockMap.set(item, stockMap.get(item) - parseInt(qty));
        }
    });

    const itemDiv = document.querySelector('.items'); // Replace 'your-div-class' with your div's class or ID
    itemDiv.innerHTML = ''; // Clear the div content

    const heading = document.createElement('h3');
    heading.textContent = 'Stocks After Sales';
    heading.style.color = '#ee6b0e';
    itemDiv.appendChild(heading);

    // Display the updated quantities in the item div
    stockMap.forEach((quantity, product) => {
        const itemElement = document.createElement('div');
        itemElement.textContent = `${product}: ${quantity}`;
        itemDiv.appendChild(itemElement);
    });
}

// Call displayItems to update and display the modified stock quantities after subtracting sales
displayItems();


function displayItem() {
    const Stocks = JSON.parse(localStorage.getItem('Stocks')) || [];
    const itemsDiv = document.querySelector('.item');

    // Clear the items div before displaying updated content
    itemsDiv.innerHTML = '';

    // Create a map to store product names and their quantities
    const productMap = new Map();

    // Iterate through the stock data to aggregate quantities by product name
    Stocks.forEach(stock => {
        const { product, quantity } = stock;
        if (productMap.has(product)) {
            productMap.set(product, productMap.get(product) + parseInt(quantity));
        } else {
            productMap.set(product, parseInt(quantity));
        }
    });
    
    
    const heading = document.createElement('h3');
    heading.textContent = 'Products Bought';
    heading.style.color = '#ee6b0e';
    itemsDiv.appendChild(heading);

    // Display the items with their quantities in the items div
    productMap.forEach((quantity, product) => {
        const itemElement = document.createElement('div');
        itemElement.textContent = `${product}: ${quantity}`;
        itemsDiv.appendChild(itemElement);
    });
  
}



// Call displayItems initially to populate the items div with initial stock data
displayItem();

// Retrieve stored Sell data from local storage and display in the table
document.addEventListener('DOMContentLoaded', function () {
    const StockData = JSON.parse(localStorage.getItem('Stocks')) || [];
    const tableBody = document.getElementById('Stock-data');

    StockData.forEach((data, index) => {
        const row = tableBody.insertRow();
        Object.values(data).forEach(value => {
            const cell = row.insertCell();
            cell.textContent = value;
        });



        // Create a cell for the delete icon
        const deleteCell = row.insertCell();
        const deleteIcon = document.createElement('i');
        deleteIcon.className = 'fas fa-trash-alt delete-icon'; // Font Awesome delete icon class
        deleteIcon.style.cursor = 'pointer';
        deleteCell.appendChild(deleteIcon);

        // Add click event listener to the delete icon
        deleteIcon.addEventListener('click', function () {
            deleteRow(row, index);
        });
    });

    function deleteRow(row, rowIndex) {
        row.parentNode.removeChild(row);

        // Update the StockData array by removing the deleted row
        StockData.splice(rowIndex, 1);

        // Update the local storage with the modified Sell data
        localStorage.setItem('Stocks', JSON.stringify(StockData));

        // Update total quantity and total rate after deletion
        const totalQuantityDiv = document.getElementById('total-quantity');
        const totalRateDiv = document.getElementById('total-rate');
        totalQuantityDiv.textContent = `Total Quantity: ${calculateTotalQuantity()}`;
        totalRateDiv.textContent = `Total Rate: ${calculateTotalRate()}`;
    }

    // Calculate total quantity from the table
    function calculateTotalQuantity() {
        let totalQty = 0;
        const quantityCells = document.querySelectorAll('#Stock-data td:nth-child(3)'); // Assuming quantity is in the fourth column

        quantityCells.forEach(cell => {
            totalQty += parseInt(cell.textContent) || 0;
        });

        return totalQty;
    }

    // Calculate total Rate from the table
    function calculateTotalRate() {
        let totalRate = 0;
        const rateCells = document.querySelectorAll('#Stock-data td:nth-child(6)'); // Assuming rate is in the sixth column

        rateCells.forEach(cell => {
            totalRate += parseInt(cell.textContent) || 0;
        });

        return totalRate;
    }

    // Display total quantity and total rate below the table initially
    const totalQuantityDiv = document.getElementById('total-quantity');
    const totalRateDiv = document.getElementById('total-rate');
    totalQuantityDiv.textContent = `Total Quantities Bought: ${calculateTotalQuantity()}`;
    totalRateDiv.textContent = `Total Estimated Earning in Rs: ${calculateTotalRate()}`;

    const Stocks = JSON.parse(localStorage.getItem('Stocks')) || [];
    const stockQuantity = Stocks.reduce((total, item) => total + parseInt(item.quantity), 0);
    localStorage.setItem('StockQuantity', stockQuantity);
});



function updateChart() {
    const itemDiv = document.querySelector('.items');
    const itemElements = itemDiv.querySelectorAll('div');

    const labels = [];
    const data = [];
    const productColors = JSON.parse(localStorage.getItem('ProductColors')) || {};

    itemElements.forEach(itemElement => {
        const [product, quantity] = itemElement.textContent.split(': ');
        labels.push(product);
        data.push(parseInt(quantity));

        if (!productColors[product]) {
            productColors[product] = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.6)`;
        }
    });

    localStorage.setItem('ProductColors', JSON.stringify(productColors));

    const ctx = document.getElementById('combined-chart').getContext('2d');

    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                label: 'Product Quantity',
                data: data,
                backgroundColor: Object.values(productColors),
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false // This hides the labels in the chart
                }
            }
        }
    });
}

// Call updateChart() after updating the item div with modified stock quantities
updateChart();

function calculateTotalQuantityOfItems() {
    const itemsDiv = document.querySelector('.items'); // Select the div containing the items
    const itemElements = itemsDiv.querySelectorAll('div'); // Assuming each product quantity is displayed in separate div elements

    let totalQuantity = 0;

    itemElements.forEach(itemElement => {
        const [_, quantity] = itemElement.textContent.split(': '); // Splitting the text to get the quantity part
        totalQuantity += parseInt(quantity) || 0; // Parse text content to an integer and add to total
    });

    return totalQuantity;
}

// Function to update total quantity in the TotalQuantityAfterSell div
function updateTotalQuantityAfterSell() {
    const totalQuantityDiv = document.getElementById('totalquantityaftersell');
    const total = calculateTotalQuantityOfItems();

    totalQuantityDiv.textContent = `Total Quantity after Sell: ${total}`;
    
    // Store the total quantity in local storage
    localStorage.setItem('TotalQuantityAfterSell', total);
}

// Call the function to update the total quantity initially
updateTotalQuantityAfterSell();

// Function to handle updates based on changes in local storage
function handleStorageChange(event) {
    // Here you can specify which keys to watch for changes
    if (event.key === 'Stocks' || event.key === 'Sells' || event.key === 'TotalQuantityAfterSell') {
        // Update the necessary parts of the page based on the changes in local storage
        displayItems();
        updateChart();
        updateTotalQuantityAfterSell(); // Update the total quantity after sell
        // Add other functions to update based on changes
        // ...
    }
}

// Event listener for local storage changes
window.addEventListener('storage', handleStorageChange);

// Function to remove event listeners
function removeStorageChangeListener() {
    window.removeEventListener('storage', handleStorageChange);
}

// Function to automatically call all necessary functions based on the current local storage data
function updatePageFromStorage() {
    handleStorageChange({ key: 'Stocks' }); // Simulating the initial update for Stocks data
    handleStorageChange({ key: 'Sells' }); // Simulating the initial update for Sells data
    handleStorageChange({ key: 'TotalQuantityAfterSell' }); // Simulating the initial update for TotalQuantityAfterSell data
}

// Call the function to initialize updates based on the current local storage data
updatePageFromStorage();
