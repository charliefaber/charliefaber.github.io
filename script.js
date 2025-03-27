// Simulated file system
const fileSystem = {
  "about.txt": "About Me:\nAs a highly motivated Software Engineer, I am currently dedicated to simplifying wedding planning for couples globally at The Knot Worldwide. With a Bachelor's in Computer Science and multiple Salesforce certifications, pursuing a Master's in Computer Science with a focus on Machine Learning excites me. I aim to leverage cutting-edge technologies and develop intelligent systems that drive positive global impact.",
  "resume": {
    "education.txt": "Education:\n- Bachelor of Science in Computer Science, Georgia College & State University, Milledgeville, GA – 2017\n- Master of Science in Computer Science, Georgia Institute of Technology, Atlanta, GA – Expected Graduation December 2026",
    "certifications.txt": "Certifications:\n- Salesforce Platform Developer I\n- Salesforce Platform Developer II\n- Salesforce Application Architect\n- Salesforce Sharing & Visibility Designer\n- Salesforce Database Management and Architecture Designer\n- Salesforce CPQ Specialist\n- Salesforce Platform App Builder\n- Salesforce Administrator\n- Salesforce Certified Associate",
    "experience.txt": "Professional Experience:\nLead Software Engineer at The Knot Worldwide (Nov 2021 – Present)\nSenior Salesforce Developer at Cognizant (Nov 2019 – Nov 2021)\nSalesforce Developer at IBM (Nov 2017 – Nov 2019)"
  },
  "blog": {
    "post1.txt": "Introducing Myself: The Journey Behind This Website\nDate: March 25, 2025\nHello and welcome! I’m Charlie Faber, a dedicated Software Engineer with experience at The Knot Worldwide, Cognizant, and IBM. This website was created to share my professional journey, technical insights, and passion for innovative technology.",
    "post2.txt": "Top 5 VS Code Extensions I Use Daily\nDate: March 20, 2025\nIn my day-to-day development work, having the right tools can make all the difference. Here are my top 5 VS Code extensions that I use daily..."
  },
  "contact.txt": "Contact:\nPhone: 404-542-5773\nEmail: charliefaber@gmail.com\nAddress: 1065 United Ave SE Unit 203, Atlanta, GA 30316\nGitHub: https://github.com/charliefaber"
};

// Terminal root will display as "C:\Faber>"
let currentPath = ["C:", "Faber"];
let currentDir = fileSystem;

// DOM elements
const outputDiv = document.getElementById("output");
const commandInput = document.getElementById("commandInput");
const promptSpan = document.getElementById("prompt");
const customCaret = document.getElementById("customCaret");
const terminal = document.getElementById("terminal");

// Update the prompt text using Windows-style backslashes.
function updatePrompt() {
  promptSpan.textContent = currentPath.join("\\") + ">";
}

// Calculate text width of the commandInput and position caret horizontally.
function updateCaretPosition() {
  // Create a temporary span to measure text width
  const measurer = document.createElement("span");
  measurer.style.visibility = "hidden";
  measurer.style.whiteSpace = "pre";
  measurer.style.fontFamily = getComputedStyle(commandInput).fontFamily;
  measurer.style.fontSize = getComputedStyle(commandInput).fontSize;
  measurer.textContent = commandInput.innerText;
  document.body.appendChild(measurer);

  const width = measurer.getBoundingClientRect().width;
  document.body.removeChild(measurer);

  // Position caret relative to .input-line
  const inputLineRect = document.querySelector(".input-line").getBoundingClientRect();
  const commandInputRect = commandInput.getBoundingClientRect();

  // The left edge of .command-input relative to .input-line
  const offsetLeftInLine = commandInputRect.left - inputLineRect.left;

  customCaret.style.left = (offsetLeftInLine + width) + "px";
}

// Print a line to the terminal output
function printLine(text) {
  const line = document.createElement("div");
  line.className = "line";
  line.textContent = text;
  outputDiv.appendChild(line);
  outputDiv.scrollTop = outputDiv.scrollHeight;
}

function clearOutput() {
  outputDiv.innerHTML = "";
}

// Helper to get a directory object from the file system based on currentPath array
function getDirectory(pathArray) {
  let dir = fileSystem;
  for (let i = 2; i < pathArray.length; i++) {
    const part = pathArray[i];
    if (dir[part] && typeof dir[part] === "object") {
      dir = dir[part];
    } else {
      return null;
    }
  }
  return dir;
}

function handleCommand(input) {
  const args = input.trim().split(" ");
  const command = args[0].toLowerCase();

  switch (command) {
    case "help":
      printLine("Available commands: help, ls, cd, cat, clear, bypass");
      break;
    case "ls":
      if (typeof currentDir === "object") {
        const entries = Object.keys(currentDir);
        printLine(entries.join("  "));
      } else {
        printLine("Not a directory.");
      }
      break;
    case "cd":
      if (args.length < 2) {
        printLine("Usage: cd [directory]");
      } else {
        const dirName = args[1];
        if (dirName === "..") {
          if (currentPath.length > 2) {
            currentPath.pop();
            currentDir = getDirectory(currentPath);
          } else {
            printLine("Already at root directory.");
          }
        } else if (currentDir[dirName] && typeof currentDir[dirName] === "object") {
          currentPath.push(dirName);
          currentDir = currentDir[dirName];
        } else {
          printLine("Directory not found: " + dirName);
        }
      }
      break;
    case "cat":
      if (args.length < 2) {
        printLine("Usage: cat [filename]");
      } else {
        const fileName = args[1];
        if (currentDir[fileName] && typeof currentDir[fileName] === "string") {
          printLine(currentDir[fileName]);
        } else {
          printLine("File not found: " + fileName);
        }
      }
      break;
    case "clear":
      clearOutput();
      break;
    case "bypass":
      bypassTerminal();
      break;
    default:
      printLine("Command not recognized. Type 'help' for a list of commands.");
  }
}

// Process Enter key to run commands
commandInput.addEventListener("keydown", function(e) {
  if (e.key === "Enter") {
    e.preventDefault(); // Prevent newline insertion
    const input = commandInput.innerText;
    printLine(currentPath.join("\\") + ">" + " " + input);
    handleCommand(input);
    commandInput.innerText = "";
    updatePrompt();
    updateCaretPosition();
  }
});

// Update caret position on every input
commandInput.addEventListener("input", updateCaretPosition);

// On page load, print initial lines and position caret
document.addEventListener("DOMContentLoaded", function() {
  printLine("Terminal Portfolio [Version 1.0]")
  printLine("(c) Charlie Faber. All rights reserved.")
  printLine(" ")
  updatePrompt();
  updateCaretPosition();
  // Focus the command input on load
  commandInput.focus();
});

// Click anywhere on the page (except the bypass button) to focus commandInput
document.addEventListener("click", function(e) {
  // If the terminal is still visible and user didn't click the bypass button, focus input
  if (terminal.style.display !== "none" && !e.target.closest(".bypass-button")) {
    commandInput.focus();
  }
});

// Bypass Terminal: Hide the terminal interface and display the full site
function bypassTerminal() {
  document.getElementById("terminal").style.display = "none";
  document.getElementById("fullsite").style.display = "block";
}

// Expose bypassTerminal to the global scope
window.bypassTerminal = bypassTerminal;
