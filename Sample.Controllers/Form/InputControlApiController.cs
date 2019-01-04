using Sample.Models.Domain;
using Sample.Models.Requests;
using Sample.Models.Responses;
using Sample.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;

namespace Sample.Web.Controllers.Api
{
    [AllowAnonymous]
    [RoutePrefix("api/inputcontrols")]
    public class InputControlApiController : ApiController
    {
        private IInputControlService _inputControlService;
        private ILogsService _logsService;
        private static readonly log4net.ILog log = log4net.LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);
        public InputControlApiController(IInputControlService inputControlService, ILogsService logsService)
        {
            _inputControlService = inputControlService;
            _logsService = logsService;
        }

        [HttpPost]
        [Route("")]
        public HttpResponseMessage Create(InputControlAddRequest model)
        {
            try
            {
                int id = _inputControlService.Create(model);
                ItemResponse<int> resp = new ItemResponse<int>();
                resp.Item = id;
                log.Info("Create Input Control");
                return Request.CreateResponse(HttpStatusCode.OK, resp);
            }
            catch (Exception ex)
            {
                log.Error("Error: Input Control Insert Failed", ex);
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ex);
            }
        }

        [HttpGet]
        [Route("{id:int}")]
        public HttpResponseMessage SelectByFormId(int id)
        {
            try
            {
                ItemsResponse<InputControlViewModel> resp = new ItemsResponse<InputControlViewModel>();
                resp.Items = _inputControlService.SelectByFormId(id);
                var grouped = resp.Items.GroupBy(item => item.Position)
                    .Select(group => new { Position = group.Key, Items = group.ToList() }).ToList()
                    .OrderBy(group => group.Items.First().Position);
                log.Info("Select by Form Id");
                return Request.CreateResponse(HttpStatusCode.OK, grouped);
            }
            catch (Exception ex)
            {
                log.Error("Error: Unable to 'Select by Form Id'", ex);
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ex);
            }
        }

        [HttpDelete]
        [Route("{id:int}")]
        public HttpResponseMessage Delete(int id)
        {
            try
            {
                _inputControlService.Delete(id);
                SuccessResponse resp = new SuccessResponse();
                log.Info("Delete Input Control");
                return Request.CreateResponse(HttpStatusCode.OK, resp);
            }
            catch (Exception ex)
            {
                log.Fatal("Error: Unable to Delete Input Control", ex);
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ex);
            }
        }
    }
}