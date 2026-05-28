import { Loader2, CheckCircle2, AlertTriangle, Download, Sparkles} from 'lucide-react';

const statusIcons = {
    FETCHING:
        <Loader2 className="h-4 w-4 animate-spin" />,
    READY:
        <Sparkles className="h-4 w-4" />,
    'PROCESSING-A':
        <Loader2 className="h-4 w-4 animate-spin" />,
    'PROCESSING-V':
        <Loader2 className="h-4 w-4 animate-spin" />,
    DOWNLOADING:
        <Download className="h-4 w-4" />,
    SUCCESS:
        <CheckCircle2 className="h-4 w-4" />,
    ERROR:
        <AlertTriangle className="h-4 w-4" />
};

const statusStyles = {
    FETCHING:
        'border-yellow-400/20 bg-yellow-500/5 text-yellow-200',
    READY:
        'border-blue-400/20 bg-blue-500/5 text-blue-200',
    'PROCESSING-A':
        'border-cyan-400/20 bg-cyan-500/5 text-cyan-200',
    'PROCESSING-V':
        'border-violet-400/20 bg-violet-500/5 text-violet-200',
    DOWNLOADING:
        'border-orange-400/20 bg-orange-500/5 text-orange-200',
    SUCCESS:
        'border-emerald-400/20 bg-emerald-500/5 text-emerald-200',
    ERROR:
        'border-rose-400/20 bg-rose-500/5 text-rose-200'
};

const StatusMessage = ({ status, statusMsg }) => {
    const style = statusStyles[status];

    if (status === 'IDLE') {
        return null;
    } 
    
    return (
        <div className={`${style} rounded-2xl border px-5 py-4 text-sm
        font-medium shadow-2xl shadow-black/30 ring-1 ring-white/5
        backdrop-blur-sm transition-all duration-300`}>
            <div className="flex items-center gap-3">
                <div className='flex gap-2 items-center'>
                    <div className='animate-pulse'>{statusIcons[status]}</div>
                    <p>{statusMsg}</p>
                </div>
            </div>
        </div>
    );
};

export default StatusMessage;