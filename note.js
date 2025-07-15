const addButton = document.getElementById("add-btn");
const notewrapper = document.getElementById("notewrapper");

addButton.addEventListener("click", function () {
  const note = addANote();
  if (note) {
    note.addEventListener("click", function () {
      openNote(note); // Pass the note
    });
  }
});

function addANote() {
  const noteTitle = document.getElementById("title-area").value.trim();
  const noteBody = document.getElementById("take-a-note-textarea").value;
  const noteColor = document.getElementById("note-color").value; // Get selected color
  //check if the note is empty
  if (noteBody === "") {
    return;
  }
  //create note div
  const note = document.createElement("div");
  note.classList.add("note");
  note.setAttribute("tabindex", "0");
  note.style.backgroundColor = noteColor;
  note.style.borderColor = noteColor;
  //create h3 element for title
  const titleElement = document.createElement("h3");
  titleElement.textContent = noteTitle;

  const contentDiv = document.createElement("div");
  contentDiv.classList.add("note-content");

  //create p element for notebody
  const bodyElement = document.createElement("p");
  bodyElement.innerHTML = noteBody
    .replace(/\n/g, "<br>")
    .replace(/ /g, "&nbsp;"); // <-- Fix here
  //add (append) titleElement and bodyElement to note div
  note.appendChild(titleElement);
  contentDiv.appendChild(bodyElement);
  note.appendChild(contentDiv);
  //add note div to notewrapper div
  notewrapper.appendChild(note);
  //make the title and note taking area clear
  document.getElementById("title-area").value = "";
  document.getElementById("take-a-note-textarea").value = "";

  return note;
}

function openNote(originalNote) {
  const rect = originalNote.getBoundingClientRect();

  // Clone the note
  const clone = originalNote.cloneNode(true);
  clone.classList.add("note-clone");

  // Make title and content editable
  const titleElement = clone.querySelector("h3");
  const contentElement = clone.querySelector(".note-content p"); // Adjust selector as needed

  titleElement.contentEditable = true; // Enable editing
  contentElement.contentEditable = true;

  // Set initial position and size to match the original
  clone.style.top = `${rect.top}px`;
  clone.style.left = `${rect.left}px`;
  clone.style.width = `${rect.width}px`;
  clone.style.height = `${rect.height}px`;

  document.body.appendChild(clone);
  originalNote.style.visibility = "hidden"; // Hide original

  const backdrop = document.getElementById("backdrop");
  backdrop.style.display = "block";
  void backdrop.offsetWidth; // force reflow for transition
  backdrop.classList.add("visible");

  // Force reflow before animating
  void clone.offsetWidth;

  // Animate to center
  setTimeout(() => {
    clone.style.top = "50%";
    clone.style.left = "50%";
    clone.style.transform = "translate(-50%, -50%)";
    clone.style.width = "500px";
    clone.style.height = "350px";
  }, 10);

  // Close on backdrop click
  backdrop.onclick = () => {
    // Update original note with edited content
    originalNote.querySelector("h3").textContent = titleElement.textContent;
    originalNote.querySelector(".note-content p").innerHTML =
      contentElement.innerHTML.replace(/\n/g, "<br>");
    clone.style.top = `${rect.top}px`;
    clone.style.left = `${rect.left}px`;
    clone.style.transform = "none";
    clone.style.width = `${rect.width}px`;
    clone.style.height = `${rect.height}px`;
    backdrop.classList.remove("visible");

    // Wait for animation to complete
    setTimeout(() => {
      clone.remove();
      originalNote.style.visibility = "visible";
      backdrop.style.display = "none";
    }, 400);
  };
}
