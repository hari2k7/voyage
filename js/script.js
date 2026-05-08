function name_check(){
    const name = document.getElementById('name').value;
    const name_div = document.getElementById('name_div');

    if(name.length < 4){
        name_div.innerHTML="Minimum 4 characters required.";
    }else{
        name_div.innerHTML="";
    }
}

function dur_check(){
    const dur = Number(document.getElementById('dur').value);
    const dur_div = document.getElementById('dur_div');

    if(dur < 1){
        dur_div.innerHTML="Minimum 1 day.";
    }else{
        dur_div.innerHTML="";
    }
}

function travNum_check(){
    const travNum = Number(document.getElementById('travNum').value);
    const travNum_div = document.getElementById('travNum_div');

    if(travNum < 1){
        travNum_div.innerHTML="Minimum 1 Traveller Required.";
    }else{
        travNum_div.innerHTML="";
    }
}

function start_check(){
    const start = document.getElementById('start').value;
    const start_div = document.getElementById('start_div');

    if(start ==""){
        start_div.innerHTML="Enter Starting point.";
    }else{
        start_div.innerHTML="";
    }
}

function dest_check(){
    const dest = document.getElementById('dest').value;
    const dest_div = document.getElementById('dest_div');

    if(dest ==""){
        dest_div.innerHTML="Enter Destination.";
    }else{
        dest_div.innerHTML="";
    }
}

function startDate_check(){
    const startDate = document.getElementById('startDate').value;
    const startDate_div = document.getElementById('startDate_div');

    if(startDate==""){
        startDate_div.innerHTML="Enter Start Date.";
    }else{
        startDate_div.innerHTML="";
    }
}

function endDate_check(){
    const endDate = document.getElementById('endDate').value;
    const startDate = document.getElementById('startDate').value;
    const endDate_div = document.getElementById('endDate_div');

    if(endDate == ""){
        endDate_div.innerHTML = "Enter End Date.";
    }else if(startDate != "" && endDate < startDate){
        endDate_div.innerHTML = "End Date cannot be before Start Date.";
    }else{
        endDate_div.innerHTML = "";
    }
}

const form = document.getElementById('form');

if(form){

    form.addEventListener('submit', (e)=>{

        const name = document.getElementById('name').value;
        const name_div = document.getElementById('name_div').innerHTML;
        const dur = Number(document.getElementById('dur').value);
        const dur_div = document.getElementById('dur_div').innerHTML;
        const travNum = Number(document.getElementById('travNum').value);
        const travNum_div = document.getElementById('travNum_div').innerHTML;
        const start = document.getElementById('start').value;
        const start_div = document.getElementById('start_div').innerHTML;
        const dest = document.getElementById('dest').value;
        const dest_div = document.getElementById('dest_div').innerHTML;
        const startDate = document.getElementById('startDate').value;
        const startDate_div = document.getElementById('startDate_div').innerHTML;
        const endDate = document.getElementById('endDate').value;
        const endDate_div = document.getElementById('endDate_div').innerHTML;


        if(name_div !=""){
            e.preventDefault();
            alert("Name condition not satisfied.");
        }else if(dur_div !=""){
            e.preventDefault();
            alert("duration details conditon not satisfied.");
        }else if(travNum_div !=""){
            e.preventDefault();
            alert("Number of Travellers condition not satisfied.");
        }else if(start_div !=""){
            e.preventDefault();
            alert("Starting point condition not satisfied.");
        }else if(dest_div !=""){
            e.preventDefault();
            alert("Destination condition not satisfied.");
        }else if(startDate_div !=""){
            e.preventDefault();
            alert("Start Date condition not satisfied.");
        }else if(endDate_div !=""){
            e.preventDefault();
            alert("End Date condition not satisfied.");
        }else if(
            name == "" ||
            dur == "" ||
            travNum == "" ||
            start == "" ||
            dest == "" ||
            startDate == "" ||
            endDate == "" ){
                e.preventDefault();
                alert("Please fill all details.");
        }

        localStorage.removeItem("events");

        localStorage.setItem("tripData", JSON.stringify({
            start,
            dest,
            dur,
            travNum,
            startDate,
            endDate,

        }))

       
    
    })
}

