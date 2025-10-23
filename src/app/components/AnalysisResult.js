import { FiBookOpen } from "react-icons/fi";
import { cleanUpHTML } from "@/app/utils/html";

export default function AnaysisResult({resultRef, typedHtml, isTyping, responseHtml }){
    //logic from original component
    const htmlToRender = cleanUpHTML(typedHtml || (isTyping? '' : responseHtml ) || '');

    return(
        <section ref={resultRef} className="w-full">
            <div className="bg-gray-800 p-6 mt-8 rounded-xl shadow border border-gray-700">
                <div className="text-lg text-amber-300 flex gap-2 items-center font-bold">
                    <FiBookOpen />Hasil Ramalan
                </div>
            {isTyping && !typedHtml && (
                <div className="flex items-center gap-1 text-sm text-gray-500">
                    <span className="w-2 h2 rounded-full bg-gray-400 animate-pulse" />
                    <span className="w-2 h2 rounded-full bg-gray-400 animate-pulse [animation-delay: .15s]" />
                    <span className="w-2 h2 rounded-full bg-gray-400 animate-pulse [animation-delay: .3s]" />
                </div>
            )}
            {/* //rendered HTML result */}
            {htmlToRender.trim() ? (
                <div className="text-base leading-6 [&_section]:mt-3 [&_h2]:text-lg [&_h2]:font-bold"
                dangerouslySetInnerHTML={{ __html: htmlToRender }} />
            ) : (
                <div className='bg-gray-500 p-4'>
                        <p className='font-semibold text-white'>Ambil Foto kamu lalu tekan 'Ramalkan' agar kamu tau kondisi kamu sekarang, asoyy</p>
                </div>
            )}
            </div>

            
        </section>
    )
}