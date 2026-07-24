// ============================================
// PRODUCT GALLERY — click thumbnail to swap main image
// ============================================
const galleryMain = document.getElementById('galleryMain');
const thumbs = document.querySelectorAll('.thumb');

thumbs.forEach(thumb => {
  thumb.addEventListener('click', () => {
    thumbs.forEach(t => t.classList.remove('active'));
    thumb.classList.add('active');
    galleryMain.src = thumb.src.replace('140x140', '600x600');
  });
});

// ============================================
// ORDER FORM — client-side validation + submit feedback
// ============================================
const orderForm = document.getElementById('orderForm');
const submitBtn = document.getElementById('submitBtn');
const formNote = document.getElementById('formNote');

if (orderForm) {
  orderForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const phone = document.getElementById('phone').value.trim();
    const phonePattern = /^01[3-9][0-9]{8}$/;

    if (!phonePattern.test(phone)) {
      formNote.textContent = '⚠️ সঠিক মোবাইল নাম্বার দিন (যেমন: 01712345678)';
      formNote.className = 'form-note error';
      return;
    }

    // Collect order data — replace this block with your Google Sheets /
    // backend endpoint call when ready (see note below).
    const orderData = {
      name: document.getElementById('fullName').value.trim(),
      phone: phone,
      address: document.getElementById('address').value.trim(),
      quantity: document.getElementById('quantity').value,
      size: document.getElementById('size').value,
      date: new Date().toISOString()
    };

    console.log('New order:', orderData);

    submitBtn.disabled = true;
    submitBtn.textContent = 'অর্ডার হচ্ছে...';

    // Simulated submit delay — swap with a real fetch() call to your
    // Google Sheets Web App / backend when that's connected.
    setTimeout(() => {
      formNote.textContent = '🎉 ধন্যবাদ! আপনার অর্ডার গ্রহণ করা হয়েছে। শীঘ্রই আমরা ফোনে যোগাযোগ করব।';
      formNote.className = 'form-note success';
      submitBtn.disabled = false;
      submitBtn.textContent = '✅ অর্ডার কনফার্ম করুন';
      orderForm.reset();
    }, 900);
  });
}

// ============================================
// STICKY ORDER BUTTON — hide while the order form itself is visible
// ============================================
const stickyBtn = document.querySelector('.sticky-order');
const orderSection = document.getElementById('order');

if (stickyBtn && orderSection && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        stickyBtn.style.display = entry.isIntersecting ? 'none' : '';
      });
    },
    { threshold: 0.2 }
  );
  observer.observe(orderSection);
}