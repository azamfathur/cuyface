import { useState, useMemo, useCallback } from "react";

export function useCaptureLogic(webcamRef, canvasRef, usePotrait){
    const isPotrait = usePotrait();
    const [photoDataUrl, setPhotoDataUrl] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const videoConstraint = useMemo(
            () => ({
                facingMode: "user",
                width: { ideal: isPotrait? 720 : 1280 },
                height: { ideal: isPotrait? 1280 : 720 },
                frameRate: { ideal: 30, max: 60 }
            }), [isPotrait]
        )

    const capturePhoto = useCallback (() => {
        setErrorMessage('');
        const video = webcamRef.current?.video;
        const canvas = canvasRef.current;
        
        if (!video || !canvas || !video.videoWidth){
            setErrorMessage('Kamera belum siap, cek dulu yaa....');
            return;
        }

        const vw = video.videoWidth, vh = video.videoHeight;

        const targetW = isPotrait? 720 : 1280;
        const targetH = isPotrait? 1280 : 720;

        const srcAspect = vw / vh, dstAspect = targetW / targetH;

        let sx = 0, sy = 0, sw= vw, sh = vh;

        if(srcAspect > dstAspect){
            sh = vh;
            sw = Math.round(vh *dstAspect);
            sx = Math.round((vw - sw ) / 2);
        } else {
            sw = vw;
            sh = Math.round(vw/dstAspect);
            sy = Math.round((vh - sh) / 2);
        }

        canvas.width = targetW;
        canvas.height = targetH;

        const context = canvas.getContext("2d");
        context.drawImage(video, sx, sy, sw, sh, 0, 0, targetW, targetH);

        const result = canvas.toDataURL("image/jpeg", 0.9)
        setPhotoDataUrl(result);
    }, [isPotrait, webcamRef, canvasRef])//identifier yang akan di liat perubahannya

    const retakePhoto = useCallback(() => {
        setPhotoDataUrl('');
        //retake logic cuma replace state photo data dan error message, sisanya bakal di handle sama useAnalysisLogic
    }, []); //kosong karna hanya di trigger secara manual pakai button

    return { photoDataUrl, setPhotoDataUrl, errorMessage, setErrorMessage,videoConstraint, isPotrait, capturePhoto, retakePhoto}
}