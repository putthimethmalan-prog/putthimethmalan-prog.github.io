const btnOpen = document.getElementById('btn-open');
const giftScreen = document.getElementById('gift-screen');
const birthdayScreen = document.getElementById('birthday-screen');
const audio = document.getElementById('myAudio');

// พยายามเล่นเพลงทันทีที่โหลด
function attemptPlay() {
    audio.play().catch(() => {
        console.log("Autoplay blocked. Waiting for first click.");
    });
}

window.addEventListener('load', attemptPlay);
window.addEventListener('touchstart', attemptPlay, { once: true });
window.addEventListener('mousedown', attemptPlay, { once: true });

btnOpen.addEventListener('click', () => {
    audio.play(); // บังคับเล่นเพลง

    // พลุกระดาษแบบกระจายสวยๆ
    const count = 200;
    const defaults = { origin: { y: 0.7 } };

    function fire(particleRatio, opts) {
        confetti(Object.assign({}, defaults, opts, {
            particleCount: Math.floor(count * particleRatio)
        }));
    }

    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });

    // เปลี่ยนหน้าแบบสมูท
    giftScreen.style.opacity = '0';
    setTimeout(() => {
        giftScreen.classList.add('hidden');
        birthdayScreen.classList.remove('hidden');
        setTimeout(() => {
            birthdayScreen.classList.add('show');
        }, 50);
    }, 800);
});
