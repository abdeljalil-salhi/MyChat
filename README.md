# MyChat
Realtime Chat using socket.io (NodeJS + MongoDB)

**LOGIN PAGE**

![image](https://user-images.githubusercontent.com/65598953/95272809-49d84380-0839-11eb-8f45-6cc6debf3457.png)

**CHAT PAGE**

![image](https://user-images.githubusercontent.com/65598953/95273233-6aed6400-083a-11eb-83f7-66854c5a8605.png)

Instant Messaging Project, Realtime Chat using socket.io (Node.JS based) + MongoDB to store messages.

# Requirements
NodeJS -> [Download NodeJS][node]

MongoDB -> [Get MongoDB][mongo]

# Installation
  - Download the requirements (NodeJS + MongoDB)
  - Go to terminal
  - Open the project dir in terminal
  - Type the following commands:

```sh
$ npm init
$ npm install
$ npm install mongoose
```
**PS:** 
if you're under Windows, you can use the ```install.bat``` file.

# Configuration
The app runs at **PORT 8080** by default, you can change it in ```app.js``` - **line 7**.

Change the path in ```launchdb.bat``` to the path of ```mongod.exe``` present in the installation folder of MongoDB,
by default, it's ```Program Files/MongoDB/Server/3.0/bin/```.

If you're not under Windows, you have to open the ```mongod.exe```'s path and execute it in terminal each time you want to run the project.

Finally, you can use the ```start.bat``` file to run the app, or ```$ npm start``` in the terminal;
it must look like this:




[node]: <https://nodejs.org/en/download/>
[mongo]: <https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/>
