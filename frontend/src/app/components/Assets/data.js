import p1_img from '../Assets/img1.jpg';
import p2_img from '../Assets/img1.jpg'; // Giả sử bạn có thêm hình ảnh khác
import p3_img from '../Assets/img1.jpg';
import p4_img from '../Assets/img1.jpg';

let data_product = [
  {
    id: 1,
    name: "282 To Hieu, Hoa Minh, Lien Chieu, Da Nang",
    category: "home",
    image: p1_img.src, // Chuyển đổi thành đường dẫn (URL)
    newPrice: 50.0,
    oldPrice: 80.5,
  },
  {
    id: 2,
    name: "123 Nguyen Van Linh, Thanh Khe, Da Nang",
    category: "apartment",
    image: p2_img.src, // Chuyển đổi thành đường dẫn (URL)
    newPrice: 70.0,
    oldPrice: 100.0,
  },
  {
    id: 3,
    name: "456 Le Duan, Hai Chau, Da Nang",
    category: "villa",
    image: p3_img.src, // Chuyển đổi thành đường dẫn (URL)
    newPrice: 120.0,
    oldPrice: 150.0,
  },
  {
    id: 4,
    name: "789 Tran Phu, Son Tra, Da Nang",
    category: "home",
    image: p4_img.src, // Chuyển đổi thành đường dẫn (URL)
    newPrice: 90.0,
    oldPrice: 110.0,
  },
  {
    id: 5,
    name: "282 To Hieu, Hoa Minh, Lien Chieu, Da Nang",
    category: "home",
    image: p1_img.src, // Chuyển đổi thành đường dẫn (URL)
    newPrice: 50.0,
    oldPrice: 80.5,
  },
  {
    id: 6,
    name: "123 Nguyen Van Linh, Thanh Khe, Da Nang",
    category: "apartment",
    image: p2_img.src, 
    newPrice: 70.0,
    oldPrice: 100.0,
  },
  {
    id: 7,
    name: "456 Le Duan, Hai Chau, Da Nang",
    category: "villa",
    image: p3_img.src,
    newPrice: 120.0,
    oldPrice: 150.0,
  },
  {
    id: 8,
    name: "789 Tran Phu, Son Tra, Da Nang",
    category: "home",
    image: p4_img.src, 
    newPrice: 90.0,
    oldPrice: 110.0,
  },
];

export default data_product;