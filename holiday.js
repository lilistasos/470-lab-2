document.getElementById("submit-btn").addEventListener("click", function () {
    const countryCodeInput = document.getElementById("country-code-input").value.trim().toUpperCase();
    const year = document.getElementById("year-input").value.trim();
    
    if (!countryCodeInput || countryCodeInput.length !== 2) {
        alert("Please enter a valid 2-letter country code (e.g., US, DE, FR)");
        return;
    }
    
    if (!year || year.length !== 4) {
        alert("Please enter a valid 4-digit year (e.g., 2023, 2024)");
        return;
    }
    
    const countryCode = countryCodeInput.toLowerCase();
    const requestString =
    `https://date.nager.at/api/v3/PublicHolidays/${year}/${countryCode}`;
    
    console.log("Fetching from:", requestString);
    
    fetch(requestString,
    { method: "GET",
    headers: {
    "Content-Type": "application/json",
    },
    })
    .then(response => {
    console.log("Response status:", response.status);
    if (!response.ok) {
    if (response.status === 404) {
    throw new Error("Country code not found. Please check the country code.");
    }
    throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
    })
    .then(data => {
    const tableBody = document.getElementById("table-body");
    tableBody.innerHTML = "";
    for (let i = 0; i < data.length; i++) {
    const element = data[i];
    const row = tableBody.insertRow();
    const dateCell = row.insertCell();
    // Convert YYYY-MM-DD to MM/DD/YYYY
    const dateParts = element.date.split('-');
    const formattedDate = `${dateParts[1]}/${dateParts[2]}/${dateParts[0]}`;
    dateCell.textContent = formattedDate;
    const nameCell = row.insertCell();
    nameCell.textContent = element.name;
    const localNameCell = row.insertCell();
    localNameCell.textContent = element.localName;
    const countryCodeCell = row.insertCell();
    countryCodeCell.textContent = element.countryCode;
    const globalCell = row.insertCell();
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = element.global;
    checkbox.disabled = true;
    globalCell.appendChild(checkbox);
    }
    })
    .catch(error => {
    console.error("Error:", error);
    alert("Error fetching holidays: " + error.message);
    });
});