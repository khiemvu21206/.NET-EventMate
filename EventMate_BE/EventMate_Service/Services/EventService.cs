using EventMate_Common.Enum;
using EventMate_Common.Status;
using EventMate_Common.Type;
using Eventmate_Data.IEventRepository;
using Eventmate_Data.IRepositories;
using EventMate_Data.Entities;
using EventMate_Data.IRepositories;
using EventMate_Data.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace EventMate_Service.Services
{
    public class EventService
    {
        private readonly IEventRepository _eventRepository;

        public EventService(IEventRepository eventRepository)
        {
            _eventRepository = eventRepository;

        }
        public async Task<IEnumerable<Events>> GetAllEventsAsync()
        {
            return await _eventRepository.GetAllEventsAsync();
        }

        public async Task<IEnumerable<Events>> GetEventsByStatusAsync(EventStatus status)
        {
            return await _eventRepository.GetEventsByStatusAsync(status);
        }

        public async Task<IEnumerable<Events>> GetEventsByUserAsync(Guid userId)
        {
            return await _eventRepository.GetEventsByUserAsync(userId);
        }

        public async Task<Events?> GetEventByIdAsync(Guid eventId)
        {
            return await _eventRepository.GetEventByIdAsync(eventId);
        }

        public async Task<Events> AddEventAsync(Events eventEntity)
        {
            var createdEvent = await _eventRepository.AddEventAsync(eventEntity);
            return createdEvent ?? null;
        }


        public async Task DeleteEventAsync(Guid eventId)
        {
            await _eventRepository.DeleteEventAsync(eventId);
        }

        public async Task<bool> ChangeEventStatusAsync(Guid eventId, EventStatus newStatus)
        {
            return await _eventRepository.ChangeEventStatusAsync(eventId, newStatus);
        }

        public async Task<Events?> GetEventByNameAsync(string eventName)
        {
            return await _eventRepository.GetEventByNameAsync(eventName);
        }

        public async Task<Events> UpdateEventAsync(Events eventEntity)
        {
            return await _eventRepository.UpdateEventAsync(eventEntity);
        }
        public async Task<List<Events>> GetRandomEventsByTypeAsync(EventType eventType, int count)
        {
            return await _eventRepository.GetRandomEventsByTypeAsync(eventType, count);
        }
        public async Task<IEnumerable<Events>> GetActiveEvents()
        {
            return await _eventRepository.GetActiveEvents();
        }

        public async Task<IEnumerable<Events>> GetEventsByRoleAndStatusAsync(string role, EventStatus status)
        {
            return await _eventRepository.GetEventsByRoleAndStatusAsync(role, status);
        }

        public async Task<bool> ChangeBannerStatusAsync(Guid eventId, BannerStatus newStatus)
        {
            return await _eventRepository.ChangeBannerStatusAsync(eventId, newStatus);
        }

        public async Task<IEnumerable<Events>> GetBannerListAsync()
        {
            return await _eventRepository.GetBannerListAsync();
        }

    }


}

