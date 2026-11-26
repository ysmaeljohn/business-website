import { checkMatchingProduct } from '../products.js';

const deliveryStages = [
  {
    id: 'processing',
    label: 'Being processed',
    description: 'Your order is being prepared.'
  },
  {
    id: 'out-for-delivery',
    label: 'Out for delivery',
    description: 'Your order is on its way.'
  },
  {
    id: 'delivered',
    label: 'Delivered',
    description: 'Your order has arrived.'
  }
];

const ordersList = document.querySelector('#orders-list');
const noOrdersMessage = document.querySelector('#no-orders');
const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'medium',
  timeStyle: 'short'
});

function createTextElement(tagName, className, text) {
  const element = document.createElement(tagName);
  element.className = className;
  element.textContent = text;
  return element;
}

function formatPlacedDate(placedAt) {
  const date = new Date(placedAt);
  return Number.isNaN(date.getTime()) ? 'Date unavailable' : dateFormatter.format(date);
}

function formatPrice(price) {
  const numericPrice = Number(price);
  return Number.isFinite(numericPrice) ? `₱${numericPrice.toFixed(2)}` : 'Price unavailable';
}

function createTrackingTimeline(currentStageIndex) {
  const timeline = document.createElement('ol');
  timeline.className = 'tracking-timeline';
  timeline.setAttribute('aria-label', 'Delivery progress');

  deliveryStages.forEach((stage, index) => {
    const step = document.createElement('li');
    step.className = 'tracking-step';
    step.classList.toggle('is-complete', index < currentStageIndex);
    step.classList.toggle('is-current', index === currentStageIndex);
    step.classList.toggle('is-upcoming', index > currentStageIndex);

    if (index === currentStageIndex) {
      step.setAttribute('aria-current', 'step');
    }

    step.append(
      createTextElement('span', 'step-marker', String(index + 1))
    );

    const copy = document.createElement('span');
    copy.className = 'step-copy';
    copy.append(
      createTextElement('strong', '', stage.label),
      createTextElement('span', '', stage.description)
    );
    step.append(copy);
    timeline.append(step);
  });

  return timeline;
}

function createOrderedItem(item) {
  const listItem = document.createElement('li');
  listItem.className = 'ordered-item';

  const product = checkMatchingProduct(item.productId);
  if (product) {
    const image = document.createElement('img');
    image.className = 'ordered-item-image';
    image.src = `../${product.src}`;
    image.alt = product.name;
    listItem.append(image);
  } else {
    const imagePlaceholder = createTextElement('span', 'ordered-item-image-placeholder', '?');
    imagePlaceholder.setAttribute('aria-hidden', 'true');
    listItem.append(imagePlaceholder);
  }

  const details = document.createElement('div');
  details.className = 'ordered-item-details';
  details.append(
    createTextElement('strong', 'ordered-item-name', product ? product.name : 'Product unavailable'),
    createTextElement('span', 'ordered-item-variation', `Variation: ${item.category || 'Default'}`),
    createTextElement('span', 'ordered-item-quantity', `Quantity: ${Number(item.quantity)}`)
  );
  listItem.append(details);
  listItem.append(createTextElement('strong', 'ordered-item-price', formatPrice(item.price)));

  return listItem;
}

