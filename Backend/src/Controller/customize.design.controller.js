const CustomDesign = require("../models/CustomDesignModel");
const CustomizeTemplate = require("../models/CustomizeTemplateModel");
const Fabric = require("../models/FabricModel");

const createDesign = async (req, res) => {
  const userId = req.user._id;
  const { templateId, color, size, fabricId } = req.body;

  const template = await CustomizeTemplate.findById(templateId);
  if (!template) return res.status(404).json({ message: "Template not found" });

  if (!template.colors.includes(color)) return res.status(400).json({ message: "Invalid color" });
  if (template.sizes.length && !template.sizes.includes(size)) return res.status(400).json({ message: "Invalid size" });

  let fabricExtra = 0;
  if (fabricId) {
    const fab = await Fabric.findById(fabricId);
    if (!fab) return res.status(400).json({ message: "Invalid fabric" });
    if (!template.fabrics.map(String).includes(String(fabricId))) return res.status(400).json({ message: "Fabric not allowed" });
    fabricExtra = fab.extraPrice || 0;
  }

  const total = Number(template.basePrice) + Number(fabricExtra);

  const design = await CustomDesign.create({
    user: userId,
    template: template._id,
    selected: { color, size, fabric: fabricId || undefined },
    priceSnapshot: { basePrice: template.basePrice, fabricExtra, printExtra: 0, total },
    status: "draft",
  });

  res.status(201).json({ design });
};

const getMyDesign = async (req, res) => {
  const d = await CustomDesign.findOne({ _id: req.params.id, user: req.user._id })
    .populate("template")
    .populate("selected.fabric");
  if (!d) return res.status(404).json({ message: "Design not found" });
  res.json({ design: d });
};

const updateDesign = async (req, res) => {
  const { layers, selected } = req.body;

  const d = await CustomDesign.findOne({ _id: req.params.id, user: req.user._id });
  if (!d) return res.status(404).json({ message: "Design not found" });
  if (d.status === "ordered") return res.status(400).json({ message: "Design already ordered" });

  if (Array.isArray(layers)) d.layers = layers;
  if (selected) d.selected = { ...d.selected, ...selected };

  await d.save();
  res.json({ design: d });
};

const setReady = async (req, res) => {
  const d = await CustomDesign.findOne({ _id: req.params.id, user: req.user._id });
  if (!d) return res.status(404).json({ message: "Design not found" });

  d.status = "ready";
  await d.save();

  res.json({ design: d });
};

module.exports = { createDesign, getMyDesign, updateDesign, setReady };