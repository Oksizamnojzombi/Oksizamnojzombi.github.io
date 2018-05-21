"use strict";

var app = void 0;
var character = void 0;
var positions = [[214, 1366], [552, 1366], [889, 1366], [214, 1703], [552, 1703], [889, 1703]];
var elements = ["assets/img/location/magic_forest_bow.png", "assets/img/location/magic_forest_bonfire.png", "assets/img/location/magic_forest_leaf.png", "assets/img/location/magic_forest_rope.png", "assets/img/location/magic_forest_tent.png"];

PIXI.loader.add('char', 'assets/img/character/red.json').add(elements).add(["assets/img/magic_forest_bg.jpg", "assets/img/magic_forest_winner_frame.png", "assets/img/magic_forest_frame_for_text.png", "assets/img/magic_forest_frame.png", "assets/img/magic_forest_win_up_to_100.png", "assets/img/location/magic_forest_scratch_frame.png", "assets/img/location/magic_forest_scratch_frame_big.png", "assets/img/location/magic_forest_frame2.png", "assets/img/location/magic_forest_button.png", "assets/img/location/magic_forest_question_icon.png", "assets/img/location/magic_forest_coin_icon_big.png", "assets/img/location/magic_forest_frame1.png"]).load(setup);

function loadRes(link) {
    return PIXI.loader.resources[link].texture;
}

function setup(loader, res) {
    createCanvas(loader, res);
    drawBg(loader, res);
    drawGame(loader, res);
    drawCharacter(loader, res);
}

function createCanvas(loader, res) {
    app = new PIXI.Application({ width: 1097, height: 1920 });
    document.body.appendChild(app.view);
}

function drawBg(loader, res) {
    var bg = new PIXI.Sprite(loadRes("assets/img/magic_forest_bg.jpg"));
    bg.x += -152;
    app.stage.addChild(bg);

    var title = new PIXI.Sprite(loadRes("assets/img/magic_forest_win_up_to_100.png"));
    title.position.set(159, 40);
    app.stage.addChild(title);

    var bg_description = new PIXI.Sprite(loadRes("assets/img/magic_forest_frame_for_text.png"));
    bg_description.position.set(56, 1043);
    bg_description.scale.set(0.98, 1);
    app.stage.addChild(bg_description);

    var winner_bg = new PIXI.Sprite(loadRes("assets/img/magic_forest_winner_frame.png"));
    winner_bg.position.set(526, 140);
    app.stage.addChild(winner_bg);

    var scratch_bg = new PIXI.Sprite(loadRes('assets/img/location/magic_forest_scratch_frame_big.png'));
    scratch_bg.position.set(799, 553);
    scratch_bg.anchor.set(0.5);
    app.stage.addChild(scratch_bg);

    var scratch_frame_bg = loadRes("assets/img/location/magic_forest_scratch_frame.png");
    var containerScratch = new PIXI.Container();
    app.stage.addChild(containerScratch);

    for (var i = 0; i < 6; i++) {
        var scratch = new PIXI.Sprite(scratch_frame_bg);
        scratch.anchor.set(0.5);
        scratch.x = i % 3 * 335;
        scratch.y = Math.floor(i / 3) * 330;

        app.stage.addChild(scratch);
        containerScratch.addChild(scratch);
    }
    containerScratch.x = app.screen.width - containerScratch.width + 67;
    containerScratch.y = app.screen.height - 552;

    gameGroup = new PIXI.Container();
    app.stage.addChild(gameGroup);

    containerBgField = new PIXI.Container();
    app.stage.addChild(containerBgField);
}

var isWin = void 0;
var symbolList = void 0;
var currentAnimation = 'idle';
var winSymbol = void 0;
var winCoin = void 0;
var backgrMask = void 0;
var containerBgField = void 0;
var gameGroup = void 0;

function drawGame(loader, res) {
    symbolList = [];
    // openCount = 0;
    winSymbol = -1;
    winCoin = 25;

    var rnd = Math.random() * 100;

    if (rnd <= 2) {
        winSymbol = 4;
        winCoin = 100;
    } else if (rnd <= 6) {
        winSymbol = 3;
        winCoin += 50;
    } else if (rnd <= 12) {
        winSymbol = 2;
        winCoin += 35;
    } else if (rnd <= 20) {
        winSymbol = 1;
        winCoin += 30;
    } else if (rnd <= 30) {
        winCoin += 25;
        winSymbol = 0;
    } else {
        winCoin += 0;
        winSymbol = -1;
    }

    if (winSymbol > -1) {
        isWin = true;
        symbolList[0] = symbolList[1] = symbolList[2] = winSymbol;
        for (var i = 3; i < 6; i++) {
            var nextSymbol = void 0;
            do {
                nextSymbol = randomInt(0, 4);
            } while (nextSymbol == winSymbol);
            symbolList.push(nextSymbol);
        }

        symbolList.forEach(function (symbol, ind) {
            var changeInd = void 0;
            do {
                changeInd = randomInt(0, 4);
            } while (changeInd == ind);
            symbolList[ind] = symbolList[changeInd];
            symbolList[changeInd] = symbol;
        });
    } else {
        isWin = false;
        winSymbol = randomInt(0, 4);
        var winCount = 0;
        for (var _i = 0; _i < 6; _i++) {
            var symbol = void 0;
            do {
                symbol = randomInt(0, 4);
            } while (symbol == winSymbol && winCount == 2);
            if (symbol == winSymbol) ++winCount;
            symbolList.push(symbol);
        }
    }

    drawDescription();
    renderTexture();
    drawSymbols();
    drawBonusSymbol();

    containerBgField.addChild(backgrMask);
}

