let InventoryModel = require('../models/inventory');

module.exports.invetoryList = async function (req, res, next) {

    try {
        let list = await InventoryModel.find({}).populate('owner');
        res.json(list);
    } catch (error) {
        console.log(error);
        next(error);
    }

}

module.exports.getByID = async function (req, res, next) {
    try {
        let item = await InventoryModel.findOne({ _id: req.params.id });
        if (!item)
            throw new Error('Item not found. Are you sure it exists?')

        res.json(item);

    } catch (error) {
        console.log(error);
        next(error);
    }
}

module.exports.processAdd = async (req, res, next) => {
    try {
        // console.log("req.payload: ", req.auth);
        let newProduct = InventoryModel({
            item: req.body.item,
            qty: req.body.qty,
            status: req.body.status,
            size: {
                h: req.body.size.h,
                w: req.body.size.w,
                uom: req.body.size.uom
            },
            tags: req.body.tags.split(",").map(word => word.trim())
            // owner: (req.body.owner == null || req.body.owner == "")? req.auth.id : req.body.owner
        });

        let result = await InventoryModel.create(newProduct)

        // refresh the book list
        console.log(result);
        res.json(result);

    } catch (error) {
        console.log(error);
        next(error);
    }
}

module.exports.processEdit = async (req, res, next) => {
    try {

        let id = req.params.id;

        // Builds updatedProduct from the values of the body of the request.
        let updatedProduct = InventoryModel({
            _id: req.params.id,
            item: req.body.item,
            qty: req.body.qty,
            status: req.body.status,
            size: {
                h: req.body.size.h,
                w: req.body.size.w,
                uom: req.body.size.uom
            },
            tags: req.body.tags.split(",").map(word => word.trim()),
            // owner: (req.body.owner == null || req.body.owner == "")? req.payload.id : req.body.owner
        });

        // Submits updatedProduct to the DB and waits for a result.
        let result = await InventoryModel.updateOne({ _id: id }, updatedProduct);
        console.log(result);

        // If the product is updated redirects to the list
        if (result.modifiedCount > 0) {
            res.json(
                {
                    success: true,
                    message: "Item updated sucessfully."
                }
            );
        }
        else {
            // Express will catch this on its own.
            throw new Error('Item not udated. Are you sure it exists?')
        }

    } catch (error) {
        next(error)
    }
}


module.exports.performDelete = async (req, res, next) => {

    try {

        let id = req.params.id;

        let result = await InventoryModel.deleteOne({ _id: id });

        console.log("====> Result: ", result);
        if (result.deletedCount > 0) {
            // refresh the book list
            res.json(
                {
                    success: true,
                    message: "Item deleted sucessfully."
                }
            )
        }
        else {
            // Express will catch this on its own.
            throw new Error('Item not deleted. Are you sure it exists?')
        }

    } catch (error) {
        console.log(error);
        next(error);
    }
}