const ButtonLoader = () => {
  return (
    <div className="flex items-center justify-center gap-2">

      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />

      <span>Please wait...</span>
    </div>
  );
};

export default ButtonLoader;