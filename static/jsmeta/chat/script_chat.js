var mapPeers = {};


const localVideo = document.getElementById('localVideo');

/*
local video stream
MediaStream ->MediaStreamTrac
MediaStream.getTracks()가 MediaStreamTrack 객체의 배열
*/ 
var localStream = new MediaStream();

var messageInput = document.getElementById('message-input');
var btnSendMsg = document.getElementById('message-submit');

var ul = document.getElementById("message-log");


var loc = window.location;
var endPoint = '';

/*
window.location.protocol
웹 프로토콜을 알려준다.(http인지 https인지)
*/
var wsStart = 'ws://';
if(loc.protocol == 'https:'){
    wsStart = 'wss://';
}


//var endPoint = wsStart + loc.host + loc.pathname;

// get shopn id
var shopId = document.getElementById('shopId').textContent;
console.log(shopId);
var roomName = shopId;

endPoint = wsStart + loc.host + '/ws/chat/' + roomName + '/';
console.log(endPoint) 

/*websocket */
var webSocket;

// get username
var username = document.getElementById('username').textContent;
console.log('Username: ',username);
var btnJoin = document.getElementById('startButton');

// join room (initiate websocket connection)
// upon button click
btnJoin.onclick = () => {
    // disable and vanish join button
    btnJoin.disabled = true;
    btnJoin.style.visibility = 'hidden';

    webSocket = new WebSocket(endPoint);

    /*커넥션이 만들어지면*/ 
    webSocket.onopen = function(e){
        console.log('Connection opened! ', e);

    
        sendSignal('new-peer', {});
    }
    
    webSocket.onmessage = webSocketOnMessage;
    
    webSocket.onclose = function(e){
        console.log('Connection closed! ', e);
    }
     
    webSocket.onerror = function(e){
        console.log('Error occured! ', e);
    }

    btnSendMsg.disabled = false;
    messageInput.disabled = false;
}


function webSocketOnMessage(event){
    var parsedData = JSON.parse(event.data);

    var action = parsedData['action'];
    // username of other peer
    var peerUsername = parsedData['peer'];
    
    console.log('action: ', action);
    console.log('peerUsername: ', peerUsername);

    if(peerUsername == username){
        // ignore all messages from oneself
        return;
    }
    
   
    var receiver_channel_name = parsedData['message']['receiver_channel_name'];
    console.log('receiver_channel_name: ', receiver_channel_name);

   
    if(action == 'new-peer'){
        console.log('New peer: ', peerUsername);
        // create new RTCPeerConnection

        createOfferer(peerUsername, receiver_channel_name);
        return;
    }

    if(action == 'new-offer'){
        console.log('Got new offer from ', peerUsername);

        // create new RTCPeerConnection
        // set offer as remote description
        var offer = parsedData['message']['sdp'];
        console.log('Offer: ', offer);
        var peer = createAnswerer(offer, peerUsername, receiver_channel_name);

        return;
    }
    

    if(action == 'new-answer'){
        var peer = null;
        
        peer = mapPeers[peerUsername][0];

        var answer = parsedData['message']['sdp'];
        
        console.log('mapPeers:');
        for(key in mapPeers){
            console.log(key, ': ', mapPeers[key]);
        }

        console.log('peer: ', peer);
        console.log('answer: ', answer);

        peer.setRemoteDescription(answer);

        return;
    }
}

messageInput.addEventListener('keyup', function(event){
    if(event.keyCode == 13){
        event.preventDefault();

        btnSendMsg.click();
    }
});

btnSendMsg.onclick = btnSendMsgOnClick;

function btnSendMsgOnClick(){
    var message = messageInput.value;
    
    var li = document.createElement("li");
    li.appendChild(document.createTextNode("Me: " + message));
    ul.appendChild(li);
    
    var dataChannels = getDataChannels();

    console.log('Sending: ', message);

    // send to all data channels
    for(index in dataChannels){
        dataChannels[index].send(username + ': ' + message);
    }
    
    messageInput.value = '';
}


/*
getUserMedia(constraints)
연결된 장치들 중 constraints에 만족하는 장치들 불러옴
*/ 
const constraints = {
    'video': true,
    'audio': true
}

userMedia = navigator.mediaDevices.getUserMedia(constraints)
    .then(stream => {
        localStream = stream;
        console.log('Got MediaStream:', stream);
        var mediaTracks = stream.getTracks();
        
        for(i=0; i < mediaTracks.length; i++){
            console.log(mediaTracks[i]);
        }
        
        localVideo.srcObject = localStream;
        localVideo.muted = true;

        window.stream = stream;

        audioTracks = stream.getAudioTracks();
        videoTracks = stream.getVideoTracks();

        // unmute audio and video by default
        audioTracks[0].enabled = true;
        videoTracks[0].enabled = true;
    })
    .catch(error => {
        console.error('Error accessing media devices.', error);
    });


function sendSignal(action, message){
    webSocket.send(
        JSON.stringify(
            {
                'peer': username,
                'action': action,
                'message': message,
            }
        )
    )
}

