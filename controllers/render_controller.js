const render_album = function (req, res, next) {
  try {
    next();
    return res.status(200);
  } catch(e) {
    return res.status(500).json({ error: e.message });
  }
};

export default render_album;