function drawCharacter(loader, res) {
    // let app = new PIXI.Application();
    // document.body.appendChild(app.view);

    character = new PIXI.spine.Spine(res.char.spineData);
    // instantiate the spine animation
    character.skeleton.setToSetupPose();
    character.update(0);
    character.autoUpdate = false;

    // create a container for the spine animation and add the animation to it
    var characterCage = new PIXI.Container();
    characterCage.addChild(character);

    // measure the spine animation and position it inside its container to align it to the origin
    var localRect = character.getLocalBounds();
    character.position.set(-localRect.x, -localRect.y);

    characterCage.position.set(80, 280);
    app.stage.addChild(characterCage);

    // once position and scaled, set the animation to play
    character.state.setAnimation(0, 'red_idle_loop', true);

    requestAnimationFrame(skeletonAnimation);

    var charLastFrame = 0;
    function skeletonAnimation(animate) {
        var animateTime = (animate - charLastFrame) / 1000;
        charLastFrame = animate;
        character.update(animateTime);
        requestAnimationFrame(skeletonAnimation);
    }
}

function drawDescription() {
    var descr_container = new PIXI.Container();
    descr_container.position.set(88, 1071);
    containerBgField.addChild(descr_container);

    var msgDescriptionStyle = new PIXI.TextStyle({
        fontFamily: "Arial",
        fontSize: 36,
        fill: "#f45b4e"
    });

    var match_winner = new PIXI.Text("MATCH THE WINNER", msgDescriptionStyle);
    match_winner.position.set(1, 0);
    descr_container.addChild(match_winner);

    var win_prize = new PIXI.Text("AND WIN A PRIZE!", msgDescriptionStyle);
    win_prize.position.set(543, 0);
    descr_container.addChild(win_prize);

    var msgDescriptionImg = new PIXI.Sprite(loadRes(elements[winSymbol]));
    msgDescriptionImg.position.set(453, -10);
    msgDescriptionImg.scale.set(0.3);

    descr_container.addChild(msgDescriptionImg);
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function drawSymbols(loader, res) {
    var elementBg = loadRes("assets/img/magic_forest_frame.png");

    var _loop = function _loop(i) {
        var filedBG = new PIXI.Sprite(elementBg);
        filedBG.anchor.set(0.5);
        // filedBG.x = (i % 3) * 335;
        // filedBG.y = Math.floor(i / 3) * 330;
        filedBG.position.set(positions[i][0], positions[i][1]);

        app.stage.addChild(filedBG);
        // gameGroup.addChild(filedBG);

        var symbolID = symbolList[i];
        var symbol = new PIXI.Sprite(loadRes(elements[symbolID]));
        symbol.anchor.set(0.5);
        // symbol.x = (i % 3) * 335;
        // symbol.y = Math.floor(i / 3) * 330;
        symbol.position.set(positions[i][0], positions[i][1]);

        app.stage.addChild(symbol);
        gameGroup.addChild(filedBG, symbol);

        backgrMask.addChild(filedBG, symbol);

        var graphics = new PIXI.Graphics();
        graphics.alpha = 0;
        graphics.beginFill(0x000000);
        graphics.drawRect(positions[i][0] - 140, positions[i][1] - 140, 280, 280);
        gameGroup.addChild(graphics);
        // graphics.anchor.set(0.5);
        // graphics.x = (i % 3) * 335;
        // graphics.y = Math.floor(i / 3) * 330;

        var startPointX = positions[i][0] - 140;
        var startPointY = positions[i][1] - 140;

        var minPos = void 0,
            maxPos = void 0;
        graphics.interactive = true;

        var isWinSymbol = symbolID == winSymbol;
        var touchmove = function touchmove(event) {

            var pos = event.data.global;
            if (pos.x < startPointX || pos.x > startPointX + 280 || pos.y < startPointY || pos.y > startPointY + 280) {
                return;
            }

            if (!minPos) {
                minPos = { x: event.data.global.x, y: event.data.global.y };
                maxPos = { x: event.data.global.x, y: event.data.global.y };
            }
            if (pos.x < minPos.x) minPos.x = pos.x;
            if (pos.x > maxPos.x) maxPos.x = pos.x;
            if (pos.y < minPos.y) minPos.y = pos.y;
            if (pos.y > maxPos.y) maxPos.y = pos.y;
            var length = ((minPos.x - maxPos.x) ** 2 + (minPos.y - maxPos.y) ** 2) ** 0.5;
            if (length >= 280) {

                gameGroup.addChild(filedBG, symbol);
                // containerBgField.addChild(filedBG, symbol);
                graphics.destroy();

                if (isWinSymbol) changeAnimation('red_happy_card');else changeAnimation('red_disappointed');

                // if(++openCount == 7) finishGame();
            }
        };
        graphics.on('touchmove', touchmove);
        graphics.on('pointermove', touchmove);
        graphics.on('pointerover', function () {
            character.state.setAnimation(0, 'red_worry_st', false);
            character.state.addAnimation(0, 'red_worry_loop', true, 0);
        });
        graphics.on('pointerout', function () {
            character.state.setAnimation(0, 'red_worry_end', false);
            character.state.addAnimation(0, 'red_idle_loop', true, 0);
        });
    };

    for (var i = 0; i < 6; i++) {
        _loop(i);
    }

    // containerBgField.x = (app.screen.width - containerBgField.width) + 67;
    // containerBgField.y = (app.screen.height) - 560;
}

function drawBonusSymbol() {
    var bonusBG = new PIXI.Sprite(loadRes("assets/img/magic_forest_winner_frame.png"));
    bonusBG.position.set(526, 140);

    var symbol = new PIXI.Sprite(loadRes(elements[winSymbol]));
    symbol.position.set(800, 590);
    symbol.anchor.set(0.5);

    backgrMask.addChild(bonusBG, symbol);

    var graphics = new PIXI.Graphics();
    graphics.alpha = 0;
    graphics.beginFill(0x000000);
    graphics.drawRect(614, 367, 368, 368);
    gameGroup.addChild(graphics);

    var minPos = void 0,
        maxPos = void 0;
    graphics.interactive = true;

    var touchmove = function touchmove(event) {
        var pos = event.data.global;
        if (pos.x < 614 || pos.x > 614 + 368 || pos.y < 367 || pos.y > 367 + 368) {
            return;
        }

        if (!minPos) {
            minPos = { x: event.data.global.x, y: event.data.global.y };
            maxPos = { x: event.data.global.x, y: event.data.global.y };
        }
        if (pos.x < minPos.x) minPos.x = pos.x;
        if (pos.x > maxPos.x) maxPos.x = pos.x;
        if (pos.y < minPos.y) minPos.y = pos.y;
        if (pos.y > maxPos.y) maxPos.y = pos.y;
        var length = ((minPos.x - maxPos.x) ** 2 + (minPos.y - maxPos.y) ** 2) ** 0.5;
        if (length >= 440) {
            containerBgField.addChild(bonusBG, symbol);
            graphics.destroy();
            changeAnimation('red_happy_bonus');

            // if(++openCount == 7) finishGame();
        }
    };
    graphics.on('touchmove', touchmove);
    graphics.on('pointermove', touchmove);

    graphics.on('pointerover', function () {
        character.state.setAnimation(0, 'red_worry_st', false);
        character.state.addAnimation(0, 'red_worry_loop', true, 0);
    });
    graphics.on('pointerout', function () {
        character.state.setAnimation(0, 'red_worry_end', false);
        character.state.addAnimation(0, 'red_idle_loop', true, 0);
    });
}

randomInt();

var dragging = false;
function renderTexture() {
    var renderTexture = PIXI.RenderTexture.create(app.screen.width, app.screen.height);
    var renderTextureSprite = new PIXI.Sprite(renderTexture);
    containerBgField.addChild(renderTextureSprite);
    gameGroup.addChild(renderTextureSprite);

    backgrMask = new PIXI.Sprite();
    backgrMask.mask = renderTextureSprite;

    gameGroup.interactive = true;
    gameGroup.on('touchstart', pointerDown);
    gameGroup.on('touchend', pointerUp);
    gameGroup.on('touchmove', function (event) {
        pointerMove(event);
        if (currentAnimation == 'idle') {
            currentAnimation = 'worry';
            character.state.setAnimation(0, 'red_worry_st', false);
            character.state.addAnimation(0, 'red_worry_loop', true, 0);
        }
    });

    gameGroup.on('pointerover', pointerDown);
    gameGroup.on('pointerout', pointerUp);
    gameGroup.on('pointermove', pointerMove);

    var brush = new PIXI.Graphics();
    brush.beginFill(0xffffff);
    brush.drawCircle(0, 0, 50);
    brush.endFill();

    function pointerMove(event) {
        if (dragging) {
            brush.position.copy(event.data.global);
            app.renderer.render(brush, renderTexture, false, null, false);
        }
    }

    function pointerDown(event) {
        dragging = true;
        pointerMove(event);
    }

    function pointerUp(event) {
        dragging = false;
        if (currentAnimation == 'worry') {
            currentAnimation = 'idle';
            character.state.setAnimation(0, 'red_worry_end', false);
            character.state.addAnimation(0, 'red_idle_loop', true, 0);
        }
    }
}

function changeAnimation(key) {
    currentAnimation = key;
    character.state.setAnimation(0, key + '_st', false);
    character.state.addAnimation(0, key + '_loop', false, 0);
    character.state.addAnimation(0, key + '_end', false, 0);
    character.state.addAnimation(0, 'red_idle_loop', true, 0);
    setTimeout(function () {
        currentAnimation = 'idle';
    }, 2000);
}