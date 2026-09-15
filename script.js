
// ==========================================
// TASKMATE - STUDENT TASK MANAGER
// ==========================================


// ==========================================
// 1. VARIABLES
// ==========================================

let tasks = JSON.parse(localStorage.getItem("taskMateTasks")) || [];
let notes = JSON.parse(localStorage.getItem("taskMateNotes")) || [];


// ==========================================
// 2. NAVIGATION
// ==========================================

function showSection(sectionId) {

    const sections = document.querySelectorAll(".page");

    sections.forEach(section => {
        section.classList.remove("active");
    });

    const selectedSection = document.getElementById(sectionId);

    if (selectedSection) {
        selectedSection.classList.add("active");
    }

    // Scroll to the selected section
    selectedSection.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}


// ==========================================
// 3. LIVE CLOCK
// ==========================================

function updateClock() {

    const clock = document.getElementById("clock");

    const now = new Date();

    const time = now.toLocaleTimeString();

    const date = now.toLocaleDateString(undefined, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    });

    clock.innerHTML = `${date}<br>${time}`;
}

setInterval(updateClock, 1000);

updateClock();


// ==========================================
// 4. ADD TASK
// ==========================================

function addTask() {

    const taskInput = document.getElementById("taskInput");
    const taskDate = document.getElementById("taskDate");
    const priority = document.getElementById("priority");

    const taskName = taskInput.value.trim();
    const date = taskDate.value;
    const taskPriority = priority.value;

    if (taskName === "") {
        alert("Please enter a task.");
        taskInput.focus();
        return;
    }

    if (date === "") {
        alert("Please select a deadline.");
        taskDate.focus();
        return;
    }

    const task = {

        id: Date.now(),

        name: taskName,

        date: date,

        priority: taskPriority,

        completed: false,

        reminderSent: false

    };

    tasks.push(task);

    saveTasks();

    taskInput.value = "";
    taskDate.value = "";
    priority.value = "Low";

    displayTasks();

    updateDashboard();

    alert("Task added successfully!");
}


// ==========================================
// 5. DISPLAY TASKS
// ==========================================

function displayTasks(taskArray = tasks) {

    const taskList = document.getElementById("taskList");

    taskList.innerHTML = "";

    if (taskArray.length === 0) {

        taskList.innerHTML = `
            <li>
                <span>No tasks found.</span>
            </li>
        `;

        return;
    }

    taskArray.forEach(task => {

        const li = document.createElement("li");

        const taskInfo = document.createElement("div");

        const taskTitle = document.createElement("strong");

        taskTitle.textContent = task.name;

        if (task.completed) {
            taskTitle.style.textDecoration = "line-through";
            taskTitle.style.opacity = "0.6";
        }

        const taskDetails = document.createElement("div");

        taskDetails.style.marginTop = "8px";

        taskDetails.innerHTML = `
            📅 Due: ${formatDate(task.date)}
            <br>
            ⚡ Priority: ${task.priority}
        `;

        taskInfo.appendChild(taskTitle);

        taskInfo.appendChild(taskDetails);


        // Buttons container

        const buttons = document.createElement("div");

        buttons.style.marginTop = "10px";


        // Complete button

        const completeButton = document.createElement("button");

        completeButton.textContent = task.completed
            ? "↩ Undo"
            : "✅ Complete";

        completeButton.style.marginRight = "5px";

        completeButton.onclick = function () {
            toggleTask(task.id);
        };


        // Delete button

        const deleteButton = document.createElement("button");

        deleteButton.textContent = "🗑️ Delete";

        deleteButton.onclick = function () {
            deleteTask(task.id);
        };


        buttons.appendChild(completeButton);

        buttons.appendChild(deleteButton);

        li.appendChild(taskInfo);

        li.appendChild(buttons);

        taskList.appendChild(li);

    });
}


// ==========================================
// 6. FORMAT DATE
// ==========================================

function formatDate(dateString) {

    if (!dateString) {
        return "No deadline";
    }

    const date = new Date(dateString + "T00:00:00");

    return date.toLocaleDateString(undefined, {
        day: "numeric",
        month: "short",
        year: "numeric"
    });
}


// ==========================================
// 7. COMPLETE / UNCOMPLETE TASK
// ==========================================

