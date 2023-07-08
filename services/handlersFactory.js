const apiFeature = require('../utils/apiFeatures');
const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');


exports.deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await Model.findByIdAndDelete(id);

    if (!document) {
      return next(new ApiError(`No document for this id ${id}`, 404));
    }

    
    res.status(204).send();
  });

exports.updateOne = (model) => (asyncHandler(async (req, res, next) => {


  const document = await model.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!document) {
    return next(new ApiError(`No document Found for id ${req.params.id}`, 404));

  }
  document.save();

  res.status(200).json({ data: document });

}));
exports.createOne = model => (asyncHandler(async (req, res) => {

  const document = await model.create(req.body);

  res.status(201).json({ data: document });

}));
exports.getOne = (model, populationOptions) => (asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  let query = await model.findById(id);

  if (!query) {
    return next(new ApiError(`No document Found for id ${id}`, 404));
  }
  //query populate
  let document = query;
  if (populationOptions) {
    document = await query.populate(populationOptions);
  }


  res.status(200).json({ data: document });
}));

exports.getAll = (model, modelName = '') => asyncHandler(async (req, res) => {
  let filterObject = {};
  if (req.filterObject) {
    filterObject = req.filterObject;
  }
  const DocumentsQuery = await model.countDocuments();
  const apiFeatures = new apiFeature(model.find(filterObject), req.query).paginate(DocumentsQuery)
    .filter().search(modelName).limitFields().sort();

  //execute Query 
  const { mongooseQuery, paginationResult } = apiFeatures;
  const documents = await mongooseQuery;

  res.status(200).json({ results: paginationResult, date: documents })


})
