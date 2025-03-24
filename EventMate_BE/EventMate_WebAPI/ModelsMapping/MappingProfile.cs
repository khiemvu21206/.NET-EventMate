using AutoMapper;
using EventMate_Data.Entities;
using EventMate_WebAPI.ModelsMapping.Event;
using EventMate_WebAPI.ModelsMapping.Authentication;

using EventMate_WebAPI.ModelsMapping.Group;
using EventMate_WebAPI.ModelsMapping.Cost;
using EventMate_WebAPI.ModelsMapping.Message;
using EventMate_WebAPI.ModelsMapping.Album;


namespace EventMate_WebAPI.ModelsMapping
{
    public class MappingProfile : Profile
    {

        public MappingProfile()
        {
            CreateMap<LoginModel, User>();
            CreateMap<SignUpModel, User>();

            CreateMap<EventCreateModel, Events>();
            CreateMap<EventCreateModel, EventMate_Data.Entities.Item>();

            CreateMap<User, UserResponse>();

            CreateMap<User, UserResponse>()
                  .ForMember(dest => dest.Role, opt => opt.MapFrom(src => src.Role.RoleName));
            CreateMap<LoginGoogleModel, User>();
            CreateMap<ResetPasswordModel, User>();
            CreateMap<VerifyOTPRequest, User>()
                  .ForMember(dest => dest.CompanyName, opt => opt.MapFrom(src => src.CompanyName));

            //Group 
            CreateMap<Requests, RequestModel>()
                .ForMember(dest => dest.Sender, opt => opt.MapFrom(src => new SenderModel
                {
                    UserId = src.Sender.UserId,
                    FullName = src.Sender.FullName,
                    Email = src.Sender.Email
                }))
                .ForMember(dest => dest.Group, opt => opt.MapFrom(src => new GroupModel
                {
                    GroupName = src.Group.GroupName,
                    GroupId = src.Group.GroupId,
                    Description = src.Group.Description,
                    Img = src.Group.Img
                }))

            ;
            CreateMap<User_Group, User_GroupModel>()
                .ForMember(dest => dest.User, opt => opt.MapFrom(src => new UserModel
                {
                    UserId = src.User.UserId,
                    FullName = src.User.FullName,
                    DateOfBirth = src.User.DateOfBirth,
                    Avatar = src.User.Avatar,
                    Email = src.User.Email,
                    License = src.User.License,
                    CompanyName = src.User.CompanyName,
                    Address = src.User.Address,
                    Phone = src.User.Phone,
                    Status = src.User.Status
                }))

                ;
            CreateMap<Groups, GroupModel>()
                   .ForMember(dest => dest.Img, opt => opt.MapFrom(src => src.Img))
                   .ForMember(dest => dest.GroupName, opt => opt.MapFrom(src => src.GroupName))
                   .ForMember(dest => dest.GroupId, opt => opt.MapFrom(src => src.GroupId))
                   .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => src.CreatedAt))
                   .ForMember(dest => dest.EventId, opt => opt.MapFrom(src => src.EventId))
                   .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.Description))
                   .ForMember(dest => dest.Visibility, opt => opt.MapFrom(src => src.Visibility))
                   .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status))
                   .ForMember(dest => dest.Currency, opt => opt.MapFrom(src => src.Currency))
                   .ForMember(dest => dest.Event, opt => opt.MapFrom(src => new EventModel
                   {
                       Name=src.Events.Name,
                       CreatedAt=src.Events.CreatedAt,
                       Img=src.Events.Img,
                       Description=src.Events.Description,
                       Place=src.Events.Place,
                       TimeEnd=src.Events.TimeEnd,
                       TimeStart = src.Events.TimeStart,
                       Banner = src.Events.banner
                   }))
                   ;
            CreateMap<Groups, GroupDetailModel>()
                   .ForMember(dest => dest.Img, opt => opt.MapFrom(src => src.Img))
                   .ForMember(dest => dest.GroupName, opt => opt.MapFrom(src => src.GroupName))
                   .ForMember(dest => dest.GroupId, opt => opt.MapFrom(src => src.GroupId))
                   .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => src.CreatedAt))
                   .ForMember(dest => dest.EventId, opt => opt.MapFrom(src => src.EventId))
                   .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.Description))
                   .ForMember(dest => dest.Visibility, opt => opt.MapFrom(src => src.Visibility))
                   .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status))
                   .ForMember(dest => dest.LeaderEmail, opt => opt.MapFrom(src => src.User.Email))
                    .ForMember(dest => dest.LeaderName, opt => opt.MapFrom(src => src.User.FullName))
                    .ForMember(dest => dest.EventName, opt => opt.MapFrom(src => src.Events.Name))
                   .ForMember(dest => dest.Place, opt => opt.MapFrom(src => src.Events.Place))
                    .ForMember(dest => dest.Currency, opt => opt.MapFrom(src => src.Currency))

                    ;
            CreateMap<EventMate_Data.Entities.Cost, CostModel>()
                                    .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.Creator.FullName));
            CreateMap<CostCreateModel, EventMate_Data.Entities.Cost>();
            CreateMap<Plans, PlanModel>();
            CreateMap<PlanModel, Plans>();

            CreateMap<PlanCreateModel, Plans>()
                .ForMember(dest => dest.PlanId, opt => opt.MapFrom(src => Guid.NewGuid()));

            CreateMap<Activity, ActivityModel>()
                      .ForMember(dest => dest.CreatedBy, opt => opt.MapFrom(src => src.User.FullName));
            CreateMap<ActivityModel, Activity>();

            CreateMap<ActivityCreateModel, Activity>()
                                .ForMember(dest => dest.ActivityId, opt => opt.MapFrom(src => Guid.NewGuid()));
            
            CreateMap<AlbumCreateModel, Albums>()
                .ForMember(dest => dest.AlbumId, opt => opt.MapFrom(src => Guid.NewGuid()))
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => DateTime.UtcNow))
                .ForMember(dest => dest.GroupId, opt => opt.MapFrom(src => src.GroupId))
                .ForMember(dest => dest.CreatedBy, opt => opt.MapFrom(src => src.CreatedBy));


            

            CreateMap<Messages, MessageResponse>()
           .ForMember(dest => dest.MessageId, opt => opt.MapFrom(src => src.MessageId))
           .ForMember(dest => dest.ConversationId, opt => opt.MapFrom(src => src.ConversationId))
           
           .ForMember(dest => dest.Content, opt => opt.MapFrom(src => src.Content))
           .ForMember(dest => dest.SentAt, opt => opt.MapFrom(src => src.SentAt))
            .ForPath(dest => dest.Sender.Email, opt => opt.MapFrom(src => src.User.Email))
           .ForPath(dest => dest.Sender.Avatar, opt => opt.MapFrom(src => src.User.Avatar))
            .ForPath(dest => dest.Sender.UserId, opt => opt.MapFrom(src => src.User.UserId))
           .ForPath(dest => dest.Sender.FullName, opt => opt.MapFrom(src => src.User.FullName));


            CreateMap<Multimedia, MultimediaDto>()
                .ForMember(dest => dest.CreatorName, opt => opt.MapFrom(src => src.Creator != null ? src.Creator.FullName : null))
                .ForMember(dest => dest.CreatorImg, opt => opt.MapFrom(src => src.Creator != null ? src.Creator.Avatar : null));
            CreateMap<Albums, AlbumDto>()
                .ForMember(dest => dest.CreatorName, opt => opt.MapFrom(src => src.Creator != null ? src.Creator.FullName : null))
                .ForMember(dest => dest.GroupName, opt => opt.MapFrom(src => src.Group != null ? src.Group.GroupName : null))
                .ForMember(dest => dest.Multimedia, opt => opt.MapFrom(src => src.Multimedia));

            CreateMap<MultimediaCreateModel, Multimedia>()
                .ForMember(dest => dest.ImageId, opt => opt.MapFrom(src => Guid.NewGuid()))
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => DateTime.UtcNow));

        }
    }
}