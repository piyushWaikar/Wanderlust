document.addEventListener('DOMContentLoaded', () => {
    const stars = document.querySelectorAll('.review-star');
    const ratingInput = document.getElementById('review-rating');
    const selectedRating = document.getElementById('selected-rating');

    stars.forEach(star => {
        star.addEventListener('click', () => {
            const rating = star.getAttribute('data-value');
            ratingInput.value = rating;
            selectedRating.textContent = rating;

            // Reset all stars and apply the filled class up to the selected one
            stars.forEach(s => s.classList.remove('filled'));
            for (let i = 0; i < rating; i++) {
                stars[i].classList.add('filled');
            }
        });
    });
});
