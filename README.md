# Hub Apps

## Overview

Hub Apps is a simple and efficient application that allows users to organize and manage various files in one place. Users can add any type of file to the hub, rename files directly, change file icons, and remove them as needed. The application ensures quick access to frequently used files, improving workflow efficiency.

## Features

- Add any type of file to the hub for easy access.
- Change the file icon by selecting a custom image.
- Rename files directly by clicking on the file name.
- Remove files from the hub with a confirmation prompt.

## Technologies Used

- **Electron.js** – For building the desktop application.
- **HTML, CSS, JavaScript** – For the frontend interface.
- **Node.js** – For handling file operations.

## Installation

1. Clone this repository:
   ```sh
   git clone https://github.com/kauanty/hub-apps.git
   ```
2. Navigate to the project directory:
   ```sh
   cd hub-apps
   ```
3. Install dependencies:
   ```sh
   npm install
   ```
<br>

![imagem_2025-03-10_152508075](https://github.com/user-attachments/assets/eba07d63-fad2-4413-8917-dbaafc999d32)


<br>

## Usage

1. Start the application:
   ```sh
   npm start
   ```
2. Add files by selecting them through the interface.
3. Rename files by clicking on their names.
4. Change file icons by hovering over the image and selecting a new one.
5. Remove files with the delete button (confirmation required).

## Packaging the Application

To create an executable version of the application:

```sh
npm run package
```

This will generate a standalone executable file that can be used without requiring additional dependencies.
