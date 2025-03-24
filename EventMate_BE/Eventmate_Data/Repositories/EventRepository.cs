using EventMate.Data;
using EventMate_Common.Enum;
using EventMate_Common.Status;
using EventMate_Common.Type;
using Eventmate_Data.IEventRepository;
using EventMate_Data.Entities;
using EventMate_Data.IRepositories;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EventMate_Data.Repositories
{
    public class EventRepository : IEventRepository
    {

        private readonly DataContext _context;
        public EventRepository(DataContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Events>> GetAllEventsAsync()
        {
            var events = await _context.Events!.ToListAsync();
            return events;
        }

        public async Task<IEnumerable<Events>> GetEventsByStatusAsync(EventStatus status)
        {
            var events = await _context.Events!
                .Where(e => e.Status == status)
                .ToListAsync();
            return events;
        }

        public async Task<IEnumerable<Events>> GetEventsByUserAsync(Guid userId)
        {
            var events = await _context.Events!
                .Where(e => e.UserId == userId)
                .ToListAsync();
            return events;
        }

        public async Task<Events?> GetEventByIdAsync(Guid id)
        {
            return await _context.Events
                .Include(e => e.User) 
                .FirstOrDefaultAsync(e => e.EventId == id);
        }


        public async Task<Events?> AddEventAsync(Events eventEntity)
        {
            try
            {

                _context.Events.Add(eventEntity);
                await _context.SaveChangesAsync();
                return eventEntity;
            }
            catch (Exception)
            {
                return null;
            }
        }


        public async Task DeleteEventAsync(Guid eventId)
        {
            var eventEntity = await _context.Events!.FindAsync(eventId);
            if (eventEntity != null)
            {
                _context.Events.Remove(eventEntity);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<bool> ChangeEventStatusAsync(Guid eventId, EventStatus newStatus)
        {
            var eventEntity = await _context.Events!.FindAsync(eventId);
            if (eventEntity == null)
            {
                return false;
            }

            eventEntity.Status = newStatus;
            _context.Events.Update(eventEntity);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<Events?> GetEventByNameAsync(string eventName)
        {
            var eventEntity = await _context.Events
                .FirstOrDefaultAsync(e => e.Name == eventName);

            if (eventEntity != null && !string.IsNullOrEmpty(eventEntity.Img))
            {
                eventEntity.Img = $"https://amzn-eventmate-event.s3.ap-southeast-2.amazonaws.com/{eventEntity.Img}";
            }

            return eventEntity;
        }

        public async Task<Events> UpdateEventAsync(Events eventEntity)
        {
            var existingEvent = await _context.Events.FindAsync(eventEntity.EventId);
            if (existingEvent == null)
            {
                return null;
            }

            existingEvent.Name = eventEntity.Name;
            existingEvent.Place = eventEntity.Place;
            existingEvent.TimeStart = eventEntity.TimeStart;
            existingEvent.TimeEnd = eventEntity.TimeEnd;
            existingEvent.Description = eventEntity.Description;
            existingEvent.Type = eventEntity.Type;
            existingEvent.Status = eventEntity.Status;
            existingEvent.OrganizerName = eventEntity.OrganizerName;
            existingEvent.OrganizerDescription = eventEntity.OrganizerDescription;
            existingEvent.Img = eventEntity.Img; 
            existingEvent.OrganizerLogo = eventEntity.OrganizerLogo; 

            _context.Events.Update(existingEvent);
            await _context.SaveChangesAsync();
            return existingEvent;
        }

        public async Task<List<Events>> GetRandomEventsByTypeAsync(EventType eventType, int count)
        {
            return await _context.Events
                .Where(e => e.Type == eventType)
                .OrderBy(x => Guid.NewGuid()) 
                .Take(count)
                .ToListAsync();
        }
        public async Task<IEnumerable<Events>> GetActiveEvents()
        {
            return await _context.Events!
                .Where(e => e.Status == EventStatus.Approved)
                .ToListAsync();
        }

        public async Task<IEnumerable<Events>> GetEventsByRoleAndStatusAsync(string role, EventStatus status)
        {
            if (!Guid.TryParse(role, out Guid roleGuid))
            {
                throw new ArgumentException("Invalid role format", nameof(role));
            }

            int statusValue = (int)status;

            return await _context.Events
                .Where(e => e.User.Role.RoleId == roleGuid && (int)e.Status == statusValue)
                .ToListAsync();
        }

        public async Task<bool> ChangeBannerStatusAsync(Guid eventId, BannerStatus newStatus)
        {
            var eventEntity = await _context.Events!.FindAsync(eventId);
            if (eventEntity == null)
            {
                return false;
            }

            eventEntity.BannerStatus = newStatus;
            _context.Events.Update(eventEntity);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<IEnumerable<Events>> GetBannerListAsync()
        {
            return await _context.Events!
                .Where(e => !string.IsNullOrEmpty(e.banner) && (e.BannerStatus == BannerStatus.Pending || e.BannerStatus == BannerStatus.Active))
                .Select(e => new Events 
                { 
                    EventId = e.EventId,
                    Name = e.Name,
                    banner = e.banner,
                    BannerStatus = e.BannerStatus
                })
                .ToListAsync();
        }

    }
}
