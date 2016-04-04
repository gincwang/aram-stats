# ARAM Stats
###### Do you love League of Legends, but only play ARAM (All-Random-All-Mid) mode most of the time?
###### Ever wonder how good you are at ARAM, but just don't know where to look for it?

###### Most popular LoL stats tracker only give you records and analysis on your ranked/normal games, but none is made solely for ARAM games...until now

### Welcome to ARAM Stats
##### This is where you can keep track of your ARAM-centric scores, where we will give you the ultimate stats break down for all your random goodness. To see this app live please go to: https://aram-stats.herokuapp.com/

*If you don't care about League of Legends and just want to see what the app does, you can type in my summoner name 'ragingoat' and see what it does.*


### Whats
##### What is League of Legends?
League of Legends is an online MOBA(Multiplayer online battle arena) type game that is currently the most played PC game of all time, and has a professional league for the elite players around the globe competing for yearly championship titles. 
##### What is ARAM mode?
ARAM stands for All-Random-All-Mid. This is the mode where the game map has only one lane and all 10 players from two teams duke it out to claim each other's nexus. While most serious/professional gamers don't play this mode, ARAM is quite popular among casual players who either don't have the time or don't want very competitive games like ranked game mode.
##### Ok I have a LoL account but I haven't played ARAM in a while, will I see any stats?
Due to Riot Games API restriction on normal game stats being made public, there's no way to get your historical ARAM game stats past the **last 10 games** that you've played. This means we can only start recording your stats right now, but it will continue to build as long as you check back in. 
##### Does my data automatically get updated even when I don't check it?
No, due to this app being a hobby project, and to limit bandwidth and memory usage, the database server only retrieves new data when you query your summoner name. 
##### Does any of my ranked/normal queue data get stored on your server?
No, I only pull 5v5-Unranked-ARAM-queue match statistics.
##### What is your application built with?
ARAM Stats is built with:
* Server Side: **node.JS**, **expressJS**,**Socket.io**
* Database: **PostgreSQL** (9.5)
* Client Side: **AngularJS**, **Bootstrap**, **Compass***

### Hows
##### How do I use this app?
To use this web app, you must have an active League of Legends account (create account/download the game here: https://signup.na.leagueoflegends.com/en/signup/index?realm_key=na), and you must have played a game of in ARAM mode in your last 10 games to see any data.
##### How about if I just want to see the app in action without any account? 
You can check out me and a few of my friends accounts for evaluation:
* ragingoat
* haywires
* ebpally
