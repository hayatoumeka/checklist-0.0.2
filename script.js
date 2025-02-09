document.addEventListener("DOMContentLoaded", function () {
    generateChecklist();
    document.getElementById("company").addEventListener("change", updateCompanyPractices);
    document.getElementById("ahj").addEventListener("change", updateAHJRequirements);
    document.getElementById("utility").addEventListener("change", updateUtilityRequirements);
});

function generateChecklist() {
    const checklistContainer = document.getElementById("checklist");
    checklistContainer.innerHTML = "";

    fetch("defaultChecklist.json")
        .then(response => response.json())
        .then(data => {
            for (const [section, items] of Object.entries(data)) {
                const sectionTitle = document.createElement("h4");
                sectionTitle.textContent = section;
                checklistContainer.appendChild(sectionTitle);

                items.forEach(item => {
                    checklistContainer.appendChild(createChecklistItem(item));
                });
            }
        })
        .catch(error => console.error("Error loading default checklist:", error));
}

function createChecklistItem(text) {
    const label = document.createElement("label");
    label.classList.add("checklist-item");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.name = text;

    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(text));

    return label;
}

function updateCompanyPractices() {
    const companySelected = document.getElementById("company").value;

    fetch("companyPractices.json")
        .then(response => response.json())
        .then(data => {
            const bestPractices = data[companySelected] || [];
            updateChecklistSection("COMPANY BEST PRACTICES", bestPractices, "green");
        })
        .catch(error => console.error("Error loading company practices:", error));
}

function updateAHJRequirements() {
    const ahjSelected = document.getElementById("ahj").value;

    fetch("ahj_requirements.json")
        .then(response => response.json())
        .then(data => {
            const requirements = data.ahjRequirements[ahjSelected] || {};
            for (const [section, items] of Object.entries(requirements)) {
                updateChecklistSection(section, items, "red");
            }
        })
        .catch(error => console.error("Error loading AHJ requirements:", error));
}

function updateUtilityRequirements() {
    const utilitySelected = document.getElementById("utility").value;

    fetch("ahj_requirements.json")
        .then(response => response.json())
        .then(data => {
            const requirements = data.utilityRequirements[utilitySelected] || {};
            for (const [section, items] of Object.entries(requirements)) {
                updateChecklistSection(section, items, "blue");
            }
        })
        .catch(error => console.error("Error loading utility requirements:", error));
}

function updateChecklistSection(section, items, color) {
    const checklistContainer = document.getElementById("checklist");

    // Find existing section or create a new one
    let sectionHeader = Array.from(checklistContainer.getElementsByTagName("h4")).find(h4 => h4.textContent === section);
    if (!sectionHeader) {
        sectionHeader = document.createElement("h4");
        sectionHeader.textContent = section;
        sectionHeader.style.color = color;
        checklistContainer.appendChild(sectionHeader);
    }

    // Clear old items from section
    let sectionItems = sectionHeader.nextSibling;
    while (sectionItems && sectionItems.tagName !== "H4") {
        const next = sectionItems.nextSibling;
        checklistContainer.removeChild(sectionItems);
        sectionItems = next;
    }

    // Add new items
    items.forEach(item => {
        const newItem = createChecklistItem(item);
        newItem.style.color = color;
        checklistContainer.appendChild(newItem);
    });
}
