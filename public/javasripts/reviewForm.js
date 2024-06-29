document.addEventListener('DOMContentLoaded', () => {
    const stars = document.querySelectorAll('.review-star');
    const ratingInput = document.getElementById('review-rating');

    stars.forEach(star => {
        star.addEventListener('click', () => {
            const rating = star.getAttribute('data-value');
            ratingInput.value = rating;
            
            stars.forEach(s => {
                if (s.getAttribute('data-value') <= rating) {
                    s.classList.add('review-checked');
                } else {
                    s.classList.remove('review-checked');
                }
            });
        });
    });
});
