const render_album = function (req, res, next) {
  try {
    next();
  } catch(e) {
    return res.status(500).json({ error: e.message });
  }
};

export default render_album;