function toggleTask(id) {

    tasks = tasks.map(task => {

        if (task.id === id) {

            return {
                ...task,
                completed: !task.completed
            };

        }

        return task;

    });

    saveTasks();

    displayTasks();

    updateDashboard();
}


// ==========================================
// 8. DELETE TASK
// ==========================================

function deleteTask(id) {

    const task = tasks.find(task => task.id === id);

    if (!task) {
        return;
    }

    const confirmation = confirm(
        `Delete "${task.name}"?`
    );

    if (!confirmation) {
        return;
    }

    tasks = tasks.filter(task => task.id !== id);

    saveTasks();

    displayTasks();

    updateDashboard();
}


// ==========================================
// 9. SEARCH TASKS
// ==========================================

function searchTask() {

    const searchInput =
        document.getElementById("searchTask");

    const searchValue =
        searchInput.value.toLowerCase().trim();

    const filteredTasks = tasks.filter(task =>

        task.name.toLowerCase().includes(searchValue) ||

        task.priority.toLowerCase().includes(searchValue)

    );

    displayTasks(filteredTasks);
}


// ==========================================
// 10. SAVE TASKS
// ==========================================

function saveTasks() {

    localStorage.setItem(
        "taskMateTasks",
        JSON.stringify(tasks)
    );
}


// ==========================================
// 11. DASHBOARD
// ==========================================

function updateDashboard() {

    const totalTasks =
        document.getElementById("totalTasks");

    const completedTasks =
        document.getElementById("completedTasks");

    const pendingTasks =
        document.getElementById("pendingTasks");

    const totalNotes =
        document.getElementById("totalNotes");


    const completed =
        tasks.filter(task => task.completed).length;

    const pending =
        tasks.filter(task => !task.completed).length;


    totalTasks.textContent = tasks.length;

    completedTasks.textContent = completed;

    pendingTasks.textContent = pending;

    totalNotes.textContent = notes.length;
}


// ==========================================
// 12. ADD NOTE
// ==========================================

function addNote() {

    const titleInput =
        document.getElementById("noteTitle");

    const contentInput =
        document.getElementById("noteContent");


    const title =
        titleInput.value.trim();

    const content =
        contentInput.value.trim();


    if (title === "") {

        alert("Please enter a note title.");

        titleInput.focus();

        return;
    }


    if (content === "") {

        alert("Please write something in your note.");

        contentInput.focus();

        return;
    }


    const note = {

        id: Date.now(),

        title: title,

        content: content,

        date: new Date().toLocaleDateString()

    };


    notes.push(note);

    saveNotes();

    titleInput.value = "";

    contentInput.value = "";

    displayNotes();

    updateDashboard();

    alert("Note saved successfully!");
}


// ==========================================
// 13. DISPLAY NOTES
// ==========================================

function displayNotes() {

    const notesContainer =
        document.getElementById("notesContainer");


    notesContainer.innerHTML = "";


    if (notes.length === 0) {

        notesContainer.innerHTML =
            "<p>No notes saved yet.</p>";

        return;
    }


    notes.forEach(note => {

        const noteDiv =
            document.createElement("div");

        noteDiv.className = "note";


        const title =
            document.createElement("h3");

        title.textContent = note.title;


        const content =
            document.createElement("p");

        content.textContent = note.content;

        content.style.whiteSpace = "pre-wrap";

        content.style.marginTop = "10px";


        const date =
            document.createElement("small");

        date.textContent =
            `Created: ${note.date}`;


        const deleteButton =
            document.createElement("button");

        deleteButton.textContent =
            "🗑️ Delete Note";

        deleteButton.style.marginTop = "15px";


        deleteButton.onclick = function () {

            deleteNote(note.id);

        };


        noteDiv.appendChild(title);

        noteDiv.appendChild(content);

        noteDiv.appendChild(date);

        noteDiv.appendChild(
            document.createElement("br")
        );

        noteDiv.appendChild(deleteButton);


        notesContainer.appendChild(noteDiv);

    });
}


// ==========================================
// 14. DELETE NOTE
// ==========================================

function deleteNote(id) {

    const confirmation =
        confirm("Delete this note?");


    if (!confirmation) {
        return;
    }


    notes =
        notes.filter(note => note.id !== id);


    saveNotes();

    displayNotes();

    updateDashboard();
}


