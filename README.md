
# Guess the City - Client

## Introduction
This app is a game called “Guess the City”. Players should choose the correct city from multiple choices based on the city image provided by the game.
The game aims to showcase the diverse landscapes of cities around the world while also fostering an increase in geography knowledge.

## Technologies
- [Gradle](https://gradle.org/) - Dependency Management
- [React](https://react.dev/) - Front-end JavaScript Library
- [Spring](https://spring.io/) - Application Framework
- [Google Cloud Platform](https://cloud.google.com/) - Depolyment Service

## High-level Components
- [MultiplayerGame](https://github.com/sopra-fs23-group-32/SoPra23_Client/tree/main/src/components/views/game/MultiPlayerGame) - A folder contains files for multiplayer mode.
  - CreatedGamePage - A file adds players before the game
  - MultiplayerGamePage - A file displays the city image, allows the player to choose the answer, and displays the score won by the player
  - MultiPlayerGamePreparePage - A file shows player ranking and countdown timer after each round
  - GameFinishPage - A file shows final player ranking and announces the winner(s)
- [ScoreBoard](https://github.com/sopra-fs23-group-32/SoPra23_Client/blob/main/src/components/views/home/ScoreBoard.js) - A file shows the user ranking in general or specific continent ranking, and also allows the user to access the profiles of other users.
- [Profile](https://github.com/sopra-fs23-group-32/SoPra23_Client/blob/main/src/components/views/home/Profile.js) - A file allows the user to check and edit his own profile.


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


## Illustrations
1. Login/Register the game and enter the game dashboard.
2. Start the game by completing the game settings in the lobby (game mode, continent category of city images, game rounds).
   1. In the Singleplayer mode, the player can practice, but the scores won by the player will not be stored.
   2. In the MultiPlayer mode, multiple players can join the game. Players need to choose the right city from four options based on the city image within 15 secs in each round.
   After each round, the player ranking will be updated. When the game ends, the final player ranking will be displayed and the winner(s) will be announced.
3. Access the Score Board to obtain the general or specific player ranking by selecting the city category. The player profile can be accessed by clicking the player.
4. Access the Game Statistics to obtain the detailed statistics for each game played by the player.
5. Edit the profile

## Roadmap
The top 2-3 features that new developers who want to contribute to your project
could add.


## Authors and Acknowledgment
### Authors
- Said-Haji Abukar - [awhoa](https://github.com/awhoa)
- Zilong Deng - [Zilong Deng](https://github.com/Dzl666)
- Jano-Sven Vukadinovic - [VukadinovicJS](https://github.com/VukadinovicJS)
- Dominic Vogel - [dominic1712](https://github.com/dominic1712)
- Leyi Xu - [leyixu21](https://github.com/leyixu21)
  
See also the list of [contributors](https://github.com/sopra-fs23-group-32/SoPra23_Client/graphs/contributors) who participated in this project.

### Acknowledgement
- City images provided by [Unsplash API](https://unsplash.com/developers).

## License
This project is licensed under the Apache License 2.0 - see the [LICENSE.md](https://github.com/sopra-fs23-group-32/SoPra23_Client/blob/main/LICENSE) file for details.