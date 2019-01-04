using Sample.Models.Domain;
using Sample.Models.Requests;
using System.Collections.Generic;

namespace Sample.Services
{
    public interface IFormService
    {
       int Create(FormAddRequest model);
       FormDomainModel SelectById(int id);
       int Update(FormDomainModel model); 
    }
}