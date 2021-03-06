 ALTER PROC [dbo].[Form_Insert]
	   @Id INT OUT,
	   @Title NVARCHAR(128),
	   @Description NVARCHAR(MAX),
	   @Version DECIMAL(18, 2),
	   @ModifiedBy NVARCHAR(128)
	AS
	   /*
	   DECLARE
	   @Id INT = 65,
	   @Title NVARCHAR(128) = 'Title',
	   @Description NVARCHAR(MAX) = 'Description',
	   @Version DECIMAL(18, 2) = 1.04,
	   @ModifiedBy NVARCHAR(128) = 'Victor'
	   EXEC Form_Insert @Id OUT, @Title, @Description, @Version, @ModifiedBy 
	   SELECT * FROM Form
	   SELECT * FROM InputControls
	   */
 BEGIN
	   BEGIN TRY
	   BEGIN TRAN
	       IF(@Id IS NULL)
	       BEGIN
               INSERT INTO Form(
			   Title,
			   Description,
               Version,
               ModifiedBy
               ) 
		       VALUES(
               @Title,
               @Description,
               @Version,
               @ModifiedBy
               )
            SET @Id = SCOPE_IDENTITY();
			END
			ELSE IF(@Id IS NOT NULL)
			BEGIN
				DELETE FROM InputControls
				WHERE FormId = @Id
				UPDATE Form
				SET Title = @Title,
					Description = @Description,
					Version = @Version + .01,
					ModifiedBy = @ModifiedBy
				WHERE id = @Id
			END
	   COMMIT TRAN
	       PRINT 'TRANSACTION COMMITTED'
	   END TRY
	   BEGIN CATCH
	   ROLLBACK TRAN
	       PRINT 'ROLLED BACK TRANSACTION'
	   END CATCH
   END