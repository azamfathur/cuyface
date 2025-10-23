'use client'
import React, { useRef } from "react";
import { useCaptureLogic } from "@/app/hooks/useCapture";
import { usePotrait } from "@/app/hooks/usePotrait";
import { useAnalysisLogic } from "../hooks/useAnalysisLogic";
import WebcamView from "./WebcamView";
import AnaysisResult from "./AnalysisResult";

function Cam() {
    //Ref (State)
    const webcamRef = useRef(null)
    const resultRef = useRef(null)
    const canvasRef = useRef(null)

    //capture Logic Hook
    const { photoDataUrl, setPhotoDataUrl,
            errorMessage, setErrorMessage,
            videoConstraint, isPotrait, capturePhoto 
        } = useCaptureLogic(webcamRef, canvasRef, usePotrait)

    //analysis Logic Hook
    const {
        ridInputRef, formAction, onSubmit, isLoading, typedHtml, isTyping, responseHtml, fullRetake
    } = useAnalysisLogic(photoDataUrl, setPhotoDataUrl, setErrorMessage, resultRef)

    //overide retakePhoto from capturelogic to include analysis reset
    const handleRetake = () => {
        fullRetake();
        // the retakePhoto in useCaptureLogic only handles photo state.
        // while fullRetake handles both photo and analysis state.
    }

    return (
        <div>
            <WebcamView
                webcamRef={webcamRef}
                canvasRef={canvasRef}
                photoDataUrl={photoDataUrl}
                errorMessage={errorMessage}
                isPotrait={isPotrait}
                videoConstraint={videoConstraint}
                capturePhoto={capturePhoto}
                retakePhoto={handleRetake}
                
                //Props
                formAction={formAction}
                onSubmit={onSubmit}
                ridInputRef={ridInputRef}
                isLoading={isLoading}
            />
            <AnaysisResult
                resultRef={resultRef}
                typedHtml={typedHtml}
                isTyping={isTyping}
                responseHtml={responseHtml}
            />
        </div>
    )
}
export default Cam;