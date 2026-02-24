'use client';

export function BottomBar() {
  return (
    <footer className="bottom-bar">
      <div className="bottom-bar-content">
        <span className="bottom-bar-text">powered by </span>
        <a 
          href="https://opencode.ai/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="bottom-bar-link"
        >
          opencode
        </a>
        <span className="bottom-bar-text"> and </span>
        <a 
          href="https://www.minimaxi.com/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="bottom-bar-link"
        >
          minimax
        </a>
      </div>
    </footer>
  );
}
