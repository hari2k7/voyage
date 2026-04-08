document.addEventListener("DOMContentLoaded", () => {
    const openModalBtn = document.getElementById('open-modal-btn');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const modalOverlay = document.getElementById('modal-overlay');
    const tripForm = document.getElementById('trip-form');
    const tripDestInput = document.getElementById('trip-dest');
    const tripDatesInput = document.getElementById('trip-dates');
    const tripStatusInput = document.getElementById('trip-status');
    const tripList = document.getElementById('trip-list');

    let trips = JSON.parse(localStorage.getItem('voyage_trips')) || [];

    renderList();

    openModalBtn.addEventListener('click', () => {
        modalOverlay.classList.add('open');
    });

    closeModalBtn.addEventListener('click', () => {
        modalOverlay.classList.remove('open');
    })

    tripForm.addEventListener('submit', (e) => {

        e.preventDefault();

        const destin = tripDestInput.value.trim();
        const dates = tripDatesInput.value.trim();
        const status = tripStatusInput.value;

        if (destin === '' || dates === '') return;

        const newTrip = {
            id: Date.now(),
            dest: destin,
            dates: dates,
            status: status
        }

        trips.push(newTrip);
        saveTrips();
        renderList();

        tripForm.reset();
        modalOverlay.classList.remove('open');

    })

    function saveTrips() {
        localStorage.setItem('voyage_trips', JSON.stringify(trips))
    }

    function renderList() {
        tripList.innerHTML = '';

        for (let i = 0; i < trips.length; i++) {
            const trip = trips[i];

            let badgeClass = '';
            let badgeText = '';

            if (trip.status === 'upcoming') {
                badgeClass = 'badge-upcoming';
                badgeText = 'Upcoming';
            } else if (trip.status === 'completed') {
                badgeClass = 'badge-past';
                badgeText = 'Completed';
            } else {
                badgeClass = 'badge-planned';
                badgeText = 'Planned';
            }

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

    tripList.addEventListener("click", (e) => {
        if (e.target.tagName === 'BUTTON') {
            const id = parseInt(e.target.getAttribute('data-id'));
            trips = trips.filter(t => t.id !== id);
            saveTrips();
            renderList();
            updateHero();
            updateStats();
        }
    })

    const expenses = JSON.parse(localStorage.getItem('voyage_expenses')) || [];
    let total = 0;

    for (let i = 0; i < expenses.length; i++) {
        total += expenses[i].amount;
    }
    document.getElementById('stat-budget').textContent = '$' + Math.round(total).toLocaleString();

})