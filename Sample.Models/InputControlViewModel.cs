using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sample.Models.Domain
{
    public class InputControlViewModel
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public decimal Version { get; set; }
        public int InputControlId { get; set; }
        public string Label { get; set; }
        public string Name { get; set; }
        public string Type { get; set; }
        public int ParentId { get; set; }
        public int Position { get; set; }
        public string DataType { get; set; }
    }
}
