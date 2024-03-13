const db = require("../models");
const Asset = db.asset;

// Create and Save a new Asset
exports.create = async (req, res) => {
  // Validate request
  if (!req.body.acquisitionDate || isNaN(parseInt(req.body.acquisitionPrice)) || !req.body.condition || !req.body.typeId) {
    return res.status(400).send({
      message: "Content cannot be empty!",
    });
  }

  // Create an Asset
  const asset = {
    id: req.body.id,
    acquisitionDate: req.body.acquisitionDate,
    acquisitionPrice: req.body.acquisitionPrice,
    dueDate: req.body.dueDate,
    condition: req.body.condition,
    templateId: req.body.templateId,
    typeId: req.body.typeId,
    borrowerId: req.body.borrowerId,
    locationId: req.body.locationId,
  };

  const type = await db.assetType.findByPk(asset.typeId, {
    attributes: ["id", "identifierId"],
    where: { categoryId: req.requestingUser.dataValues.creatableCategories },
    required: true,
    include: [
      {
        model: db.assetField,
        as: "fields",
        attributes: ["id", "required"],
      }
    ],
  });

  if (!type) return res.status(400).send({
    message: "Error creating asset! Maybe user is unauthorized.",
  });

  const t = await db.sequelize.transaction();
  let error = false;

  try {
    let result = {};
    await Asset.create(asset, { transaction: t })
    .then((data) => {
      result = data.get({ plain: true });
    })
    .catch((err) => {
      error = true;
      res.status(500).send({
        message: err.message || "Some error occurred while creating the asset.",
      });
    });
    
    if (error) throw new Error();

    const data = req.body.type?.fields?.filter(field => {
      field.assetData = {
        ...(field.assetData ?? {}),
        assetId: result.id,
        fieldId: field.id,
      };
      field.assetData.value = field.assetData.value?.trim();

      return field.assetData.value?.length > 0;
    })?.map(field => field.assetData);
    
    // If template can be found, exclude any asset data with matching field ids
    if (!isNaN(parseInt(asset.templateId))) {
      const template = (await db.assetTemplate.findByPk(asset.templateId, {
        attributes: [],
        include: {
          model: db.templateData,
          as: "data",
          attributes: ["fieldId"],
        },  
      }))?.get({ plain: true });  

      if (!template) {
        res.status(404).send({
          message: "Error creating asset: invalid asset template id.",
        });  
        throw new Error();
      }

      console.log(template)

      // Overwrite all asset data that a template data already handles
      template.data.forEach(templateData => {
        const match = data.findIndex(assetData => assetData.fieldId == templateData.fieldId);
        if (match >= 0) data[match] = {
          ...data[match],
          ...templateData,
        };
      });
    }

    // Check required fields
    type.dataValues.fields.forEach(field => {
      error ||= field.dataValues.required && !data.find(assetData => assetData.fieldId == field.dataValues.id);
    });
    
    if (error) {
      res.status(400).send({
        message: "Error creating asset data! Not all required fields have been filled out.",
      });
      throw new Error();
    }

    // Check identifier
    if (!isNaN(parseInt(type.dataValues.identifierId))) {
      const identifier = await db.assetField.findByPk(type.dataValues.identifierId, {
        attributes: [],
        include: {
          model: db.assetData,
          as: "assetData",
          attributes: ["value"],
        },
      });

      if (!identifier) {
        res.status(400).send({
          message: "Error: invalid asset field id for identifier!",
        });
        throw new Error();
      }

      const identifierData = data.find(assetData => assetData.fieldId == type.dataValues.identifierId);
      if (identifier.dataValues.assetData?.some(assetData => assetData.value == identifierData.value)) {
        res.status(400).send({
          message: "Error: asset identifier is not unique!",
        });
        throw new Error();
      }
    }

    await db.assetData.bulkCreate(data, { transaction: t })
    .catch(err => {
      error = true;
      res.status(500).send({
        message: "Error creating asset data!",
      });
    });

    if (error) throw new Error();

    await Asset.findByPk(result.id, {
      transaction: t,
      include: {
        model: db.assetType,
        as: "type",
        attributes: ["name", "identifierId"],
        include: [
          {
            model: db.assetField,
            as: "fields",
            attributes: ["id", "label", "required"],
            include: {
              model: db.assetData,
              as: "assetData",
              where: {
                assetId: result.id,
              },
              limit: 1,
            },
          },
          {
            model: db.assetCategory,
            as: "category",
            attributes: ["name"],
          },
        ],
      },
    })
    .then(data => {
      result = data;
      result.dataValues.type.dataValues.fields.forEach(field => field.dataValues.assetData = field.dataValues.assetData?.[0] ?? null);
    })
    .catch(err => {
      console.log(err)
      error = true;
      res.send(500).send({
        message: "Error retrieving and serving new asset!",
      });
    });

    if (error) throw new Error();

    res.send(result);

    await t.commit();
  }
  catch {
    await t.rollback();
  }
};

