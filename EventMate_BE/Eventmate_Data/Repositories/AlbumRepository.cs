using EventMate.Data;
using EventMate_Data.Entities;
using EventMate_Data.IRepositories;
using Microsoft.EntityFrameworkCore;

namespace EventMate_Data.Repositories
{
    public class AlbumRepository : IAlbumRepository
    {
        private readonly DataContext _context;

        public AlbumRepository(DataContext context)
        {
            _context = context;
        }

        public async Task<Albums> AddAlbumAsync(Albums album)
        {
            try
            {
                _context.Albums.Add(album);
                await _context.SaveChangesAsync();
                return album;
            }
            catch (Exception)
            {
                return null;
            }
        }

        public async Task<Albums?> GetAlbumByIdAsync(Guid id)
        {
            return await _context.Albums
                .Include(a => a.Creator)
                .Include(a => a.Group)
                .Include(a => a.Multimedia)
                    .ThenInclude(m => m.Creator)
                .FirstOrDefaultAsync(a => a.AlbumId == id);
        }

        public async Task<IEnumerable<Albums>> GetAlbumsByUserAsync(Guid userId)
        {
            return await _context.Albums
                .Include(a => a.Creator)
                .Include(a => a.Group)
                .Include(a => a.Multimedia)
                    .ThenInclude(m => m.Creator)
                .Where(a => a.CreatedBy == userId)
                .ToListAsync();
        }

        public async Task<IEnumerable<Albums>> GetAlbumsByGroupAsync(Guid groupId)
        {
            return await _context.Albums
                .Include(a => a.Creator)
                .Include(a => a.Group)
                .Include(a => a.Multimedia)
                    .ThenInclude(m => m.Creator)
                .Where(a => a.GroupId == groupId)
                .ToListAsync();
        }

        public async Task<Multimedia> AddMultimediaAsync(Multimedia multimedia)
        {
            try
            {
                _context.Multimedia.Add(multimedia);
                await _context.SaveChangesAsync();
                return multimedia;
            }
            catch (Exception)
            {
                return null;
            }
        }

        public async Task<Multimedia?> GetMultimediaByIdAsync(Guid id)
        {
            return await _context.Multimedia
                .Include(m => m.Creator)  // Nếu bạn muốn lấy thông tin creator
                .FirstOrDefaultAsync(m => m.ImageId == id);
        }

        public async Task<FavoriteMedia> AddFavoriteMediaAsync(FavoriteMedia favoriteMedia)
        {
            try
            {
                _context.FavoriteMedias.Add(favoriteMedia);
                await _context.SaveChangesAsync();
                return favoriteMedia;
            }
            catch (Exception)
            {
                return null;
            }
        }

        public async Task<int> CountFavoriteMediaByMediaIdAsync(Guid multimediaId)
        {
            return await _context.FavoriteMedias
                .CountAsync(fm => fm.MultimediaId == multimediaId);
        }

        public async Task<bool> CheckFavoriteMediaAsync(Guid userId, Guid multimediaId)
        {
            return await _context.FavoriteMedias
                .AnyAsync(fm => fm.UserId == userId && fm.MultimediaId == multimediaId);
        }

        public async Task<bool> RemoveFavoriteMediaAsync(Guid userId, Guid multimediaId)
        {
            var favoriteMedia = await _context.FavoriteMedias
                .FirstOrDefaultAsync(fm => fm.UserId == userId && fm.MultimediaId == multimediaId);
            
            if (favoriteMedia != null)
            {
                _context.FavoriteMedias.Remove(favoriteMedia);
                await _context.SaveChangesAsync();
                return true;
            }
            return false;
        }

        public async Task<bool> RemoveMultimediaAsync(Guid multimediaId)
        {
            var multimedia = await _context.Multimedia.FindAsync(multimediaId);
            if (multimedia != null)
            {
                _context.Multimedia.Remove(multimedia);
                await _context.SaveChangesAsync();
                return true;
            }
            return false;
        }

        public async Task<IEnumerable<FavoriteMedia>> GetFavoriteMediaByMultimediaIdAsync(Guid multimediaId)
        {
            return await _context.FavoriteMedias
                .Where(fm => fm.MultimediaId == multimediaId)
                .ToListAsync();
        }
    }
} 