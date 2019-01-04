using Sample.Models.Domain;
using Sample.Models.Requests;
using System.Collections.Generic;

namespace Sample.Services.Interfaces
{
    public interface IInputControlService
    {
        int Create(InputControlAddRequest model);
        List<InputControlViewModel> SelectByFormId(int id);
        int Update(InputControlUpdateRequest model);
        void Delete(int id);
    };
}