// Retrieve all Assets from the database.
exports.findAll = (req, res) => {
  const raw = req.query?.raw != undefined;
  const typeIncludes = !raw ? {
    include: [
      {
        model: db.assetCategory,
        as: "category",
        attributes: ["name"],
      },
      {
        model: db.assetField,
        as: "identifier",
        attributes: ["label"],
        required: false,
        include: {
          model: db.assetData,
          as: "assetData",
          attributes: ["value"],
          required: false,
          where: db.Sequelize.where(db.Sequelize.col("type->identifier->assetData.assetId"), db.Sequelize.col("asset.id")),
        },
      },
    ],
  } : {};
  const assetIncludes = !raw ? [
    {
      model: db.room,
      as: "location",
      attributes: ["name"],
      include: {
        model: db.building,
        as: "building",
        attributes: ["abbreviation"],
      },
    },
    {
      model: db.alert,
      as: "alerts",
    },
  ] : [];

  Asset.findAll({
    ...req.paginator,
    attributes: raw ? [] : ["id"],
    include: [
      {
        model: db.assetType,
        as: "type",
        attributes: raw ? [] : ["name"],
        required: true,
        where: { categoryId: req.requestingUser.dataValues.viewableCategories },
        ...typeIncludes,
      },
      ...assetIncludes
    ]
  })
  .then(async (data) => {
    if (!raw) {
      data.forEach(asset => {
        if (!!asset.dataValues.type.dataValues.identifier?.dataValues?.assetData)
          asset.dataValues.type.dataValues.identifier.dataValues.assetData = asset.dataValues.type.dataValues.identifier.dataValues.assetData?.[0] ?? null;
      })
    }

    res.send(data);
  })
  .catch((err) => {
    res.status(500).send({
      message: "Some error occurred while retrieving assets.",
    });
  });
};

