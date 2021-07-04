const Setting = require('../modals/setting');

module.exports = {
    addSetting: addSetting,
    fetchSetting: fetchSetting,
    fetchAllSetting: fetchAllSetting,
    updateSetting: updateSetting,
    updateAllSetting: updateAllSetting,
    removeSetting: removeSetting,
};

function addSetting(req, res) {
    let setting = new Setting(req.body);
    setting.save()
        .then(response => {
            res.status(200);
            return res.json({
                success: true,
                message: 'Data saved successfully!',
                data: response,
            });
        })
        .catch(error => {
            res.status(400);
            return res.json({
                success: false,
                message: 'Unable to save data!',
                error: error,
            });
        });
}

function fetchSetting(req, res) {
    Setting.find(req.body.query).sort({
        createdAt: 1
    }).then(response => {
        res.status(200);
        return res.json({
            success: true,
            message: 'Data fetched successfully!',
            data: response,
        });
    }).catch(error => {
        res.status(400);
        return res.json({
            success: false,
            message: 'Unable to fetch data!',
            error: error,
        });
    });
}

function fetchAllSetting(req, res) {
    let query = req.body.query || {};
    let sort = {
        createdAt: 1
    };
    let skip = 0;
    let limit = 10;
    if (req.body.sort) {
        sort = req.body.sort;
    }
    if (req.body.skip) {
        skip = req.body.skip;
    }
    if (req.body.limit) {
        limit = req.body.limit;
    }
    Setting.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .then(response => {
            res.status(200);
            return res.json({
                success: true,
                message: 'Data fetched successfully!',
                data: response,
            });
        })
        .catch(error => {
            res.status(400);
            return res.json({
                success: false,
                message: 'Unable to fetch data!',
                error: error,
            });
        });
}

function updateSetting(req, res) {
    Setting.findOneAndUpdate(req.body.query, {
        $set: req.body
    }, {
        new: true
    })
        .then(response => {
            res.status(200);
            return res.json({
                success: true,
                message: 'Data updated successfully!',
                data: response,
            });
        })
        .catch(error => {
            res.status(400);
            return res.json({
                success: false,
                message: 'Unable to update data!',
                error: error,
            });
        });
}

function updateAllSetting(req, res) {
    Setting.updateMany(req.body.query, {
        $set: req.body.data
    }, {
        multi: true
    })
        .then(response => {
            res.status(200);
            return res.json({
                success: true,
                message: 'Data updated successfully!',
                data: response,
            });
        })
        .catch(error => {
            res.status(400);
            return res.json({
                success: false,
                message: 'Unable to update data!',
                error: error,
            });
        });
}

function removeSetting(req, res) {
    Setting.findByIdAndRemove({
        _id: req['token']['_id'],
    })
        .then(response => {
            res.status(200);
            return res.json({
                success: true,
                message: 'Data removed successfully!',
            });
        })
        .catch(error => {
            res.status(400);
            return res.json({
                success: false,
                message: 'Unable to remove data!',
                error: error,
            });
        });
}