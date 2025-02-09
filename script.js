document.addEventListener("DOMContentLoaded", () => {
    loadDefaultChecklist();
});

let defaultChecklist = {}; // Stores the default checklist

// Load default checklist
function loadDefaultChecklist() {
    fetch("default_checklist.json")
        .then(response => response.json())
        .then(data => {
            defaultChecklist = data;
            loadChecklist(); // Load with default
        })
        .catch(error => console.error("Error loading default checklist:", error));
}

// Load AHJ-specific checklist
function loadChecklist(ahj = "default") {
    fetch("ahj_requirements.json")
        .then(response => response.json())
        .then(ahjData => {
            const checklistContainer = document.getElementById("checklist-sections");
            checklistContainer.innerHTML = ""; // Clear previous checklist

            const ahjChecklist = ahj !== "default" ? ahjData[ahj] || {} : {};

            Object.keys(defaultChecklist).forEach(section => {
                const sectionDiv = document.createElement("div");
                sectionDiv.classList.add("section");

                const sectionTitle = document.createElement("h3");
                sectionTitle.textContent = section;
                sectionDiv.appendChild(sectionTitle);

                const checklistItemsDiv = document.createElement("div");
                checklistItemsDiv.classList.add("checklist-container");

                // Add default checklist items
                defaultChecklist[section].forEach(item => {
                    checklistItemsDiv.appendChild(createChecklistItem(item));
                });

                // Add AHJ-specific requirements
                if (ahj !== "default" && ahjChecklist[section]) {
                    ahjChecklist[section].forEach(item => {
                        checklistItemsDiv.appendChild(createChecklistItem(item, true));
                    });
                }

                sectionDiv.appendChild(checklistItemsDiv);
                checklistContainer.appendChild(sectionDiv);
            });
        })
        .catch(error => console.error("Error loading AHJ checklist:", error));
}

// Create a checklist item
function createChecklistItem(text, isAHJRequirement = false) {
    const label = document.createElement("label");
    label.classList.add("checklist-item");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";

    if (isAHJRequirement) {
        checkbox.style.accentColor = "red"; // Highlight AHJ-specific rules
    }

    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(text));

    return label;
}

// Update checklist based on AHJ selection
function updateChecklist() {
    const ahjSelected = document.getElementById("ahj").value;
    loadChecklist(ahjSelected);
}
