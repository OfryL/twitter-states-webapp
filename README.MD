# Tweeter Stats
##### By [Ofry Linkovsky](https://ofry.net)

![alt text](https://i.ibb.co/MsZV0SX/Screen-Shot-2020-01-11-at-20-01-27.png
 "screenshot")

implement tweeter parser and showin some states

## server 

#### data
tweets processed then saved in tree shaped data structure,
`LetterTree`,
every leaf in this tree hold updated list of top 10 leafs in this node.
this makin the filter option very easy.

this tree is serializable what makes it super easy to persist to any db.
for this example i didnt choose to add DB. 

#### tweet stream
to consume the tweet stream i use some NodeJs pipe libs:
- JSONStream
- event-stream

## client
I choose vuejs as Framework an Bootstarp for css styles. 

## communication 
When new client open web socket to the server (i used [socket.io](https://socket.io) lib)
the server adding the client the root's update event room using `client.join`.

if the client sending filter event (changed the filter in the ui) the server moves him to new event room in the tree (where the filter word is) and remove him from unwanted olf events rooms.

## How to run
``` 
npm i
npm start
 ``` 

## FAQ
- sometimes the server starting to read tweets stream on faulty postion. restart solving that.
 