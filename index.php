<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <title>No-Air Hockey</title>
        <link href="css/styles.css" rel="stylesheet" type="text/css">
        <script src="js/javascript.js" type="text/javascript"></script>
    </head>
    <body>
        <div id="content">
        <nav>
            <h1>NO-AIR HOCKEY</h1>
            <a href="">PLAY</a> |
            <a href="">HIGH SCORES</a> |
            <a href="">ABOUT US</a>
        </nav>
        <div id="playerDetails">
            <form>
                <table>
                    <tr>
                        <td>GETTING STARTED...</td>
                    </tr>
                    <tr>
                        <td>NAME</td>
                        <td><input type="text" name="playerName"></td>
                    </tr>
                    <tr>
                        <td>CHOOSE A SIDE</td>
                        <td>
                            <select>
                                <option value="home">HOME</option>
                                <option value="away">AWAY</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td>CHOOSE HOME COLOR</td>
                        <td>
                            <input type="color" name="homeColor"
                                   value="#FFA500">
                        </td>
                    </tr>
                    <tr>
                        <td>CHOOSE AWAY COLOR</td>
                        <td>
                            <input type="color" name="awayColor"
                                   value="#008000">
                        </td>
                    </tr>
                    <tr>
                        <td>READY?</td>
                        <td><input type="submit" value="PLAY"></td>
                    </tr>
                </table>
            </form>
        </div>
        <div id="info">
            <span id="home">HOME 0</span>
            <span id="period">PERIOD 1</span>
            <span id="time">1:00</span>
            <span id="away">AWAY 0</span>
        </div>
        </div>
        <canvas id="rink"></canvas>
        <?php
        // put your code here
        ?>
    </body>
</html>
