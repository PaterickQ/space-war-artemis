namespace SpriteKind {
    export const EnemyLaser = SpriteKind.create()
    export const Boss = SpriteKind.create()
    export const PowerUp = SpriteKind.create()
}
function spawnBoss () {
    boss = sprites.create(bossImage, SpriteKind.Boss)
    boss.setPosition(80, 25)
    boss.vx = 35
    boss.setBounceOnWall(true)
    bossLife = 15
    game.splash("BOSS!", "Tref ho 15x")
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.EnemyLaser, function (sprite, laser) {
    laser.destroy()
    if (shieldActive) {
        shieldActive = false
    } else {
        info.changeLifeBy(-1)
    }
})
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    laser = sprites.createProjectileFromSprite(img`
        . 1 . 
        . 1 . 
        . 1 . 
        . 1 . 
        `, player2, 0, -120)
    laser.setKind(SpriteKind.Projectile)
})
sprites.onOverlap(SpriteKind.Projectile, SpriteKind.Boss, function (laser, boss) {
    laser.destroy()
    bossLife += -1
    info.changeScoreBy(20)
    if (bossLife <= 0) {
        boss.destroy(effects.confetti, 500)
        game.over(true, effects.confetti)
    }
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.Enemy, function (sprite, enemy) {
    enemy.destroy(effects.disintegrate, 100)
    if (shieldActive) {
        shieldActive = false
    } else {
        info.changeLifeBy(-1)
    }
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.PowerUp, function (sprite, otherSprite) {
    otherSprite.destroy(effects.hearts, 200)
    shieldActive = true
    sprite.startEffect(effects.trail, 2000)
    pause(2000)
    shieldActive = false
})
function nextLevel () {
    level += 1
    killsInLevel = 0
    if (level == 2) {
        killsNeeded = 10
        enemySpeed = 45
        enemySpawnTime = 1000
        enemyShootChance = 20
    } else if (level == 3) {
        killsNeeded = 12
        enemySpeed = 55
        enemySpawnTime = 850
        enemyShootChance = 25
    } else if (level == 4) {
        killsNeeded = 14
        enemySpeed = 65
        enemySpawnTime = 700
        enemyShootChance = 30
    } else if (level == 5) {
        killsNeeded = 10
        enemySpeed = 75
        enemySpawnTime = 600
        enemyShootChance = 35
    }
    game.splash("Level " + level, "Dalsi level")
}
sprites.onOverlap(SpriteKind.Projectile, SpriteKind.Enemy, function (laser, enemy) {
    laser.destroy()
    enemy.destroy(effects.fire, 100)
    info.changeScoreBy(10)
    killsInLevel += 1
    checkLevelProgress()
})
function spawnEnemy () {
    if (level >= 3 && randint(1, 100) <= 35) {
        enemy = sprites.create(fastEnemyImage, SpriteKind.Enemy)
        enemy.vy = enemySpeed + 25
        enemy.vx = randint(-20, 20)
    } else {
        enemy = sprites.create(enemyImage, SpriteKind.Enemy)
        enemy.vy = enemySpeed
        enemy.vx = randint(-10, 10)
    }
    enemy.setPosition(randint(10, 150), 5)
    enemy.setBounceOnWall(true)
}
function checkLevelProgress () {
    if (level < 5 && killsInLevel >= killsNeeded) {
        nextLevel()
    }
    if (level == 5 && killsInLevel >= killsNeeded && bossLife == 0) {
        spawnBoss()
    }
}
let shot: Sprite = null
let enemies: Sprite[] = []
let shot2: Sprite = null
let bosses: Sprite[] = []
let power2: Sprite = null
let enemy: Sprite = null
let killsInLevel = 0
let laser: Sprite = null
let shieldActive = false
let bossLife = 0
let boss: Sprite = null
let player2: Sprite = null
let bossImage: Image = null
let fastEnemyImage: Image = null
let enemyImage: Image = null
let enemyShootChance = 0
let enemySpawnTime = 0
let enemySpeed = 0
let killsNeeded = 0
let level = 0
let enemy2 = null
level = 1
killsNeeded = 8
enemySpeed = 35
enemySpawnTime = 2400
enemyShootChance = 15
let playerImage = img`
    . . . . . . . . . . . . 
    . . . . . 4 4 . . . . . 
    . . . . 1 4 4 1 . . . . 
    . . . . 1 1 1 1 . . . . 
    . . . . 2 2 2 2 . . . . 
    . . . 2 2 2 2 2 2 . . . 
    . . 2 2 . . . . 2 2 . . 
    . . 2 . . . . . . 2 . . 
    `
enemyImage = img`
    . . . 7 7 7 7 . . . 
    . . . 7 2 2 7 . . . 
    . . . 7 . . 7 . . . 
    . . 7 1 1 1 1 7 . . 
    . 7 1 1 1 1 1 1 7 . 
    . . 7 1 1 1 1 7 . . 
    `
fastEnemyImage = img`
    . . 5 . . . . 5 . . 
    . 5 5 5 . . 5 5 5 . 
    5 5 . 5 5 5 5 . 5 5 
    5 5 5 5 5 5 5 5 5 5 
    . . 5 5 . . 5 5 . . 
    `
bossImage = img`
    . . . a a a a a a . . . 
    . . a a 2 2 2 2 a a . . 
    . a a 2 2 2 2 2 2 a a . 
    a a 2 2 4 4 4 4 2 2 a a 
    a 2 2 4 4 5 5 4 4 2 2 a 
    a 2 2 4 4 5 5 4 4 2 2 a 
    a a 2 2 4 4 4 4 2 2 a a 
    . a a 2 2 2 2 2 2 a a . 
    . . a a 2 2 2 2 a a . . 
    . . . a a a a a a . . . 
    `
let powerUpImage = img`
    . . . 7 7 7 . . . 
    . . 7 7 1 7 7 . . 
    . 7 7 1 1 1 7 7 . 
    7 7 1 1 1 1 1 7 7 
    . 7 7 1 1 1 7 7 . 
    . . 7 7 1 7 7 . . 
    . . . 7 7 7 . . . 
    `
scene.setBackgroundColor(15)
player2 = sprites.create(playerImage, SpriteKind.Player)
player2.setPosition(80, 105)
player2.setStayInScreen(true)
controller.moveSprite(player2, 100, 0)
info.setLife(50)
info.setScore(0)
game.splash("ARTEMIS II SPACE WAR", "level 1")
game.onUpdate(function () {
    for (let enemy3 of sprites.allOfKind(SpriteKind.Enemy)) {
        if (enemy3.y > 125) {
            enemy3.destroy()
        }
    }
    for (let laser2 of sprites.allOfKind(SpriteKind.EnemyLaser)) {
        if (laser2.y > 125) {
            laser2.destroy()
        }
    }
})
game.onUpdateInterval(9000, function () {
    if (randint(1, 100) <= 35) {
        power2 = sprites.create(powerUpImage, SpriteKind.PowerUp)
        power2.setPosition(randint(10, 150), -10)
        power2.vy = 35
        power2.setFlag(SpriteFlag.AutoDestroy, true)
    }
})
game.onUpdateInterval(700, function () {
    bosses = sprites.allOfKind(SpriteKind.Boss)
    for (let boss2 of bosses) {
        shot2 = sprites.createProjectileFromSprite(img`
            . 4 . 
            4 4 4 
            . 4 . 
            `, boss2, randint(-25, 25), 80)
        shot2.setKind(SpriteKind.EnemyLaser)
    }
})
game.onUpdateInterval(1000, function () {
    if (randint(0, enemySpawnTime) < 500) {
        spawnEnemy()
    }
})
game.onUpdateInterval(900, function () {
    enemies = sprites.allOfKind(SpriteKind.Enemy)
    for (let enemy22 of enemies) {
        if (randint(1, 100) <= enemyShootChance) {
            shot = sprites.createProjectileFromSprite(img`
                . 2 . 
                . 2 . 
                . 2 . 
                `, enemy22, 0, 70)
            shot.setKind(SpriteKind.EnemyLaser)
        }
    }
})
