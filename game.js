var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: "#2d6b2d",
    parent: "phaser-example",
    physics: {
        default: "arcade",
        arcade: {
            gravity: 0,
        },
    },
    scene: {
        preload: preload,
        create: create,
        update: update,
    },
};

var sprite;
var healthGroup;
var text;
var cursors;
var currentHealth = 100;
var maxHealth = 100;
var timedEvent;

var game = new Phaser.Game(config);

function preload() {
    this.load.image("cat", "assets/sprites/orange-cat1.png");
    this.load.image("health", "assets/sprites/firstaid.png");
}
var time = 0;

function create() {
    // setInterval(()=>console.log(time++),1000)
    sprite = this.physics.add.image(400, 300, "cat");

    sprite.setCollideWorldBounds(true);

    //  Create 10 random health pick-ups
    healthGroup = this.physics.add.staticGroup({
        key: "health",
        frameQuantity: 10,
        immovable: true,
    });

    var children = healthGroup.getChildren();

    for (var i = 0; i < children.length; i++) {
        var x = Phaser.Math.Between(50, 750);
        var y = Phaser.Math.Between(50, 550);

        children[i].setPosition(x, y);
    }

    healthGroup.refresh();

    //  So we can see how much health we have left
    text = this.add.text(10, 10, "Health: 100", {
        font: "32px Courier",
        fill: "#000000",
    });

    //  Cursors to move
    cursors = this.input.keyboard.createCursorKeys();

    //  When the player sprite his the health packs, call this function ...
    this.physics.add.overlap(sprite, healthGroup, spriteHitHealth);

    //  Decrease the health by calling reduceHealth every 50ms
    timedEvent = this.time.addEvent({
        delay: 100,
        callback: reduceHealth,
        callbackScope: this,
        loop: true,
    });
}

function reduceHealth() {
    currentHealth--;

    if (currentHealth === 0) {
        //  Uh oh, we're dead
        sprite.body.reset(400, 300);

        text.setText("");
        this.add.text(
            10,
            10,
            "Chú chim bé nhỏ của bạn đã tuột huyết áp ngất xỉu. F5 hoặc Ctrl+R để chơi lại", { font: "14px Courier", fill: "#000000" }
        );
        //  Stop the timer
        timedEvent.remove();
    }
}
var count = 0; //số cục ăn dc

function spriteHitHealth(sprite, health) {
    count++;
    console.log(count);
    if (count == 10) {

        ipcRenderer.send("da an het", "YOU WON!!");
    }

    //  Hide the sprite
    healthGroup.killAndHide(health);

    //  And disable the body
    health.body.enable = false;

    //  Add 10 health, it'll never go over maxHealth
    currentHealth = Phaser.Math.MaxAdd(currentHealth, 10, maxHealth);
}
const electron = require("electron");
const { ipcRenderer } = electron;

function update() {
    if (currentHealth === 0) {
        return;
    }
    //nếu ăn đủ 10 cục cũng dzậy
    if (count === 10) {
        text.setText("");
        this.add.text(10, 10, "You won", { font: "22px Courier", fill: "#fbc531" });
        return;
    }

    text.setText("Health: " + currentHealth);

    sprite.setVelocity(0);

    if (cursors.left.isDown) {
        sprite.setVelocityX(-200);
    } else if (cursors.right.isDown) {
        sprite.setVelocityX(200);
    }

    if (cursors.up.isDown) {
        sprite.setVelocityY(-200);
    } else if (cursors.down.isDown) {
        sprite.setVelocityY(200);
    }
}