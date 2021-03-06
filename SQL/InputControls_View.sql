 ALTER PROC [dbo].[InputControls_View]
	   @FormId INT
	AS
	   /*
	   DECLARE @FormId INT = 170
	   EXEC InputControls_View @FormId
	   */
 BEGIN
SELECT
	   f.Title,
	   f.Description,
	   f.Version,
	   ic.Id AS InputControlId,
	   ic.Label,
	   ic.Name,
	   ic.Type,
	   ic.ParentId,
	   ic.Position,
	   it.DataType
  FROM InputControls ic
	   JOIN Form f on ic.FormId = f.Id
	   JOIN InputType it on ic.InputTypeId = it.Id
 WHERE FormId = @FormId
 	   ORDER BY Position, ParentId
   END