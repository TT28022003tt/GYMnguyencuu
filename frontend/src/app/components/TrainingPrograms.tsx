"use client"

import { useState } from "react";
import { trainingPlans } from "../lib/data";

const TrainingPrograms = () => {
	const [trainingPlan, setTrainingPlan] = useState(trainingPlans)
	return (
		<div className="p-6 flex flex-col justify-center items-center">
		  <h1 className="text-2xl font-bold text-center mb-14">LIỆU TRÌNH TẬP (TRAINING PLANS)</h1>
		  {trainingPlan.map((plan) => (
			<div key={plan.id} className="mb-8 text-white">
			  <h2 className="text-xl font-bold mb-2">{plan.id}. {plan.name}</h2>
			  <p className="mb-1"><strong>Mục tiêu:</strong> {plan.goal}</p>
			  <p className="mb-2"><strong>Thời gian:</strong> {plan.duration} Tuần </p>
			  <ul className="list-disc pl-5">
				{plan.details.map((detail, index) => (
				  <li key={index} className="mb-1 text-white">
					<strong>{detail.week}:</strong> {detail.description}
				  </li>
				))}
			  </ul>
			</div>
		  ))}
		</div>
	  );
};

export default TrainingPrograms;