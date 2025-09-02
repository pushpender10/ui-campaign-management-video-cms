"use client";
import { redirect, useRouter } from "next/navigation";
import React, { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Upload as UploadIcon, X, Plus, Video as VideoIcon, Image, Sparkles } from "lucide-react";
import { useVideos } from "@/hooks/useVideos";
import { VIDEO_CATEGORIES, VIDEO_PRIVACY_OPTIONS } from "@/lib/shared/constants";
import { validateVideoFile } from "@/lib/client/utils";
import { useSession } from "next-auth/react";

export default function UploadPage() {
  const { data: session, status } = useSession();
  if (status !== 'authenticated') {
    return (
      redirect('/login')
    )
  }
  
  const router = useRouter();
  const { uploadVideo } = useVideos();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("other");
  const [privacy, setPrivacy] = useState<"PUBLIC" | "PRIVATE">("PRIVATE");
  const [campaignStartDate, setCampaignStartDate] = useState("");
  const [campaignEndDate, setCampaignEndDate] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    await createVideo();
  }

  const createVideo = async () => {
    setError(null);
    
    if (!file || !title) {
      setError("Please select a video file and enter a title");
      return;
    }

    // Validate file
    const validation = validateVideoFile(file);
    if (!validation.valid) {
      setError(validation.error || 'Invalid file');
      return;
    }

    try {
      setIsUploading(true);
      const result = await uploadVideo({
        title,
        description,
        category,
        privacy,
        campaignStartDate,
        campaignEndDate,
        file
      });
      
      router.push(`/videos/${result.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrag = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    const videoFile = files.find(file => file.type.startsWith("video/"));
    
    if (videoFile) {
      handleFileSelection(videoFile);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      handleFileSelection(file);
    }
  };

  const handleFileSelection = (file: File) => {
    setFile(file);
    setTitle(file.name.replace(/\.[^/.]+$/, ""));
  };

  const removeFile = () => {
    setFile(null);
    setTitle("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-white">Upload Video</h1>
            <p className="text-gray-400">Share your content with the world</p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          {/* File Upload Section */}
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <UploadIcon className="w-5 h-5" />
                Video File
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!file ? (
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragActive
                      ? "border-blue-500 bg-blue-500/10"
                      : "border-gray-600 hover:border-gray-500"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <VideoIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-300 mb-2">
                    Drag and drop your video file here, or{" "}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-blue-400 hover:text-blue-300 underline"
                    >
                      browse
                    </button>
                  </p>
                  <p className="text-sm text-gray-500">
                    Supports MP4, AVI, MOV, WMV, FLV, WebM (Max 500MB)
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/*"
                    onChange={handleFileInput}
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-lg">
                  <VideoIcon className="w-8 h-8 text-blue-400" />
                  <div className="flex-1">
                    <p className="text-white font-medium">{file.name}</p>
                    <p className="text-sm text-gray-400">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={removeFile}
                    className="text-gray-400 hover:text-red-400"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Video Details */}
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Sparkles className="w-5 h-5" />
                Video Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Title *
                </label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter video title"
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your video"
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Category
                  </label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      {VIDEO_CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat} className="text-white">
                          {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Privacy
                  </label>
                  <Select value={privacy} onValueChange={(value: "PUBLIC" | "PRIVATE") => setPrivacy(value)}>
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      {VIDEO_PRIVACY_OPTIONS.map((option) => (
                        <SelectItem key={option} value={option} className="text-white">
                          {option.charAt(0).toUpperCase() + option.slice(1).toLowerCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Campaign Start Date
                  </label>
                  <Input
                    type="date"
                    value={campaignStartDate}
                    onChange={(e) => setCampaignStartDate(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Campaign End Date
                  </label>
                  <Input
                    type="date"
                    value={campaignEndDate}
                    onChange={(e) => setCampaignEndDate(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Error Display */}
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400">{error}</p>
            </div>
          )}

          {/* Upload Progress */}
          {isUploading && (
            <Card className="bg-gray-900/50 border-gray-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  <div className="flex-1">
                    <p className="text-white font-medium">Uploading video...</p>
                    <Progress value={uploadProgress} className="mt-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isUploading || !file || !title}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isUploading ? "Uploading..." : "Upload Video"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}


