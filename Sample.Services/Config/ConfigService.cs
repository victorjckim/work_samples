using Sample.Data;
using Sample.Data.Providers;
using Sample.Models.Domain;
using Sample.Models.Requests;
using Sample.Services.Interfaces;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;

namespace Sample.Services.Config
{
    public class ConfigService : IConfigService
    {
        private IDataProvider _dataProvider;

        public static ConcurrentDictionary<string, ConfigDomainModel> ConfigCache { get; set; }

        public ConfigService(IDataProvider dataProvider)
        {
            _dataProvider = dataProvider;
        }

        public int Create(ConfigAddRequest model)
        {
            int id = 0;
            
            this._dataProvider.ExecuteNonQuery(
                "Config_Insert",
                inputParamMapper: delegate(SqlParameterCollection paramList)
                {
                    SqlParameter param = new SqlParameter();
                    param.ParameterName = "@Id";
                    param.SqlDbType = SqlDbType.Int;
                    param.Direction = ParameterDirection.Output;
                    paramList.Add(param);

                    paramList.AddWithValue("@ConfigName", model.ConfigName);
                    paramList.AddWithValue("@DataTypeId", model.DataTypeId);
                    paramList.AddWithValue("@ConfigValue", model.ConfigValue);
                    paramList.AddWithValue("@ConfigKey", model.ConfigKey);
                    paramList.AddWithValue("@Description", model.Description);
                    paramList.AddWithValue("@ConfigTypeId", model.ConfigTypeId);
                    paramList.AddWithValue("@Required", model.Required);
                    paramList.AddWithValue("@Secured", model.Secured);
                    paramList.AddWithValue("@ModifiedBy", model.ModifiedBy);
                },
                returnParameters: delegate(SqlParameterCollection paramList)
                {
                    id = (int)paramList["@Id"].Value;
                });
            return id;
        }

        public ConfigDomainModel SelectById(int id)
        {
            ConfigDomainModel model = null;

            this._dataProvider.ExecuteCmd(
                "Config_SelectById",
                inputParamMapper: delegate (SqlParameterCollection paramList)
                {
                    paramList.AddWithValue("@Id", id);
                },
                singleRecordMapper: delegate(IDataReader reader, short set)
                {
                    int index = 0;
                    model = MapConfig(reader, index);
                }
            );
            return model;
        }

        public ConfigDomainModel SelectByKey(string key)
        {
            ConfigCache.TryGetValue(key, out ConfigDomainModel model);

            if (model == null)
            {
                this._dataProvider.ExecuteCmd(
                "Config_SelectByKey",
                inputParamMapper: delegate (SqlParameterCollection paramList)
                {
                    paramList.AddWithValue("@ConfigKey", key);
                },
                singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    int index = 0;
                    model = MapConfig(reader, index);
                }); ;
                ConfigCache.TryAdd(key, model);
            }
            return model;
        }

        public ConfigTypeConvertModel<bool> SelectConfigBoolByKey(string key)
        {
            ConfigDomainModel model = null;
            ConfigTypeConvertModel<bool> convertModel = new ConfigTypeConvertModel<bool>();

            this._dataProvider.ExecuteCmd(
                "Config_SelectByKey",
                inputParamMapper: delegate (SqlParameterCollection paramList)
                {
                    paramList.AddWithValue("@ConfigKey", key);
                },
                singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    int index = 0;
                    model = MapConfig(reader, index);
                }
            );

            bool val = false;
            bool success = bool.TryParse(model.ConfigValue, out val);

            if (success)
            {
                convertModel.ConfigValue = val;
            }
            
            convertModel.Id = model.Id;
            convertModel.ConfigName = model.ConfigName;
            convertModel.DataTypeId = model.DataTypeId;
            convertModel.ConfigKey = model.ConfigKey;
            convertModel.Description = model.Description;
            convertModel.ConfigTypeId = model.ConfigTypeId;
            convertModel.Required = model.Required;
            convertModel.Secured = model.Secured;
            convertModel.CreatedDate = model.CreatedDate;
            convertModel.ModifiedDate = model.ModifiedDate;
            convertModel.ModifiedBy = model.ModifiedBy;

