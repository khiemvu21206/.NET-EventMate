'use client';
import React, { useEffect, useState, useCallback, useRef } from 'react';
import axios from 'axios';
import Navbar from '@/components/group/Navbar';
import { useRouter } from "next/navigation";
import { 
  ArrowDownTrayIcon,
  BookmarkIcon,
  HeartIcon,
  XMarkIcon,
  PlusIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpTrayIcon,
  TrashIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import { 
  BookmarkIcon as BookmarkIconSolid,
  HeartIcon as HeartIconSolid 
} from '@heroicons/react/24/solid';
import { MediaRepository, AlbumDto, MultimediaDto } from '@/repositories/MediaRepository';
import { useParams } from 'next/navigation';
import { useUserContext } from "@/providers/UserProvider";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface MultimediaDto {
  imageId: string;
  url: string;
  createdAt: Date;
  createdBy: string;
  creatorName: string;
  type: 0 | 1 | 2;
  status: string;
  creatorImg?: string;
  name?: string;
}

interface AlbumDto {
  albumId: string;
  name: string;
  createdAt: Date;
  groupId?: string;
  createdBy?: string;
  multimedia: MultimediaDto[];
}

const SharePage: React.FC = () => {
  const { id: userId, status: authStatus } = useUserContext();
  const [albums, setAlbums] = useState<AlbumDto[]>([]);
  const [userAlbums, setUserAlbums] = useState<AlbumDto[]>([]);
  const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [activeMedia, setActiveMedia] = useState<MultimediaDto[]>([]);
  const [selectedImage, setSelectedImage] = useState<MultimediaDto | null>(null);
  const [showAddAlbum, setShowAddAlbum] = useState<boolean>(false);
  const [newAlbumName, setNewAlbumName] = useState<string>('');
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [showSaveModal, setShowSaveModal] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const videoRefs = useRef<Map<string, HTMLVideoElement>>(new Map());
  const observerRef = useRef<IntersectionObserver | null>(null);
  const params = useParams();
  const playingVideos = useRef<Set<string>>(new Set());
  const groupId = typeof params.groupId === 'string' ? params.groupId : '';
  const router = useRouter();
  const API_BASE_URL = 'https://localhost:7121/api';
  const [favoriteStates, setFavoriteStates] = useState<Record<string, boolean>>({});
  const [favoriteCounts, setFavoriteCounts] = useState<Record<string, number>>({});
  const [showDeleteButton, setShowDeleteButton] = useState<boolean>(false);
  const [selectedMediaForDeletion, setSelectedMediaForDeletion] = useState<MultimediaDto[]>([]);

  const fetchAlbums = async () => {
    try {
      if (!userId) {
        console.error('userId is not available');
        return;
      }

      setLoading(true);
      const response = await MediaRepository.getAlbumsByGroup(groupId);
      if (Array.isArray(response.data)) {
        setAlbums(response.data);
        if (response.data.length === 0) {
          const newAlbum: AlbumDto = {
            albumId: '',
            name: `Album của nhóm ${groupId}`,
            createdAt: new Date(),
            groupId: groupId,
            multimedia: []
          };
          const createResponse = await MediaRepository.createAlbum(newAlbum);
          if (createResponse.data) {
            setAlbums([createResponse.data]);
            setSelectedAlbumId(createResponse.data.albumId);
            setActiveMedia(createResponse.data.multimedia);
          }
        } else if (response.data.length > 0 && !selectedAlbumId) {
          setSelectedAlbumId(response.data[0].albumId);
          setActiveMedia(response.data[0].multimedia);
          const initialFavoriteStates: Record<string, boolean> = {};
          const initialFavoriteCounts: Record<string, number> = {};
          for (const album of response.data) {
            for (const media of album.multimedia) {
              const checkResponse = await MediaRepository.checkFavoriteMedia(userId, media.imageId);
              if (checkResponse && checkResponse.status === 200) {
                initialFavoriteStates[media.imageId] = checkResponse.data;
              }
              const countResponse = await MediaRepository.countFavoriteMedia(media.imageId);
              if (countResponse && countResponse.status === 200) {
                initialFavoriteCounts[media.imageId] = countResponse.data;
              }
            }
          }
          setFavoriteStates(initialFavoriteStates);
          setFavoriteCounts(initialFavoriteCounts);
        }
      }
    } catch (error) {
      console.error('Lỗi khi lấy danh sách album:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserAlbums = async () => {
    try {
      const response = await MediaRepository.getAlbumsByUser(userId);
      if (Array.isArray(response.data)) {
        setUserAlbums(response.data);
      }
    } catch (error) {
      console.error('Lỗi khi lấy danh sách album của người dùng:', error);
      setUploadError('Không thể tải danh sách album. Vui lòng thử lại.');
    }
  };

  useEffect(() => {
    if (userId) {
      fetchAlbums();
    }
  }, [groupId, userId]);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          const video = entry.target as HTMLVideoElement;
          const videoId = video.dataset.id;
          if (!videoId) return;

          let isPlaying = false;

          if (entry.isIntersecting && !isPlaying) {
            const playPromise = video.play();
            if (playPromise !== undefined) {
              playPromise
                .then(() => {
                  isPlaying = true;
                  playingVideos.current.add(videoId);
                })
                .catch(error => {});
            }
          } else if (!entry.isIntersecting && isPlaying) {
            video.pause();
            isPlaying = false;
          }
        });
      },
      { threshold: 0.5 }
    );

    videoRefs.current.forEach(video => {
      observerRef.current?.observe(video);
    });

    return () => {
      videoRefs.current.forEach(video => {
        observerRef.current?.unobserve(video);
        if (!video.paused) {
          video.pause();
        }
      });
      observerRef.current?.disconnect();
      playingVideos.current.clear();
    };
  }, [activeMedia]);

  const handleSelectAlbum = useCallback((albumId: string) => {
    setSelectedAlbumId(albumId);
    const selectedAlbum = albums.find(album => album.albumId === albumId);
    if (selectedAlbum) {
      setActiveMedia(selectedAlbum.multimedia);
      videoRefs.current.forEach(video => {
        if (!video.paused) {
          video.pause();
        }
      });
    }
  }, [albums]);

  const handleMediaClick = (item: MultimediaDto) => {
    if (showDeleteButton) {
      handleSelectMediaForDeletion(item);
    } else {
      setSelectedImage(item);
    }
  };

  const handleToggleFavorite = async (item: MultimediaDto) => {
    try {
      if (!userId) {
        console.error('userId is not available');
        return;
      }

      const checkResponse = await MediaRepository.checkFavoriteMedia(userId, item.imageId);
      let currentIsFavorite = false;
      if (checkResponse && checkResponse.status === 200) {
        currentIsFavorite = checkResponse.data;
      }

      const newIsFavorite = !currentIsFavorite;
      setFavoriteStates(prev => ({ ...prev, [item.imageId]: newIsFavorite }));
      setFavoriteCounts(prev => ({ ...prev, [item.imageId]: newIsFavorite ? (prev[item.imageId] || 0) + 1 : (prev[item.imageId] || 0) - 1 }));

      if (newIsFavorite) {
        const favoriteData = {
          MultimediaId: item.imageId,
          UserId: userId,               
        };
        const response = await MediaRepository.addFavoriteMedia(favoriteData);
      } else {
        const response = await MediaRepository.removeFavoriteMedia(userId, item.imageId);
      }
    } catch (error) {
      console.error('Lỗi khi xử lý yêu thích:', error);
    }
  };

  const handleDownload = async (media: MultimediaDto) => {
    if (!media.url) {
      console.error("URL không hợp lệ:", media);
      return;
    }
  
    try {
      const response = await fetch(`/api/download?url=${encodeURIComponent(media.url)}&filename=${media.imageId || "download"}`);
  
      if (!response.ok) {
        throw new Error(`Lỗi tải xuống: ${response.status} - ${response.statusText}`);
      }
  
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
  
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = media.imageId || "download";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Tải ảnh thất bại:", error);
    }
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const handleCreateAlbum = async () => {
    if (!newAlbumName.trim()) return;

    const newAlbum: AlbumDto = {
      albumId: '',
      name: newAlbumName,
      createdAt: new Date(),
      groupId: groupId,
      multimedia: []
    };

    try {
      const response = await MediaRepository.createAlbum(newAlbum);
      if (response.data) {
        setAlbums([...albums, response.data]);
        setNewAlbumName('');
        setShowAddAlbum(false);
      }
    } catch (error) {
      console.error('Lỗi khi tạo album:', error);
    }
  };

  const handleCreateUserAlbum = async () => {
    if (!newAlbumName.trim()) return;

    const newAlbum: AlbumDto = {
      albumId: '',
      name: newAlbumName,
      createdAt: new Date(),
      createdBy: userId,
      multimedia: []
    };

    try {
      const response = await MediaRepository.createAlbum(newAlbum);
      if (response.data) {
        setUserAlbums([...userAlbums, response.data]);
        setNewAlbumName('');
        setShowAddAlbum(false);
      }
    } catch (error) {
      console.error('Lỗi khi tạo album:', error);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFiles(event.target.files);
    setUploadError(null);        
  };

  const handleUploadMultimedia = async () => {
    if (!selectedFiles || selectedFiles.length === 0 || !selectedAlbumId) {
      setUploadError('Vui lòng chọn tệp và album');
      return;
    }

    try {
      setLoading(true);
      setUploadError(null);

      const formData = new FormData();
      Array.from(selectedFiles).forEach(file => {
        formData.append('MediaFiles', file);
      });
      formData.append('CreatedBy', userId);

      const response = await axios.post(
        `${API_BASE_URL}/Media/${selectedAlbumId}/multimedia`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.status === 201) {
        const newMultimedia = response.data.data;
        setActiveMedia(prevActiveMedia => [...newMultimedia, ...prevActiveMedia]);
        setSelectedFiles(null);
        setShowUploadModal(false);
        fetchAlbums();
      }
    } catch (error) {
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.message || 'Tải lên thất bại'
        : 'Đã xảy ra lỗi không mong muốn';
      setUploadError(errorMessage);
      console.error('Lỗi khi tải lên multimedia:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToAlbum = async (albumId: string) => {
    if (!selectedImage) {
      console.error("Không có hình ảnh nào được chọn để lưu.");
      return;
    }

    try {
      const response = await fetch(`/api/download?url=${encodeURIComponent(selectedImage.url)}&filename=${selectedImage.imageId || "download"}`);
      
      if (!response.ok) {
        throw new Error(`Lỗi tải xuống hình ảnh: ${response.status} - ${response.statusText}`);
      }

      const blob = await response.blob();
      const formData = new FormData();
      formData.append('MediaFiles', blob, selectedImage.imageId); 
      formData.append('CreatedBy', selectedImage.createdBy);

      const saveResponse = await axios.post(
        `${API_BASE_URL}/Media/${albumId}/multimedia`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (saveResponse.status === 201) {
        setShowSaveModal(false);
        toast.success('Đã lưu vào bộ sưu tập!');
      }
    } catch (error) {
      console.error('Lỗi khi lưu vào bộ sưu tập:', error);
      setUploadError('Không thể lưu vào bộ sưu tập. Vui lòng thử lại.');
    }
  };

  const handleOpenSaveModal = async () => {
    await fetchUserAlbums();
    setShowSaveModal(true);
  };

  const isVideo = (media: MultimediaDto) => {
    return media.type === 2;
  };

  const setVideoRef = (item: MultimediaDto) => (element: HTMLVideoElement | null) => {
    if (element && isVideo(item)) {
      videoRefs.current.set(item.imageId, element);
      element.dataset.id = item.imageId;
      observerRef.current?.observe(element);
    }
  };

  const handleToggleDeleteMode = () => {
    setShowDeleteButton(!showDeleteButton);
    setSelectedMediaForDeletion([]);
    
    if (showDeleteButton) {
      setActiveMedia(albums.find(album => album.albumId === selectedAlbumId)?.multimedia || []);
    }
  };

  const handleSelectMediaForDeletion = (item: MultimediaDto) => {
    setSelectedMediaForDeletion(prev => {
      if (prev.includes(item)) {
        return prev.filter(media => media.imageId !== item.imageId);
      } else {
        return [...prev, item];
      }
    });
  };

  const handleDeleteSelectedMedia = async () => {
    try {
      for (const media of selectedMediaForDeletion) {
        await MediaRepository.removeMultimedia(media.imageId);
      }

      // Cập nhật trạng thái cục bộ
      setAlbums(prevAlbums => 
        prevAlbums.map(album => ({
          ...album,
          multimedia: album.multimedia.filter(media => 
            !selectedMediaForDeletion.some(deletedMedia => deletedMedia.imageId === media.imageId)
          ),
        }))
      );

      setActiveMedia(prevActiveMedia => 
        prevActiveMedia.filter(media => 
          !selectedMediaForDeletion.some(deletedMedia => deletedMedia.imageId === media.imageId)
        )
      );

      // Reset trạng thái xóa
      setSelectedMediaForDeletion([]);
      setShowDeleteButton(false);

      // Hiển thị thông báo thành công
      toast.success('Đã xóa ảnh/video thành công!');
    } catch (error) {
      console.error('Lỗi khi xóa ảnh/video:', error);
      setUploadError('Không thể xóa ảnh/video. Vui lòng thử lại.');
    }
  };

  const filteredActiveMedia = showDeleteButton 
    ? activeMedia.filter(media => media.createdBy === userId) 
    : activeMedia;

  if (!userId) {
    return <div>Vui lòng đăng nhập để xem trang này</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex-1 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900">Album ảnh</h1>
            <p className="mt-2 text-gray-600">Khám phá và chia sẻ những khoảnh khắc đẹp</p>
          </div>

          <div className="flex justify-center py-4 mb-6">
            <div className="inline-flex items-center overflow-x-auto gap-3 scrollbar-hide max-w-4xl px-4 bg-white rounded-lg shadow-sm">
              {albums.map((album) => (
                <div key={album.albumId} className="flex-shrink-0 mx-1">
                  <button
                    onClick={() => handleSelectAlbum(album.albumId)}
                    className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ease-in-out whitespace-nowrap
                      ${selectedAlbumId === album.albumId 
                        ? 'bg-black text-white shadow-lg transform scale-105' 
                        : 'bg-white text-gray-800 hover:bg-gray-200 border border-gray-300 hover:shadow-md'}`}
                  >
                    {album.name}
                  </button>
                </div>
              ))}
              <button
                onClick={() => setShowAddAlbum(!showAddAlbum)}
                className="flex-shrink-0 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                title="Thêm album mới"
              >
                <PlusIcon className="w-6 h-6 text-gray-600" />
              </button>
              {showAddAlbum && (
                <div className="flex items-center gap-2 ml-2">
                  <input
                    type="text"
                    value={newAlbumName}
                    onChange={(e) => setNewAlbumName(e.target.value)}
                    placeholder="Tên album mới"
                    className="px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-slate-600"
                  />
                  <button
                    onClick={handleCreateAlbum}
                    className="px-4 py-2 bg-slate-600 text-white rounded-full hover:bg-slate-700 transition-colors"
                  >
                    Tạo
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-center py-4 mb-6">
            <button
              onClick={() => setShowUploadModal(true)}
              className="px-4 py-2 bg-black text-white rounded-full hover:bg-slate-700 transition-colors"
              disabled={loading}
            >
              <ArrowUpTrayIcon className="w-5 h-5 inline-block mr-2" />
              Tải lên ảnh/video
            </button>
            <button
              onClick={handleToggleDeleteMode}
              className="ml-4 px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
              disabled={loading}
            >
              {showDeleteButton ? (
                <>
                  <XMarkIcon className="w-5 h-5 inline-block mr-2" />
                  Hủy xóa
                </>
              ) : (
                <>
                  <TrashIcon className="w-5 h-5 inline-block mr-2" />
                  Xóa ảnh/video
                </>
              )}
            </button>
            {showDeleteButton && selectedMediaForDeletion.length > 0 && (
              <button
                onClick={handleDeleteSelectedMedia}
                className="ml-4 px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
              >
                <CheckIcon className="w-5 h-5 inline-block mr-2" />
                Xác nhận xóa
              </button>
            )}
          </div>

          {showUploadModal && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
              <div className="bg-gray-50 rounded-lg p-6 w-11/12 md:w-1/2">
                <h2 className="text-lg font-bold mb-4">Chọn ảnh/video để tải lên</h2>
                {uploadError && (
                  <p className="text-red-500 mb-4">{uploadError}</p>
                )}
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleFileChange}
                  className="mb-4 w-full"
                  disabled={loading}
                />
                <div className="flex justify-end">
                  <button
                    onClick={handleUploadMultimedia}
                    className="px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors disabled:bg-green-400"
                    disabled={loading}
                  >
                    {loading ? 'Đang tải...' : 'Tải lên'}
                  </button>
                  <button
                    onClick={() => setShowUploadModal(false)}
                    className="ml-2 px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                    disabled={loading}
                  >
                    Đóng
                  </button>
                </div>
              </div>
            </div>
          )}

          {loading && !showUploadModal ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
          ) : filteredActiveMedia.length === 0 ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-gray-500 text-lg">Chưa có ảnh trong album này</p>
            </div>
          ) : (
            <div className="columns-3 gap-4">
              {filteredActiveMedia.map(item => (
                <div
                  key={item.imageId}
                  className={`group relative mb-4 break-inside-avoid rounded-lg overflow-hidden cursor-pointer ${
                    showDeleteButton ? 'border border-red-500' : ''
                  }`}
                  onClick={() => handleMediaClick(item)}
                >
                  {isVideo(item) ? (
                    <video
                      ref={setVideoRef(item)}
                      src={item.url}
                      className="w-full object-cover transition-transform group-hover:scale-105"
                      muted
                      loop
                      playsInline
                    />
                  ) : (
                    <img
                      src={item.url}
                      alt={item.name || 'Album image'}
                      className="w-full object-cover transition-transform group-hover:scale-105"
                      loading="lazy"
                    />
                  )}
                  
                  {!showDeleteButton && (
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors">
                      <div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex items-center space-x-0">
                          <span className="text-white">{favoriteCounts[item.imageId] || 0}</span>
                          <button 
                            className="p-1.5 bg-white/90 rounded-full hover:bg-white shadow-md transition-transform transform hover:scale-110"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleFavorite(item);
                            }}
                          >
                            {favoriteStates[item.imageId] ? (
                              <HeartIconSolid className="w-6 h-6 text-red-600" />
                            ) : (
                              <HeartIcon className="w-6 h-6 text-red-600" />
                            )}
                          </button>
                        </div>
                        <button 
                          onClick={handleOpenSaveModal} 
                          className="p-1.5 bg-white/90 rounded-full hover:bg-white shadow-md transition-transform transform hover:scale-110"
                        >
                          <BookmarkIcon className="w-6 h-6 text-blue-600" />
                        </button>
                      </div>
                      <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            {item.creatorImg && (
                              <img
                                src={item.creatorImg}
                                alt={item.creatorName}
                                className="w-8 h-8 rounded-full mr-2"
                              />
                            )}
                            <span className="text-sm text-white font-medium">
                              {item.creatorName}
                            </span>
                          </div>
                          <button 
                            onClick={() => handleDownload(item)} 
                            className="p-1.5 bg-white/90 rounded-full hover:bg-white shadow-md transition-transform transform hover:scale-110"
                          >
                            <ArrowDownTrayIcon className="w-6 h-6 text-green-600" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {showDeleteButton && (
                    <div className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1">
                      {selectedMediaForDeletion.includes(item) ? '✓' : 'O'}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedImage && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 p-2 bg-white/20 rounded-full hover:bg-white/30"
          >
            <XMarkIcon className="w-6 h-6 text-white" />
          </button>

          <div className="max-w-5xl w-full relative">
            {isVideo(selectedImage) ? (
              <video
                src={selectedImage.url}
                className="w-full h-[80vh] object-contain"
                controls
                autoPlay
                loop
              />
            ) : (
              <img
                src={selectedImage.url}
                alt={selectedImage.name || 'Full size image'}
                className="w-full h-[80vh] object-contain"
              />
            )}
            <div className="mt-4 flex justify-between items-center">
              <div className="flex items-center text-white">
                {selectedImage.creatorImg && (
                  <img
                    src={selectedImage.creatorImg}
                    alt={selectedImage.creatorName}
                    className="w-8 h-8 rounded-full mr-2"
                  />
                )}
                <div>
                  <p className="font-medium">{selectedImage.creatorName}</p>
                  <p className="text-sm opacity-75">
                    {new Date(selectedImage.createdAt || Date.now()).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex space-x-4">
                <button 
                  onClick={() => handleToggleFavorite(selectedImage)}
                  className="flex items-center space-x-2 text-white hover:text-red-400"
                >
                  <span>{favoriteCounts[selectedImage.imageId] || 0}</span>
                  {favoriteStates[selectedImage.imageId] ? (
                    <HeartIconSolid className="w-6 h-6 text-red-600" />
                  ) : (
                    <HeartIcon className="w-6 h-6  text-red-600" />
                  )}
                  <span>Thích</span>
                </button>
                <button 
                  onClick={handleOpenSaveModal}
                  className="flex items-center space-x-2 text-white hover:text-blue-400"
                >
                  <BookmarkIcon className="w-6 h-6  text-blue-600" />
                  <span>Lưu</span>
                </button>
                <button 
                  onClick={() => handleDownload(selectedImage)}
                  className="flex items-center space-x-2 text-white hover:text-orange-400"
                >
                  <ArrowDownTrayIcon className="w-8 h-8 text-yellow-400" />
                  <span className="text-lg font-semibold">Tải về</span>
                </button>
              </div>
            </div>
            <button
              onClick={() => {
                const currentIndex = activeMedia.findIndex(media => media.imageId === selectedImage?.imageId);
                const prevIndex = (currentIndex - 1 + activeMedia.length) % activeMedia.length;
                setSelectedImage(activeMedia[prevIndex]);
              }}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 hover:bg-gray-200"
            >
              <ArrowLeftIcon className="w-6 h-6 text-gray-800" />
            </button>
            <button
              onClick={() => {
                const currentIndex = activeMedia.findIndex(media => media.imageId === selectedImage?.imageId);
                const nextIndex = (currentIndex + 1) % activeMedia.length;
                setSelectedImage(activeMedia[nextIndex]);
              }}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 hover:bg-gray-200"
            >
              <ArrowRightIcon className="w-6 h-6 text-gray-800" />
            </button>
          </div>
        </div>
      )}

      {showSaveModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-gray-50 rounded-lg p-6 w-10/12 md:w-1/3 relative">
            <button
              onClick={() => setShowSaveModal(false)}
              className="absolute top-2 right-2 p-1 text-gray-500 hover:text-gray-700"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
            <h2 className="text-lg font-bold mb-4 text-center">Lưu vào Bộ sưu tập</h2>
            <div className="grid grid-cols-3 gap-x-1 gap-y-2 mb-4">
              <button
                onClick={() => setShowAddAlbum(!showAddAlbum)}
                className="flex flex-col items-center justify-center p-4 bg-gray-100 rounded-lg hover:bg-gray-200 h-32 w-32"
              >
                <PlusIcon className="w-6 h-6 text-gray-600" />
                <span className="mt-2 text-sm">Tạo bộ sưu tập mới</span>
              </button>
              {[...userAlbums]
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .map((album) => (
                  <button
                    key={album.albumId}
                    onClick={() => {
                      handleSaveToAlbum(album.albumId);
                      setSelectedAlbumId(album.albumId);
                    }}
                    className={`flex items-center justify-center p-0 rounded-lg hover:bg-gray-200 h-32 w-32 ${
                      selectedAlbumId === album.albumId ? "bg-green-100" : "bg-gray-100"
                    } overflow-hidden relative`}
                  >
                    {album.multimedia && album.multimedia.length > 0 ? (
                      <img
                        src={album.multimedia[album.multimedia.length - 1].url}
                        alt={album.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                          (e.target as HTMLImageElement).nextElementSibling!.style.display = "block";
                        }}
                      />
                    ) : null}
                    {(!album.multimedia || album.multimedia.length === 0) && (
                      <svg
                        className="w-full h-full text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        style={{ display: album.multimedia && album.multimedia.length > 0 ? "none" : "block" }}
                      >
                        <path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0-2-.9-2-2V5c0-1.1-.9-2-2-2zm-7 9c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm0 4c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm6-7H6v-2h12v2z"/>
                      </svg>
                    )}
                    <span className="absolute bottom-2 left-2 right-2 text-sm text-white bg-black bg-opacity-50 p-1 rounded text-center truncate">
                      {album.name}
                    </span>
                  </button>
                ))}
              {Array.from({ length: 3 - ((userAlbums.length % 3) + 1) }).map((_, index) => (
                <div key={`placeholder-${index}`} className="h-32 w-32"></div>
              ))}
            </div>
            {showAddAlbum && (
              <div className="flex items-center gap-2 mb-4">
                <input
                  type="text"
                  value={newAlbumName}
                  onChange={(e) => setNewAlbumName(e.target.value)}
                  placeholder="Tên bộ sưu tập mới"
                  className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-slate-600 w-full"
                />
                <button
                  onClick={handleCreateUserAlbum}
                  className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
                >
                  Tạo
                </button>
              </div>
            )}
            <button
              onClick={() => router.push('/media')}
              className="w-full p-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Bộ sưu tập của bạn →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SharePage;