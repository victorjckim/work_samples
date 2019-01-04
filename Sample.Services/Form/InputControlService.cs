using Sample.Data;
using Sample.Data.Providers;
using Sample.Models.Domain;
using Sample.Models.Requests;
using Sample.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sample.Services.Form
{
    public class InputControlService : IInputControlService
    {
        private IDataProvider _dataProvider;

        public InputControlService(IDataProvider dataProvider)
        {
            _dataProvider = dataProvider;
        }

        public int Create(InputControlAddRequest model)
        {
            int id = 0;
            this._dataProvider.ExecuteNonQuery(
                "InputControls_Insert",
                inputParamMapper: delegate (SqlParameterCollection paramList)
                {
                    SqlParameter param = new SqlParameter();
                    param.ParameterName = "@Id";
                    param.SqlDbType = SqlDbType.Int;
                    param.Direction = ParameterDirection.Output;
                    paramList.Add(param);

                    paramList.AddWithValue("@FormId", model.FormId);
                    paramList.AddWithValue("@InputTypeId", model.InputTypeId);
                    paramList.AddWithValue("@Label", model.Label);
                    paramList.AddWithValue("@Type", model.Type);
                    paramList.AddWithValue("@Name", model.Name);
                    paramList.AddWithValue("@ParentId", model.ParentId);
                    paramList.AddWithValue("@Position", model.Position);
                },
                returnParameters: delegate (SqlParameterCollection paramList)
                {
                    id = (int)paramList["@Id"].Value;
                });
            return id;
        }

        public static InputControlViewModel MapInputControls(IDataReader reader, int index)
        {
            InputControlViewModel model = new InputControlViewModel();
            model.Title = reader.GetSafeString(index++);
            model.Description = reader.GetSafeString(index++);
            model.Version = reader.GetSafeDecimal(index++);
            model.InputControlId = reader.GetSafeInt32(index++);
            model.Label = reader.GetSafeString(index++);
            model.Name = reader.GetSafeString(index++);
            model.Type = reader.GetSafeString(index++);
            model.ParentId = reader.GetSafeInt32(index++);
            model.Position = reader.GetSafeInt32(index++);
            model.DataType = reader.GetSafeString(index++);
            return model;
        }

        public List<InputControlViewModel> SelectByFormId(int id)
        {
            List<InputControlViewModel> result = new List<InputControlViewModel>();
            this._dataProvider.ExecuteCmd(
            "InputControls_View",
            inputParamMapper: delegate (SqlParameterCollection paramList)
            {
                paramList.AddWithValue("@FormId", id);
            },
            singleRecordMapper: delegate (IDataReader reader, short set)
            {
                InputControlViewModel model = new InputControlViewModel();
                int index = 0;
                model = MapInputControls(reader, index);
                index++;
                result.Add(model);
            });
            return result;
        }

        public int Update(InputControlUpdateRequest model)
        {
            int id = 0;
            this._dataProvider.ExecuteNonQuery(
            "InputControls_Update",
            inputParamMapper : delegate(SqlParameterCollection paramList)
            {
                paramList.AddWithValue("@Id", model.Id);
                paramList.AddWithValue("@FormId", model.FormId);
                paramList.AddWithValue("@InputTypeId", model.InputTypeId);
                paramList.AddWithValue("@Label", model.Label);
                paramList.AddWithValue("@Type", model.Type);
                paramList.AddWithValue("@Name", model.Name);
                paramList.AddWithValue("@ParentId", model.ParentId);
                paramList.AddWithValue("@Position", model.Position);
            },
            returnParameters : delegate(SqlParameterCollection paramList)
            {
                id = (int)paramList["@Id"].Value;
            });
            return id;
        }

        public void Delete(int id)
        {
            this._dataProvider.ExecuteNonQuery(
                "InputControls_Delete",
                inputParamMapper: delegate (SqlParameterCollection paramList)
                {
                    paramList.AddWithValue("@FormId", id);
                });
        }
    }
}

