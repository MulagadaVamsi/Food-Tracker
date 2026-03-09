// ================== CONFIG ==================
const POST_URL = "https://a3pfud2yj9.execute-api.ap-south-1.amazonaws.com/dev/donations";  // API Gateway POST endpoint
const GET_URL  = "https://a3pfud2yj9.execute-api.ap-south-1.amazonaws.com/dev/get-donations";   // API Gateway GET endpoint

// ================= MATRIX BACKGROUND =================
const canvas = document.getElementById('matrix');
const ctx = canvas.getContext('2d');
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%";
const fontSize = 14;
const columns = canvas.width / fontSize;
const drops = Array(Math.floor(columns)).fill(1);

function drawMatrix() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#0F0";
    ctx.font = fontSize + "px monospace";
    for (let i = 0; i < drops.length; i++) {
        const text = letters.charAt(Math.floor(Math.random() * letters.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i]++;
    }
}
setInterval(drawMatrix, 35);

// ================= FORM SUBMISSION =================
document.getElementById("donationForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const donationData = {
        storeName: document.getElementById("storeName").value,
        storeAddress: document.getElementById("storeAddress").value,
        storeLocation: document.getElementById("storeLocation").value,
        itemName: document.getElementById("itemName").value,
        expiryDate: document.getElementById("expiryDate").value
    };

    try {
        const res = await fetch(POST_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(donationData)
        });

        const result = await res.json();
        alert(result.message || "Donation added!");
        document.getElementById("donationForm").reset();
        loadDonations();
    } catch (error) {
        console.error("Error adding donation:", error);
    }
});

// ================= LOAD DONATIONS =================
async function loadDonations() {
    try {
        const res = await fetch(GET_URL);
        const donations = await res.json();

        const tableBody = document.querySelector("#donationsTable tbody");
        tableBody.innerHTML = "";

        donations.forEach(d => {
            const row = `<tr>
                <td>${d.StoreName || ""}</td>
                <td>${d.StoreAddress || ""}</td>
                <td>${d.StoreLocation || ""}</td>
                <td>${d.ItemName || ""}</td>
                <td>${d.ExpiryDate || ""}</td>
            </tr>`;
            tableBody.innerHTML += row;
        });
    } catch (error) {
        console.error("Error fetching donations:", error);
    }
}

// Load donations on start and refresh every 5 seconds
loadDonations();
setInterval(loadDonations, 5000);