function createOrderCard(order, orderNumber) {
  const card = document.createElement('article');
  card.className = 'order-card';

  const currentStageIndex = deliveryStages.findIndex((stage) => stage.id === order.status);
  const cardHeader = document.createElement('header');
  cardHeader.className = 'order-card-header';

  const placedDetails = document.createElement('div');
  placedDetails.append(
    createTextElement('p', 'order-label', `ORDER ${orderNumber}`),
    createTextElement('time', 'order-placed', formatPlacedDate(order.placedAt))
  );
  cardHeader.append(placedDetails);
  cardHeader.append(
    createTextElement(
      'span',
      'status-badge',
      currentStageIndex === -1 ? 'Status unavailable' : deliveryStages[currentStageIndex].label
    )
  );
  card.append(cardHeader);

  const itemsSection = document.createElement('section');
  itemsSection.className = 'ordered-items-section';
  itemsSection.append(createTextElement('h2', 'order-section-title', 'Items in this order'));

  const itemsList = document.createElement('ul');
  itemsList.className = 'ordered-items';
  if (Array.isArray(order.items) && order.items.length > 0) {
    order.items.forEach((item) => itemsList.append(createOrderedItem(item)));
  } else {
    itemsList.append(createTextElement('li', 'ordered-items-empty', 'Item details unavailable.'));
  }
  itemsSection.append(itemsList);
  card.append(itemsSection);

  if (order.deliveryDetails && typeof order.deliveryDetails === 'object') {
    const deliveryDetails = order.deliveryDetails;
    const address = deliveryDetails.address;
    const addressText = address && typeof address === 'object'
      ? [
          address.street,
          address.barangay,
          address.city,
          address.province,
          address.postalCode
        ].filter(Boolean).join(', ')
      : '';
    const recipientSection = document.createElement('section');
    recipientSection.className = 'order-recipient-details';
    recipientSection.append(
      createTextElement('h2', 'order-section-title', 'Delivery address'),
      createTextElement('strong', 'order-recipient-name', deliveryDetails.fullName || 'Recipient unavailable'),
      createTextElement(
        'span',
        'order-recipient-contact',
        deliveryDetails.contactNumber
          ? `Contact: ${deliveryDetails.contactNumber}`
          : 'Contact number unavailable'
      ),
      createTextElement('span', 'order-recipient-address', addressText || 'Address unavailable')
    );

    if (deliveryDetails.deliveryInstructions) {
      recipientSection.append(
        createTextElement(
          'span',
          'order-recipient-instructions',
          `Instructions: ${deliveryDetails.deliveryInstructions}`
        )
      );
    }

    card.append(recipientSection);
  }

  if (order.deliveryOption && typeof order.deliveryOption === 'object') {
    const deliveryDetails = document.createElement('section');
    deliveryDetails.className = 'order-delivery-details';
    deliveryDetails.append(
      createTextElement('h2', 'order-section-title', 'Delivery'),
      createTextElement('strong', 'order-delivery-label', order.deliveryOption.label || 'Delivery option'),
      createTextElement(
        'span',
        'order-delivery-date',
        order.deliveryOption.deliveryDate
          ? `Estimated arrival: ${order.deliveryOption.deliveryDate}`
          : 'Estimated arrival unavailable'
      ),
      createTextElement(
        'span',
        'order-delivery-fee',
        `Shipping: ${formatPrice(order.deliveryOption.shippingFee)}`
      )
    );
    card.append(deliveryDetails);
  }

  if (currentStageIndex === -1) {
    card.append(
      createTextElement('p', 'status-unavailable', 'Delivery progress is unavailable for this order.')
    );
  } else {
    card.append(createTrackingTimeline(currentStageIndex));
  }

  const itemCount = Number(order.itemCount);
  const orderSummary = document.createElement('footer');
  orderSummary.className = 'order-summary';
  orderSummary.append(
    createTextElement(
      'span',
      '',
      `${itemCount} ${itemCount === 1 ? 'item' : 'items'}`
    ),
    createTextElement('strong', '', typeof order.total === 'string' ? order.total : 'Total unavailable')
  );
  card.append(orderSummary);

  return card;
}

function renderOrders() {
  const orders = JSON.parse(localStorage.getItem('orders') || '[]');
  if (!Array.isArray(orders)) {
    throw new TypeError('Saved orders must be a list.');
  }

  ordersList.replaceChildren();
  noOrdersMessage.hidden = orders.length > 0;
  ordersList.hidden = orders.length === 0;

  orders.slice().reverse().forEach((order, index) => {
    ordersList.append(createOrderCard(order, orders.length - index));
  });
}

window.addEventListener('storage', (event) => {
  if (event.key === 'orders' || event.key === null) {
    renderOrders();
  }
});

renderOrders();