function createEventElement(activePanel, name, time, note){

    const emptyMessage = activePanel.querySelector('.empty-message');

    if(emptyMessage){
        emptyMessage.remove();
    }

    const event = document.createElement('div');

    event.className = "itin-event";

    event.innerHTML = `
        <div class="itin-time">
            ${time || "--:--"}
        </div>

        <div class="itin-card">

            <div class="event-top">

                <div class="itin-type">
                    Custom Event
                </div>

                <button class="remove-btn">
                    ✖
                </button>

            </div>

            <div class="itin-name">
                ${name}
            </div>

            <div class="itin-note">
                ${note || "No additional note"}
            </div>

        </div>
    `;

    activePanel.appendChild(event);

    const removeBtn = event.querySelector('.remove-btn');

    removeBtn.addEventListener('click', function(){

        removeStoredEvent(
            activePanel.id,
            name,
            time,
            note
        );

        event.remove();

        if(activePanel.querySelectorAll('.itin-event').length === 0){

            const data = JSON.parse(localStorage.getItem("tripData"));

            activePanel.innerHTML = `
                <h3>
                    Day ${activePanel.id.replace("day", "")} Events
                </h3>

                <div class="empty-message">

                    <p>No events added yet.</p>

                    <a href="https://www.google.com/search?q=best+tourist+places+in+${encodeURIComponent(data.dest)}" target="_blank">

                        Explore tourist places in ${data.dest}

                    </a>

                </div>
            `;
        }

    });

}

function saveEvents(dayId, name, time, note){

    let storedEvents = JSON.parse(localStorage.getItem("events")) || {};

    if(!storedEvents[dayId]){
        storedEvents[dayId] = [];
    }

    storedEvents[dayId].push({
        name,
        time,
        note
    });

    localStorage.setItem("events", JSON.stringify(storedEvents));
}

function renderStoredEvents(dayId){

    const storedEvents = JSON.parse(localStorage.getItem("events")) || {};

    if(!storedEvents[dayId]){
        return;
    }

    const panel = document.getElementById(dayId);

    storedEvents[dayId].forEach(eventData => {

        createEventElement(
            panel,
            eventData.name,
            eventData.time,
            eventData.note
        );

    });

}

function removeStoredEvent(dayId, name, time, note){

    let storedEvents = JSON.parse(localStorage.getItem("events")) || {};

    if(!storedEvents[dayId]){
        return;
    }

    storedEvents[dayId] = storedEvents[dayId].filter(event => {

        return !(

            event.name === name &&
            event.time === time &&
            event.note === note

        );

    });

    localStorage.setItem("events", JSON.stringify(storedEvents));
}


window.addEventListener('DOMContentLoaded', ()=>{

    const data = JSON.parse(localStorage.getItem("tripData"));

    if(!data) return;

    const {start, dest, dur, travNum, startDate, endDate} = data;

    document.getElementById('date_dest').innerHTML = `${start} to ${dest} · ${startDate} - ${endDate} · Travellers: ${travNum}`;
    
    const day_tabs = document.querySelector('.day-tabs');
    const day_container = document.getElementById('day_container');

    day_tabs.innerHTML="";
    day_container.innerHTML = "";

    for (let i = 1; i <= dur; i++) {
        
        //button 
        const btn = document.createElement('button');
        btn.className = "day-tab";
        btn.innerHTML = `Day ${i}`;

        btn.addEventListener('click', () => {
            showDay(`day${i}`, btn);
        });

        //panel
        const panel = document.createElement('div');
        panel.id = `day${i}`;
        panel.className = "day-panel";
        panel.innerHTML = `
        <h3>Day ${i} Events</h3>

        <div class="empty-message">
            <p>No events added yet.</p>

            <a href="https://www.google.com/search?q=best+tourist+places+in+${encodeURIComponent(dest)}" target="_blank">
            Explore tourist places in ${dest}
            </a>
        </div>`;


        if (i==1){
            btn.classList.add('active');
            panel.classList.add('active');
        }

        day_tabs.appendChild(btn);
        day_container.appendChild(panel);
        renderStoredEvents(`day${i}`);
    }

})

function showDay(dayId, clickedBtn) {

    
    document.querySelectorAll('.day-panel').forEach(p => {
        p.classList.remove('active');
    });

    
    document.querySelectorAll('.day-tab').forEach(b => {
        b.classList.remove('active');
    });

    
    document.getElementById(dayId).classList.add('active');
    clickedBtn.classList.add('active');
}

function showAddEvent(){
    document.getElementById('input-name').focus();
    document.getElementById('modal-overlay').style.display = "flex";
}

function closeModal(){
    document.getElementById('modal-overlay').style.display = "none";
}

function addEvent(){

    const name = document.getElementById('input-name').value.trim();
    const time = document.getElementById('input-time').value;
    const note = document.getElementById('input-note').value.trim();

    if(name === ""){
        alert("Enter event name");
        return;
    }

    const activePanel = document.querySelector('.day-panel.active');

    createEventElement(
        activePanel,
        name,
        time,
        note
    );

    saveEvents(
        activePanel.id,
        name,
        time,
        note
    );

    document.getElementById('input-name').value = "";
    document.getElementById('input-time').value = "";
    document.getElementById('input-note').value = "";

    closeModal();
}

document.getElementById('modal-overlay').addEventListener('click', function(e){

    if(e.target === this){
        closeModal();
    }

});

document.addEventListener('keydown', function(e){

    if(e.key === "Escape"){
        closeModal();
    }

});

function export_butt(){
    alert('Update yet to come.');
}