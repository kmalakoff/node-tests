module.exports = function wrapCallbackComposer(fn, wrapper) {
  return function wrapCallback() {
    var args = Array.prototype.slice.call(arguments, 0);
    var callback = args.pop();
    args.push(function wrapperCallback() {
      var args = Array.prototype.slice.call(arguments, 0);
      args.push(callback);
      wrapper.apply(null, args);
    });
    fn.apply(null, args);
  };
};