// create RTCPeerConnection as offerer
function createOfferer(peerUsername, receiver_channel_name){

    var peer = new RTCPeerConnection(null);
    
    addLocalTracks(peer);

    // create and manage an RTCDataChannel
    var dc = peer.createDataChannel("channel");
    dc.onopen = () => {
        console.log("Connection opened.");
    };
    var remoteVideo = null;

    dc.onmessage = dcOnMessage;

    remoteVideo = createVideo(peerUsername);
    setOnTrack(peer, remoteVideo);
    console.log('Remote video source: ', remoteVideo.srcObject);

    mapPeers[peerUsername] = [peer, dc];

    peer.oniceconnectionstatechange = () => {
        var iceConnectionState = peer.iceConnectionState;
        if (iceConnectionState === "failed" || iceConnectionState === "disconnected" || iceConnectionState === "closed"){
            console.log('Deleting peer');
            delete mapPeers[peerUsername];
            if(iceConnectionState != 'closed'){
                peer.close();
            }
            removeVideo(remoteVideo);
        }
    };

 
    peer.onicecandidate = (event) => {
        if(event.candidate){
            console.log("New Ice Candidate! Reprinting SDP" + JSON.stringify(peer.localDescription));
            return;
        }
    
        
        console.log('Gathering finished! Sending offer SDP to ', peerUsername, '.');
        console.log('receiverChannelName: ', receiver_channel_name);

        // send offer to new peer
        // after ice candidate gathering is complete
        sendSignal('new-offer', {
            'sdp': peer.localDescription,
            'receiver_channel_name': receiver_channel_name,
        });
    }


    peer.createOffer()
        .then(o => peer.setLocalDescription(o))
        .then(function(event){
            console.log("Local Description Set successfully.");
        });

    console.log('mapPeers[', peerUsername, ']: ', mapPeers[peerUsername]);

    return peer;
}

// create RTCPeerConnection as answerer
function createAnswerer(offer, peerUsername, receiver_channel_name){
    var peer = new RTCPeerConnection(null);

    addLocalTracks(peer);


    // set remote video
    var remoteVideo = createVideo(peerUsername);

    // and add tracks to remote video
    setOnTrack(peer, remoteVideo);

    // it will have an RTCDataChannel
    peer.ondatachannel = e => {
        console.log('e.channel.label: ', e.channel.label);
        peer.dc = e.channel;
        peer.dc.onmessage = dcOnMessage;
        peer.dc.onopen = () => {
            console.log("Connection opened.");
        }

        // store the RTCPeerConnection
        mapPeers[peerUsername] = [peer, peer.dc];
    }

    peer.oniceconnectionstatechange = () => {
        var iceConnectionState = peer.iceConnectionState;
        if (iceConnectionState === "failed" || iceConnectionState === "disconnected" || iceConnectionState === "closed"){
            delete mapPeers[peerUsername];
            if(iceConnectionState != 'closed'){
                peer.close();
            }
            removeVideo(remoteVideo);
        }
    };

    peer.onicecandidate = (event) => {
        if(event.candidate){
            console.log("New Ice Candidate! Reprinting SDP" + JSON.stringify(peer.localDescription));
            return;
        }
        

        console.log('Gathering finished! Sending answer SDP to ', peerUsername, '.');
        console.log('receiverChannelName: ', receiver_channel_name);

        // send answer to offering peer
        sendSignal('new-answer', {
            'sdp': peer.localDescription,
            'receiver_channel_name': receiver_channel_name,
        });
    }

    peer.setRemoteDescription(offer)
        .then(() => {
            console.log('Set offer from %s.', peerUsername);
            return peer.createAnswer();
        })
        .then(a => {
            console.log('Setting local answer for %s.', peerUsername);
            return peer.setLocalDescription(a);
        })
        .then(() => {
            console.log('Answer created for %s.', peerUsername);
            console.log('localDescription: ', peer.localDescription);
            console.log('remoteDescription: ', peer.remoteDescription);
        })
        .catch(error => {
            console.log('Error creating answer for %s.', peerUsername);
            console.log(error);
        });

    return peer
}

function dcOnMessage(event){
    var message = event.data;
    
    var li = document.createElement("li");
    li.appendChild(document.createTextNode(message));
    ul.appendChild(li);
}

// get all stored data channels
function getDataChannels(){
    var dataChannels = [];
    
    for(peerUsername in mapPeers){
        console.log('mapPeers[', peerUsername, ']: ', mapPeers[peerUsername]);
        var dataChannel = mapPeers[peerUsername][1];
        console.log('dataChannel: ', dataChannel);

        dataChannels.push(dataChannel);
    }

    return dataChannels;
}

// get all stored RTCPeerConnections
// peerStorageObj is an object (either mapPeers or mapScreenPeers)
function getPeers(peerStorageObj){
    var peers = [];
    
    for(peerUsername in peerStorageObj){
        var peer = peerStorageObj[peerUsername][0];
        console.log('peer: ', peer);

        peers.push(peer);
    }

    return peers;
}


function createVideo(peerUsername){
    var remoteVideo = document.getElementById('remoteVideo');

    remoteVideo.id = peerUsername + '-video';
    remoteVideo.autoplay = true;
    remoteVideo.playsinline = true;

    return remoteVideo;
}

function setOnTrack(peer, remoteVideo){
    console.log('Setting ontrack:');
    // create new MediaStream for remote tracks
    var remoteStream = new MediaStream();

    // assign remoteStream as the source for remoteVideo
    remoteVideo.srcObject = remoteStream;

    console.log('remoteVideo: ', remoteVideo.id);

    peer.addEventListener('track', async (event) => {
        console.log('Adding track: ', event.track);
        remoteStream.addTrack(event.track, remoteStream);
    });
}


function addLocalTracks(peer){

    localStream.getTracks().forEach(track => {
        console.log('Adding localStream tracks.');
        peer.addTrack(track, localStream);
    });

    return;
}

function removeVideo(video){
    // get the video wrapper
    var videoWrapper = video.parentNode;
    // remove it
    videoWrapper.parentNode.removeChild(videoWrapper);
}
