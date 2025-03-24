using EventMate_Data.Entities;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace EventMate_WebAPI.ModelsMapping.Group
{
    public class User_GroupModel
    {
       
        public Guid UsergroupId { get; set; }

        public Guid UserId { get; set; }
        public Guid GroupId { get; set; }
        public virtual UserModel User { get; set; }
    }
}
