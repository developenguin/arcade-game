export default class GameState {

  /*
   * Initialize the game state
   */
  constructor() {
    this.score = 0;
  }

  increaseScore() {
    this.score++;
  }

  decreaseScore() {
    this.score--;
  }

  /*
   * Draw the scoreboard
   */
  render() {
    ctx.fillText(`Score: ${this.score}`, 32, 32);
  }

  /*
   * Changes the speed of all enemies
   * Param: modifier, the amount with which to modify the speed. Can be negative
   */
  static changeAllEnemySpeed(listOfEnemies, modifier) {

    for (const enemy of listOfEnemies) {
      enemy.increaseSpeed(modifier);
    }

  }

}
