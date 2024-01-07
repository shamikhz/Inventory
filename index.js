 //  for changing the form 
 function showForm(event, formId) {
    event.preventDefault();
    const sellForm = document.getElementById('sell-form');
    const purchaseForm = document.getElementById('purchase-form');

    if (formId === 'showSellForm') {
      sellForm.style.display = 'block';
      purchaseForm.style.display = 'none';
    } else if (formId === 'showPurchaseForm') {
      sellForm.style.display = 'none';
      purchaseForm.style.display = 'block';
    }
  }

  // for Calculating total price of purchase
  function calculateTotal() {
    const qty = parseFloat(document.getElementById('quantity').value);
    const rate = parseFloat(document.getElementById('selling-price').value);
    const total = qty * rate;

    if (!isNaN(total)) {
      document.getElementById('total-price').value = total.toFixed(2);
    } else {
      document.getElementById('total-price').value = 'Invalid values';
    }
  }
  // for Calculating total price of sell 
  function calculateTotalS() {
    const qty = parseFloat(document.getElementById('sell-qty').value);
    const rate = parseFloat(document.getElementById('sell-rate').value);
    const total = qty * rate;

    if (!isNaN(total)) {
      document.getElementById('sell-total-rate').value = total.toFixed(2);
    } else {
      document.getElementById('sell-total-rate').value = 'Invalid values';
    }
  }

  
  function addToStocks() {
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
          updateChart();
      }
  
  //  submit sell form 
  function submitSell() {
    const name = document.getElementById('sell-name').value;
    const date = document.getElementById('sell-date').value;
    const item = document.getElementById('sell-item').value;
    const qty = document.getElementById('sell-qty').value;
    const rate = document.getElementById('sell-rate').value;
    const totalRate = document.getElementById('sell-total-rate').value;

    // Creating an object to hold the form data
    const formData = { name, date, item, qty, rate, totalRate };

    // Storing form data in local storage
    let Sells = JSON.parse(localStorage.getItem('Sells')) || [];
    Sells.push(formData);
    localStorage.setItem('Sells', JSON.stringify(Sells));

    // Clearing the form after submission
    document.getElementById('sell-form').reset();
    updateChart();
  }
  


  
  // for chart and to update chart
  document.addEventListener('DOMContentLoaded', function () {
    const ctx = document.getElementById('combined-chart').getContext('2d');
    const combinedChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Sell Quantity', 'Stock Quantity'],
        datasets: [{
          label: 'Combined Quantity',
          data: [0, 0],
          backgroundColor: ['orange', 'green'],
          borderWidth:3,
          
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              font: {
                size: 30
              }
            }
          } 
        }
      }
      
      
    });

    const stockQuantity = parseInt(localStorage.getItem('TotalQuantityAfterSell')) || 0;
    const sellQuantity = parseInt(localStorage.getItem('SellQuantity')) || 0;

    // Update the combined chart data with the corrected quantities
    combinedChart.data.datasets[0].data = [sellQuantity, stockQuantity];
    combinedChart.update();

    // Function to calculate total quantity from stored data
    function calculateTotalQuantity(key) {
      const data = JSON.parse(localStorage.getItem(key)) || [];
      return data.reduce((total, item) => total + parseInt(item.qty), 0);
    }

    // Update chart function (if required)
    updateChart();
  });
