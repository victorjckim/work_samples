ALTER PROC [dbo].[Config_View]
	AS
 BEGIN
SELECT 
	   c.Id, 
	   c.ConfigName, 
	   c.ConfigValue,
	   c.ConfigKey, 
	   c.Description, 
	   c.Required, 
	   c.Secured, 
	   ct.DisplayName AS ConfigTypeName, 
	   ct.Description AS ConfigTypeDescription, 
	   dt.DisplayName AS DataTypeName, 
	   dt.Description AS DataTypeDescription 
  FROM Config c 
	   JOIN ConfigType ct ON c.ConfigTypeId = ct.id
	   JOIN DataType dt ON c.DataTypeId = dt.id
   END