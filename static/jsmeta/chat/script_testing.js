const config = {
    video: { width: 640, height: 480, fps: 100 }
};

const landmarkColors = {
    thumb: 'red',
    indexFinger: 'blue',
    middleFinger: 'yellow',
    ringFinger: 'green',
    pinky: 'pink',
    palmBase: 'white'
};

const gestureStrings = {
    'thumbs_up': '👍',
    'victory': '✌🏻'
};









// const videoElement = document.getElementById('localVideo');
// const canvasElement = document.getElementById('output-canvas');
// const canvasCtx = canvasElement.getContext('2d');
// const resultLayer = document.getElementById("pose-result");


// var localStream = new MediaStream();

// const constraints = {
//     'video': true,
//     'audio': true
// }

// userMedia = navigator.mediaDevices.getUserMedia(constraints)
//     .then(stream => {
//         localStream = stream;
//         console.log('Got MediaStream:', stream);
//         var mediaTracks = stream.getTracks();
        
//         for(i=0; i < mediaTracks.length; i++){
//             console.log(mediaTracks[i]);
//         }
        
//         videoElement.srcObject = localStream;
//         videoElement.muted = true;

//         window.stream = stream; // make variable available to browser console

//         audioTracks = stream.getAudioTracks();
//         videoTracks = stream.getVideoTracks();

//         // unmute audio and video by default
//         audioTracks[0].enabled = true;
//         videoTracks[0].enabled = true;
//     })
//     .catch(error => {
//         console.error('Error accessing media devices.', error);
//     });











async function main() {
    


    const video = document.getElementById('localVideo');
    const canvas = document.getElementById('output-canvas');
    const ctx = canvas.getContext('2d');
    const resultLayer = document.getElementById("pose-result");


    var localStream = new MediaStream();

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
            
            video.srcObject = localStream;
            video.muted = true;

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


    // configure gesture estimator
    // add "✌🏻" and "👍" as sample gestures
    const knownGestures = [
        fp.Gestures.VictoryGesture,
        fp.Gestures.ThumbsUpGesture
    ];


    const GE = new fp.GestureEstimator(knownGestures);


    // load handpose model
    const model = await handpose.load();
    console.log("Handpose model loaded");

    // main estimation loop
    const estimateHands = async () => {
        // clear canvas overlay
        ctx.clearRect(0, 0, config.video.width, config.video.height);
        resultLayer.innerText = '';

        // get hand landmarks from video
        // Note: Handpose currently only detects one hand at a time
        // Therefore the maximum number of predictions is 1
        const predictions = await model.estimateHands(video, true);
        console.log(predictions)

        for(let i = 0; i < predictions.length; i++) {
            // draw colored dots at each predicted joint position
            for(let part in predictions[i].annotations) {
            for(let point of predictions[i].annotations[part]) {
                drawPoint(ctx, point[0], point[1], 3, landmarkColors[part]);
                }
            }

        
        // estimate gestures based on landmarks
        // using a minimum score of 9 (out of 10)
        // gesture candidates with lower score will not be returned
        const est = GE.estimate(predictions[i].landmarks, 9);

        if(est.gestures.length > 0) {

        // find gesture with highest match score
        let result = est.gestures.reduce((p, c) => { 
            return (p.score > c.score) ? p : c;
        });

        resultLayer.innerText = gestureStrings[result.name];
        }

        // update debug info
        updateDebugInfo(est.poseData);
    }

    // ...and so on
    setTimeout(() => { estimateHands(); }, 1000 / config.video.fps);
    };



    
    estimateHands();
    console.log("Starting predictions");
}

async function initCamera(width, height, fps) {

    const constraints = {
    audio: false,
    video: {
        facingMode: "user",
        width: width,
        height: height,
        frameRate: { max: fps }
    }
    };

    const video = document.getElementById("localVideo");
    video.width = width;
    video.height = height;

    // get video stream
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    video.srcObject = stream;

    return new Promise(resolve => {
    video.onloadedmetadata = () => { resolve(video) };
    });
}

function drawPoint(ctx, x, y, r, color) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
}

function updateDebugInfo(data) {
    for(let fingerIdx in data) {
    document.getElementById("curl-" + fingerIdx).innerText = data[fingerIdx][1];
    document.getElementById("dir-" + fingerIdx).innerText = data[fingerIdx][2];
    }
}






window.addEventListener("DOMContentLoaded", () => {

    initCamera(
    config.video.width, config.video.height, config.video.fps
    ).then(video => {
    video.play();
    video.addEventListener("loadeddata", event => {
        console.log("Camera is ready");
        main();
    });
    });

    const canvas = document.getElementById("output-canvas");
    canvas.width = config.video.width;
    canvas.height = config.video.height;
    console.log("Canvas initialized");
});