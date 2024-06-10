import express from "express";
import { LoginMiddleware, isAdmin } from "../middleware/authMiddleware.js";
import { categoryController, createCategoryController, deleteCategoryController, singleCategoryController, updateCategoryController } from "../controllers/CategoryController.js";

const router = express.Router();

router.post(
  "/create-category",
  LoginMiddleware,
  isAdmin,
  createCategoryController
);

// update category
router.put(
  "/update-category/:id",
  LoginMiddleware,
  isAdmin,
  updateCategoryController
);


// get all category
router.get("/get-category", categoryController);


// single category
router.get("/single-category/:slug", singleCategoryController);


// delete category
router.delete("/delete-category/:id",LoginMiddleware,isAdmin,deleteCategoryController)


export default router