// ==========================================
// 15. SAVE NOTES
// ==========================================

function saveNotes() {

    localStorage.setItem(
        "taskMateNotes",
        JSON.stringify(notes)
    );
}


// ==========================================
// 16. CONTACT FORM
// ==========================================

const contactForm =
    document.getElementById("contactForm");


contactForm.addEventListener("submit", function(event) {

    event.preventDefault();


    const name =
        document.getElementById("name").value.trim();

    const email =
        document.getElementById("email").value.trim();

    const message =
        document.getElementById("message").value.trim();


    if (
        name === "" ||
        email === "" ||
        message === ""
    ) {

        alert("Please complete all fields.");

        return;
    }


    alert(
        `Thank you, ${name}! Your message has been received.`
    );


    contactForm.reset();

});


// ==========================================
// 17. BROWSER NOTIFICATION PERMISSION
// ==========================================

function requestNotificationPermission() {

    if (!("Notification" in window)) {

        console.log(
            "This browser does not support notifications."
        );

        return;
    }


    if (Notification.permission === "default") {

        Notification.requestPermission()
            .then(permission => {

                if (permission === "granted") {

                    console.log(
                        "TaskMate notifications enabled."
                    );

                }

            });

    }

}


// ==========================================
// 18. SEND NOTIFICATION
// ==========================================

function sendNotification(title, message) {

    if (!("Notification" in window)) {
        return;
    }


    if (Notification.permission === "granted") {

        new Notification(title, {

            body: message,

            icon: "📚"

        });

    }
}


// ==========================================
// 19. CHECK TASK REMINDERS
// ==========================================

function checkReminders() {

    const today = new Date();

    today.setHours(0, 0, 0, 0);


    tasks.forEach(task => {

        if (task.completed) {
            return;
        }


        const deadline =
            new Date(task.date + "T00:00:00");

        deadline.setHours(0, 0, 0, 0);


        const difference =
            deadline.getTime() - today.getTime();


        const daysRemaining =
            Math.ceil(
                difference / (1000 * 60 * 60 * 24)
            );


        // Due today

        if (
            daysRemaining === 0 &&
            !task.reminderSent
        ) {

            sendNotification(
                "🔔 TaskMate Reminder",
                `"${task.name}" is due today!`
            );


            alert(
                `🔔 Reminder:\n"${task.name}" is due today!`
            );


            task.reminderSent = true;

            saveTasks();
        }


        // Due tomorrow

        else if (
            daysRemaining === 1 &&
            !task.reminderSent
        ) {

            sendNotification(
                "📚 TaskMate Reminder",
                `"${task.name}" is due tomorrow.`
            );


            task.reminderSent = true;

            saveTasks();
        }


        // Overdue

        else if (
            daysRemaining < 0 &&
            !task.reminderSent
        ) {

            sendNotification(
                "⚠️ TaskMate Overdue",
                `"${task.name}" is overdue.`
            );


            task.reminderSent = true;

            saveTasks();
        }

    });

}


// ==========================================
// 20. START APPLICATION
// ==========================================

function initializeTaskMate() {

    displayTasks();

    displayNotes();

    updateDashboard();

    updateClock();

    requestNotificationPermission();

    checkReminders();

}


// Run TaskMate

initializeTaskMate();


// Check reminders every minute

setInterval(checkReminders, 60000);


// ==========================================
// DARK / LIGHT MODE
// ==========================================

function toggleTheme() {

    const body = document.body;
    const themeButton = document.getElementById("themeToggle");

    body.classList.toggle("dark-mode");

    // Check current theme

    if (body.classList.contains("dark-mode")) {

        themeButton.textContent = "☀️ Light Mode";

        localStorage.setItem("taskMateTheme", "dark");

    } else {

        themeButton.textContent = "🌙 Dark Mode";

        localStorage.setItem("taskMateTheme", "light");

    }
}

function loadTheme() {

    const savedTheme =
        localStorage.getItem("taskMateTheme");

    const themeButton =
        document.getElementById("themeToggle");


    if (savedTheme === "dark") {

        document.body.classList.add("dark-mode");

        themeButton.textContent = "☀️ Light Mode";

    } else {

        document.body.classList.remove("dark-mode");

        themeButton.textContent = "🌙 Dark Mode";

    }
}


// Load theme when TaskMate starts

loadTheme();