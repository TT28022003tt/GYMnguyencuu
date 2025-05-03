import React from 'react';

interface BMIResultProps {
    bmi: number;
    category: string;
    name: string;
    age: string;
    height: string;
    weight: string;
    gender: string;
    onBack: () => void;
}

const BMIResult: React.FC<BMIResultProps> = ({
    bmi,
    category,
    name,
    age,
    height,
    weight,
    gender,
    onBack,
}) => {
    const getAdvice = (category: string) => {
        switch (category) {
            case "Thiếu cân":
                return "Bạn đang thiếu cân. Hãy chú ý bổ sung dinh dưỡng hợp lý.";
            case "Bình thường":
                return "Bạn có cân nặng bình thường. Tiếp tục duy trì lối sống lành mạnh!";
            case "Thừa cân":
                return "Bạn đang thừa cân. Cần có kế hoạch tập luyện và ăn uống hợp lý.";
            case "Béo phì":
                return "Bạn đang béo phì. Hãy tìm kiếm sự hỗ trợ từ chuyên gia dinh dưỡng.";
            default:
                return "";
        }
    };

    return (
        <div className="bg-white p-8 rounded-lg shadow-xl max-w-md mx-auto mt-10 border border-gray-300">
            <h2 className="text-3xl font-bold mb-4 text-center text-orange-600">KẾT QUẢ BMI CỦA BẠN</h2>
            <table className="w-full text-left border-collapse">
                <tbody>
                    {[
                        { label: "Họ:", value: name },
                        { label: "Tuổi:", value: age },
                        { label: "Chiều cao:", value: `${height} cm` },
                        { label: "Cân nặng:", value: `${weight} kg` },
                        { label: "Giới tính:", value: gender },
                        { label: "Chỉ số BMI:", value: bmi.toFixed(2) },
                        { label: "Phân loại:", value: category },
                    ].map((item, index) => (
                        <tr key={index} className="bg-gray-50 hover:bg-gray-100 transition duration-200">
                            <td className="py-3 font-bold border-b text-black">{item.label}</td>
                            <td className="py-3 border-b text-black">{item.value}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="mt-4 text-center">
                <p className="text-black mb-4">{getAdvice(category)}</p>
                <button
                    className="bg-orange-600 text-white py-2 px-4 rounded hover:bg-orange-700 transition duration-200 transform hover:scale-105"
                    onClick={onBack}
                >
                    Quay lại
                </button>
            </div>
        </div>
    );
};

export default BMIResult;
