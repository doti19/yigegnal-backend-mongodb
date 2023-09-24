const httpStatus = require('http-status');
const ApiError = require('../errors/api-error');
const catchAsync = require('../utils/catchAsync');
const {dashboardService} = require('../services');
const logger = require('../../config/logger');

const dashboard = catchAsync(async(req, res)=>{
	console.log(req.user.role);
	const result = await dashboardService.dashboard(req.user.role);
	res.send(result);
})


module.exports = {
	dashboard,
}