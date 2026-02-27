/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  Banana, 
  Upload, 
  Image as ImageIcon, 
  Sparkles, 
  Settings2, 
  Download, 
  Edit3, 
  MoreVertical, 
  Wand2,
  ChevronDown,
  Loader2,
  X,
  Layers,
  Zap,
  BrainCircuit,
  History,
  Sun,
  Moon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { generateImage, AspectRatio, ModelType } from './services/gemini';

// --- Types ---

interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  timestamp: number;
}

// --- Components ---

const Header = ({ theme, toggleTheme }: { theme: 'light' | 'dark', toggleTheme: () => void }) => (
  <header className="glass-header px-6 py-4 flex items-center justify-between">
    <div className="flex items-center gap-2">
      <div className="bg-banana p-1.5 rounded-lg shadow-sm">
        <Banana className="w-6 h-6 text-black" />
      </div>
      <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-[var(--text-primary)] to-[var(--text-secondary)] bg-clip-text text-transparent">
        Nano Banana
      </span>
    </div>
    
    <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[var(--text-secondary)]">
      <a href="#" className="hover:text-banana transition-colors">Generate</a>
      <a href="#" className="hover:text-banana transition-colors">Edit</a>
      <a href="#" className="hover:text-banana transition-colors">Fusion</a>
      <a href="#" className="hover:text-banana transition-colors">Pricing</a>
    </nav>

    <div className="flex items-center gap-4">
      <button 
        onClick={toggleTheme}
        className="p-2 rounded-lg hover:bg-zinc-500/10 transition-colors text-[var(--text-secondary)]"
      >
        {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
      </button>
      <button className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">Sign In</button>
      <button className="bg-[var(--text-primary)] text-[var(--bg-app)] px-4 py-2 rounded-lg text-sm font-bold hover:opacity-90 transition-all active:scale-95">
        Get Started
      </button>
    </div>
  </header>
);

const FeatureCard = ({ icon: Icon, title, description }: { icon: any, title: string, description: string }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="glass p-6 rounded-2xl flex flex-col gap-4"
  >
    <div className="w-12 h-12 rounded-xl bg-banana/10 flex items-center justify-center">
      <Icon className="w-6 h-6 text-banana" />
    </div>
    <h3 className="text-lg font-bold">{title}</h3>
    <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{description}</p>
  </motion.div>
);

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
  const [model, setModel] = useState<ModelType>('gemini-2.5-flash-image');
  const [isGenerating, setIsGenerating] = useState(false);
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Theme effect
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  // Auto-expand textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [prompt]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    try {
      const results = await generateImage({
        prompt,
        aspectRatio,
        model
      });
      
      const newImages = results.map(url => ({
        id: Math.random().toString(36).substr(2, 9),
        url,
        prompt,
        timestamp: Date.now()
      }));
      
      setImages(prev => [...newImages, ...prev]);
    } catch (error) {
      console.error("Generation failed:", error);
      alert("Failed to generate image. Please check your API key.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setUploadedFiles(prev => [...prev, ...files].slice(0, 5));
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300">
      <Header theme={theme} toggleTheme={toggleTheme} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12 flex flex-col gap-16">
        
        {/* Workspace Area */}
        <section className="grid lg:grid-cols-[1fr_400px] gap-12 items-start">
          
          {/* Left: Input Section */}
          <div className="flex flex-col gap-8">
            <div className="space-y-2">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                Create anything you can <span className="text-banana">imagine.</span>
              </h1>
              <p className="text-[var(--text-secondary)] text-lg">
                High-fidelity image generation powered by Gemini.
              </p>
            </div>

            <div className="glass p-6 rounded-3xl space-y-6 shadow-sm">
              {/* Drag & Drop Zone */}
              <div className="relative group">
                <input 
                  type="file" 
                  multiple 
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="border-2 border-dashed border-[var(--glass-border)] rounded-2xl p-8 flex flex-col items-center justify-center gap-3 group-hover:border-banana/50 transition-colors">
                  <div className="w-12 h-12 rounded-full bg-zinc-500/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Upload className="w-6 h-6 text-[var(--text-secondary)] opacity-40 group-hover:text-banana group-hover:opacity-100" />
                  </div>
                  <p className="text-sm text-[var(--text-secondary)] opacity-60">
                    <span className="text-[var(--text-primary)] font-medium">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-[var(--text-secondary)] opacity-40">Up to 5 images, max 5MB each</p>
                </div>
              </div>

              {/* Uploaded Files Preview */}
              <AnimatePresence>
                {uploadedFiles.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="flex flex-wrap gap-3"
                  >
                    {uploadedFiles.map((file, i) => (
                      <div key={i} className="relative group w-16 h-16 rounded-lg overflow-hidden border border-[var(--glass-border)]">
                        <img 
                          src={URL.createObjectURL(file)} 
                          alt="upload preview" 
                          className="w-full h-full object-cover"
                        />
                        <button 
                          onClick={() => removeFile(i)}
                          className="absolute top-1 right-1 bg-black/60 p-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-white"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Prompt Input */}
              <div className="relative">
                <textarea
                  ref={textareaRef}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe your image in detail..."
                  className="w-full bg-transparent text-xl font-medium placeholder:text-[var(--text-secondary)] placeholder:opacity-40 focus:outline-none min-h-[100px]"
                />
              </div>

              {/* Settings Row */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[var(--border-subtle)]">
                <div className="flex items-center gap-3">
                  {/* Aspect Ratio */}
                  <div className="relative group">
                    <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-500/5 hover:bg-zinc-500/10 transition-colors text-xs font-medium">
                      <ImageIcon className="w-3.5 h-3.5" />
                      {aspectRatio}
                      <ChevronDown className="w-3 h-3 opacity-50" />
                    </button>
                    <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block glass p-2 rounded-xl min-w-[120px] shadow-lg">
                      {(['1:1', '16:9', '9:16'] as AspectRatio[]).map(ratio => (
                        <button 
                          key={ratio}
                          onClick={() => setAspectRatio(ratio)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-zinc-500/5 ${aspectRatio === ratio ? 'text-banana' : ''}`}
                        >
                          {ratio}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Model Selector */}
                  <div className="relative group">
                    <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-500/5 hover:bg-zinc-500/10 transition-colors text-xs font-medium">
                      <Zap className="w-3.5 h-3.5" />
                      {model === 'gemini-2.5-flash-image' ? 'Fast' : 'Pro'}
                      <ChevronDown className="w-3 h-3 opacity-50" />
                    </button>
                    <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block glass p-2 rounded-xl min-w-[160px] shadow-lg">
                      <button 
                        onClick={() => setModel('gemini-2.5-flash-image')}
                        className="w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-zinc-500/5 flex items-center justify-between"
                      >
                        Fast <span className="text-[10px] opacity-40">2.5 Flash</span>
                      </button>
                      <button 
                        onClick={() => setModel('gemini-3.1-flash-image-preview')}
                        className="w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-zinc-500/5 flex items-center justify-between"
                      >
                        Pro <span className="text-[10px] opacity-40">3.1 Preview</span>
                      </button>
                    </div>
                  </div>

                  <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-500/5 hover:bg-zinc-500/10 transition-colors text-xs font-medium">
                    <Sparkles className="w-3.5 h-3.5" />
                    Style
                  </button>
                </div>

                <button 
                  onClick={handleGenerate}
                  disabled={isGenerating || !prompt.trim()}
                  className="btn-primary disabled:opacity-50 disabled:scale-100 shadow-sm"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      Generate 🍌
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right: Sidebar / Quick Actions */}
          <div className="hidden lg:flex flex-col gap-6">
            <div className="glass p-6 rounded-3xl space-y-4 shadow-sm">
              <div className="flex items-center gap-2 text-sm font-bold">
                <History className="w-4 h-4 text-banana" />
                Recent Activity
              </div>
              <div className="space-y-3">
                {images.length === 0 ? (
                  <p className="text-xs text-[var(--text-secondary)] opacity-40 italic">No generations yet.</p>
                ) : (
                  images.slice(0, 3).map(img => (
                    <div key={img.id} className="flex gap-3 items-center">
                      <img src={img.url} className="w-10 h-10 rounded-lg object-cover" alt="" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] text-[var(--text-secondary)] truncate">{img.prompt}</p>
                        <p className="text-[8px] text-[var(--text-secondary)] opacity-40">Just now</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="glass p-6 rounded-3xl bg-gradient-to-br from-banana/10 to-transparent border-banana/10 shadow-sm">
              <h4 className="text-sm font-bold mb-2">Pro Tip</h4>
              <p className="text-xs text-[var(--text-secondary)] opacity-70 leading-relaxed">
                Use the "Thinking" model for complex prompts that require spatial reasoning or text rendering.
              </p>
            </div>
          </div>
        </section>

        {/* Results Area */}
        <section className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Generations</h2>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg hover:bg-zinc-500/5 transition-colors">
                <Settings2 className="w-5 h-5 text-[var(--text-secondary)] opacity-40" />
              </button>
            </div>
          </div>

          {isGenerating && images.length === 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="aspect-square rounded-3xl bg-zinc-500/5 animate-pulse overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-zinc-500/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                </div>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {images.map((img) => (
                <motion.div
                  key={img.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="group relative aspect-square rounded-3xl overflow-hidden glass shadow-sm"
                >
                  <img 
                    src={img.url} 
                    alt={img.prompt} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-6">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md transition-colors text-white">
                        <Download className="w-4 h-4" />
                      </button>
                      <button className="p-2 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md transition-colors text-white">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      <p className="text-xs text-white/80 line-clamp-2 font-medium">
                        {img.prompt}
                      </p>
                      <div className="flex gap-2">
                        <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-white text-black text-xs font-bold hover:bg-white/90 transition-colors">
                          <Edit3 className="w-3.5 h-3.5" />
                          Edit
                        </button>
                        <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-banana text-black text-xs font-bold hover:bg-banana-dark transition-colors">
                          <Wand2 className="w-3.5 h-3.5" />
                          Pro
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </section>

        {/* Features Showcase */}
        <section className="py-16 border-t border-[var(--border-subtle)]">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl font-bold">Unleash your creativity</h2>
            <p className="text-[var(--text-secondary)]">
              Nano Banana offers professional-grade tools for creators, designers, and enthusiasts.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={Layers}
              title="Character Consistency"
              description="Maintain the same characters across multiple generations with advanced reference mapping."
            />
            <FeatureCard 
              icon={BrainCircuit}
              title="Multi-Image Fusion"
              description="Blend up to 5 images together to create unique compositions and styles."
            />
            <FeatureCard 
              icon={Edit3}
              title="Conversational Editing"
              description="Edit your images just by talking to the AI. 'Add a hat', 'Change the lighting', 'Make it cinematic'."
            />
          </div>
        </section>

      </main>

      <footer className="border-t border-[var(--border-subtle)] py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <Banana className="w-5 h-5 text-banana" />
            <span className="font-bold opacity-60">Nano Banana</span>
          </div>
          <div className="flex gap-8 text-sm text-[var(--text-secondary)] opacity-60">
            <a href="#" className="hover:text-[var(--text-primary)] transition-colors">Terms</a>
            <a href="#" className="hover:text-[var(--text-primary)] transition-colors">Privacy</a>
            <a href="#" className="hover:text-[var(--text-primary)] transition-colors">API</a>
            <a href="#" className="hover:text-[var(--text-primary)] transition-colors">Support</a>
          </div>
          <p className="text-sm text-[var(--text-secondary)] opacity-40">© 2026 Nano Banana. All rights reserved.</p>
        </div>
      </footer>

      {/* Global Animations */}
      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
