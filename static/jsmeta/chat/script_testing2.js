function Main(){

    const runHandpose = async() => {


                //Get video properties
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


        const model = await handpose.load();
        console.log("Handpose model loaded");
        //Loop and detect hands

        setInterval(() => {
            detect(model);
        }, 10);
    };

    const detect = async (model) => {
        //Make detections
        const hand = await model.estimateHands(localVideo);
        //console.log(hand);

        if (hand.length > 0) {
            const GE = new fp.GestureEstimator([
                fp.Gestures.VictoryGesture,
                fp.Gestures.ThumbsUpGesture,
            ]);
            const gesture = await GE.estimate(hand[0].landmarks, 4);
            if (gesture.gestures !== undefined && gesture.gestures.length > 0) {
                console.log(gesture.gestures);

                const confidence = gesture.gestures.map(
                    (prediction) => prediction.confidence
                );
                console.log(confidence);
                
                const maxConfidence = confidence.indexOf(
                    Math.max.apply(null, confidence)
                );
                console.log(maxConfidence);
        
            }
        }

    }

    runHandpose();

}


Main();

