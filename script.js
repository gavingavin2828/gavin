// Tombol "Salin" untuk email dan nomor telepon
document.querySelectorAll("[data-copy]").forEach(function (button) {
  button.addEventListener("click", function () {
    const value = button.closest(".row").querySelector(".value");

    // Cadangan: blok teksnya jika browser tidak bisa menyalin otomatis
    function selectText() {
      const range = document.createRange();
      range.selectNodeContents(value);

      const selection = getSelection();
      selection.removeAllRanges();
      selection.addRange(range);

      button.textContent = "Teks dipilih";
    }

    if (!navigator.clipboard) {
      selectText();
      return;
    }

    navigator.clipboard
      .writeText(button.dataset.copy)
      .then(function () {
        button.textContent = "Tersalin";

        // Kembalikan tulisan tombol setelah 1,8 detik
        setTimeout(function () {
          button.textContent = "Salin";
        }, 1800);
      })
      .catch(selectText);
  });
});

// Animasi muncul saat halaman digulir
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        observer.unobserve(entry.target); // cukup sekali saja
      }
    });
  });

  document
    .querySelectorAll(
      "section h2, .about, .list article, .skills > div, .documentation, .contact .row",
    )
    .forEach(function (element) {
      observer.observe(element);
    });
}

// Slide foto dokumentasi OSIS
const slider = document.querySelector(".slider");

if (slider) {
  const track = slider.querySelector(".track");
  const photos = track.querySelectorAll("img");
  const dotsBox = slider.querySelector(".dots");
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  let current = 0;
  let timer;
  let startX = 0;

  // Buat satu titik untuk setiap foto
  const dots = Array.from(photos, function (photo, index) {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "dot";
    dot.setAttribute("aria-label", "Foto " + (index + 1));
    dot.addEventListener("click", function () {
      showPhoto(index);
      play();
    });
    dotsBox.appendChild(dot);
    return dot;
  });

  // Tampilkan foto sesuai urutan (setelah foto terakhir kembali ke awal)
  function showPhoto(index) {
    current = (index + photos.length) % photos.length;
    track.style.transform = "translateX(-" + current * 100 + "%)";

    photos.forEach(function (photo, i) {
      photo.classList.toggle("active", i === current);
    });
    dots.forEach(function (dot, i) {
      dot.classList.toggle("active", i === current);
    });
  }

  // Geser otomatis setiap 3,5 detik
  function play() {
    clearInterval(timer);
    if (reduceMotion) return;
    timer = setInterval(function () {
      showPhoto(current + 1);
    }, 3500);
  }

  // Tombol panah kiri dan kanan
  slider.querySelectorAll(".arrow").forEach(function (arrow) {
    arrow.addEventListener("click", function () {
      showPhoto(current + Number(arrow.dataset.step));
      play();
    });
  });

  // Berhenti sebentar saat mouse berada di atas slide
  slider.addEventListener("pointerenter", function (event) {
    if (event.pointerType === "mouse") clearInterval(timer);
  });
  slider.addEventListener("pointerleave", function (event) {
    if (event.pointerType === "mouse") play();
  });

  // Geser dengan jari di HP
  track.addEventListener("touchstart", function (event) {
    startX = event.touches[0].clientX;
  });
  track.addEventListener("touchend", function (event) {
    const distance = event.changedTouches[0].clientX - startX;
    if (Math.abs(distance) < 40) return;
    showPhoto(current + (distance < 0 ? 1 : -1));
    play();
  });

  showPhoto(0);
  play();
}
