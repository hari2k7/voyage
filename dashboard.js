if(localStorage.getItem("voyage_theme") === "dark"){
    document.body.classList.add("dark-mode");
}

document.addEventListener("DOMContentLoaded", () => {
    const openModalBtn = document.getElementById('open-modal-btn');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const modalOverlay = document.getElementById('modal-overlay');
    const tripForm = document.getElementById('trip-form');
    const tripDestInput = document.getElementById('trip-dest');
    const tripStatusInput = document.getElementById('trip-status');
    const tripList = document.getElementById('trip-list');
    const tripDateFromInput = document.getElementById('trip-date-from');
    const tripDateToInput = document.getElementById('trip-date-to');

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
        const dateFrom = tripDateFromInput.value;
        const dateTo = tripDateToInput.value;
        const status = tripStatusInput.value;

        if (destin === '' || dateFrom === '' || dateTo === '') return;

        const newTrip = {
            id: Date.now(),
            dest: destin,
            dates: dateFrom + ' → ' + dateTo,
            status: status
        };

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

        document.getElementById('stat-total').textContent = trips.filter(trip => trip.status === 'planned').length;
        document.getElementById('stat-total2').textContent = trips.filter(trip => trip.status === 'completed').length;
        document.getElementById('stat-total3').textContent = trips.filter(trip => trip.status === 'upcoming').length;

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
        }
    })

    const expenses = JSON.parse(localStorage.getItem('voyage_expenses')) || [];
    let total = 0;

    for (let i = 0; i < expenses.length; i++) {
        total += expenses[i].amount;
    }
    document.getElementById('stat-budget').textContent = '₹' + Math.round(total).toLocaleString();

    // Adithya
    const upcomingContainer = document.getElementById('upcoming-events');
    const storedEvents = JSON.parse(localStorage.getItem('events')) || {};
    let firstDay = null;

    for(let i=1; i<=20; i++){

        if(
            storedEvents[`day${i}`] &&
            storedEvents[`day${i}`].length > 0
        ){
            firstDay = `day${i}`;
            break;
        }

    }

    if(firstDay){

        const events = storedEvents[firstDay];

        events.forEach(event => {
            
            const item = document.createElement('div');
            item.className = "timeline-item";

            item.innerHTML = `
                <div class="tl-dot"></div>

                <div>

                    <div class="tl-day">
                        ${firstDay.replace("day","Day ")}
                    </div>

                    <div class="tl-title">
                        ${event.name}
                    </div>

                </div>
            `;

            upcomingContainer.appendChild(item);

        });

    }else{

        upcomingContainer.innerHTML = `
            <p>No upcoming events yet.</p>
        `;
    }

})