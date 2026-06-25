import { ExternalLink, Zap } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t-2 border-black bg-black text-white py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-7 h-7 bg-[#00C2FF] text-black border-2 border-white font-black text-sm">
            <Zap size={13} fill="currentColor" />
          </span>
          <span className="font-black tracking-widest text-sm uppercase">DEV.PORTFOLIO</span>
        </div>
        <p className="text-xs text-gray-400 font-medium tracking-wide">
          Crafted with ⚡ using <span className="text-[#00C2FF] font-bold">Laravel</span> + <span className="text-[#00C2FF] font-bold">React</span>
        </p>
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-xs font-bold border-2 border-white px-3 py-2 hover:bg-white hover:text-black transition-all duration-150"
        >
          <ExternalLink size={14} /> GitHub
        </a>
      </div>
    </footer>
  );
}
