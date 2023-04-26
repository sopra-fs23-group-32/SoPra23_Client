class GameGetDTO {
    constructor(gameId, currentRound, totalRounds, countdownTime, currentAnswer, playerList) {
      this.gameId = gameId || null;
      this.currentRound = currentRound || null;
      this.totalRounds = totalRounds || null;
      this.countdownTime = countdownTime || null;
      this.currentAnswer = currentAnswer || null;
      this.playerList = playerList || null;
    }
  }
  
  export default GameGetDTO;
  