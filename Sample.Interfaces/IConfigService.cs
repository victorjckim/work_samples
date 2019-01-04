using System.Collections.Generic;

using Sample.Models.Domain;
using Sample.Models.Requests;

namespace Sample.Services.Interfaces
{
    public interface IConfigService
    {
        int Create(ConfigAddRequest model);
        void Delete(int id);
        ConfigDomainModel SelectById(int id);
        ConfigDomainModel SelectByKey(string key);
        int Update(ConfigUpdateModel model);
        List<ConfigDomainModel> SelectAll();
        List<ConfigViewModel> View();
    }
}
