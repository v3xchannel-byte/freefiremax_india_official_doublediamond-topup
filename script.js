document.addEventListener('DOMContentLoaded', function() {
    // Sample offer data
    const offers = [
        { diamonds: "315 Diamond", price: 150, outOfStock: true },
        { diamonds: "620 Diamond", price: 350, newOffer: true },
        { diamonds: "1070 Diamond", price: 510, newOffer: true },
        { diamonds: "2090 Diamond", price: 800, newOffer: true },
        { diamonds: "5700 Diamond", price: 2100, outOfStock: true },
        { diamonds: "90 Diamond weeklylite", price: 30, newOffer: true },
        { diamonds: "445 Diamond weekly", price: 100, newOffer: true },
        { diamonds: "2500 Diamond monthly", price: 600, newOffer: true }
    ];

    const offerContainer = document.getElementById('offerContainer');
    const selectedOfferText = document.getElementById('selectedOfferText');
    const selectedPrice = document.getElementById('selectedPrice');
    const payButton = document.getElementById('payButton');
    let selectedOffer = null;

    // Render offers
    offers.forEach(offer => {
        const offerCard = document.createElement('div');
        offerCard.className = 'offer-card';
        offerCard.innerHTML = `
            <h3>${offer.diamonds}</h3>
            <p class="price">₹ ${offer.price.toFixed(2)}</p>
            ${offer.newOffer ? '<span class="new-offer">New Offer</span>' : ''}
            ${offer.outOfStock ? '<p class="out-of-stock">Out of Stock!</p>' : ''}
        `;
        
        if (!offer.outOfStock) {
            offerCard.addEventListener('click', () => selectOffer(offer));
        } else {
            offerCard.style.opacity = '0.6';
            offerCard.style.cursor = 'not-allowed';
        }
        
        offerContainer.appendChild(offerCard);
    });

    // Select offer function
    function selectOffer(offer) {
        // Remove selected class from all cards
        document.querySelectorAll('.offer-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        // Add selected class to clicked card
        event.currentTarget.classList.add('selected');
        
        selectedOffer = offer;
        selectedOfferText.textContent = offer.diamonds;
        selectedPrice.textContent = `₹ ${offer.price.toFixed(2)}`;
        payButton.textContent = `Pay ₹ ${offer.price.toFixed(2)}`;
        payButton.disabled = false;
    }

    // Payment handler
    payButton.addEventListener('click', function() {
        const playerId = document.getElementById('playerId').value;
        const email = document.getElementById('email').value;
        
        if (!playerId || !email) {
            alert('Please enter your Player ID and Email');
            return;
        }
        
        if (!selectedOffer) {
            alert('Please select an offer');
            return;
        }
        
        const options = {
            key: 'rzp_test_YOUR_RAZORPAY_KEY', // Replace with your Razorpay key
            amount: selectedOffer.price * 100, // Amount in paise
            currency: 'INR',
            name: 'Free Fire Diamond Top-Up',
            description: selectedOffer.diamonds,
            image: 'https://via.placeholder.com/100x100?text=FF',
            order_id: '', // You'll get this from your server
            handler: function(response) {
                alert('Payment successful! Diamonds will be credited to your account shortly.');
                // Here you would typically send the payment details to your server
                console.log({
                    playerId,
                    email,
                    offer: selectedOffer,
                    paymentId: response.razorpay_payment_id
                });
            },
            prefill: {
                name: 'Player',
                email: email,
                contact: '9999999999'
            },
            notes: {
                address: 'Free Fire Diamond Purchase',
                player_id: playerId
            },
            theme: {
                color: '#FF6B00'
            }
        };
        
        const rzp = new Razorpay(options);
        rzp.open();
    });
});

// Payment handler
payButton.addEventListener('click', function() {
    const playerId = document.getElementById('playerId').value;
    const email = document.getElementById('email').value;
    
    if (!playerId || !email) {
        alert('Please enter your Player ID and Email');
        return;
    }
    
    if (!selectedOffer) {
        alert('Please select an offer');
        return;
    }
    
    // Redirect to QR scan screen with payment details
    window.location.href = `qrscan.html?diamonds=${encodeURIComponent(selectedOffer.diamonds)}&price=${selectedOffer.price}&playerId=${encodeURIComponent(playerId)}&email=${encodeURIComponent(email)}`;
});

function redirectToPayment() {
    // Get form values
    const playerId = document.getElementById('playerId').value;
    const email = document.getElementById('email').value;
    const selectedOffer = document.querySelector('.offer-card.selected');
    
    // Validate inputs
    if (!playerId || !email) {
        alert('Please enter your Player ID and Email');
        return;
    }
    
    if (!selectedOffer) {
        alert('Please select a diamond package');
        return;
    }
    
    // Get offer details
    const diamonds = selectedOffer.querySelector('h3').textContent;
    const price = selectedOffer.querySelector('.price').textContent;
    
    // Redirect to payment page with data
    window.location.href = `payment.html?playerId=${encodeURIComponent(playerId)}&email=${encodeURIComponent(email)}&diamonds=${encodeURIComponent(diamonds)}&price=${encodeURIComponent(price)}`;
}