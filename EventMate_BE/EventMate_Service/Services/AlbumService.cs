using EventMate_Data.Entities;
using EventMate_Data.IRepositories;

namespace EventMate_Service.Services
{
    public class AlbumService
    {
        private readonly IAlbumRepository _albumRepository;

        public AlbumService(IAlbumRepository albumRepository)
        {
            _albumRepository = albumRepository;
        }

        public async Task<Albums> AddAlbumAsync(Albums album)
        {
            return await _albumRepository.AddAlbumAsync(album);
        }

        public async Task<Albums?> GetAlbumByIdAsync(Guid id)
        {
            return await _albumRepository.GetAlbumByIdAsync(id);
        }

        public async Task<IEnumerable<Albums>> GetAlbumsByUserAsync(Guid userId)
        {
            return await _albumRepository.GetAlbumsByUserAsync(userId);
        }

        public async Task<IEnumerable<Albums>> GetAlbumsByGroupAsync(Guid groupId)
        {
            return await _albumRepository.GetAlbumsByGroupAsync(groupId);
        }
        public async Task<Multimedia> AddMultimediaAsync(Multimedia multimedia)
        {
            return await _albumRepository.AddMultimediaAsync(multimedia);
        }
        public async Task<Multimedia?> GetMultimediaByIdAsync(Guid id)
        {
            return await _albumRepository.GetMultimediaByIdAsync(id);
        }
        public async Task<FavoriteMedia> AddFavoriteMediaAsync(FavoriteMedia favoriteMedia)
        {
            return await _albumRepository.AddFavoriteMediaAsync(favoriteMedia);
        }
        public async Task<int> CountFavoriteMediaByMediaIdAsync(Guid multimediaId)
        {
            return await _albumRepository.CountFavoriteMediaByMediaIdAsync(multimediaId);
        }
        public async Task<bool> CheckFavoriteMediaAsync(Guid userId, Guid multimediaId)
        {
            return await _albumRepository.CheckFavoriteMediaAsync(userId, multimediaId);
        }
        public async Task<bool> RemoveFavoriteMediaAsync(Guid userId, Guid multimediaId)
        {
            return await _albumRepository.RemoveFavoriteMediaAsync(userId, multimediaId);
        }
        public async Task<bool> RemoveMultimediaAsync(Guid multimediaId)
        {
            return await _albumRepository.RemoveMultimediaAsync(multimediaId);
        }
        public async Task<IEnumerable<FavoriteMedia>> GetFavoriteMediaByMultimediaIdAsync(Guid multimediaId)
        {
            return await _albumRepository.GetFavoriteMediaByMultimediaIdAsync(multimediaId);
        }
    }
} 