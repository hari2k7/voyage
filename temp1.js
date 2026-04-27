document.addEventListener('DOMContentLoaded', () => {

  // grab elements — same as your todo/expense apps
  const openModalBtn   = document.getElementById('open-modal-btn');
  const closeModalBtn  = document.getElementById('close-modal-btn');
  const modalOverlay   = document.getElementById('modal-overlay');
  const tripForm       = document.getElementById('trip-form');
  const tripDestInput  = document.getElementById('trip-dest');
  const tripDatesInput = document.getElementById('trip-dates');
  const tripStatusInput= document.getElementById('trip-status');
  const tripList       = document.getElementById('trip-list');

  // load from localStorage — same as your apps
  let trips = JSON.parse(localStorage.getItem('voyage_trips')) || [];

  // render on load — same as your renderList() on DOMContentLoaded
  renderList();
  updateHero();
  updateStats();

  // open modal
  openModalBtn.addEventListener('click', () => {
    modalOverlay.classList.add('open');
  });

  // close modal
  closeModalBtn.addEventListener('click', () => {
    modalOverlay.classList.remove('open');
    tripForm.reset();
  });

  // close modal if clicking outside
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      modalOverlay.classList.remove('open');
      tripForm.reset();
    }
  });

  // submit form — same pattern as your expense tracker form submit
  tripForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const dest   = tripDestInput.value.trim();
    const dates  = tripDatesInput.value.trim();
    const status = tripStatusInput.value;

    if (dest === '' || dates === '') return;

    const newTrip = {
      id: Date.now(),
      dest: dest,
      dates: dates,
      status: status
    };

    trips.push(newTrip);
    saveTrips();
    renderList();
    updateHero();
    updateStats();

    tripForm.reset();
    modalOverlay.classList.remove('open');
  });

  // save — same as your saveExpensesToLocal()
  function saveTrips() {
    localStorage.setItem('voyage_trips', JSON.stringify(trips));
  }

  // render list — same as your renderList() in expense tracker
  function renderList() {
    tripList.innerHTML = '';

    if (trips.length === 0) {
      tripList.innerHTML = '<p class="empty-msg">No trips yet — add one above.</p>';
      return;
    }

    for (let i = 0; i < trips.length; i++) {
      const trip = trips[i];

      const badgeClass = trip.status === 'upcoming'  ? 'badge-upcoming'
                       : trip.status === 'completed' ? 'badge-past'
                       : 'badge-planned';

      const badgeText  = trip.status === 'upcoming'  ? 'Upcoming'
                       : trip.status === 'completed' ? 'Completed'
                       : 'Planned';

      const li = document.createElement('li');
      li.setAttribute('data-id', trip.id);
      li.innerHTML = `
        <div class="trip-row">
          <div>
            <div class="trip-dest">${trip.dest}</div>
            <div class="trip-dates">${trip.dates}</div>
          </div>
          <div style="display:flex;align-items:center;gap:10px;">
            <span class="badge ${badgeClass}">${badgeText}</span>
            <button class="trip-delete-btn" data-id="${trip.id}">✕</button>
          </div>
        </div>
      `;
      tripList.appendChild(li);
    }
  }

  // delete — event delegation, same as your expense tracker delete
  tripList.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
      const id = parseInt(e.target.getAttribute('data-id'));
      trips = trips.filter(t => t.id !== id);
      saveTrips();
      renderList();
      updateHero();
      updateStats();
    }
  });

  // update hero card to show first upcoming or planned trip
  function updateHero() {
    const next = trips.find(t => t.status === 'upcoming')
              || trips.find(t => t.status === 'planned')
              || trips[0];

    if (!next) {
      document.getElementById('hero-name').textContent = 'No trips yet';
      document.getElementById('hero-meta').textContent = 'Add your first trip using the button above';
      document.getElementById('hero-tags').innerHTML   = '';
      return;
    }

    document.getElementById('hero-name').textContent = next.dest;
    document.getElementById('hero-meta').textContent = next.dates;
    document.getElementById('hero-tags').innerHTML   = next.status === 'upcoming'
      ? '<span class="tag accent">✈ Booked</span>'
      : '<span class="tag">Planning in progress</span>';
  }

  // update stat cards by reading localStorage — same way your apps read data
  function updateStats() {
    document.getElementById('stat-total').textContent = trips.length;
    document.getElementById('trip-sub').textContent   = trips.length + ' trip' + (trips.length !== 1 ? 's' : '') + ' planned';

    // packing stat
    const packingItems = JSON.parse(localStorage.getItem('voyage_packing')) || [];
    if (packingItems.length > 0) {
      let done = 0;
      for (let i = 0; i < packingItems.length; i++) {
        if (packingItems[i].checked) done++;
      }
      document.getElementById('stat-packing').textContent = done + '/' + packingItems.length;
    }

    // budget stat — same as your calculateTotal()
    const expenses = JSON.parse(localStorage.getItem('voyage_expenses')) || [];
    let total = 0;
    for (let i = 0; i < expenses.length; i++) {
      total += expenses[i].amount;
    }
    document.getElementById('stat-budget').textContent = '$' + Math.round(total).toLocaleString();

    // places stat
    const places = JSON.parse(localStorage.getItem('voyage_places')) || [];
    document.getElementById('stat-places').textContent = places.length;
  }

});