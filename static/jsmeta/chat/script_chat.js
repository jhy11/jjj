var mapPeers = {};

//Get video properties
const localVideo = document.getElementById('localVideo');
let localStream = new MediaStream();

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
    
    window.stream = stream; // make variable available to browser console

    audioTracks = stream.getAudioTracks();
    videoTracks = stream.getVideoTracks();

    // unmute audio and video by default
    audioTracks[0].enabled = true;
    videoTracks[0].enabled = true;
})
.catch(error => {
    console.error('Error accessing media devices.', error);
});


const runHandpose = async(peerUsername) => {    
    const model = await handpose.load();
    console.log("Handpose model loaded");

    //Loop and detect hands
    let detectTimer = setInterval(() => {
        detect(model, detectTimer, peerUsername);
    }, 10);
};



const detect = async (model, detectTimer, peerUsername) => {
    //Make detections
    const hand = await model.estimateHands(localVideo);

    if (hand.length > 0) {
        const GE = new fp.GestureEstimator([
            fp.Gestures.VictoryGesture,
            fp.Gestures.ThumbsUpGesture,
        ]);
        const gesture = await GE.estimate(hand[0].landmarks, 4);
        if (gesture.gestures !== undefined && gesture.gestures.length > 0) {

            const confidence = gesture.gestures.map(
                (prediction) => prediction.confidence
            );
                
            const maxConfidence = confidence.indexOf(
                Math.max.apply(null, confidence)
            );

            let result = gesture.gestures.reduce((p, c) => { 
                return (p.score > c.score) ? p : c;
            });
            if (result.name == 'thumbs_up' && result.score > 9) {
                testfunction(model, result, peerUsername);
                clearInterval(detectTimer);
            }
        }
    }
}

function testfunction(model, result, peerUsername){
    console.log('result: ', result);
    
    if(confirm(result.name + '이 감지되었습니다. 쿠폰을 발행하려면 확인을, 아니라면 취소를 누르세요')) {
        console.log("Promise Resolved");
        bargainResult = 'Accepted';
        console.log(bargainResult);

        //쿠폰 발행
        memberName = peerUsername;
        productId = document.getElementById('selectedPro').getAttribute('data-id');

        console.log('Coupon for (member name): ', memberName);
        console.log('Coupon for (product id): ', productId);

        issueCoupon(productId, memberName);

        async function issueCoupon(productId, memberName){
            const url = '/chat/issue-coupon?proId=' + productId + "&memName="+ memberName;

            const response = await fetch(url, {
                method: 'GET',
            })
            .catch((error) => {
                alert(error);
            });
        
            const result = await response.json();
        
            if (result.success === true) {
                alert(result.message);
            }
            else{
                console.log('쿠폰 발행에 실패했습니다');
            }
        }
        
    }else{
        console.log("Promise Rejected");
        bargainResult = 'Rejected';
        console.log(bargainResult);
    }

    // if bargain is over, send message
    sendSignal('end-bargain', {
        'bargain_result': bargainResult,
    });
}


const messageInput = document.getElementById('message-input');
const btnSendMsg = document.getElementById('message-submit');
const ul = document.getElementById("message-log");

const loc = window.location;
let endPoint = '';

let wsStart = 'ws://';
if(loc.protocol == 'https:'){
    wsStart = 'wss://';
}

// get shopn id
let shopId = document.getElementById('shopId').textContent;
console.log('Shop Id:', shopId);
let roomName = shopId;

endPoint = wsStart + loc.host + '/ws/chat/' + roomName + '/';
console.log('Endpoint:',endPoint) 

let webSocket;

// get username
let username = document.getElementById('username').textContent;
console.log('Username: ',username);

const btnJoin = document.getElementById('startButton');
const btnHangup = document.getElementById('hangupButton');

// join room (initiate websocket connection)
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
        alert("연결이 해제되었습니다");
        console.log('Connection closed! ', e);
    }
     
    webSocket.onerror = function(e){
        alert("이미 대화가 진행중인 채팅방입니다");
        console.log('Error occured! ', e);
    }

    btnSendMsg.disabled = false;
    messageInput.disabled = false;
}

btnHangup.onclick = () => {
    btnJoin.disabled = false;
    btnJoin.style.visibility = 'show';
    btnSendMsg.disabled = true;
    messageInput.disabled = true;

    webSocket.close()
    
    webSocket.onclose = function(e){
        alert("통화가 종료되었습니다");
        console.log('Connection closed! ', e);
    }

    //use replace instead of href
    location.replace('/');
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

    if(action == 'new-product'){
        var selectedProId = parsedData['message']['selected_product'];
        var selectedProName = parsedData['message']['selected_product_name'];

        console.log('Selected Product name: ', selectedProName);

        setProduct(selectedProName, selectedProId);
        return;
    }

    if(action == 'start-bargain'){

        console.log('Buyer asks for a bargain');
        alert('Bargain start');
        runHandpose(peerUsername);
        
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


function setProduct(productName, productId){
    document.getElementById('selectedPro').setAttribute('value', productName);
    document.getElementById('selectedPro').setAttribute('data-id', productId);
}

