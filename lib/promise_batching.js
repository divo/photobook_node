Array.prototype.each_slice = function (size, callback){
  for (var i = 0, l = this.length; i < l; i += size){
    callback.call(this, this.slice(i, i + size));
  }
};

export const collect_promises = function(data, offset = 0, slice_size = 15, work_callback) {
  return fetch_slice(data.slice(offset, offset + slice_size), work_callback)
}

export const await_promises = function(promises, data, offset, slice_size, work_callback, succ_callback) {
  Promise.all(promises).then(() => {
    if (offset < data.length) {
      const promises = collect_promises(data, offset, slice_size, work_callback)
      await_promises(promises, data, (offset + slice_size), slice_size, work_callback, succ_callback)
    } else {
      succ_callback()
    }
  })
}

const fetch_slice = function(slice, work_callback) {
  const fetch_promises = [];
  slice.forEach(function(item) {
    fetch_promises.push(work_callback(item))
  })
  return fetch_promises;
}
