const logger = require('./logger')('app')

    , express = require("express")
    , app = express()
    , server = require('http').createServer(app)
    , io = require('socket.io').listen(server)

    , LetterTree = require('./letterTree').LetterTree

    , request = require('request')
    , JSONStream = require('JSONStream')
    , es = require('event-stream')

    , url = 'http://34.67.195.184/';

const topWords = new LetterTree();
const topHashTags = new LetterTree();
const topUsers = new LetterTree();

let tweetCountPerSec = 0;
let tweetPerSec = 0;

server.listen(8080, () => {
    logger.log("Server running on port 8080");
});

function addCbToNode(name, data, eventName) {
    if (name) {
        let node = data.get(name);
        if (node === 'not found') {
            io.to(eventName + name).emit(eventName + name, 0);
        } else {
            let newTopNotifyCb = function (top10) {
                io.to(eventName + name).emit(eventName + name, top10);
            };
            node.newTopNotifyCb = newTopNotifyCb;
            newTopNotifyCb(node.top10);
        }
    }
}

io.on('connection', function(client) {
    logger.log('Client connected...');

    client.join('topWords');
    client.join('topUsers');
    client.join('topHashTags');

    let registerFilter = (data, dataName) => {
        return function ({filter, old}) {
            client.leave(dataName + old);
            client.join(dataName + filter);
            addCbToNode(filter, data, dataName);
        };
    };
    client.on('topWordsFilter', registerFilter(topWords,'topWords'));
    client.on('topUsersFilter', registerFilter(topUsers,'topUsers'));
    client.on('topHashTagsFilter', registerFilter(topHashTags,'topHashTags'));

    client.on('disconnect', function(filter) {
        logger.log('Client disconnect');
    });
});

topWords.newTopNotifyCb = (top10) => {
    io.to('topWords').emit('topWords', top10);
};

topHashTags.newTopNotifyCb = (top10) => {
    io.to('topHashTags').emit('topHashTags', top10);
};
topUsers.newTopNotifyCb = (top10) => {
    io.to('topUsers').emit('topUsers', top10);
};

function pipes() {
    let remote = request({url: url});
    remote
        .pipe(JSONStream.parse())
        .pipe(es.mapSync(function (data) {
            if (data)
                tweetCountPerSec++;
        }));
    remote
        .pipe(JSONStream.parse('entities.hashtags'))
        .pipe(es.mapSync(function (data) {
            if (data && data.length !== 0)
                data.forEach(tag => topHashTags.count(tag.text));
        }));
    remote
        .pipe(JSONStream.parse('user.screen_name'))
        .pipe(es.mapSync(function (data) {
            if (data)
                topUsers.count(data);
        }));
    remote
        .pipe(JSONStream.parse('text'))
        .pipe(es.mapSync(function (data) {
            if (data)
                data.split(' ').forEach(word => topWords.count(word));
        }));
}

setInterval(() => {
    tweetPerSec = (tweetPerSec + tweetCountPerSec) / 2;
    tweetCountPerSec = 0;
    io.sockets.emit('tweetPerSec', tweetPerSec);
}, 1000);

app.use('/assets', express.static(__dirname + '/webapp/assets'));
app.get('/', function(req, res,next) {
    res.sendFile(__dirname + '/webapp/index.html');
});

try {
    pipes();
} catch (e) {
    logger.error(e);
}