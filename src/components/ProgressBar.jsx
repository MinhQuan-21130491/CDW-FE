import './styles/ProgressBar.css';

export default function ProgressBar({ progress, isActive }) {
    return (
        <div className={`progress-bar-container ${isActive ? 'active' : ''}`}>
            <div
                className="progress-bar"
                style={{ width: `${progress}%` }}
            />
        </div>
    );
}
