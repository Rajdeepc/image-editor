import React from "react"
import Lottie from "lottie-react";
import * as animationData from "./animation.json"

const LottieControl = ({width = 600,height = 600}) => {
  return <Lottie animationData={animationData} height={height} width={width} />
}

export default LottieControl
