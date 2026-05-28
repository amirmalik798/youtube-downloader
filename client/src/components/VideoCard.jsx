function formatSeconds(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [hours, minutes, seconds]
    .map(val => val.toString().padStart(2, '0'))
    .join(':');
}

const VideoCard = ({ downloader }) => {
    const { metadata } = downloader;
    
    if (!metadata) {
        return null;
    }

    return (
        <div className='w-full max-w-3xl bg-zinc-900 border border-zinc-800
        rounded-3xl overflow-hidden shadow-2xl'>
            <img src={metadata.thumbnail} className='w-full h-48 object-cover'></img>
            <div className='p-4'>
                <h2 className='text-m font-bold text-white leading-snug'>
                    {metadata.fulltitle || 'N/A'}
                </h2>
                <div className="mt-2 space-y-1 text-zinc-400">
                    <h3>Duration: {formatSeconds(metadata.duration) || 'N/A'}</h3>
                    <h3>Uploader: {metadata.uploader || 'N/A'}</h3>
                    <h3>Views: {metadata.view_count.toLocaleString() || 'N/A'}</h3>
                </div>
            </div>
        </div>
    )
}  

export default VideoCard;