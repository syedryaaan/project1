// NexaStore — Order Controller
// Original project by Marios Kanellopoulos (MIT), adapted for NexaStore
import asyncHandler from "express-async-handler";
import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import User from "../models/userModel.js";

// Server-side price recalculation helpers
const calcPrices = async (orderItems) => {
  // Look up real prices from DB to prevent manipulation
  const dbProducts = await Product.find({
    _id: { $in: orderItems.map((i) => i.product) },
  });

  const itemsPrice = orderItems.reduce((acc, orderItem) => {
    const dbProduct = dbProducts.find(
      (p) => p._id.toString() === orderItem.product.toString()
    );
    if (!dbProduct) throw new Error(`Product ${orderItem.product} not found`);
    // Apply discount if any
    const effectivePrice = dbProduct.discount
      ? dbProduct.price * (1 - dbProduct.discount / 100)
      : dbProduct.price;
    return acc + effectivePrice * orderItem.qty;
  }, 0);

  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  const taxRate = 0.15;
  const taxPrice = itemsPrice * taxRate;
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  return {
    itemsPrice: parseFloat(itemsPrice.toFixed(2)),
    shippingPrice: parseFloat(shippingPrice.toFixed(2)),
    taxPrice: parseFloat(taxPrice.toFixed(2)),
    totalPrice: parseFloat(totalPrice.toFixed(2)),
  };
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod } = req.body;

  if (!orderItems || orderItems.length === 0) {
    res.status(400);
    throw new Error("No order items provided");
  }

  if (!shippingAddress || !paymentMethod) {
    res.status(400);
    throw new Error("Shipping address and payment method are required");
  }

  // Server-side price recalculation (Security fix S4)
  const prices = await calcPrices(orderItems);

  const order = new Order({
    orderItems: orderItems.map((item) => ({
      name: item.name,
      qty: item.qty,
      image: item.image,
      price: item.price,
      product: item.product,
    })),
    user: req.user._id,
    shippingAddress,
    paymentMethod,
    itemsPrice: prices.itemsPrice,
    taxPrice: prices.taxPrice,
    shippingPrice: prices.shippingPrice,
    totalPrice: prices.totalPrice,
  });

  const createdOrder = await order.save();
  res.status(201).json(createdOrder);
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (order) {
    // Allow admin or the order owner to view
    if (
      order.user._id.toString() !== req.user._id.toString() &&
      !req.user.isAdmin
    ) {
      res.status(403);
      throw new Error("Not authorized to view this order");
    }
    res.json(order);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @desc    Update order to paid (server-side verification)
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    if (order.isPaid) {
      res.status(400);
      throw new Error("Order is already paid");
    }

    // Ensure only the owner can mark as paid
    if (order.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("Not authorized");
    }

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer?.email_address,
    };

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    order.status = "Delivered";

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({
    createdAt: -1,
  });
  res.json(orders);
});

// @desc    Get all orders (admin)
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  const pageSize = 20;
  const page = Number(req.query.pageNumber) || 1;
  const statusFilter = req.query.status ? { status: req.query.status } : {};

  const count = await Order.countDocuments(statusFilter);
  const orders = await Order.find(statusFilter)
    .populate("user", "id name email")
    .sort({ createdAt: -1 })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ orders, page, pages: Math.ceil(count / pageSize), count });
});

// @desc    Get admin analytics
// @route   GET /api/orders/analytics
// @access  Private/Admin
const getAnalytics = asyncHandler(async (req, res) => {
  const totalOrders = await Order.countDocuments();
  const paidOrders = await Order.countDocuments({ isPaid: true });

  const revenueResult = await Order.aggregate([
    { $match: { isPaid: true } },
    { $group: { _id: null, total: { $sum: "$totalPrice" } } },
  ]);
  const totalRevenue = revenueResult[0]?.total || 0;

  // Last 7 days revenue
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const dailyRevenue = await Order.aggregate([
    { $match: { isPaid: true, paidAt: { $gte: sevenDaysAgo } } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$paidAt" } },
        revenue: { $sum: "$totalPrice" },
        orders: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const totalProducts = await Product.countDocuments();
  const lowStockProducts = await Product.find({
    countInStock: { $lte: 5, $gt: 0 },
  })
    .select("name countInStock")
    .limit(10);
  const outOfStockProducts = await Product.countDocuments({
    countInStock: 0,
  });

  const totalCustomers = await User.countDocuments({ isAdmin: false });
  const recentCustomers = await User.find({ isAdmin: false })
    .sort({ createdAt: -1 })
    .limit(5)
    .select("name email createdAt");

  const recentOrders = await Order.find()
    .populate("user", "name email")
    .sort({ createdAt: -1 })
    .limit(10);

  res.json({
    totalRevenue: parseFloat(totalRevenue.toFixed(2)),
    totalOrders,
    paidOrders,
    totalProducts,
    totalCustomers,
    outOfStockProducts,
    lowStockProducts,
    dailyRevenue,
    recentOrders,
    recentCustomers,
  });
});

export {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
  getAnalytics,
};
