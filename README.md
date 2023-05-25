
# ![logo](https://github.com/sopra-fs23-group-32/SoPra23_Client/blob/readme_branch/images/city_logo.png?raw=true) SoPra FS23 - Guess the City Client 
<p align="center">
	<img src="https://img.shields.io/github/issues-raw/sopra-fs23-group-32/SoPra23_Client"/>
	<img src="https://img.shields.io/github/milestones/progress/sopra-fs23-group-32/SoPra23_Client/1"/>
	<img src="https://img.shields.io/github/milestones/progress/sopra-fs23-group-32/SoPra23_Client/2"/>
	<img src="https://sonarcloud.io/api/project_badges/measure?project=sopra-fs23-group-32_SoPra23_Client&metric=vulnerabilities"/>
	<img src="https://sonarcloud.io/api/project_badges/measure?project=sopra-fs23-group-32_SoPra23_Client&metric=code_smells"/>
	<img src="https://img.shields.io/github/license/sopra-fs23-group-32/SoPra23_Client"/>
</p>

## Introduction
This app is a game called “Guess the City”. It is a captivating game that invites players to discover the cityscapes around the world by identifying corresponding city name from multiple-choice options.
The game not only serves as a source of entertainment but also offers an opportunity for players to enhance their geography knowledge. As players immerse themselves in the game, they embark on a virtual journey across continents, exploring the diverse landscapes and architectual marvels that cities have to offer.
To cater to different preferences and gaming experiences, the game offers two modes: Singleplayer Mode and Multiplayer Mode. The Singleplayer Mode is for practice, enabling players to improve their accuracy in identifying cities without the pressure of competition.
The Multiplayer Mode provides a platform for friendly competition, where players have the opportunity to challenge their friends and compete against each other.

