// for sell page

  function displayPRO() {
    const Sells = JSON.parse(localStorage.getItem('Sells')) || [];
    const ProsDiv = document.querySelector('.Pros');
  
    // Clear the Pros div before displaying updated content
    ProsDiv.innerHTML = '';
  
    // Create a map to store product names and their quantities
    const productMap = new Map();
  
    // Iterate through the sell data to aggregate quantities by product name
    Sells.forEach(sell => {
      const { item, qty } = sell; // Use the correct property names (item and qty)
      if (productMap.has(item)) {
        productMap.set(item, productMap.get(item) + parseInt(qty));
      } else {
        productMap.set(item, parseInt(qty));
      }
    });
  
    const heading = document.createElement('h3');
    heading.textContent = 'Products Sold';
    heading.style.color = '#ee6b0e';
    ProsDiv.appendChild(heading);
  
    // Display the items with their quantities in the Pros div
    productMap.forEach((qty, item) => { // Use the correct variable names here (item and quantity)
      const proElement = document.createElement('div'); // Use consistent variable naming
      proElement.textContent = `${item}: ${qty}`;
      ProsDiv.appendChild(proElement); // Use consistent variable naming
    });
  }
  
  // Call displayPRO initially to populate the Pros div with initial sell data
  displayPRO();
  

// Retrieve stored Sell data from local storage and display in the table
document.addEventListener('DOMContentLoaded', function () {
    const SellData = JSON.parse(localStorage.getItem('Sells')) || [];
    const tableBody = document.getElementById('Sell-data');

    SellData.forEach((data, index) => {
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

        // Update the SellData array by removing the deleted row
        SellData.splice(rowIndex, 1);

        // Update the local storage with the modified Sell data
        localStorage.setItem('Sells', JSON.stringify(SellData));

        // Update total quantity and total rate after deletion
        const totalQuantityDiv = document.getElementById('total-quantity');
        const totalRateDiv = document.getElementById('total-rate');
        totalQuantityDiv.textContent = `Total Quantity: ${calculateTotalQuantity()}`;
        totalRateDiv.textContent = `Total Rate: ${calculateTotalRate()}`;
    }

    // Calculate total quantity from the table
    function calculateTotalQuantity() {
        let totalQty = 0;
        const quantityCells = document.querySelectorAll('#Sell-data td:nth-child(4)'); // Assuming quantity is in the fourth column

        quantityCells.forEach(cell => {
            totalQty += parseInt(cell.textContent) || 0;
        });

        return totalQty;
    }

    // Calculate total Rate from the table
    function calculateTotalRate() {
        let totalRate = 0;
        const rateCells = document.querySelectorAll('#Sell-data td:nth-child(6)'); // Assuming rate is in the sixth column

        rateCells.forEach(cell => {
            totalRate += parseInt(cell.textContent) || 0;
        });

        return totalRate;
    }

    // Display total quantity and total rate below the table initially
    const totalQuantityDiv = document.getElementById('total-quantity');
    const totalRateDiv = document.getElementById('total-rate');
    totalQuantityDiv.textContent = `Total Quantity: ${calculateTotalQuantity()}`;
    totalRateDiv.textContent = `Total Rate: ${calculateTotalRate()}`;

    const Sells = JSON.parse(localStorage.getItem('Sells')) || [];
    const sellQuantity = Sells.reduce((total, item) => total + parseInt(item.qty), 0);
    localStorage.setItem('SellQuantity', sellQuantity);

    // Notify the inventory.html page about the update
    window.opener.postMessage({ type: 'updateChart' }, '*');

});