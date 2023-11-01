document.addEventListener('DOMContentLoaded', function () {
    // Retrieve the checkout data from local storage
    const checkoutData = JSON.parse(localStorage.getItem('checkoutData'));

    if (checkoutData) {
        // Update the movie title, price, and quantity on the page
        document.getElementById('movieTitle').textContent = checkoutData.title;
        document.getElementById('moviePrice').textContent = `₹${checkoutData.price.toFixed(2)}`;

        const debitCardRadio = document.getElementById('debit_card');
        const creditCardRadio = document.getElementById('credit_card');
        const upiRadio = document.getElementById('upi');
        const debitCreditForm = document.getElementById('debitCreditForm');
        const upiForm = document.getElementById('upiForm');
        const cardNumberInput = document.getElementById('cardNumber');
        const expiryDateInput = document.getElementById('expiryDate');

        // Add an event listener to the quantity input field
        const quantityInput = document.getElementById('quantity');
        quantityInput.addEventListener('input', updateTotalPrice);

        // Function to update the total price when the quantity changes
        function updateTotalPrice() {
            const quantity = parseInt(quantityInput.value, 10);
            if (!isNaN(quantity) && quantity > 0) {
                const price = checkoutData.price;
                const convenienceFee = price * 0.0175;
                const total = (price + convenienceFee) * quantity;
                document.getElementById('totalPrice').textContent = `₹${total.toFixed(2)}`;
                document.getElementById('convenienceFee').textContent = `₹${(convenienceFee * quantity).toFixed(2)}`;
            }
        }

        // Initialize total price and convenience fee
        updateTotalPrice();

        // Card number formatting
        cardNumberInput.addEventListener('input', formatCardNumber);

        function formatCardNumber() {
            let cardNumber = cardNumberInput.value.replace(/\s/g, '').replace(/\D/g, '');
            if (cardNumber.length > 16) {
                cardNumber = cardNumber.slice(0, 16);
            }
            const formattedCardNumber = cardNumber.replace(/(\d{4})/g, '$1 ');
            cardNumberInput.value = formattedCardNumber.trim();
        }

        // Expiry date formatting and validation
        expiryDateInput.addEventListener('input', formatAndValidateExpiryDate);

        function formatAndValidateExpiryDate() {
            let expiryDate = expiryDateInput.value.replace(/\s/g, '').replace(/\D/g, '');
            if (expiryDate.length > 4) {
                expiryDate = expiryDate.slice(0, 4);
            }

            if (expiryDate.length === 4) {
                const formattedExpiryDate = `${expiryDate.slice(0, 2)}/${expiryDate.slice(2)}`;
                expiryDateInput.value = formattedExpiryDate;

                // Validate the expiry date against the current date
                const today = new Date();
                const enteredYear = parseInt('20' + expiryDate.slice(2), 10);
                const enteredMonth = parseInt(expiryDate.slice(0, 2), 10);

                if (enteredYear > today.getFullYear() || (enteredYear === today.getFullYear() && enteredMonth >= today.getMonth() + 1)) {
                    // Valid expiry date
                } else {
                    // Display an alert for an invalid expiry date.
                    alert('Expiry date should be greater than today.');
                }
            }
        }

        // Show/hide payment method forms and make unselected method fields non-required
        function toggleForms() {
            if (debitCardRadio.checked || creditCardRadio.checked) {
                debitCreditForm.style.display = 'block';
                upiForm.style.display = 'none';
                // Make UPI input fields non-required
                upiForm.querySelectorAll('input').forEach(input => input.removeAttribute('required'));
            } else if (upiRadio.checked) {
                debitCreditForm.style.display = 'none';
                upiForm.style.display = 'block';
                // Make Debit Card and Credit Card input fields non-required
                debitCreditForm.querySelectorAll('input').forEach(input => input.removeAttribute('required'));
            }
        }

        debitCardRadio.addEventListener('change', toggleForms);
        creditCardRadio.addEventListener('change', toggleForms);
        upiRadio.addEventListener('change', toggleForms);

        // Initialize the form display and requirements
        toggleForms();
        
        // Function to display the success popup
        function displaySuccessPopup() {
            const successPopup = document.getElementById('successPopup');
            successPopup.style.display = 'block';
        }

        // Add an event listener to close the success popup
        const closePopup = document.getElementById('closePopup');
        closePopup.addEventListener('click', function() {
            // Hide the success popup
            const successPopup = document.getElementById('successPopup');
            successPopup.style.display = 'none';

            // Redirect to the home page (change the URL as needed)
            window.location.href = 'index.html';
        });

        // Update your form submission logic to display the success popup
        const paymentForm = document.getElementById('paymentForm');
        paymentForm.addEventListener('submit', function (event) {
            event.preventDefault();

            // Your form submission and validation logic here

            // Assuming payment was successful, display the success popup
            displaySuccessPopup();
        });
    }
});
