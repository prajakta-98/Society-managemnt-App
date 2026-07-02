import Society from '../models/Society.js';
import AppError from '../utils/AppError.js';
import asyncHandler from '../utils/asyncHandler.js';

export const listSocieties = asyncHandler(async (req, res) => {
  const societies = await Society.find().sort({ createdAt: -1 });
  res.json(societies);
});

export const createSociety = asyncHandler(async (req, res) => {
  const { name, address } = req.body;

  if (!name || !address) {
    throw new AppError('Name and address are required', 400);
  }

  const society = await Society.create({ name, address });
  res.status(201).json(society);
});
