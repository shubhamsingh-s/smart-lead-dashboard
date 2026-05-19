import { Request, Response, NextFunction } from 'express';
import Lead from '../models/Lead';
import { ApiError } from '../middlewares/errorMiddleware';

// @desc    Create a lead
// @route   POST /api/leads
// @access  Private
export const createLead = async (req: any, res: Response, next: NextFunction) => {
  try {
    const { name, email, status, source } = req.body;

    const leadExists = await Lead.findOne({ email });
    if (leadExists) {
      return next(new ApiError('Lead with this email already exists', 400));
    }

    const lead = await Lead.create({
      name,
      email,
      status,
      source,
      createdBy: req.user._id,
    });

    res.status(201).json({ success: true, data: lead });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all leads (with advanced filtering, sorting, pagination)
// @route   GET /api/leads
// @access  Private
export const getLeads = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, source, search, sort, page = '1', limit = '10' } = req.query;

    const query: any = {};

    if (status) {
      query.status = status;
    }
    
    if (source) {
      query.source = source;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    // Sorting
    let sortObj: any = { createdAt: -1 }; // default latest
    if (sort === 'Oldest') {
      sortObj = { createdAt: 1 };
    }

    // Pagination
    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);
    const skip = (pageNumber - 1) * limitNumber;

    const leads = await Lead.find(query)
      .sort(sortObj)
      .skip(skip)
      .limit(limitNumber);

    const total = await Lead.countDocuments(query);

    res.status(200).json({
      success: true,
      data: leads,
      pagination: {
        total,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(total / limitNumber)
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single lead
// @route   GET /api/leads/:id
// @access  Private
export const getLeadById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return next(new ApiError('Lead not found', 404));
    }
    res.status(200).json({ success: true, data: lead });
  } catch (error) {
    next(error);
  }
};

// @desc    Update lead
// @route   PUT /api/leads/:id
// @access  Private
export const updateLead = async (req: any, res: Response, next: NextFunction) => {
  try {
    let lead = await Lead.findById(req.params.id);
    if (!lead) {
      return next(new ApiError('Lead not found', 404));
    }

    // Update
    lead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: lead });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete lead
// @route   DELETE /api/leads/:id
// @access  Private (Admin only)
export const deleteLead = async (req: any, res: Response, next: NextFunction) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return next(new ApiError('Lead not found', 404));
    }

    if (req.user.role !== 'Admin') {
      return next(new ApiError('Not authorized to delete leads', 403));
    }

    await lead.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};
