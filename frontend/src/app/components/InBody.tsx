"use client"

import BodyCompositionAnalysis from "./BCA";
import BodyTypeChart from "./Chart/BodyType";
import WeightControlAnalysis from "./WM";

const InBody = () => {
  return (
	<div className=''>
		<div className="bg-gradient-to-r from-brown-red to-bright-orange px-4 py-2 rounded-2xl">
              <h1 className="text-2xl font-medium text-white animate-bounce">InBody</h1>
        </div>
		<BodyCompositionAnalysis/>
		<WeightControlAnalysis/>
		<BodyTypeChart/>
	</div>
  );
};

export default InBody;