            return convertModel;
        }

        public ConfigTypeConvertModel<int> SelectConfigIntByKey(string key)
        {
            ConfigDomainModel model = null;
            ConfigTypeConvertModel<int> convertModel = new ConfigTypeConvertModel<int>();

            this._dataProvider.ExecuteCmd(
                "Config_SelectByKey",
                inputParamMapper: delegate (SqlParameterCollection paramList)
                {
                    paramList.AddWithValue("@ConfigKey", key);
                },
                singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    int index = 0;
                    model = MapConfig(reader, index);
                }
            );

            int val = 0;
            bool success = int.TryParse(model.ConfigValue, out val);
            if (success) {
                convertModel.ConfigValue = val;
            }

            convertModel.Id = model.Id;
            convertModel.ConfigName = model.ConfigName;
            convertModel.DataTypeId = model.DataTypeId;
            convertModel.ConfigKey = model.ConfigKey;
            convertModel.Description = model.Description;
            convertModel.ConfigTypeId = model.ConfigTypeId;
            convertModel.Required = model.Required;
            convertModel.Secured = model.Secured;
            convertModel.CreatedDate = model.CreatedDate;
            convertModel.ModifiedDate = model.ModifiedDate;
            convertModel.ModifiedBy = model.ModifiedBy;

            return convertModel;
        }

        public ConfigTypeConvertModel<string> SelectConfigStringByKey(string key)
        {
            ConfigDomainModel model = null;
            ConfigTypeConvertModel<string> convertModel = new ConfigTypeConvertModel<string>();

            this._dataProvider.ExecuteCmd(
                "Config_SelectByKey",
                inputParamMapper: delegate (SqlParameterCollection paramList)
                {
                    paramList.AddWithValue("@ConfigKey", key);
                },
                singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    int index = 0;
                    model = MapConfig(reader, index);
                }
            );

            convertModel.Id = model.Id;
            convertModel.ConfigName = model.ConfigName;
            convertModel.DataTypeId = model.DataTypeId;
            convertModel.ConfigKey = model.ConfigKey;
            convertModel.Description = model.Description;
            convertModel.ConfigTypeId = model.ConfigTypeId;
            convertModel.Required = model.Required;
            convertModel.Secured = model.Secured;
            convertModel.CreatedDate = model.CreatedDate;
            convertModel.ModifiedDate = model.ModifiedDate;
            convertModel.ModifiedBy = model.ModifiedBy;

            return convertModel;
        }

        public List<ConfigDomainModel> SelectAll()
        {
            List<ConfigDomainModel> result = new List<ConfigDomainModel>();
            if (ConfigCache == null || ConfigCache.Count == 0)
            {
                this._dataProvider.ExecuteCmd(
                    "Config_SelectAll",
                    inputParamMapper: null,
                    singleRecordMapper: delegate (IDataReader reader, short set)
                    {
                        ConfigDomainModel model = new ConfigDomainModel();
                        int index = 0;
                        model = MapConfig(reader, index);
                        index++;
                        result.Add(model);
                    }
                );

                ConfigCache = new ConcurrentDictionary<string, ConfigDomainModel>();
                foreach (var item in result)
                {
                    ConfigCache.TryAdd(item.ConfigKey, item);
                }
            } else {
                foreach (var item in ConfigCache.Values)
                {
                    result.Add(item);
                }
            }

            return result;
        }

        public List<ConfigViewModel> View()
        {
            List<ConfigViewModel> result = new List<ConfigViewModel>();

            this._dataProvider.ExecuteCmd(
                "Config_View",
                inputParamMapper: null,
                singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    ConfigViewModel model = new ConfigViewModel();
                    int index = 0;
                    model = MapView(reader, index);
                    index++;
                    result.Add(model);
                }
            );
            return result;
        }

        public static ConfigViewModel MapView(IDataReader reader, int index)
        {
            ConfigViewModel model = new ConfigViewModel();
            model.Id = reader.GetSafeInt32(index++);
            model.ConfigName = reader.GetSafeString(index++);
            model.ConfigValue = reader.GetSafeString(index++);
            model.ConfigKey = reader.GetSafeString(index++);
            model.Description = reader.GetSafeString(index++);
            model.Required = reader.GetBoolean(index++);
            model.Secured = reader.GetBoolean(index++);
            model.ConfigTypeName = reader.GetSafeString(index++);
            model.ConfigTypeDescription = reader.GetSafeString(index++);
            model.DataTypeName = reader.GetSafeString(index++);
            model.DataTypeDescription = reader.GetSafeString(index++);
            return model;
        }

        public static ConfigDomainModel MapConfig(IDataReader reader, int index)
        {
            ConfigDomainModel model = new ConfigDomainModel();
            model.Id = reader.GetSafeInt32(index++);
            model.ConfigName = reader.GetSafeString(index++);
            model.DataTypeId = reader.GetSafeInt32(index++);
            model.ConfigValue = reader.GetSafeString(index++);
            model.ConfigKey = reader.GetSafeString(index++);
            model.Description = reader.GetSafeString(index++);
            model.ConfigTypeId = reader.GetSafeInt32(index++);
            model.Required = reader.GetBoolean(index++);
            model.Secured = reader.GetBoolean(index++);
            model.CreatedDate = reader.GetSafeDateTime(index++);
            model.ModifiedDate = reader.GetSafeDateTime(index++);
            model.ModifiedBy = reader.GetSafeString(index++);
            return model;
        }

        public int Update(ConfigUpdateModel model)
        {
            ConfigCache.TryRemove(model.ConfigKey, out _);
            var Id = 0;
            this._dataProvider.ExecuteNonQuery(
                "Config_Update",
                inputParamMapper: delegate (SqlParameterCollection paramList)
                {
                    paramList.AddWithValue("@Id", model.Id);
                    paramList.AddWithValue("@ConfigName", model.ConfigName);
                    paramList.AddWithValue("@DataTypeId", model.DataTypeId);
                    paramList.AddWithValue("@ConfigValue", model.ConfigValue);
                    paramList.AddWithValue("@ConfigKey", model.ConfigKey);
                    paramList.AddWithValue("@Description", model.Description);
                    paramList.AddWithValue("@ConfigTypeId", model.ConfigTypeId);
                    paramList.AddWithValue("@Required", model.Required);
                    paramList.AddWithValue("@Secured", model.Secured);
                    paramList.AddWithValue("@ModifiedBy", model.ModifiedBy);
                }, returnParameters: (SqlParameterCollection paramList) =>
                {
                    Id = (int)paramList["@Id"].Value;
                }
            );
            return Id;
        }

        public void Delete(int id)
        {
            this._dataProvider.ExecuteNonQuery(
                "Config_Delete",
                inputParamMapper: delegate (SqlParameterCollection paramList)
                {
                    paramList.AddWithValue("@Id", id);
                }
            );
        }
    }
}