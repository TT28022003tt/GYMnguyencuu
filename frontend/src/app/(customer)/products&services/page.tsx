import MembershipTiers from "@/app/components/MembershipTiers";
import Products from "@/app/components/Products";
import RegisterClass from "@/app/components/RegisterClass";

const ProductsServicesPage = () => {
  return (
	<div className=''>
    <h1 className="text-2xl text-white font-bold m-4 text-center">Products and Services</h1>
    <h2 className="text-xl text-white text-center m-3">Gói dịch vụ</h2>
    <MembershipTiers/>
    <RegisterClass/>
    <div className="">
      <h1 className="text-xl text-white text-center m-5">SẢN PHẨM </h1>
      <Products/>
    </div>
  </div>
  );
};

export default ProductsServicesPage;