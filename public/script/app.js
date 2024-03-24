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
  var noteName = window.location.pathname.split("/")[1];
  // Check if the textarea is empty
  if (textToDownload.trim() === "") {
    alert("Textarea is empty. Please enter some text.");
    return;
  }

  // Create a Blob with the content
  const blob = new Blob([textToDownload], { type: 'text/plain' });

  // Create a link element to trigger the download
  var link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  link.download = `${noteName}_file.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
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
  //how to use it button
  const aboutBtn = document.getElementById("about");
  const aboutContainer = document.querySelector(".about-container");
  const aboutClose = document.getElementById("about-close-btn"); // Use querySelector to select the first element with the class
  aboutBtn.addEventListener("click", () => {
    aboutContainer.classList.toggle("close");
  });

  aboutClose.addEventListener("click", () => {
    aboutContainer.classList.toggle("close");
  })

  // contain indicator icon
  var saveIcon = document.getElementById("saveIcon");
  var loadingIcon = document.getElementById("loadingIcon");

  saveIcon.classList.toggle("open");

  var textarea = document.getElementById("text-input");
  var saveInterval;

  // Get the note name from the URL
  var noteName = window.location.pathname.split("/")[1];
  alert(noteName);
  if (!noteName) {
    noteName = generateRandomName();
  }else{
    alert(noteName);
  }
  window.history.pushState(null, null, `${noteName}`);


  // Autosave functionality
  textarea.addEventListener("input", function () {
    clearTimeout(saveInterval);
    saveInterval = setTimeout(function () {
      toggleIcons();
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
        } else {
          toggleIcons();
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  function toggleIcons() {
    saveIcon.classList.toggle("open");
    loadingIcon.classList.toggle("open");
  }
});
