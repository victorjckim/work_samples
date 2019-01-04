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
    // [Authorize (Roles = "Admin")]
    [AllowAnonymous]
    [RoutePrefix("api/admin/config")]
    public class ConfigAdminApiController : ApiController
    {
        private IConfigService _configService;

        [HttpPost]
        [Route("")]
        public HttpResponseMessage Create(ConfigAddRequest model)
        {
            try
            {
                if (ModelState.IsValid) {
                    int id = _configService.Create(model);
                    ItemResponse<int> resp = new ItemResponse<int>();
                    resp.Item = id;
                    return Request.CreateResponse(HttpStatusCode.OK, resp);
                } else {
                    return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
                }
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ex);
            }
        }

        [HttpGet]
        [Route("{id:int}")]
        public HttpResponseMessage SelectById(int id)
        {
            try
            {
                ItemResponse<ConfigDomainModel> resp = new ItemResponse<ConfigDomainModel>();
                resp.Item = _configService.SelectById(id);
                return Request.CreateResponse(HttpStatusCode.OK, resp);
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ex);
            }
        }

        [HttpGet]
        [Route]
        public HttpResponseMessage SelectAll()
        {
            try
            {
                ItemsResponse<ConfigDomainModel> resp = new ItemsResponse<ConfigDomainModel>();
                resp.Items = _configService.SelectAll();
                return Request.CreateResponse(HttpStatusCode.OK, resp);
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ex);
            }
        }

        [HttpGet]
        [Route("view")]
        public HttpResponseMessage View()
        {
            try
            {
                ItemsResponse<ConfigViewModel> resp = new ItemsResponse<ConfigViewModel>();
                resp.Items = _configService.View();
                return Request.CreateResponse(HttpStatusCode.OK, resp);
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ex);
            }
        }

        [HttpPut]
        [Route("{id:int}")]
        public HttpResponseMessage Update(ConfigUpdateModel model)
        {
            try
            {
                if (ModelState.IsValid) {
                    _configService.Update(model);
                    SuccessResponse resp = new SuccessResponse();
                    return Request.CreateResponse(HttpStatusCode.OK, resp);
                } else {
                    return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
                }
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ex);
            }
        }

        [HttpDelete]
        [Route("{id:int}")]
        public HttpResponseMessage Delete(int id)
        {
            try
            {
                _configService.Delete(id);
                SuccessResponse resp = new SuccessResponse();
                return Request.CreateResponse(HttpStatusCode.OK, resp);
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ex);
            }
        }

        public ConfigAdminApiController(IConfigService configService)
        {
            _configService = configService;
        }
    }
}