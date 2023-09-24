const httpStatus = require('http-status');
const {FoundedItem} = require('../models');
const {Inquiry} = require('../models');
const {Catagory} = require('../models');
const {User} = require('../models');

const dashboard = async(role)=>{
// res = User.aggregate([
// 	{
// 		$count: "TotalUsers"
// 	},
// 	{
// 		$lookup:{
// 			from: "founditems",
// 			pipeline:[
// 				{
// 					$count: "TotalFoundItems"
// 				}
// 			],
// 			as: "founditems"
// 		}
// 	},
// 	{
// 		$lookup:{
// 			from: "inquiries",
// 			pipeline:[
// 				{
// 					$count: "TotalInquiries"
// 				}
// 			],
// 			as: "inquiries"
// 		}
// 	},
	
// 	{
// 		$project: {
// 			TotalUsers: 1,
// 			TotalInquiries: {
// 				$arrayElemAt: [
// 					"$inquiries.TotalInquiries",
// 					0
// 				]
// 			},
// 			TotalFoundItems: {
// 				$arrayElemAt: [
// 					"$founditems.TotalFoundItems",
// 					0
// 				]
// 			},
			
// 		}
// 	}
// ]);

res = {};

	
const result = await Promise.all([
	FoundedItem.countDocuments({}),
	FoundedItem.countDocuments({
		status: "Pending"
	}),
	FoundedItem.countDocuments({
		status: "Delivered"
	}),
	FoundedItem.countDocuments({
		status: "Not Delivered"
	}),
	Inquiry.countDocuments({}),
	Inquiry.countDocuments({
		status: "Pending"
	}),
	Inquiry.countDocuments({
		status: "Found"
	}),

])
if(role=='admin' || role=='super_admin'){
	const x = await Promise.all([
		User.countDocuments({}),
		User.countDocuments({
			role: 'db_analysist'
		}),
		User.countDocuments({
			role: 'delivery'
		})
	]);
	res.users = x[0];
	res.dbAnalysists = x[1];
	res.deliveries = x[2];
}
res.foundedItems = result[0];
res.foundedItemPending = result[1];
res.foundedItemDelivered = result[2];
res.foundedItemNotDelivered = result[3];
res.inquiries = result[4];
res.inquiriesPending = result[5];
res.inquiriesFound = result[6];

return res;
}

module.exports = {
	dashboard
}