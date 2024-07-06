document.getElementById('flexSwitchCheckReverse').addEventListener('change', function () {
    const isChecked = this.checked;
    const priceElements = document.querySelectorAll('.price-value');
    const gstElements = document.querySelectorAll('.gst');

    priceElements.forEach((priceElement, index) => {
        const originalPrice = parseFloat(priceElement.textContent.replace(/,/g, ''));

        if (isChecked) {
            const newPrice = (originalPrice * 1.18).toFixed(2);
            priceElement.textContent = newPrice.toLocaleString("en-In");
            gstElements[index].style.display = 'none';
        } else {
            const originalPriceAgain = (originalPrice / 1.18).toFixed(2);
            priceElement.textContent = originalPriceAgain.toLocaleString("en-In");
            gstElements[index].style.display = 'inline';
        }
    });
});