import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import image_gym2 from '../components/Assets/image_gym2.png';
import './Calculator.css';
import Image from 'next/image';

const Calculator = () => {
    const [height, setHeight] = useState<string>("");
    const [weight, setWeight] = useState<string>("");
    const [gender, setGender] = useState<string>("");
    const [bmi, setBmi] = useState<string>("");

    const calculateBMI = (e: React.FormEvent) => {
        e.preventDefault();

        if (!height || !weight || !gender) {
            toast.error("vui lòng nhập cân nặng, chiều cao và giới tính ");
            return;
        }

        const heightInMeters = parseFloat(height) / 100;
        const bmiValue = (parseFloat(weight) / (heightInMeters * heightInMeters)).toFixed(2);
        setBmi(bmiValue);

        const bmiNumber = parseFloat(bmiValue);

        if (bmiNumber < 18.5) {
          toast.warning("Bạn đang bị thiếu cân. Hãy tham khảo một số lời khuyên từ chúng tôi.");
      } else if (bmiNumber >= 18.5 && bmiNumber < 24.9) {
          toast.success("Bạn có cân nặng bình thường. Hãy tiếp tục duy trì lối sống lành mạnh.");
      } else if (bmiNumber >= 25 && bmiNumber < 29.9) {
          toast.warning("Bạn đang thừa cân.Hãy tham khảo một số lời khuyên từ chúng tôi.");
      } else {
          toast.error("Bạn đang trong phạm vi béo phì.Hãy tham khảo một số lời khuyên từ chúng tôi.");
      }
    };

    return (
        <section className="bmi" id="calculator">
            <h1>BMI CALCULATOR</h1>
            <div className="container">
                <div className="wrapper">
                    <form onSubmit={calculateBMI}>
                        <div>
                            <label>Ho</label>
                            <input type="text" />
                        </div>
                        <div>
                            <label>Ten</label>
                            <input type="text" />
                        </div>
                        <div>
                            <label>Chieu cao (cm)</label>
                            <input
                                type="number"
                                value={height}
                                onChange={(e) => setHeight(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label>Can nang (kg)</label>
                            <input
                                type="number"
                                value={weight}
                                onChange={(e) => setWeight(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label>Gioi Tinh</label>
                            <select
                                value={gender}
                                onChange={(e) => setGender(e.target.value)}
                            >
                                <option value="">Chon gioi tinh</option>
                                <option value="Male">Nam</option>
                                <option value="Female">Nu</option>
                            </select>
                        </div>
                        <button type="submit">Calculate BMI</button>
                    </form>
                </div>
                <div className="wrapper">
                    <Image src={image_gym2} alt="Gym" />
                </div>
            </div>
            {}
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </section>
    );
};

export default Calculator;