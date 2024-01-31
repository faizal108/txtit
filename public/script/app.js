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

function generateRandomName() {
  const length = 10;
  const characters =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let randomName = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomName += characters.charAt(randomIndex);
  }

  return randomName;
}

document.addEventListener("DOMContentLoaded", function () {
  var noteName = window.location.pathname.split("/")[1];

  if (!noteName) {
    noteName = generateRandomName();
    window.history.pushState(null, null, `/${noteName}`);
  }
  fetch(`/api/note/${noteName}`)
    .then((response) => response.json())
    .then((data) => {
      console.log(data.content);
      // Set the existing note content to the textarea
      document.getElementById("text-input").value = data.content;
    })
    .catch((error) => {
      console.error("Error fetching note content:", error);
    });

  // DONE
  // autosave functionality
  var textarea = document.getElementById("text-input");
  var saveInterval;

  textarea.addEventListener("input", function () {
    // Clear previous autosave timer
    clearTimeout(saveInterval);

    // Set a new autosave timer
    saveInterval = setTimeout(function () {
      saveContent(textarea.value);
    }, 2000); // Set the autosave interval in milliseconds (e.g., 2000ms = 2 seconds)
  });

  // DONE
  function saveContent(content) {
    // Make a POST request to save the content
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
        // Handle errors as needed
      });
  }
});
