import React, { useState } from 'react';
import image_gym2 from '../components/Assets/image_gym2.png';
import './Calculator.css';
import Image from 'next/image';
import BMIResult from './BMIResult'; // Component chi tiết BMI

const Calculator = () => {
    const [height, setHeight] = useState<string>("");
    const [weight, setWeight] = useState<string>("");
    const [gender, setGender] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [age, setAge] = useState<string>("");
    const [bmi, setBmi] = useState<number | null>(null);
    const [category, setCategory] = useState<string>("");
    const [showResult, setShowResult] = useState<boolean>(false);

    const calculateBMI = (e: React.FormEvent) => {
        e.preventDefault();

        if (!height || !weight || !gender || !name || !age) {
            alert("Vui lòng nhập đầy đủ thông tin");
            return;
        }

        const heightInMeters = parseFloat(height) / 100;
        const bmiValue = parseFloat((parseFloat(weight) / (heightInMeters * heightInMeters)).toFixed(2));
        setBmi(bmiValue);

        if (bmiValue < 18.5) {
            setCategory("Thiếu cân");
        } else if (bmiValue >= 18.5 && bmiValue < 24.9) {
            setCategory("Bình thường");
        } else if (bmiValue >= 25 && bmiValue < 29.9) {
            setCategory("Thừa cân");
        } else {
            setCategory("Béo phì");
        }

        setShowResult(true); // Show the BMI result component
    };

    const handleBack = () => {
        // Reset state to go back to the input form
        setShowResult(false);
        setHeight("");
        setWeight("");
        setGender("");
        setName("");
        setAge("");
        setBmi(null);
        setCategory("");
    };

    return (
        <section className="bmi" id="calculator">
            <h1>BMI CALCULATOR</h1>

            {!showResult ? (
                <div className="container">
                    <div className="wrapper">
                        <form onSubmit={calculateBMI}>
                            <div>
                                <label>Họ</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label>Tên</label>
                                <input
                                    type="text"
                                    value={age}
                                    onChange={(e) => setAge(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label>Chiều cao (cm)</label>
                                <input
                                    type="number"
                                    value={height}
                                    onChange={(e) => setHeight(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label>Cân nặng (kg)</label>
                                <input
                                    type="number"
                                    value={weight}
                                    onChange={(e) => setWeight(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label>Giới tính</label>
                                <select
                                    value={gender}
                                    onChange={(e) => setGender(e.target.value)}
                                    required
                                >
                                    <option value="">Chọn giới tính</option>
                                    <option value="Male">Nam</option>
                                    <option value="Female">Nữ</option>
                                </select>
                            </div>
                            <button type="submit">Calculate BMI</button>
                        </form>
                    </div>
                    <div className="wrapper">
                        <Image src={image_gym2} alt="Gym" />
                    </div>
                </div>
            ) : (
                <BMIResult
                    bmi={bmi!}
                    category={category}
                    name={name}
                    age={age}
                    height={height}
                    weight={weight}
                    gender={gender}
                    onBack={handleBack}
                />
            )}
        </section>
    );
};

export default Calculator;