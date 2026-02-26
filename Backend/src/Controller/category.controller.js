const Category=require("../models/CategoryModel")
const  slugify  =require( "../utils/slugify");

const createCategory = async (req, res) => {
  const { name, slug } = req.body;

  if (!name?.trim()) return res.status(400).json({ message: "Category name is required" });

  const finalSlug = (slug?.trim() ? slugify(slug) : slugify(name));
  const exists = await Category.findOne({ slug: finalSlug });
  if (exists) return res.status(409).json({ message: "Category already exists" });

  const category = await Category.create({ name: name.trim(), slug: finalSlug });
  res.status(201).json({ category });
};

const getAllCategories = async (req, res) => {
  const categories = await Category.find().sort({ createdAt: -1 });
  res.json({ categories });
};

const getCategoryBySlug = async (req, res) => {
  const { slug } = req.params;
  const category = await Category.findOne({ slug });
  if (!category) return res.status(404).json({ message: "Category not found" });
  res.json({ category });
};

const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name, slug } = req.body;

  const category = await Category.findById(id);
  if (!category) return res.status(404).json({ message: "Category not found" });

  if (name?.trim()) category.name = name.trim();
  if (slug?.trim()) category.slug = slugify(slug);
  else if (name?.trim()) category.slug = slugify(name); // keep slug synced if you want

  const conflict = await Category.findOne({ slug: category.slug, _id: { $ne: id } });
  if (conflict) return res.status(409).json({ message: "Slug already in use" });

  await category.save();
  res.json({ category });
};

const deleteCategory = async (req, res) => {
  const { id } = req.params;
  const deleted = await Category.findByIdAndDelete(id);
  if (!deleted) return res.status(404).json({ message: "Category not found" });
  res.json({ message: "Category deleted" });
};

module.exports={createCategory,getAllCategories,getCategoryBySlug,updateCategory,deleteCategory};