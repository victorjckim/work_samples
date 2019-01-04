using System;
using System.Data;
using System.Data.SqlClient;
using System.Collections.Generic;

using Sample.Data;
using Sample.Data.Providers;
using Sample.Models.Requests;
using Sample.Services.Interfaces;
using Sample.Models.Domain;

namespace Sample.Services
{
    public class FormService : IFormService
    {
        private IDataProvider _dataProvider;

        public FormService (IDataProvider dataProvider)
        {
            _dataProvider = dataProvider;
        }

        public int Create(FormAddRequest model)
        {
            int id = 0;
            this._dataProvider.ExecuteNonQuery(
                "Form_Insert",
               inputParamMapper: delegate (SqlParameterCollection paramList)
               {
                   SqlParameter param = new SqlParameter();
                   param.ParameterName = "@Id";
                   param.SqlDbType = SqlDbType.Int;
                   param.Direction = ParameterDirection.Output;
                   paramList.Add(param);

                   paramList.AddWithValue("@Title", model.Title);
                   paramList.AddWithValue("@Description", model.Description);
                   paramList.AddWithValue("@Version", model.Version);
                   paramList.AddWithValue("@ModifiedBy", model.ModifiedBy);
               },
               returnParameters: delegate (SqlParameterCollection paramList)
               {
                   id = (int)paramList["@Id"].Value;
               });
            return id;
        }

        public FormDomainModel SelectById(int id)
        {
            FormDomainModel model = null;
            this._dataProvider.ExecuteCmd(
            "Form_SelectById",
            inputParamMapper: delegate (SqlParameterCollection paramList)
            {
                paramList.AddWithValue("@Id", id);
            },
            singleRecordMapper: delegate (IDataReader reader, short set)
            {
                int index = 0;
                model = MapForm(reader, index);
            });
            return model;
        }

        public static FormDomainModel MapForm(IDataReader reader, int index)
        {
            FormDomainModel model = new FormDomainModel();
            model.Id = reader.GetSafeInt32(index++);
            model.Title = reader.GetSafeString(index++);
            model.Description = reader.GetSafeString(index++);
            model.Version = reader.GetSafeDecimal(index++);
            model.CreatedDate = reader.GetSafeDateTime(index++);
            model.ModifiedDate = reader.GetSafeDateTime(index++);
            model.ModifiedBy = reader.GetSafeString(index++);
            return model;
        }

        public int Update(FormDomainModel model)
        {
            int id = 0;
            this._dataProvider.ExecuteNonQuery(
                "Form_Insert",
                inputParamMapper: delegate (SqlParameterCollection paramList)
                {
                    paramList.AddWithValue("@Id", model.Id);
                    paramList.AddWithValue("@Title", model.Title);
                    paramList.AddWithValue("@Description", model.Description);
                    paramList.AddWithValue("@Version", model.Version);
                    paramList.AddWithValue("@ModifiedBy", model.ModifiedBy);
                },
                returnParameters: delegate (SqlParameterCollection paramList)
                {
                    id = (int)paramList["@Id"].Value;
                });
            return id;
        }
    }
}
