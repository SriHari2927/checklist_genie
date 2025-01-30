const express = require("express");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getItemResponses = async (req, res) => {
  try {
    const itemResponse = await prisma.checklist_item_response.findMany();

    return res.status(200).json(itemResponse);
  } catch (error) {
    console.error("Error creating item response:", error);
    return res.status(500).json({ error: "Error creating item response" });
  }
};


const updateItemResponse = async (req, res) => {
  try {
    const {
      status,
      comments,
      checklist_template_linked_items_id,
      template_version,
      selected_date,
      input,
    } = req.body;

    const { organisation_user_id } = req.user;

    const linkedItem = await prisma.checklist_template_linked_items.findMany({
      where: { id: checklist_template_linked_items_id },
    });

    console.log("jjjjjjjjjjj", linkedItem);
    if (!linkedItem) {
      return res
        .status(404)
        .json({ error: "Checklist template linked item not found." });
    }

    const templateVersion = await prisma.checklist_template_version.findFirst({
      where: { version_id: template_version },
    });

    if (!templateVersion) {
      return res.status(404).json({ error: "Template version not found." });
    }

    const dateTime = selected_date || new Date().toISOString().split("T")[0];

    const updatedItem = await prisma.checklist_item_response.create({
      data: {
        status,
        organisation_user_id,
        comments,
        checklist_template_linked_items_id: linkedItem.id,
        user_assigned_checklist_template_id: 1,
        template_version: templateVersion.version_id,
        selected_date: dateTime,
        created_at: new Date(),
        input,
      },
    });

    return res.status(200).json({
      message: "Response updated successfully",
      updatedItem,
    });
  } catch (error) {
    console.error("Error updating item response:", error);
    return res.status(500).json({ error: "Error updating item response" });
  }
};

module.exports = { getItemResponses, updateItemResponse };
