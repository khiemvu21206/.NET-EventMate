using EventMate_Data.Entities;

namespace EventMate_Data.IRepositories
{
    public interface IAlbumRepository
    {
        Task<Albums> AddAlbumAsync(Albums album);
        Task<Albums?> GetAlbumByIdAsync(Guid id);
        Task<IEnumerable<Albums>> GetAlbumsByUserAsync(Guid userId);
        Task<IEnumerable<Albums>> GetAlbumsByGroupAsync(Guid groupId);
        Task<Multimedia> AddMultimediaAsync(Multimedia multimedia);
        Task<Multimedia?> GetMultimediaByIdAsync(Guid id);
        Task<FavoriteMedia> AddFavoriteMediaAsync(FavoriteMedia favoriteMedia);
        Task<int> CountFavoriteMediaByMediaIdAsync(Guid multimediaId);
        Task<bool> CheckFavoriteMediaAsync(Guid userId, Guid multimediaId);
        Task<bool> RemoveFavoriteMediaAsync(Guid userId, Guid multimediaId);
        Task<bool> RemoveMultimediaAsync(Guid multimediaId);
        Task<IEnumerable<FavoriteMedia>> GetFavoriteMediaByMultimediaIdAsync(Guid multimediaId);
    }
} 