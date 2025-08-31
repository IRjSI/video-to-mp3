import "./App.css"
import { useState } from "react";
import axios from "axios";
import { Download, FileVideo, Loader2, Music, Upload } from "lucide-react";

export default function Home() {
  const [input, setInput] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [blob, setBlob] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input) return alert("No file selected");

    setLoading(true);
    setProgress(0);
    setBlob(null);

    const formData = new FormData();
    formData.append("input", input);

    try {
      const res = await axios.post("http://localhost:3000/conversion", formData, {
        responseType: "blob",
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total ?? 1)
          );
          setProgress(percent);
        },
      });

      setBlob(res.data);
      setProgress(100);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${input?.name.split(".")[0]}-converted.mp3`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
      
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-slate-800 rounded-lg mb-4">
            <Music className="w-6 h-6 text-slate-300" />
          </div>
          <h1 className="text-2xl font-semibold text-white mb-1">
            Video to MP3 Converter
          </h1>
          <p className="text-slate-400 text-sm">
            Convert your video files to MP3 audio
          </p>
        </div>

        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="space-y-4">

            <div className="relative">
              <input
                type="file"
                accept="video/*"
                onChange={(e) => setInput(e.target.files?.[0] ?? null)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                id="file-upload"
              />
              <label 
                htmlFor="file-upload" 
                className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-slate-600 rounded-lg hover:border-slate-500 transition-colors cursor-pointer hover:bg-slate-700/50"
              >
                {input ? (
                  <div className="flex items-center space-x-2 text-green-400">
                    <FileVideo className="w-5 h-5" />
                    <span className="text-sm font-medium truncate max-w-48">{input.name}</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center space-y-1 text-slate-400">
                    <Upload className="w-6 h-6" />
                    <span className="text-sm font-medium">Select video file</span>
                    <span className="text-xs text-slate-500">MP4, AVI, MOV, etc.</span>
                  </div>
                )}
              </label>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading || !input}
              className="w-full h-10 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-600 disabled:text-slate-400 text-white font-medium rounded-lg transition-colors disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Converting...</span>
                </>
              ) : (
                <>
                  <Music className="w-4 h-4" />
                  <span>Convert to MP3</span>
                </>
              )}
            </button>
          </div>

          {loading && (
            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-slate-400">Converting</span>
                <span className="text-sm text-slate-400">{progress}%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div
                  className="h-2 bg-blue-500 transition-all duration-300 ease-out rounded-full"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}

          {blob && (
            <div className="mt-4">
              <button
                onClick={handleDownload}
                className="w-full h-10 bg-green-600 hover:bg-green-500 text-white font-medium rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Download MP3</span>
              </button>
            </div>
          )}
        </div>

        <div className="text-center mt-6">
          <p className="text-slate-500 text-xs">
            Supports MP4, AVI, MOV and other video formats
          </p>
        </div>
      </div>
    </div>
  );
}
