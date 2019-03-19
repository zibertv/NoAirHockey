window.onload = function() {
    var c = document.getElementById("rink");
    var ctx = c.getContext("2d");
    var form = document.forms[0];
    
    var seconds = 30;
    var period = document.getElementById("period");
    var periodNum = parseInt(period.innerHTML[period.innerHTML.length - 1]);
    
    // set width and height of the rink
    c.width = 900;
    c.height = 450;

    // radius for the puck and the corners of the rink
    var radius = (1 / 12) * c.height;

    // account for the thickness of the sides
    var strikerWidth = 5;

    // puck position, direction, and speed variables
    var puckPosX = c.width * 0.5;
    var puckPosY = c.height * 0.5;
    var puckDirX = 0;
    var puckDirY = 0;
    var puckSpeed = 10;
    
    var playerStrikerPosX;
    var playerStrikerPosY = 0.5 * c.height;
    var cpuStrikerPosX;
    var cpuStrikerPosY = 0.5 * c.height;
    var homeColor;
    var awayColor;
    var home;
            
    form.onsubmit = function() {
        document.getElementById("playerDetails").style.display = "none";
        document.getElementById("info").style.display = "inline-block";
        if (form[1].value === "home") {
            home = true;
            playerStrikerPosX = 0.2 * c.width;
            cpuStrikerPosX = 0.8 * c.width;
        } else {
            home = false;
            playerStrikerPosX = 0.8 * c.width;
            cpuStrikerPosX = 0.2 * c.width;            
        }
        homeColor = document.getElementById("homeColor").value;
        awayColor = document.getElementById("awayColor").value;
        document.getElementById("home").style["background-color"] = homeColor;
        document.getElementById("away").style["background-color"] = awayColor;
        // begins the animation
        startAnimation();
        document.getElementById("theme").play();
        return false;
    };
    
    document.getElementById("theme").addEventListener('timeupdate', function() {
        var buffer = 0.14;
        if (this.currentTime > this.duration - buffer) {
            this.currentTime = 0;
            this.play();
        }
    })

    // cpu's direction, and speed
    var cpuStrikerDir = 0;
    var cpuStrikerSpeed = 1.5;
    // the following 2 variables are used to periodically determine whether the
    // left mouse button is being held
    var mouseDownTimer = null;
    var mouseDown = false;

    // y-coordinates for the top and bottom of the goals, respectively
    var goalTop = (1 / 3) * c.height;
    var goalBottom = (2 / 3) * c.height;

    // starting score for the home and away teams
    var homeScore = 0;
    var awayScore = 0;

    // draws the entire rink including all of the regulation lines, and objects
    function drawCanvas() {
        //create the outline of the rink
        ctx.beginPath();
        ctx.moveTo(0, c.height - radius);
        ctx.lineTo(0, radius);
        ctx.arc(radius + 0, radius +
            0, radius, Math.PI, 1.5 * Math.PI);
        ctx.lineTo(c.width - radius - 0, 0);
        ctx.arc(c.width - radius - 0, radius +
            0, radius, 1.5 * Math.PI, 0);
        ctx.lineTo(c.width - 0, radius + 0);
        ctx.arc(c.width - radius - 0, c.height - radius -
            0, radius, 0, 0.5 * Math.PI);
        ctx.lineTo(radius + 0, c.height - 0);
        ctx.arc(radius + 0, c.height - radius -
            0, radius, 0.5 * Math.PI, Math.PI);
        ctx.closePath();
        ctx.fillStyle = "white";
        ctx.fill();
        // ctx.lineWidth = 1;
        // ctx.strokeStyle = "blue";
        // ctx.stroke();

        // draw the blue lines
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(c.width / 3, 0);
        ctx.lineTo(c.width / 3, c.height);
        ctx.closePath();
        ctx.strokeStyle = "rgba(0, 0, 255, 0.2)";
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(c.width * (2 / 3), 0);
        ctx.lineTo(c.width * (2 / 3), c.height);
        ctx.closePath();
        ctx.stroke();

        // draw the red line and the center faceoff circle
        ctx.beginPath();
        ctx.moveTo(c.width / 2, 0);
        ctx.lineTo(c.width / 2, c.height / 3);
        ctx.closePath();
        ctx.strokeStyle = "rgba(255, 0, 0, 0.2)";
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(c.width / 2, c.height / 2, c.height / 6, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.strokeStyle = "rgba(0, 0, 255, 0.2)";
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(c.width / 2, c.height * (2 / 3));
        ctx.lineTo(c.width / 2, c.height);
        ctx.closePath();
        ctx.strokeStyle = "rgba(255, 0, 0, 0.2)";
        ctx.stroke();

        // draw the rest of the faceoff circles
        ctx.lineWidth = 2;
        ctx.strokeStyle = "rgba(255, 0, 0, 0.2)";
        ctx.beginPath();
        ctx.arc(0.2 * c.width, 0.2 * c.height, (1 / 6) * c.height, 0,
        2 * Math.PI);
        ctx.closePath();
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(0.2 * c.width, 0.8 * c.height, (1 / 6) * c.height, 0,
        2 * Math.PI);
        ctx.closePath();
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(0.8 * c.width, 0.2 * c.height, (1 / 6) * c.height, 0,
        2 * Math.PI);
        ctx.closePath();
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(0.8 * c.width, 0.8 * c.height, (1 / 6) * c.height, 0,
        2 * Math.PI);
        ctx.closePath();
        ctx.stroke();

        // draw the goal creases
        ctx.beginPath();
        ctx.arc(0, c.height / 2, c.height / 6, 
            1.5 * Math.PI, 0.5 * Math.PI);
        ctx.fillStyle = homeColor;
        ctx.fill();
        ctx.strokeStyle = "black";
        ctx.stroke();
        ctx.closePath();

        ctx.beginPath();
        ctx.arc(c.width, c.height / 2, c.height / 6,
            0.5 * Math.PI, 1.5 * Math.PI);
        ctx.fillStyle = awayColor;
        ctx.fill();
        ctx.strokeStyle = "black";
        ctx.stroke();
        ctx.closePath();

        // draw the puck
        ctx.beginPath();
        ctx.arc(puckPosX, puckPosY, radius, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fillStyle = "black";
        ctx.fill();

        // draw the strikers
        ctx.beginPath();
        ctx.arc(playerStrikerPosX, playerStrikerPosY, radius, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.lineWidth = 5;
        ctx.strokeStyle = "black";
        ctx.stroke();
        if (home) {
            ctx.fillStyle = homeColor;
        } else {
            ctx.fillStyle = awayColor;
        }
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo((playerStrikerPosX) - (0.5 * radius), playerStrikerPosY);
        ctx.lineTo((playerStrikerPosX) - (0.5 * radius), (playerStrikerPosY) -
                radius);
        ctx.arc(playerStrikerPosX, (playerStrikerPosY) - (radius),
            0.5 * radius, Math.PI, 0);
        ctx.lineTo((playerStrikerPosX) + (0.5 * radius), playerStrikerPosY);
        ctx.stroke();
        ctx.fill();
        ctx.closePath();

        ctx.beginPath();
        ctx.arc(cpuStrikerPosX, cpuStrikerPosY, radius, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.stroke();
        if (home) {
            ctx.fillStyle = awayColor;
        } else {
            ctx.fillStyle = homeColor;
        }
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo((cpuStrikerPosX) - (0.5 * radius), cpuStrikerPosY);
        ctx.lineTo((cpuStrikerPosX) - (0.5 * radius), (cpuStrikerPosY) -
            radius);
        ctx.arc(cpuStrikerPosX, (cpuStrikerPosY) - (radius),
            0.5 * radius, Math.PI, 0);
        ctx.lineTo((cpuStrikerPosX) + (0.5 * radius), cpuStrikerPosY);
        ctx.stroke();
        ctx.fill();
        ctx.closePath();
    }

    // function to start the animation
    function startAnimation() {
        timerId = setInterval(updateAnimation, 16);
    }

    // determines whether the left mouse button is being held down
    c.addEventListener("mousedown", function(event) {
        var xDelta = (event.pageX - c.offsetLeft) - playerStrikerPosX;
        var yDelta = (event.pageY - c.offsetTop) - playerStrikerPosY;
        if (Math.sqrt(Math.pow(xDelta, 2) + Math.pow(yDelta, 2)) < radius) {
            mouseDownTimer = setInterval(function() {
                mouseDown = true;
            }, 16);
        }
    });

    // if the left mouse button is being held down, the coordinates of the
    // player's striker will update accordingly
    c.addEventListener("mousemove", function(event) {
        if (mouseDown) {
            playerStrikerPosX = event.pageX - c.offsetLeft;
            playerStrikerPosY = event.pageY - c.offsetTop;
        }
    });

    // when the player releases the left mouse button, the striker will cease
    // to move
    c.addEventListener("mouseup", function(event) {
        clearInterval(mouseDownTimer);
        mouseDown = false;
    });

    // updates the position of the CPU striker according to the vertical
    // coordinate of the puck
    function moveCPUStriker() {
        var yDelta = puckPosY - cpuStrikerPosY;
        if (yDelta !== 0) {
            cpuStrikerPosY += cpuStrikerSpeed * (yDelta / Math.abs(yDelta));
        }
    }

    // handle puck collisions
    function puckCollision() {
        // determine whether the player's striker collided with the puck
        var xDelta = puckPosX - playerStrikerPosX;
        var yDelta = puckPosY - playerStrikerPosY;
        var distance = Math.sqrt(Math.pow(xDelta, 2) + Math.pow(yDelta, 2));
        if (distance <= 2 * radius) {
                puckDirX = xDelta / distance;
                puckDirY = yDelta / distance;
        }
        // determine whether the cpu's striker collided with the puck
        var xDeltaCPU = puckPosX - cpuStrikerPosX;
        var yDeltaCPU = puckPosY - cpuStrikerPosY;
        var distanceCPU = Math.sqrt(Math.pow(xDeltaCPU, 2) +
            Math.pow(yDeltaCPU, 2));
        if (distanceCPU <= strikerWidth + (2 * radius)) {
            puckDirX = xDeltaCPU / distanceCPU;
            puckDirY = yDeltaCPU / distanceCPU;
        }
                // determine whether the puck has collided with the boundaries 
        if (puckPosY <= goalTop) { 
            if (puckPosY <= radius) { 
                puckDirY *= -1; 
            } 
            if ((puckPosX <= radius) || (puckPosX + radius >= c.width)) { 
                puckDirX *= -1; 
            } 
        } else if ((puckPosY > goalTop) && (puckPosY < goalBottom)) { 
            if ((puckPosX <= radius && puckPosX >= 0) || 
                    (puckPosX + radius >= c.width && puckPosX <= c.width)) { 
                if ((puckPosY - radius <= goalTop) || 
                        (puckPosY + radius >= goalBottom)) { 
                    puckDirX *= -1; 
                } 
            } else if ((puckPosX <= radius) || (puckPosX >= c.width)) { 
                puckDirY *= -1; 
            } 
        } else if (puckPosY >= goalBottom) { 
            if (puckPosY + radius >= c.height) { 
                puckDirY *= -1; 
            } 
            if ((puckPosX <= radius) || (puckPosX + radius >= c.width)) { 
                puckDirX *= -1; 
            }
        } 
        puckPosX += puckSpeed * puckDirX;
        puckPosY += puckSpeed * puckDirY;
    }

    // reset the puck position in the event of a goal
    function resetPuck() {
        puckPosX = c.width / 2;
        puckPosY = c.height / 2;
        puckDirX = 0;
        puckDirY = 0;
    }

    // reset the striker positions in the event of a goal
    function resetStrikers() {
        if (home) {
            playerStrikerPosX = 0.2 * c.width;
            cpuStrikerPosX = 0.8 * c.width;
        } else {
            playerStrikerPosX = 0.8 * c.width;
            cpuStrikerPosX = 0.2 * c.width;            
        }
        cpuStrikerPosY = 0.5 * c.height;
        playerStrikerPosY = 0.5 * c.height;
    }

    // determine whether a goal has been scored
    function goalScored() {
        if (puckPosX + radius < 0) {
            awayScore += 1;
            document.getElementById("away").innerHTML = "AWAY " + awayScore;
            return true;
        } else if (puckPosX - radius > c.width) {
            homeScore += 1;
            document.getElementById("home").innerHTML = "HOME " + homeScore;            
            document.getElementById("away").innerHTML = "AWAY " + awayScore;
            return true;
        }
    }

    // function to update the animation
    function updateAnimation() {
        drawCanvas();
        puckCollision();
        if (goalScored()) {
            resetPuck();
            resetStrikers();
        }
        moveCPUStriker();
        seconds = seconds - (16 / 1000);
        if (seconds > 0) {
            document.getElementById("time").innerHTML = Math.round(seconds, 2);
        } else {
            if (periodNum < 3) {
                resetPuck();
                resetStrikers();
                periodNum += 1;
                period.innerHTML = "PERIOD " + periodNum;
                seconds = 30;
            } else {
                clearInterval(timerId);
                var homeScore = document.getElementById("" +
                    "home").innerHTML[document.getElementById("" +
                        "home").innerHTML.length - 1];
                var awayScore = document.getElementById("" +
                    "away").innerHTML[document.getElementById("" +
                        "away").innerHTML.length - 1];
                console.log(homeScore);
                console.log(awayScore);
                if (home) {
                    if (homeScore > awayScore) {
                        document.getElementById("result").innerHTML = "YOU WON";
                        document.getElementById("result").className = "won";
                    } else if (homeScore < awayScore) {
                        document.getElementById("result").innerHTML = "YOU " +
                                "LOST";
                        document.getElementById("result").className = "lost";
                    } else {
                        document.getElementById("result").innerHTML = "TIE " +
                                "GAME";
                        document.getElementById("result").className = "tie";
                    }
                } else {
                    if (homeScore > awayScore) {
                        document.getElementById("result").innerHTML = "YOU " +
                                "LOST";
                        document.getElementById("result").className = "lost";
                    } else if (homeScore < awayScore) {
                        document.getElementById("result").innerHTML = "YOU WON";
                        document.getElementById("result").className = "won";
                    } else {
                        document.getElementById("result").innerHTML = "TIE " +
                                "GAME";
                        document.getElementById("result").className = "tie";
                    }
                }
            }
        }
    }
};