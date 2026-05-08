if(localStorage.getItem("voyage_theme") === "dark"){
    document.body.classList.add("dark-mode");
}


let packed = 0;
let total = 26;
document.getElementById("progress").innerHTML = `
    <div class="progress-percent" id="progress-percent">0%</div>
    <div class="progress-track">
        <div class="progress-fill" id="progress-fill"></div>
    </div>
    <div class="progress-label">PROGRESS</div>
`;

function updateDisplay() {
    // document.getElementById("Packing_sub").innerHTML = `${packed} of ${total} packed`;
    document.getElementById("packed").innerHTML = packed;
    document.getElementById("total").innerHTML = total;
       const percent = total > 0 ? Math.round((packed / total) * 100) : 0;
 document.getElementById("progress-percent").textContent = `${percent}%`;
    document.getElementById("progress-fill").style.width = `${percent}%`;
    // document.getElementById("progress").innerHTML = `
    //     <div class="progress-percent">${percent}%</div>
    //     <div class="progress-track">
    //         <div class="progress-fill" style="width: ${percent}%"></div>
    //     </div>
    //     <div class="progress-label">PROGRESS</div>
    // `;
}

updateDisplay();

function Adds(checkbox) {
    if (checkbox.checked) {
        packed += 1;
    } else {
        packed -= 1;
    }
    updateDisplay();
}

function uncheck() {
    document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
    packed = 0;
    updateDisplay();
}

function check() {
    document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = true);
    packed = total;
    updateDisplay();
}