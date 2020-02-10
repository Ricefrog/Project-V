const canvas = document.querySelector("canvas");
const body = document.querySelector("body");
const ctx = canvas.getContext('2d');
var sprite = document.querySelector("#player");
var elderDialogBlock = "Hello Eddy. I know that life has been hard for you. When I created you I purposely gave you a hideous and malformed skull in the hopes that you would learn humility and restraint. Unfortunately, you have neither of those qualities. However, I will give you a chance to redeem yoursef and win back your long lost lover. She awaits you behind one of these doors. But behind the other two lie horrifying challenges...";

var player = new component(20, 20, 108, 64);
player.update();

var guardian = new npcFriendly(15, 15, 258, 54, player);
guardian.render();

var door1 = new doorObj(104, 36, 30, 30, player);
var door2 = new doorObj(202, 24, 30, 30, player);
var door3 = new doorObj(148, 100, 30, 30, player);
var eventCounter = 0; //determines what happens when you enter each door
var eventOne = false;
var objectsScreen1 = [guardian, door1, door2, door3];

setInterval(gameFrame, 20);

//function to wipe pixels in a specified range
function clearArea(object) {
    ctx.clearRect(object.x, object.y, object.width, object.height)
};

//function to output an object's coordinates
function getCoords(obj) {
    console.log("X: "+obj.x);
    console.log("Y: "+obj.y);
};





//object constructor
function component(width, height, x, y) {
    this.xSpeed = 0;
    this.ySpeed = 0;
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.update = function () {
        ctx.drawImage(sprite, this.x, this.y, this.width, this.height);
    }
    this.newPos = function () {
        if (!collisionDetection(this.x, this.y, this.width, this.height, guardian)) {
            this.x += this.xSpeed;
            this.y += this.ySpeed;
        } else if (this.x > guardian.x && this.y > guardian.y 
            || this.y - this.height > guardian.y - guardian.height) {
            this.x++;
            this.y++;
        }
        else {
            this.x--;
            this.y--;
        }
        
        if (this.x < 0) {
            this.x = 0;
        }
        if (this.y < 0) {
            this.y = 0;
        }
        if (this.y > 130) {
            this.y = 130;
        }
        if (this.x > 282) {
            this.x = 282;
        }
        
    }
};

//function returns true if character tries to go out of bounds
function collisionDetection(x, y, width, height, object) {
    if (object.x < x + width && object.x + object.width > x &&
        object.y > y - height && object.y - object.height < y){
        return true;
    }
    else return false;
};


window.addEventListener("keydown", (e) => {
    if (e.keyCode == 38) {
        player.ySpeed = -2;
    }
    if (e.keyCode == 39) {
        player.xSpeed = 2;
    }
    if (e.keyCode == 40) {
        player.ySpeed = 2;
    }
    if (e.keyCode == 37) {
        player.xSpeed = -2;
    }
});

window.addEventListener("keyup", (e) => {
    if (e.keyCode == 38) {
        player.ySpeed = 0;
    }
    if (e.keyCode == 39) {
        player.xSpeed = 0;
    }
    if (e.keyCode == 40) {
        player.ySpeed = 0;
    }
    if (e.keyCode == 37) {
        player.xSpeed = 0;
    }
});


//contructor for dialog box
function dialogBox(x, y, width, height, dialogId, textContent) {
    this.dialogOpen = false;
    this.dialogId = dialogId;
    this.text = textContent;
    this.x = x;
    this.height = height;
    this.y = y;
    this.width = width;
    this.display = () => {
        this.dialogOpen = true;
        let span = document.createElement("span");
        body.appendChild(span);
        span.setAttribute("id", this.dialogId);
        span.classList.add("dialog");
        span.style.height = this.height+"px";
        span.style.width = this.width+"px";
        span.style.top = this.y+"px";
        span.style.right = this.x+"px";
        span.textContent = this.text;
    }
    this.clear = () => {
        this.dialogOpen = false;
        let span = document.querySelector(`#${this.dialogId}`);
        body.removeChild(span);
    }
};

function doorObj(x, y, height, width, player) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.active = false;
    this.entered = false;
    this.render = () => {
        if (collisionDetection(player.x, player.y, player.width, player.height, this) && this.entered === false) {
            this.entered = true;
            console.log("touched a door");
            //load new game screen
            loadNewScreen(eventCounter);
            eventCounter++;
        }
    };
};


function npcFriendly(width, height, x, y, player) {
    this.dialog_1 = new dialogBox(x, y, 1000, 100, "First", elderDialogBlock);
    this.active = true;
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.render = () => {
        ctx.fillRect(x, y, width, height);
        if (player.x + player.width > this.x - 10 && this.dialog_1.dialogOpen === false) {
            this.dialog_1.display();
            unlockDoors(eventOne);
        } else if (this.dialog_1.dialogOpen === true && player.x +player.width < this.x - 10) {
                this.dialog_1.clear();
                this.dialog_1.dialogOpen = false;
            }
        
    }
};








function loadNewScreen(eventCounter) {
    if (eventCounter === 0){
        console.log("entered first door");
    }
    if (eventCounter === 1) {
        console.log("entered second door");
    }
    if (eventCounter === 2) {
        console.log("entered third door");
    }
};

//function to unlock doors
function unlockDoors(eventOne) {
    if (eventOne === false) {
        eventOne === true;
        //play scary noise
        //assign door
        console.log("doors opened");
        door1.active = true;
        door2.active = true;
        door3.active = true;
    }
};


function gameFrame() {
    clearArea(player);
    clearArea(guardian);
    player.newPos();
    player.update();
    objectsScreen1.forEach(e => {
        if (e.active === true){
            e.render();
        }
    });
    // if (guardian.active === true){
    //     guardian.render();
    // }
    // if (door1.active === true) {
    //     door1.render();
    // }
};
