# Microsoft Engage 2021, VideoPrism.io

A VideoCalling Website that allows multiple users to participate in a video chat in real-time. The website is deployed on Heroku and comprises Node.js, Socket.io, and Express on Back-end and uses React.js, Material-UI, Socket.io-Client, and Simple-Peer on the Front-end.

Link to the website: [VideoPrism.io](https://dry-coast-04578.herokuapp.com/)

## Features
1. **Main Page** - Allows User to either Start a new Meeting or Join an existing Meeting. In case a user tries to join a meeting that doesn't exist, the website creates a Room first and subsequently starts the meeting.

2. **User Design and Interface** - The entire website is designed using a feature-rich open-source library of Material-UI. All Icons and Customization have been made using this library. Dark Theme allows a stress-free user experience, and the entire website follows a fixed color scheme and typography.

3. **Chat Room** - Allows User to chat with each other simultaneously during a video call. User can send messages and emojis hassle-free, and each message shows which user has sent the message. Users can also send messages to each other after the video meeting has ended. This feature aligns with the Adopt Challenge provided on the Ace-Hacker Website.

4. **Toggle Video/Audio** - The users have a feature to mute and unmute themselves while at the same time also toggle their video settings. If a user turns their Camera Off, a block displaying the name of the user appears.

5. **Multiple Users in VideoCall** - A room can host upto 4 people in video call at any given point. The screen showing users video automatically judges the number of people in meeting to give optimum experience. All the above features exist for all users at the same time.

## Usage

1. Firstly, the Host starts a meeting by clicking on the new Call button on the Homepage. This takes the user to the meeting area.

2. The Host can then send the room name to all fellow clients that can enter the same meeting room by clicking on the join call button and entering the provided room name.

3. All clients will enter the meeting subsequently. It is advisable that the clients enter the room **one-by-one** and not together.

4. Voila, all the users are in the same room and can use the website how they may like.

## Run Website Locally

Clone the repository
> Enter the recently cloned repository and run:
```bash
npm install
```
> Now, change the directory to client folder:
```bash
cd client && npm install
```

This, sets up the website to be used on the LocalHost. To run the Website, follow the below steps:
> Enter the repository folder and run:
```bash
nodemon index.js
```
> change the directory to client folder and run:
```bash
npm start
```
Shortly, the website will be up and running locally on the System.

## Problems Faced
- Changing the app from one-to-one video call to multiple user involved changes on many levels. Not only did we have understand the concept of Rooms in Socket.io but also had to understand how to send Peer connections to multiple users at the same time.

## TODO List
1. Addition of concept of raising Hands as seen in Teams, Meet and Zoom.
2. Establishment of more reliable connection when connecting to users on different network
3. Introduction to screen sharing and pinning of one particular user to the screen.
4. Deployment of more control for user on their video and audio such as volume control and low bandwidth video signals to improve connection on slower connections.

## Known Bugs:
- If the Host leaves meeting before everyone, some clients tend to lose connection to other clients
- When running the website to connect with clients on different network, the connection sometimes fails and the user is unable to connect. However, **no such errors exists** if the users are on the same network or website is being hosted locally.
> Reason for this failure is still unknown 
[Link to this issue on simple-peer GitHub account](https://github.com/feross/simple-peer/issues/781)
