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
// SINGLE PRODUCT CONFIG — change these 2 lines when the product changes
// ============================================
const PRODUCT_NAME = 'Nayara Comfort Bra-Panty Set';
const UNIT_PRICE = 749; // টাকা, প্রতি পিস

// ============================================
// ORDER FORM (COD) — validation + total calculation + submit feedback
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

    const quantity = parseInt(document.getElementById('quantity').value, 10);
    const totalPrice = UNIT_PRICE * quantity;

    // Collect order data — replace this block with your Google Sheets /
    // backend endpoint call when ready (see note below).
    const orderData = {
      product: PRODUCT_NAME,
      name: document.getElementById('fullName').value.trim(),
      phone: phone,
      address: document.getElementById('address').value.trim(),
      size: document.getElementById('size').value,
      quantity: quantity,
      unitPrice: UNIT_PRICE,
      totalPrice: totalPrice,
      paymentMethod: 'Cash on Delivery',
      date: new Date().toISOString()
    };

    console.log('New COD order:', orderData);

    submitBtn.disabled = true;
    submitBtn.textContent = 'অর্ডার হচ্ছে...';

    // Simulated submit delay — swap with a real fetch() call to your
    // Google Sheets Web App / backend when that's connected.
    setTimeout(() => {
      formNote.innerHTML =
        `🎉 ধন্যবাদ! আপনার <strong>${PRODUCT_NAME}</strong> (${quantity} পিস) অর্ডারটি গ্রহণ করা হয়েছে।<br>` +
        `সর্বমোট <strong>৳${totalPrice}</strong> — ক্যাশ অন ডেলিভারিতে পরিশোধ করবেন। শীঘ্রই আমরা ফোনে যোগাযোগ করব।`;
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