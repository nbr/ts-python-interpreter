ts-python-interpreter
=====================
**_ts-python-interpreter_** is a Python .pyc interpreter written in TypeScript.
Dependencies
---
Requires node.js, npm, and the Unix shell commands echo and xargs
Building the Project
---
```
git clone https://github.com/nbraga/ts-python-interpreter.git
cd ./ts-python-interpreter
npm install
npm run-script compile-amd
npm run-script optimize
```
Running the Project
---
```
npm start
```
Visit [http://localhost:8080](http://localhost:8080) in a browser.
View interpretation results in the browser's developer tools console.
Running Tests
---
To run our functional test programs, run (from the root of project directory):
```
npm run-script compile-loop
npm run-script loop
```
