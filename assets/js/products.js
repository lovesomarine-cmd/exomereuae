const track = document.querySelector('.product-track');
const slides = document.querySelectorAll('.product-slide');

let current = 0;

function goToSlide(index) {

  track.style.transform =
    `translateX(-${index * 100}%)`;

  slides.forEach((slide, i) => {

    const img = slide.querySelector('img');

    if (i === index) {
      img.style.transform = 'scale(1) translateX(0)';
    } else {
      img.style.transform = 'scale(1.04) translateX(24px)';
    }

  });

  current = index;
}