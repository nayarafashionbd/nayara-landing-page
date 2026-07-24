// ============================================
// SINGLE PRODUCT CONFIG — change these when the product changes
// ============================================
const PRODUCT_NAME = 'Nayara Comfort Bra-Panty Set';

// Price for each quantity option (৳)
const QUANTITY_PRICES = { 1: 749, 2: 1498, 3: 2247, 4: 2996 };

// Delivery charge for each zone (৳)
const DELIVERY_CHARGES = {
  dhaka: { label: 'ঢাকার ভিতরে', price: 70 },
  nearby: { label: 'পার্শ্ববর্তী এলাকা', price: 120 },
  outside: { label: 'ঢাকার বাইরে', price: 150 }
};

// Available colors — edit this list to match your real stock
const COLOR_OPTIONS = ['Skin/Beige', 'Olive Green', 'Grey', 'Black'];

// ============================================
// OPTION CARDS (quantity / size / delivery zone) — visual selection state
// ============================================
const optionCards = document.querySelectorAll('.option-card');

optionCards.forEach(card => {
  const input = card.querySelector('input');
  if (!input) return;
  input.addEventListener('change', () => {
    // clear "selected" from siblings sharing the same name
    document.querySelectorAll(`input[name="${input.name}"]`).forEach(sibling => {
      sibling.closest('.option-card').classList.remove('selected');
    });
    card.classList.add('selected');
  });
  if (input.checked) card.classList.add('selected');
});

// ============================================
// DYNAMIC COLOR PICKERS — one dropdown per piece, based on quantity
// ============================================
const colorPickersEl = document.getElementById('colorPickers');
const quantityRadios = document.querySelectorAll('input[name="quantity"]');

function renderColorPickers(quantity) {
  colorPickersEl.innerHTML = '';
  for (let i = 1; i <= quantity; i++) {
    const row = document.createElement('div');
    row.className = 'color-picker-row';

    const label = document.createElement('label');
    label.textContent = `পিস ${i} এর রং`;

    const select = document.createElement('select');
    select.name = `color-${i}`;
    select.className = 'piece-color-select';
    select.required = true;

    COLOR_OPTIONS.forEach(color => {
      const opt = document.createElement('option');
      opt.value = color;
      opt.textContent = color;
      select.appendChild(opt);
    });

    row.appendChild(label);
    row.appendChild(select);
    colorPickersEl.appendChild(row);
  }
}

quantityRadios.forEach(radio => {
  radio.addEventListener('change', () => {
    if (radio.checked) renderColorPickers(parseInt(radio.value, 10));
    updateTotal();
  });
});

// Render pickers for the default checked quantity on page load
renderColorPickers(parseInt(document.querySelector('input[name="quantity"]:checked').value, 10));

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
// LIVE TOTAL PRICE — quantity price + delivery charge
// ============================================
const totalPriceDisplay = document.getElementById('totalPriceDisplay');
const deliveryRadios = document.querySelectorAll('input[name="deliveryZone"]');

function updateTotal() {
  const quantity = parseInt(document.querySelector('input[name="quantity"]:checked').value, 10);
  const zone = document.querySelector('input[name="deliveryZone"]:checked').value;
  const total = QUANTITY_PRICES[quantity] + DELIVERY_CHARGES[zone].price;
  totalPriceDisplay.textContent = `৳${total}`;
}

deliveryRadios.forEach(radio => radio.addEventListener('change', updateTotal));
updateTotal();

// ============================================
// ORDER FORM (COD) — validation + submit feedback
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
      formNote.textContent = '⚠️ সঠিক ফোন নম্বর দিন (যেমন: 01712345678)';
      formNote.className = 'form-note error';
      return;
    }

    const quantity = parseInt(document.querySelector('input[name="quantity"]:checked').value, 10);
    const size = document.querySelector('input[name="size"]:checked').value;
    const zone = document.querySelector('input[name="deliveryZone"]:checked').value;
    const deliveryCharge = DELIVERY_CHARGES[zone].price;
    const unitTotal = QUANTITY_PRICES[quantity];
    const totalPrice = unitTotal + deliveryCharge;

    const colors = Array.from(document.querySelectorAll('.piece-color-select')).map(s => s.value);

    // Collect order data — replace this block with your Google Sheets /
    // backend endpoint call when ready (see note below).
    const orderData = {
      product: PRODUCT_NAME,
      name: document.getElementById('fullName').value.trim(),
      phone: phone,
      address: document.getElementById('address').value.trim(),
      size: size,
      quantity: quantity,
      colors: colors,
      deliveryZone: DELIVERY_CHARGES[zone].label,
      deliveryCharge: deliveryCharge,
      productTotal: unitTotal,
      totalPrice: totalPrice,
      paymentMethod: 'Cash on Delivery',
      date: new Date().toISOString()
    };

    console.log('New COD order:', orderData);

    submitBtn.disabled = true;
    submitBtn.textContent = 'Order হচ্ছে...';

    // Simulated submit delay — swap with a real fetch() call to your
    // Google Sheets Web App / backend when that's connected.
    setTimeout(() => {
      formNote.innerHTML =
        `🎉 ধন্যবাদ! আপনার <strong>${PRODUCT_NAME}</strong> (${quantity} পিস — ${colors.join(', ')}) Order টি Confirm হয়েছে।<br>` +
        `Total <strong>৳${totalPrice}</strong> (Delivery: ${DELIVERY_CHARGES[zone].label}, ৳${deliveryCharge}) — Cash on Delivery-তে পরিশোধ করবেন। শীঘ্রই আমরা ফোনে যোগাযোগ করব।`;
      formNote.className = 'form-note success';
      submitBtn.disabled = false;
      submitBtn.textContent = '✅ Confirm Order';
      orderForm.reset();

      // reset visual card selections back to defaults
      optionCards.forEach(card => card.classList.remove('selected'));
      document.querySelector('input[name="quantity"][value="1"]').closest('.option-card').classList.add('selected');
      document.querySelector('input[name="size"][value="M"]').closest('.option-card').classList.add('selected');
      document.querySelector('input[name="deliveryZone"][value="dhaka"]').closest('.option-card').classList.add('selected');
      renderColorPickers(1);
      updateTotal();
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