// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

// Todo: create a function to generate a unique task id
function generateTaskId() {
    return nextId++;

}

// Todo: create a function to create a task card
function createTaskCard(task) {
    return `
        <div class="task-card" id="task-${task.id}">
            <div class="task-title">${task.title}</div>
            <div class="task-description">${task.description}</div>
            <div class="task-due-date">${dayjs(task.duedate).format("MM, DD, YYY")}</div>
       
            <button class="btn btn-danger delete-task-btn"><i class="fas fa-trash"></i></button>
        </div>
    `;


}


// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    if (!taskList) {
        taskList = [];
    }
    $("#to-do-cards").empty(); // Clear existing task cards
    $("#in-progress-cards").empty();
    $("#done-cards").empty();

    taskList.forEach(task => {
        let laneId = task.status.toLowerCase().replace(' ', '-'); // Get lane ID based on task status
        console.log(laneId);
        $(`#${laneId}-cards`).append(createTaskCard(task)); // Append task card to appropriate lane
    });
    // Make task cards draggable
    $(".task-card").draggable({
        revert: true,
        revertDuration: 0
    });

}

// Todo: create a function to handle adding a new task
function handleAddTask(event){
    event.preventDefault();
    let title = $("#task-title").val();
    let description = $("#task-description").val();
    let duedate = $("#due-date").val();
    let status = "To Do"; // Initially, new tasks are added to "To Do" lane
    let taskId = generateTaskId();
    let newTask = {

        id: taskId,
        title: title,
        description: description,
        duedate: duedate,
        status: status
    };
    taskList.push(newTask);
    localStorage.setItem("nextId", nextId);
    localStorage.setItem("tasks", JSON.stringify(taskList));
    renderTaskList();
    $("#formModal").modal("hide"); // Hide the modal after adding task
    $("#add-task-form").trigger("reset"); // Reset form fields

}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){
    let taskId = $(event.target).closest(".task-card").attr("id").split("-")[1];
    let index = taskList.findIndex(task => task.id === parseInt(taskId));
    taskList.splice(index, 1);
    localStorage.setItem("tasks", JSON.stringify(taskList));
    renderTaskList();

}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    let taskId = ui.draggable.attr("id").split("-")[1];
    let newLane = $(event.target).closest(".lane").attr("id");
    let index = taskList.findIndex(task => task.id === parseInt(taskId));
    taskList[index].status = newLane.replace('-', ' ');
    localStorage.setItem("tasks", JSON.stringify(taskList));
    renderTaskList();

}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    renderTaskList();
    $("#add-task-form").submit(handleAddTask);
    $(document).on("click", ".delete-task-btn", handleDeleteTask); // Event delegation for dynamically created elements
    $(".lane .card-body").droppable({
        
        drop: handleDrop
    });
    $("#due-date").datepicker();


});
