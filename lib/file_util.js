const extension = (content_type) => {
  // TODO: Add support for HEIC etc
  switch (content_type) {
    case 'image/jpeg':
      return '.jpg';
    case 'image/png':
      return '.png';
    default:
      throw "Unsupported content type: " + page.content_type
  }
};

export default extension;
