import slugify from "slugify";
import ProductModel from "../models/ProductModel.js";
import fs from "fs";
import CategoryModel from "../models/CategoryModel.js";
import braintree from "braintree";
import OrderModel from "../models/OrderModel.js";
import dotenv from "dotenv";
// import upload1 from "../middleware/upload.js";

dotenv.config();

// payment gateway
var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox, 
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});


// create product controller



export const createProductController = async (req, res) => {
  try {
   
    const { name, slug, description, price, offer,offerPrice, category, quantity } =
      req.body;
      const {photo1,photo2} = req.files;
      console.log(req.body);

      const photoPath1 = `/uploads/${photo1[0].filename}`;
      const photoPath2 = `/uploads/${photo2[0].filename}`;

    // validation
    if (!name) {
      return res.status(400).send({ error: "Name is required" });
    }
    if (!description) {
      return res.status(400).send({ error: "Description is required" });
    }
    if (!price) {
      return res.status(400).send({ error: "Price is required" });
    }
    if (!offer) {
      return res.status(400).send({ error: "Offer is required" });
    }
    if (!category) {
      return res.status(400).send({ error: "Category is required" });
    }
    if (!quantity) {
      return res.status(400).send({ error: "Quantity is required" });
    }
    if(!photo1){
      return res.status(400).send({ error: "Photo is required is required" });
    }
    if(!photo2){
      return res.status(400).send({ error: "Photo is required is required" });
    }
    // create product
    const product = new ProductModel({
      name,
      description,
      price,
      offer,
      category,
      quantity,
      photo1:photoPath1,
      photo2:photoPath2,
      slug:slugify(name)
    });

    // save product to database
    await product.save();

    // send response
    res.status(201).send({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error: "Error creating product",
    });
  }
};

// get all products controller
export const getProductController = async (req, res) => {
  try {
    const products = await ProductModel.find({})
      .populate("category")
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      total: products.length,
      message: "All products",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while getting all products",
      error,
    });
  }
};

// get single products controller
export const getSingleProductController = async (req, res) => {
  try {
    const product = await ProductModel.findOne({ slug: req.params.slug })
      .select("-photo1.data")
      .populate("category");
    res.status(200).send({
      success: true,
      message: "Single product Fetched",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while getting single product",
      error,
    });
  }
};

// get product photo
export const productPhotoController = async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.pid).select("-photo1.data");
    if (product.photo1.data) {
      const base64Image = `data:${product.photo1.contentType};base64,${product.photo1.data.toString('base64')}`;
      return res.status(200).send({ photo: base64Image });;
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in getting photo",
      error,
    });
  }
};

// delete product controller
export const deleteProductController = async (req, res) => {
  try {
    await ProductModel.findByIdAndDelete(req.params.pid).select("-photo1.data");
    res.status(200).send({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.statsu(500).send({
      success: false,
      message: "Error while deleting product",
      error,
    });
  }
};

// update product controller
export const updateProductController = async (req, res) => {
  try {
    const { name, description, price, offer, category, quantity, shipping } =
      req.fields;
    const { photo1,photo2 } = req.files;

    // validation
    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is Required" });
      case !description:
        return res.status(500).send({ error: "Description is Required" });
      case !price:
        return res.status(500).send({ error: "Price is Required" });
      case !offer:
        return res.status(500).send({ error: "Offer is Required" });
      case !category:
        return res.status(500).send({ error: "Category is Required" });
      case !quantity:
        return res.status(500).send({ error: "Quantity is Required" });
      // case photo && photo.size > 1000000:
      //   return res
      //     .status(500)
      //     .send({ error: "Photo is required or should be less then 1mb" });
      default:
        break;
    }
    const product = await ProductModel.findByIdAndUpdate(
      req.params.pid,
      { ...req.fields, slug: slugify(name) },
      { new: true }
    );
    if(photo1){
      product.photo1.data = fs.readFileSync(photo1.path);
      product.photo1.contentType = photo1.type
    }
    if(photo2){
      product.photo2.data = fs.readFileSync(photo2.path);
      product.photo2.contentType = photo2.type
    }
    product.offerPrice = Math.floor(price - ((price * offer)/100))
    await product.save();
    res.status(201).send({
      success: true,
      product: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in updating product",
      error,
    });
  }
};

// product filter controller
export const productFilterController = async (req, res) => {
  try {
    const { checked, radio } = req.body;
    let args = {};
    if (checked.length > 0) args.category = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
    const products = await ProductModel.find(args);
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in filtering products",
      error,
    });
  }
};

// product count controller
export const productCountController = async (req, res) => {
  try {
    const total = await ProductModel.find({}).estimatedDocumentCount();
    res.status(200).send({
      success: true,
      total,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while counting the products",
      error,
    });
  }
};

// product list controller
export const productListController = async (req, res) => {
  try {
    const perPage = 10;
    const page = req.params.page ? req.params.page : 1;
    const products = await ProductModel.find({})
      .select("-photo1.data")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });
      res.status(200).send({
        success:true,
        products
      })
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in per page control",
      error,
    });
  }
};

// search product controller
export const searchProductController = async(req,res) => {
  try {
    const {keyword} = req.params;
    const results = await ProductModel.find({
      $or:[
        {name:{$regex :keyword, $options:"i"}},
        {description:{$regex :keyword, $options:"i"}}
      ]
    }).select('-photos.data');
    res.json(results)
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while searching product",
      error,
    });
  }
}

// similar product controller
export const similarProductController = async(req,res) => {
  try {
    const {pid,cid} = req.params;
    const products = await ProductModel.find({
      category:cid,
      _id:{$ne:pid}
    }).select('-photo1.data').limit(3).populate('category');
    res.status(200).send({
      success:true,
      products
    })
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success:false,
      message:"Error while fetching similar products",
      error
    })
  }
}

// product category controller
export const productCategoryController = async(req,res) => {
  try {
    const category = await CategoryModel.findOne({slug:req.params.slug});
    const products = await ProductModel.find({category}).populate('category');
    res.status(200).send({
      success:true,
      category,
      products
    })
  } catch (error) {
    console.log(error);;
    res.status(500).send({
      success:false,
      message:"Error in getting products according to single category",
      error
    })
  }
}

// payment gateway controller
export const BraintreeTokenController = async(req,res) => {
  try {
    gateway.clientToken.generate({}, function (err, response) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(response);
      }
    });
  } catch (error) {
    console.log(error);
  }
}

// payment controller
export const BraintreePaymentController = async(req,res) => {
  try {
    const { nonce, cart } = req.body;
    let total = 0;
    cart.map((i) => {
      total += i.price;
    });
    let newTransaction = gateway.transaction.sale(
      {
        amount: total,
        paymentMethodNonce: nonce,
        options: {
          submitForSettlement: true,
        },
      },
      function (error, result) {
        if (result) {
          const order = new OrderModel({
            products: cart,
            payment: result,
            buyer: req.user._id,
          }).save();
          res.json({ ok: true });
        } else {
          res.status(500).send(error);
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
}

