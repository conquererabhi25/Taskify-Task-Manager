import React from "react";


const TodoSkeleton = () => {
  return (
    <div className="flex flex-col w-full p-4 bg-red-400 rounded-lg animate-pulse">
      <div className="h-4 bg-white rounded w-3/4 mb-3"></div>
      <div className="h-4 bg-white rounded w-1/2"></div>
    </div>
  );
};


export default TodoSkeleton