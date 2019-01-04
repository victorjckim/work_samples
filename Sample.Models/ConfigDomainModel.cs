using System;

namespace Sample.Models.Domain
{
    public class ConfigDomainModel
    {
        public int Id { get; set; }
        public string ConfigName { get; set; }
        public int DataTypeId { get; set; }
        public string ConfigValue { get; set; }
        public string ConfigKey { get; set; }
        public string Description { get; set; }
        public int ConfigTypeId { get; set; }
        public bool Required { get; set; }
        public bool Secured { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime ModifiedDate { get; set; }
        public string ModifiedBy { get; set; }
    }
}
