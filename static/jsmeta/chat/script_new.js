function Main(){

    const runHandpose = async() => {
        const model = handPoseDetection.SupportedModels.MediaPipeHands;
        console.log("Handpose model loaded");

        const detectorConfig = {
            runtime: 'mediapipe',
            modelType: 'lite',
            solutionPath: "https://cdn.jsdelivr.net/npm/@mediapipe/hands/"
        };

        // Get Video Properties
        const localVideo = document.getElementById('localVideo');
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

        const detector = await handPoseDetection.createDetector(model, detectorConfig);

        //Loop and detect hands
        setInterval(() => {
            detect(detector);
        }, 10000);
    };
    
    const detect = async (detector) => {
        // Make Detections
        const hand = await detector.estimateHands(localVideo);
        console.log(hand);        
    };
    
    runHandpose();

}


Main();

