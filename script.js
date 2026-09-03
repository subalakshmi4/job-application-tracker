const companyInput = document.getElementById("company");
const jobRoleInput = document.getElementById("jobRole");
const locationInput = document.getElementById("location");
const jobTypeInput = document.getElementById("jobType");
const applicationDateInput = document.getElementById("applicationDate");
const statusInput = document.getElementById("status");

const addButton = document.getElementById("addButton");

const searchInput = document.getElementById("searchInput");
const filterStatus = document.getElementById("filterStatus");

const applicationsContainer =
    document.getElementById("applicationsContainer");

const totalCount = document.getElementById("totalCount");
const interviewCount = document.getElementById("interviewCount");
const offerCount = document.getElementById("offerCount");
const rejectedCount = document.getElementById("rejectedCount");


let applications = JSON.parse(localStorage.getItem("applications")) || [];

let editIndex = -1;


// Display applications
function displayApplications() {

    applicationsContainer.innerHTML = "";

    const searchText = searchInput.value.toLowerCase();
    const selectedStatus = filterStatus.value;

    applications.forEach(function(application, index) {

        const company = application.company.toLowerCase();
        const role = application.jobRole.toLowerCase();

        const matchesSearch =
            company.includes(searchText) ||
            role.includes(searchText);

        const matchesStatus =
            selectedStatus === "All" ||
            application.status === selectedStatus;

        if (matchesSearch && matchesStatus) {

            const card = document.createElement("div");

            card.classList.add("application-card");

            card.innerHTML = `
                <h3>${application.company}</h3>

                <p>Job Role: ${application.jobRole}</p>

                <p>Location: ${application.location}</p>

                <p>Job Type: ${application.jobType}</p>

                <p>Application Date: ${application.date}</p>

                <p>Status: ${application.status}</p>

                <button class="editButton">
                    Edit
                </button>

                <button class="deleteButton">
                    Delete
                </button>
            `;


            // Edit button
            const editButton =
                card.querySelector(".editButton");

            editButton.addEventListener("click", function() {

                companyInput.value = application.company;
                jobRoleInput.value = application.jobRole;
                locationInput.value = application.location;
                jobTypeInput.value = application.jobType;
                applicationDateInput.value = application.date;
                statusInput.value = application.status;

                editIndex = index;

                addButton.textContent = "Update Application";

            });


            // Delete button
            const deleteButton =
                card.querySelector(".deleteButton");

            deleteButton.addEventListener("click", function() {

                applications.splice(index, 1);

                saveApplications();

                displayApplications();

            });


            applicationsContainer.appendChild(card);
        }

    });

    updateStatistics();
}


// Add / Update application
addButton.addEventListener("click", function() {

    const company = companyInput.value.trim();
    const jobRole = jobRoleInput.value.trim();
    const location = locationInput.value.trim();
    const jobType = jobTypeInput.value;
    const date = applicationDateInput.value;
    const status = statusInput.value;


    if (
        company === "" ||
        jobRole === "" ||
        location === "" ||
        date === ""
    ) {

        alert("Please fill in all required fields.");

        return;
    }


    const application = {

        company: company,
        jobRole: jobRole,
        location: location,
        jobType: jobType,
        date: date,
        status: status

    };


    // Update existing application
    if (editIndex !== -1) {

        applications[editIndex] = application;

        editIndex = -1;

        addButton.textContent = "Add Application";

    }

    // Add new application
    else {

        applications.push(application);

    }


    saveApplications();

    clearForm();

    displayApplications();

});


// Save applications to LocalStorage
function saveApplications() {

    localStorage.setItem(
        "applications",
        JSON.stringify(applications)
    );

}


// Clear form
function clearForm() {

    companyInput.value = "";
    jobRoleInput.value = "";
    locationInput.value = "";
    jobTypeInput.value = "Full-time";
    applicationDateInput.value = "";
    statusInput.value = "Applied";

}


// Search
searchInput.addEventListener("input", function() {

    displayApplications();

});


// Filter
filterStatus.addEventListener("change", function() {

    displayApplications();

});


// Update statistics
function updateStatistics() {

    totalCount.textContent = applications.length;

    const interviews =
        applications.filter(function(application) {

            return application.status === "Interview";

        }).length;

    const offers =
        applications.filter(function(application) {

            return application.status === "Offer";

        }).length;

    const rejected =
        applications.filter(function(application) {

            return application.status === "Rejected";

        }).length;


    interviewCount.textContent = interviews;

    offerCount.textContent = offers;

    rejectedCount.textContent = rejected;

}


// Display saved applications when page loads
displayApplications();