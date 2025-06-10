import * as types from './types';

export const defaultFilesList: string[] = ['index.html', 'style.css', 'script.js'];

export const defaultFilesData: types.fileData[] = [
  {
    name: defaultFilesList[0],
    language: 'html',
    value: `<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>

<body>

  <!-- Cleaned Logo SVG -->
  <svg class="logo" viewBox="0 0 280 344" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill="#fff"
      d="M110.57 248.64c-22.7-21.25-45.06-42.09-67.31-63.06-11.73-11.06-23.32-22.26-34.87-33.51C-2.6 141.35-2.86 128 8.02 117.42 47.67 78.82 87.46 40.35 127.21 1.84c.46-.44 1.03-.77 2.47-1.84 12.52 13.66 25.06 27.34 37.1 40.47-4.44 4.76-10.06 11.31-16.21 17.33-22.69 22.2-45.56 44.22-68.34 66.32-7.89 7.66-7.97 13.48.11 21.07 19.38 18.19 38.85 36.29 58.37 54.33 7.53 6.96 7.75 12.42.32 19.64-10.01 9.72-20.05 19.4-30.46 29.48z" />
    <path fill="#fff"
      d="M150.02 343.95c-13.41-13.03-26.71-25.97-40.2-39.08 1.23-1.32 2.19-2.44 3.24-3.46 27.8-26.95 55.61-53.89 83.42-80.83 8.32-8.05 8.41-13.92-.01-21.79-19.54-18.27-39.14-36.47-58.77-54.63-6.52-6.04-6.76-12.11-.37-18.33 10.24-9.96 20.52-19.87 31.15-30.16 6.33 5.89 12.53 11.58 18.65 17.37 27.53 26.03 55.07 52.05 82.52 78.16 12.57 11.96 12.66 24.78.33 36.75-38.99 37.85-78.04 75.64-117.07 113.45-.82.79-1.71 1.51-2.89 2.55z" />
  </svg>

  <h1>Hello World 👋<br>Welcome to Hipex Pages!</h1>
  <p>This is a Hipex page that you can code and make your own.</p>
  <p>
    <cite>Built with ❤️ by Jay Soni</cite>
  </p>

  <!-- Button -->
  <button onclick="handleClick()">Do Something Cool 🚀</button>

  </body>
  </html>`,
  },
  {
    name: defaultFilesList[1],
    language: 'css',
    value: `* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Segoe UI', sans-serif;
  background-color: #0e0e10;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  min-height: 100vh;
}

svg.logo {
  width: 120px;
  height: auto;
  margin-bottom: 2rem;
  color: white;
}

h1 {
  font-size: 2.5rem;
  background: linear-gradient(90deg, #00f2fe, #4facfe);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 1rem;
}

p {
  font-size: 1.2rem;
  margin: 0.5rem 0;
  text-align: center;
  max-width: 600px;
}

cite {
  font-style: normal;
  color: #aaa;
}

.github-link {
  color: #00f2fe;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  transition: color 0.3s;
}

.github-link:hover {
  color: #4facfe;
}

.github-link svg {
  fill: currentColor;
}

button {
  margin-top: 2rem;
  background: linear-gradient(135deg, #00f2fe, #4facfe);
  border: none;
  color: #000;
  font-weight: bold;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

button:hover {
  transform: scale(1.05);
  box-shadow: 0 0 10px rgba(0, 242, 254, 0.6);
}
`,
  },
  {
    name: defaultFilesList[2],
    language: 'javascript',
    value: `console.log("Hello World");
function handleClick() {
    // You can replace this with any custom logic
    alert("🚨 Are you ready to make somthing cool?!");
}`,
  },
];

export const defaultActiveFile: types.fileData = {
  name: defaultFilesData[0].name,
  language: defaultFilesData[0].language,
  value: defaultFilesData[0].value,
};
