// main.js
// 

const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

let win; // Reference to the main application window

// Function to create the main application window
function createWindow() {
    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'), // Preload script for secure IPC communication
            nodeIntegration: true, // Allows using Node.js modules in renderer
            contextIsolation: false // Disables context isolation for easier access to Node.js
        }
    });

    win.loadFile('index.html'); // Loads the main HTML file
    win.setMenuBarVisibility(false); // Hides the default menu bar
}

// Runs the function when Electron is ready
app.on('ready', createWindow);

// Handles selecting one or multiple files
ipcMain.handle('select-app', async () => {
    const result = await dialog.showOpenDialog(win, {
        properties: ['openFile', 'multiSelections'], // Allows selecting multiple files
        filters: [
            { name: 'All Files', extensions: ['*'] } // No restriction on file types
        ]
    });

    // If files were selected, return their details; otherwise, return an empty array
    if (result.filePaths.length > 0) {
        return result.filePaths.map(filePath => {
            return {
                filePath,
                iconPath: path.join(__dirname, 'icons', 'default-icon.png'), // Default icon for files
                fileName: path.basename(filePath), // Extracts the file name from the path
                isDirectory: false // Indicates it's a file, not a folder
            };
        });
    }
    return [];
});

// Handles selecting a folder
ipcMain.handle('select-folder', async () => {
    const result = await dialog.showOpenDialog(win, {
        properties: ['openDirectory'] // Allows selecting only directories
    });

    // If a folder was selected, return its details; otherwise, return an empty array
    if (result.filePaths.length > 0) {
        return result.filePaths.map(folderPath => {
            return {
                filePath: folderPath,
                iconPath: path.join(__dirname, 'icons', 'folder-icon.png'), // Default folder icon
                fileName: path.basename(folderPath), // Extracts folder name from path
                isDirectory: true // Indicates it's a folder
            };
        });
    }
    return [];
});

// Handles selecting an icon image for an application
ipcMain.handle('select-icon', async () => {
    const result = await dialog.showOpenDialog(win, {
        properties: ['openFile'], // Only allows selecting files
        filters: [{ name: 'Images', extensions: ['png', 'jpg', 'ico'] }] // Restricts selection to image formats
    });
    return result.filePaths; // Returns the selected file path(s)
});

// Handles saving the list of applications to a JSON file
ipcMain.handle('save-apps', async (event, apps) => {
    fs.writeFileSync('apps.json', JSON.stringify(apps)); // Writes app data to apps.json
});

// Handles loading the list of applications from the JSON file
ipcMain.handle('load-apps', async () => {
    if (fs.existsSync('apps.json')) { // Checks if the file exists
        const data = fs.readFileSync('apps.json'); // Reads the file
        return JSON.parse(data); // Parses and returns the JSON data
    }
    return []; // If the file doesn't exist, return an empty array
});
