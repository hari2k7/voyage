document.addEventListener('DOMContentLoaded', function () {

    if (localStorage.getItem('voyage_theme') === 'dark') {
        document.body.classList.add('dark-mode');
    }


    var BG_COLORS = {
        Temple:     '#FEF3E8',
        Restaurant: '#FBEAF0',
        Nature:     '#EAF3DE',
        Landmark:   '#E6F1FB',
        Mall:       '#F1EFE8',
        Museum:     '#EEEDFE',
        Resort:     '#FAEEDA',
        Other:      '#EDE8DF'
    };

    var places = [];

    try {
        var saved = localStorage.getItem('places');
        places = saved ? JSON.parse(saved) : (typeof DEFAULT_PLACES !== 'undefined' ? DEFAULT_PLACES : []);
    } catch (e) {
        places = (typeof DEFAULT_PLACES !== 'undefined') ? DEFAULT_PLACES : [];
    }

    var activeFilter = 'All';

    function savePlaces() {
        try {
            localStorage.setItem('places', JSON.stringify(places));
        } catch (e) {
            console.error('Failed to save places:', e);
        }
    }

    function makeStars(rating) {
        var fullStars = Math.floor(rating);
        var hasHalf   = (rating % 1) >= 0.5;
        var stars     = '';
        for (var i = 0; i < fullStars; i++) { stars += '★'; }
        if (hasHalf) { stars += '½'; }
        return stars;
    }


    function renderPlaces() {
        var grid = document.getElementById('places-grid');
        var sub  = document.getElementById('places-sub');

        sub.textContent = places.length + ' places saved';

        var list = [];
        if (activeFilter === 'All') {
            list = places.slice();
        } else {
            for (var i = 0; i < places.length; i++) {
                if (places[i].type === activeFilter) {
                    list.push(places[i]);
                }
            }
        }

        if (list.length === 0) {
            grid.innerHTML =
                '<div id="empty-state"><p>📍</p>No places in this category yet.</div>';
            return;
        }

        // Build cards — NO inline onclick, we use data-id instead
        var html = '';
        for (var j = 0; j < list.length; j++) {
            var p  = list[j];
            var bg = BG_COLORS[p.type] || '#EDE8DF';

            html +=
                '<div class="place-card">' +
                    '<div class="place-thumb" style="background-color:' + bg + '">' + p.emoji + '</div>' +
                    '<div class="place-body">' +
                        '<button class="place-delete" data-id="' + p.id + '">✕</button>' +
                        '<div class="place-name">'  + p.name   + '</div>' +
                        '<div class="place-type">'  + p.type + ' · ' + p.city + '</div>' +
                        '<div class="place-stars">' + makeStars(parseFloat(p.rating)) + ' ' + p.rating + '</div>' +
                    '</div>' +
                '</div>';
        }

        grid.innerHTML = html;

        var deleteBtns = grid.querySelectorAll('.place-delete');
        for (var k = 0; k < deleteBtns.length; k++) {
            deleteBtns[k].addEventListener('click', function () {
                var id = parseInt(this.getAttribute('data-id'));
                deletePlace(id);
            });
        }
    }

    var filterBar = document.getElementById('filter-bar');
    filterBar.addEventListener('click', function (e) {
        if (e.target.tagName !== 'BUTTON') return;

        // Update active class
        var allBtns = filterBar.querySelectorAll('button');
        for (var i = 0; i < allBtns.length; i++) {
            allBtns[i].classList.remove('active');
        }
        e.target.classList.add('active');

        activeFilter = e.target.getAttribute('data-filter');
        renderPlaces();
    });


    document.getElementById('save-btn').addEventListener('click', function () {
        var name   = document.getElementById('place-name').value.trim();
        var type   = document.getElementById('place-type').value;
        var city   = document.getElementById('place-city').value.trim();
        var emoji  = document.getElementById('place-emoji').value.trim() || '📍';
        var rating = document.getElementById('place-rating').value;

        if (name === '' || city === '') {
            alert('Please enter both a place name and a city.');
            return;
        }

        places.push({
            id:     Date.now(),
            name:   name,
            type:   type,
            city:   city,
            emoji:  emoji,
            rating: rating
        });

        savePlaces();
        renderPlaces();

        document.getElementById('place-name').value  = '';
        document.getElementById('place-city').value  = '';
        document.getElementById('place-emoji').value = '';
    });

    function deletePlace(id) {
        if (!confirm('Remove this place?')) return;

        var newPlaces = [];
        for (var i = 0; i < places.length; i++) {
            if (places[i].id !== id) {
                newPlaces.push(places[i]);
            }
        }

        places = newPlaces;
        savePlaces();
        renderPlaces();
    }

    renderPlaces();

});