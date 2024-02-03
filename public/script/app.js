function dropMenu() {
  var hamburger = document.getElementById("menu");
  var menuItems = document.getElementsByClassName("menu-item");
  var closeBtn = document.getElementById("close");

  hamburger.addEventListener("click", function () {
    for (var i = 0; i < menuItems.length; i++) {
      menuItems[i].style.display = "block";
    }
    hamburger.style.display = "none";
  });

  closeBtn.addEventListener("click", function () {
    for (var i = 0; i < menuItems.length; i++) {
      menuItems[i].style.display = "none";
    }
    hamburger.style.display = "block";
  });
}

function downloadText() {
  var textToDownload = document.getElementById("text-input").value;

  // Check if the textarea is empty
  if (textToDownload.trim() === "") {
    alert("Textarea is empty. Please enter some text.");
    return;
  }

  // Make a POST request to the server
  fetch("/api/download", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text: textToDownload }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.blob();
    })
    .then((blob) => {
      // Create a link element to trigger the download
      var link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = "textFile.txt";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    })
    .catch((error) => {
      console.error("Error:", error);
      // Handle errors as needed
    });
}

document.addEventListener("DOMContentLoaded", function () {
  var textarea = document.getElementById("text-input");
  var saveInterval;

  // Load note content based on the URL
  // loadNoteContent(noteName);

  // Autosave functionality
  textarea.addEventListener("input", function () {
    clearTimeout(saveInterval);
    saveInterval = setTimeout(function () {
      saveContent(textarea.value);
    }, 2000);
  });

  function saveContent(content) {
    fetch(`/api/save/${noteName}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: content }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        console.log("Content saved successfully");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  async function loadNoteContent(noteName) {
    try {
      const response = await fetch(`/api/note/${noteName}`);
      const data = await response.json();
      const noteContent = data.content;
      textarea.value = noteContent; // Update the textarea with the loaded content
    } catch (error) {
      console.error("Error loading note content:", error);
    }
  }
});