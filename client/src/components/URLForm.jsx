import StatusMessage from "./StatusMessage";
import VideoCard from "../components/VideoCard";

const URLForm = ({downloader}) => {

    const isWorking = 
        downloader.status.includes('FETCHING') ||
        downloader.status.includes('PROCESSING') ||
        downloader.status.includes('DOWNLOADING');

    return (
        <div className="rounded-4xl w-full items-center max-w-3xl bg-zinc-900 border border-zinc-800 shadow-2xl p-6">
            { !downloader.metadata && <div className="mb-8">
                <h1 className="text-3xl font-bold text-white">
                    YouTube Downloader
                </h1>
                <p className='text-zinc-400 mt-2'>
                    Download YouTube audio and convert to Mp3
                </p>
            </div>
            }
            
            <div className="space-y-2 flex flex-col gap-2 mb-6">
                <VideoCard downloader={downloader} />
                
                { !downloader.metadata && <input type='text' placeholder="Paste YouTube URL..."
                value={downloader.url} onChange={(e) => downloader.setUrl(e.target.value)}
                className='flex-1 bg-zinc-950 border border-zinc-700
                rounded-3xl px-5 py-5 text-white outline-none
                focus:border-red-500 transition' />}
                    
                <StatusMessage status={downloader.status} statusMsg={downloader.statusMsg} />

                {downloader.metadata && <div className='mt-3 flex flex-col gap-2.5'>
                <button onClick={() => { downloader.startDownload('audio') }} disabled={isWorking}
                    className='w-full rounded-xl border border-teal-800 bg-teal-950/70 px-4 py-3 
                    font-medium text-teal-100 transition-all duration-200 hover:bg-teal-900 shadow-lg shadow-black/20
                    hover:border-teal-700 disabled:cursor-not-allowed disabled:opacity-50'
                    >Download MP3</button>
                    
                    <button onClick={() => { downloader.startDownload('video') }} disabled={isWorking}
                    className='w-full rounded-xl border border-fuchsia-900 bg-fuchsia-950/50 px-4 py-3 
                    shadow-lg shadow-black/20 font-medium text-fuchsia-100 transition-all duration-200 
                    hover:bg-fuchsia-900/70 hover:border-fuchsia-800 disabled:cursor-not-allowed 
                    disabled:opacity-50'>Download MP4</button>

                    <button onClick={downloader.handleCancel} disabled={isWorking}
                    className='w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3 
                    text-neutral-300 transition-all duration-200 hover:bg-neutral-900 
                    hover:border-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed'
                    >Back</button>
                    </div>}  
            </div>
             { !downloader.metadata && <p className='mt-2 text-zinc-400'>Developed by: Amir Malik</p> }
        </div>
    )
}

export default URLForm;