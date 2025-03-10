// renderer.js

const { ipcRenderer } = require('electron');
const path = require('path');
const fs = require('fs');
const { shell } = require('electron');

document.addEventListener('DOMContentLoaded', () => {
    // Get references to UI elements
    const addAppBtn = document.getElementById('addAppBtn');
    const addFolderBtn = document.getElementById('addFolderBtn');
    const appList = document.getElementById('appList');
    const searchBar = document.getElementById('searchBar');

    let apps = []; // Array to store apps and folders

    // Event listener for adding an app
    addAppBtn.addEventListener('click', async () => {
        const results = await ipcRenderer.invoke('select-app');
        if (results && results.length > 0) {
            results.forEach(result => {
                const { filePath, iconPath, fileName, isDirectory } = result;
                // Use folder icon if it's a directory, otherwise use the provided icon
                const icon = isDirectory ? 'icons/folder-icon.png' : iconPath;
                apps.push({ name: fileName, path: filePath, icon });
            });
            saveApps();
            renderApps();
        }
    });

    // Event listener for adding a folder
    addFolderBtn.addEventListener('click', async () => {
        const results = await ipcRenderer.invoke('select-folder');
        if (results && results.length > 0) {
            results.forEach(result => {
                const { filePath, iconPath, fileName } = result;
                apps.push({ name: fileName, path: filePath, icon: iconPath });
            });
            saveApps();
            renderApps();
        }
    });

    // Event listener for the search bar
    searchBar.addEventListener('input', () => {
        renderApps();
    });

    // Handle click events inside the app list
    appList.addEventListener('click', async (event) => {
        const target = event.target;
        const index = target.dataset.index;

        if (target.classList.contains('pencil-icon')) {
            // Open file dialog to select a new icon
            const newIcon = await ipcRenderer.invoke('select-icon');
            if (newIcon && newIcon.length > 0) {
                const newIconPath = path.join('icons', path.basename(newIcon[0]));
                fs.copyFileSync(newIcon[0], newIconPath);
                apps[index].icon = newIconPath;
                saveApps();
                renderApps();
            }
        } else if (target.classList.contains('app-name-edit')) {
            // Enable inline editing of app name
            const appNameSpan = target;
            const currentName = appNameSpan.innerText;
            const input = document.createElement('input');
            input.type = 'text';
            input.value = currentName;
            input.className = 'app-name-input';
            input.dataset.index = index;

            // Save new name when user clicks outside or presses Enter
            input.addEventListener('blur', () => {
                const newName = input.value.trim();
                if (newName && newName !== currentName) {
                    apps[index].name = newName;
                    saveApps();
                    renderApps();
                }
            });

            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    input.blur();
                }
            });

            appNameSpan.innerHTML = '';
            appNameSpan.appendChild(input);
            input.focus();
        } else if (target.classList.contains('app-remove')) {
            // Confirm before removing an app
            if (confirm('Are you sure you want to remove this app??')) {
                apps.splice(index, 1);
                saveApps();
                renderApps();
            }
        } else if (target.classList.contains('app-open')) {
            // Open the selected app or folder
            const filePath = apps[index].path;
            shell.openPath(filePath)
                .then(() => {
                    console.log('File opened successfully');
                })
                .catch(err => {
                    console.error(`Error opening file: ${err}`);
                });
        }
    });

    // Save the apps list to a JSON file
    async function saveApps() {
        await ipcRenderer.invoke('save-apps', apps);
    }

    // Load saved apps from the JSON file
    async function loadApps() {
        apps = await ipcRenderer.invoke('load-apps');
        renderApps();
    }

    // Render the app list dynamically
    function renderApps() {
        const searchText = searchBar.value.toLowerCase();
        const filteredApps = apps.filter(app => app.name.toLowerCase().includes(searchText));

        appList.innerHTML = filteredApps
            .map((app, index) => `
                <div class="app-item">
                    <div class="icon-container">
                        <img 
                            src="${app.icon}" 
                            alt="${app.name}" 
                            class="app-icon"
                            data-index="${index}"
                            onerror="this.src='icons/default-icon.png'"
                        >
                        <div class="icon-overlay">
                            <img src="icons/edit-icon.png" class="pencil-icon" alt="Edit Icon" data-index="${index}">
                        </div>
                    </div>
                    <span 
                        class="app-name-edit" 
                        data-index="${index}"
                    >${app.name}</span>
                    <div class="button-container">
                        <button class="app-open" data-index="${index}">Open</button>
                        <button class="app-remove" data-index="${index}">Remove</button>
                    </div>
                </div>
            `)
            .join('');
    }

    // Load apps when the app starts
    loadApps();
});