## Technologies
- [Gradle](https://gradle.org/) - Dependency Management
- [Spring Boot](https://spring.io/) - Application Framework
- [React](https://reactjs.org/) - Front-end JavaScript Library
- [npm](https://www.npmjs.com/) - Package manger for the JavaScript programming language
- [Google Cloud Platform](https://cloud.google.com/) - Depolyment Service
- [SonarCloud](https://sonarcloud.io/welcome) - Cloud-based code quality and security service

**<span style="color:red">Note: Please use the "https" protocol for correct connection!</span>**

## High-level Components
### [Dashboard](https://github.com/sopra-fs23-group-32/SoPra23_Client/blob/main/src/components/views/home/Home.js)
The dashboard contains the menu that guides players to the main services provided by the game. The buttons within the menu include:

- **[Start Singlplayer Game](https://github.com/sopra-fs23-group-32/SoPra23_Client/blob/main/src/components/views/game/SinglePlayerGame/SinglePlayerGameLobby.js)**

   The player will be guided to the singleplayer game lobby to configure the game setting.

- **[Create Multiplayer Game](https://github.com/sopra-fs23-group-32/SoPra23_Client/blob/main/src/components/views/game/MultiPlayerGame/MultiPlayerGameLobby.js)**
  
   The player will be guided to the multiplayer game lobby to configure the game setting.

- **[Join Multiplayer Game](https://github.com/sopra-fs23-group-32/SoPra23_Client/blob/main/src/components/views/game/JoinGame.js)**

   The player will be guided to the page where a list of game rooms is displayed, and the player can choose a game to join.

- **[Leaderboard](https://github.com/sopra-fs23-group-32/SoPra23_Client/blob/main/src/components/views/home/ScoreBoard.js)**

  The player will be guided to the leader board, where the player rankings are displayed, and the player can specify the city category to show ranking at different continents.

- **[Game History](https://github.com/sopra-fs23-group-32/SoPra23_Client/blob/main/src/components/views/userinfo/History.js)**
  
  The player will be guided to the game history, where the detailed game information, such correct rate and previous answers, can be accessed.

- **[My Profile](https://github.com/sopra-fs23-group-32/SoPra23_Client/blob/main/src/components/views/userinfo/Profile.js)**

  The player will be guided the profile, where the profile can be viewed and edited.

- **[About](https://github.com/sopra-fs23-group-32/SoPra23_Client/blob/main/src/components/views/home/About.js)**

  The player will be guided to the about page, where the introduction and rule of the game are displayed.

### [Multiplayer Game](https://github.com/sopra-fs23-group-32/SoPra23_Client/tree/main/src/components/views/game/MultiPlayerGame)
The multiplayer game provides a battle mode for players. The main components of this mode include:
- **[CreatedGamePage](https://github.com/sopra-fs23-group-32/SoPra23_Client/blob/main/src/components/views/game/MultiPlayerGame/CreatedGamePage.js)**
  
  The player can wait other players to join the game.

- **[MultiplayerGamePage](https://github.com/sopra-fs23-group-32/SoPra23_Client/blob/main/src/components/views/game/MultiPlayerGame/MultiPlayerGamePage.js)**

  The main component for players to play the game in the multiplayer mode, the players can choose the city name based on the city image.

- **[MultiPlayerGamePreparePage](https://github.com/sopra-fs23-group-32/SoPra23_Client/blob/main/src/components/views/game/MultiPlayerGame/MultiPlayerGamePreparePage.js)**

  The player is displayed with the player ranking and countdown time after each round.

- **[GameFinishPage](https://github.com/sopra-fs23-group-32/SoPra23_Client/blob/main/src/components/views/game/MultiPlayerGame/MultiPlayerGameFinishPage.js)**

  The player is displayed with final player ranking, and the winner is announced.

### [LeaderBoard](https://github.com/sopra-fs23-group-32/SoPra23_Client/blob/main/src/components/views/home/ScoreBoard.js)
The player can check the player ranking. With a dropdown field, the player can choose the general or specific continent in a dropdown field to access player ranking. Moreover, the profiles of other players can be accessed by clicking the corresponding player row.


## Launch & Deployment
### Prerequisites and Installation
For your local development environment, you will need Node.js. You can download it [here](https://nodejs.org). All other dependencies, including React, get installed with:

```npm install```

Run this command before you start your application for the first time. Next, you can start the app with:

```npm run dev```

Now you can open [http://localhost:3000](http://localhost:3000) to view it in the browser.

Notice that the page will reload if you make any edits. You will also see any lint errors in the console (use Google Chrome).
### Testing
Testing is optional, and you can run the tests with `npm run test`.
This launches the test runner in an interactive watch mode. See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

> For macOS user running into a 'fsevents' error: https://github.com/jest-community/vscode-jest/issues/423

### Build
Finally, `npm run build` builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance: the build is minified, and the filenames include hashes.<br>

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### External Dependencies
- [Unsplash API](https://unsplash.com/developers) - City images API.
- [sockjs-client](https://github.com/sockjs) -  Browser JavaScript library that provides a WebSocket-like object, communicating between the browser and the web server.
- [stompjs](https://www.npmjs.com/package/@stomp/stompjs) - npm package that provides a STOMP over WebSocket client for Web browser and node.js applications.
- [react-toggle](https://www.npmjs.com/package/react-toggle) - npm package for toggle component.
- [react-toastify](https://www.npmjs.com/package/react-toastify) - npm package for notifications.
- [react-countdown-circle-timer](https://www.npmjs.com/package/react-countdown-circle-timer) - npm package for countdown timer.

## Illustrations
1. Login/Register the game and enter the game dashboard.
   ![image](.//images/illustrations/login.png)
   ![image](.//images/illustrations/registration.png)
2. Enter the dashboard upon successful login/registration.
   ![image](.//images/illustrations/dashboard.png)
3. Start the Singleplayer game by completing the game setting in the lobby.
   ![image](.//images/illustrations/single_lobby.png)
   1. Wait for the game to start in the prepare page.
      ![image](.//images/illustrations/single_prepare.png)
   2. Enter the final page, where the final score is shown. Note: In the Singleplayer mode, the player can practice, but the scores won by the player will not be stored.
      ![image](.//images/illustrations/single_finish.png)
4. Start Multiplayer game by creating or joining the game.
   1. Create Multiplayer game in the lobby.
      ![image](.//images/illustrations/multi_lobby.png)
   2. Join Multiplayer game in the joining room.
      ![image](.//images/illustrations/join_game.png)
   3. Play the game. Players need to select the correct city name from four options within 15 secs to win scores.
      ![image](.//images/illustrations/game_page.png)
   4. Wait for the game to start and check the updated leaderboard after each round.
      ![image](.//images/illustrations/multi_prepare.png)
   5. Enter the final page, where the final leaderboard and the winner(s) are displayed.
      ![image](.//images/illustrations/multi_finish.png)
5. Access the Leaderboard to obtain the general or specific player ranking by selecting the city category. The player profile can be accessed by clicking the player.
   ![image](.//images/illustrations/leaderboard.png)
6. Access the Game History to obtain the statistics for each game played by the player. Click the triangle to unfold detailed information.
   ![image](.//images/illustrations/history.png)
7. Edit the profile.
   ![image](.//images/illustrations/profile.png)
8. Check the game instruction and rule.
   ![image](.//images/illustrations/about.png)

## Roadmap
![image](.//images/illustrations/roadmap.png)
- **Difficulty Level**

   Implement difficulty levels that offer varying levels of challenge to players. For example, there can be easy, medium, and hard modes where the hints of images are progressively more limited. This feature would require designing new image sets and adjusting scoring mechanisms.

- **Social Integration**

  Allow players to connect their social media accounts to the game. This feature would require new developers to integrate social media sharing APIs.

- **Unlockable Content**

   Add a progressive map where players can unlock new cities. This feature involves tracking player achievements, integrating the global map and providing rewards for new milestones.

- **Game Booster**

  Allow players to use a certain number of boosters to get hints during the game. This feature requires to add an endpoint to provide hints for city images in the server side and design of boosters in the client side.

- **More Game Modes**

   Add game modes like Time Attack mode where players have to guess as many cities as possible within a given time limit. This feature involves 

Please check [Sprint 3 (Future Work) User Stories](https://github.com/orgs/sopra-fs23-group-32/projects/1/views/18) and [Sprint 3 (Future Work) Tasks](https://github.com/orgs/sopra-fs23-group-32/projects/1/views/17) for detailed information.

## Authors and Acknowledgment
### Authors
- Said-Haji Abukar - [awhoa](https://github.com/awhoa)
- Zilong Deng - [Dzl666](https://github.com/Dzl666)
- Jano-Sven Vukadinovic - [VukadinovicJS](https://github.com/VukadinovicJS)
- Dominic Vogel - [dominic1712](https://github.com/dominic1712)
- Leyi Xu - [leyixu21](https://github.com/leyixu21)
  
See also the list of [contributors](https://github.com/sopra-fs23-group-32/SoPra23_Client/graphs/contributors) who participated in this project.

### Acknowledgement
- The city images of this project are provided by [Unsplash API](https://unsplash.com/developers).
- Thanks to Luis Torrejón Machado - [luis-tm](https://github.com/luis-tm) who supports this project as a tutor.


## License
This project is licensed under the Apache License 2.0 - see the [LICENSE.md](https://github.com/sopra-fs23-group-32/SoPra23_Client/blob/main/LICENSE) file for details.