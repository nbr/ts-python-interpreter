ts-python-interpreter
=====================
**_ts-python-interpreter_** is a Python .pyc interpreter written in TypeScript.
Dependencies
---
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
Running Tests
---
To run our functional test programs, run (from the root of project directory):
```
npm run-script compile-loop
npm run-script loop
```
