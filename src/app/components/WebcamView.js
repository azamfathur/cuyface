import Webcam from "react-webcam";
import { FiCamera,FiRefreshCcw } from "react-icons/fi";

export default function WebcamView({
    webcamRef,
    canvasRef,
    photoDataUrl,
    errorMessage,
    isPotrait,
    videoConstraint,
    capturePhoto,
    retakePhoto,
    formAction,
    onSubmit,
    ridInputRef,
    isLoading
}) {
    //Determine which button to show take or retake
    const isPhotoTaken = !!photoDataUrl;
    return (
        <div className="relative w-full rounded overflow-hidden bg-black">
            <Webcam
                ref={webcamRef}
                audio={false}
                className={` ${isPotrait ? 'aspect-[9/16]' : 'aspect-video'} object-cover`}
                videoConstraints={videoConstraint}
                mirrored
                screenshotFormat='image/jpeg'
                screenshotQuality={0.9}
            />
            {isPhotoTaken && (
                <img src={photoDataUrl} alt="capture" className="absolute inset-0 w-full h-full object-cover" />
            )}

            <div className="absolute bottom-1 left-1/2 -translate-1/2 flex items-center gap-3">
                {!isPhotoTaken ?(
                    <button
                        onClick={capturePhoto}
                        className="w-14 h-14 rounded-full bg-white text-gray-900 flex items-center justify-center shadow"
                    ><FiCamera /></button>
                ) : (
                    <button
                        onClick={retakePhoto}
                        className="w-14 h-14 rounded-full bg-white text-gray-900 flex items-center justify-center shadow"
                    ><FiRefreshCcw /></button>
                )}
                {/* //analysis form button */}
                <form action={formAction} onSubmit={onSubmit}>
                    <input type="hidden" name="image" value={photoDataUrl} />
                    <input ref={ridInputRef} type="hidden" name="rid" defaultValue={''} />
                    <button
                        type='submit'
                        disabled={!isPhotoTaken|| isLoading}
                        className={`px-4 h-14 rounded-xl text-white shadw transition ${!isPhotoTaken || isLoading ? 'bg-gray-400' : 'bg-emerald-700 hover:bg-emerald-800'}`}
                    >
                        {isLoading ? "Tunggu...." : "Ramal"}
                    </button>
                </form>
            </div>
            {errorMessage && (<p className='w-full text-white p-2 bg-red-600'>{errorMessage}</p>)}
            <canvas ref={canvasRef} className='hidden' />
        </div>
    );
}

