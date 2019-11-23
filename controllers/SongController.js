var Song = require('../models/song');
var debug = require('debug')('blog:song_controller');

// Search a one Song y database
module.exports.getOne = (req, res, next) => {
    debug("Search Song", req.params);
    Song.findOne({
            songname: req.params.songname
        })
        .then((foundSong) => {
            debug("Found Song", foundSong);
            if (foundSong)
                return res.status(200).json(foundSong);
            else
                return res.status(400).json(null)
        })
        .catch(err => {
            next(err);
        });
}

module.exports.getAll = (req, res, next) => {
    var perPage = Number(req.query.size) || 10,
        page = req.query.page > 0 ? req.query.page : 0;

    var sortProperty = req.query.sortby || "createdAt",
        sort = req.query.sort || "desc";

    debug("Songt List", {
        size: perPage,
        page,
        sortby: sortProperty,
        sort
    });

    Song.find({})
        .limit(perPage)
        .skip(perPage * page)
        .sort({
            [sortProperty]: sort
        })
        .then((songs) => {
            debug("Found songs", songs);
            return res.status(200).json(songs)
        }).catch(err => {
            next(err);
        });

}

// New Song

module.exports.register = (req, res, next) => {
    debug("New Song", {
        body: req.body
    });
    Song.findOne({
            songname: req.body.songname
        })
        .then((foundSong) => {
            if (foundSong) {
                debug("Cancion duplicada");
                throw new Error(`Cancion duplicada ${req.body.songname}`);
            } else {
                let newSong = new Song({
                    songname: req.body.songname,
                    songlink: req.body.songlink
                });
                return newSong.save();
            }
        }).then(song => {
            return res
                .header('Location', '/songs/' + song.songname)
                .status(201)
                .json({
                    songname: song.songname
                });
        }).catch(err => {
            next(err);
        });
}


// Update Song 

module.exports.update = (req, res, next) => {
    debug("Update song", {
        songname: req.params.songname,
        ...req.body
    });

    let update = {
        ...req.body
    };

    Song.findOneAndUpdate({
            songname: req.params.songname
        }, update, {
            new: true
        })
        .then((updated) => {
            if (updated)
                return res.status(200).json(updated);
            else
                return res.status(400).json(null);
        }).catch(err => {
            next(err);
        });
}

module.exports.delete = (req, res, next) => {

    debug("Delete song", {
        _id: req.params.songname,
    });

    Song.findOneAndDelete({songname: req.params.songname})
    .then((data) =>{
        if (data) res.status(200).json(data);
        else res.status(404).send();
    }).catch( err => {
        next(err);
    })
}