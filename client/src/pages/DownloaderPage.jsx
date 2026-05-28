import URLForm from "../components/URLForm";
import useYoutubeDownloader from "../hooks/useYoutubeDownloader";

const DownloaderPage = () => {
    const downloader = useYoutubeDownloader();
    
    return (
        <div className='min-h-screen bg-zinc-950 flex flex-col justify-center items-center px-2'>
            <URLForm downloader={downloader} />
        </div>
    )
}

export default DownloaderPage;