// Find a single Asset with an id
exports.findOne = async (req, res) => {
  const id = req.params.id;
  const full = req.query?.full != undefined;

  const typeIncludes = full ? [
    {
      model: db.assetField,
      as: "fields",
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      include: [
        {
          model: db.assetData,
          as: "assetData",
          attributes: {
            exclude: ["assetId", "fieldId", "id"],
          },
          required: false,
          where: {
            assetId: id,
          },
          limit: 1,
        },
        {
          model: db.templateData,
          as: "templateData",
          attributes: {
            exclude: ["templateId", "fieldId", "id"],
          },
          required: false,
          where: {
            templateId: db.Sequelize.col("asset.templateId"),
          },
        },
      ],
    },
  ] : [];
  const assetIncludes = full ? [
    {
      model: db.assetTemplate,
      as: "template",
      attributes: ["id", "name"],
    },
    {
      model: db.log,
      as: "logs",
    }
  ] : [];

  let error = false;
  const asset = await Asset.findByPk(id, {
    include: [
      {
        model: db.assetType,
        as: "type",
        attributes: full ? ["name", "identifierId"] : [],
        required: true,
        where: { categoryId: req.requestingUser.dataValues.viewableCategories },
        include: typeIncludes,
      },
      ...assetIncludes,
    ],
  })
  .catch((err) => {
    error = true;
    res.status(500).send({
      message: "Error retrieving asset with id=" + id,
    });
  });

  if (error) return;

  if (!asset) return res.status(404).send({
    message: `Cannot find asset with id=${id}. Maybe asset was not found or user is unauthorized!`,
  });

  asset.dataValues?.type?.dataValues?.fields
  ?.forEach(field => {
    field.dataValues.templateData = field.dataValues.templateData?.[0] ?? null;
    field.dataValues.assetData = !field.dataValues.templateData ? field.dataValues.assetData?.[0] ?? null : null;
  });

  const missingData = asset.dataValues?.type?.dataValues?.fields
  ?.filter(field => field.dataValues.required && !field.dataValues.assetData && !field.dataValues.templateData)
  ?.map(field => {
    return {
      assetId: id,
      fieldId: field.dataValues.id,
    };
  }) ?? [];

  if (full && missingData.length > 0) {
    const t = await db.sequelize.transaction();

    try {
      const newData = await db.assetData.bulkCreate(missingData, { transaction: t });
      
      if (!newData) {
        res.status(500).send({
          message: "Error auto-filling required fields!",
        });
        throw new Error();
      }
      
      newData.forEach(data => {
        const owningField = asset.dataValues.type.dataValues.fields.find(field => field.dataValues.id == data.dataValues.fieldId);
        if (!owningField) return error = true;
        delete data.dataValues.id;
        delete data.dataValues.fieldId;
        delete data.dataValues.assetId;
        owningField.dataValues.assetData = data;
      });

      if (error) {
        res.status(500).send({
          message: "Error auto-filling required fields!",
        });
        throw new Error();
      }

      await t.commit();
    }
    catch {
      return t.rollback();
    }
  }

  res.send(asset);
};

// Update an Asset by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Asset.update(req.body, {
    where: { id },
    include: {
      model: db.assetType,
      as: "type",
      attributes: [],
      required: true,
      where: { categoryId: req.requestingUser.dataValues.editableCategories },
    },
  })
  .then((num) => {
    if (num > 0) {
      res.send({
        message: "Asset was updated successfully.",
      });
    } else {
      res.send({
        message: `Cannot update asset with id=${id}. Maybe asset was not found, req.body is empty, or user is unauthorized!`,
      });
    }
  })
  .catch((err) => {
    res.status(500).send({
      message: "Error updating asset with id=" + id,
    });
  });
};

// Delete an Asset with the specified id in the request
exports.delete = async (req, res) => {
  const id = req.params.id;
  const type = await Asset.findByPk(id, {
    attributes: [],
    include: {
      model: db.assetType,
      as: "type",
      attributes: [],
      where: { categoryId: req.requestingUser.dataValues.deletableCategories },
      required: true,
      raw: true,
    },
  });

  if (!type) return res.status(404).send({
    message: "Error deleting asset! Maybe asset was not found or user is unauthorized.",
  });

  Asset.destroy({ where: { id } })
  .then((num) => {
    if (num > 0) {
      res.send({
        message: "Asset was deleted successfully!",
      });
    } else {
      res.send({
        message: `Cannot delete asset with id=${id}. Maybe asset was not found or user is unauthorized!`,
      });
    }
  })
  .catch((err) => {
    res.status(500).send({
      message: "Could not delete asset with id=" + id,
    });
  });
};

// Delete all Assets from the database.
// exports.deleteAll = (req, res) => {
//   Asset.destroy({
//     where: {},
//     truncate: false,
//   })
//   .then((nums) => {
//     res.send({ message: `${nums} assets were deleted successfully!` });
//   })
//   .catch((err) => {
//     res.status(500).send({
//       message:
//         err.message || "Some error occurred while removing all assets.",
//     });
//   });
// };
