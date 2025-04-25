
const TestColor = () => {
  return (
	<div className="p-4 space-y-2">
      {/* Màu chính */}
      <div className="bg-primary text-primary-content p-2 w-full rounded">primary</div>
      <button className="btn btn-primary focus:bg-primary-focus text-primary-content p-2 w-full rounded">primary-focus</button>
	  
      {/* Màu phụ */}
      <div className="bg-secondary text-secondary-content p-2 w-full rounded">secondary</div>
      <button className="btn btn-secondary focus:bg-secondary-focus text-secondary-content p-2 w-full rounded">secondary-focus</button>

      {/* Màu nhấn */}
      <div className="bg-accent text-accent-content p-2 w-full rounded">accent</div>
      <button className="btn btn-accent focus:bg-accent-focus text-accent-content p-2 w-full rounded">accent-focus</button>
      
      {/* Màu trung tính */}
      <div className="bg-neutral text-neutral-content p-2 w-full rounded">neutral</div>
      <button className="btn btn-neutral focus:bg-neutral-focus text-neutral-content p-2 w-full rounded">neutral-focus</button>
      
      {/* Màu nền */}
      <div className="bg-base-100 text-base-content p-2 w-full rounded">base-100</div>
      <div className="bg-base-200 text-base-content p-2 w-full rounded">base-200</div>
      <div className="bg-base-300 text-base-content p-2 w-full rounded">base-300</div>
      
      {/* Màu trạng thái */}
      <div className="bg-info text-info-content p-2 w-full rounded">info</div>
      <div className="bg-success text-success-content p-2 w-full rounded">success</div>
      <div className="bg-warning text-warning-content p-2 w-full rounded">warning</div>
      <div className="bg-error text-error-content p-2 w-full rounded">error</div>
    </div>
  );
};

export default TestColor;