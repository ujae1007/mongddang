import { useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";

const StartButton = () => {

  const nav = useNavigate()

  return (
    <button className="start-button" onClick={() => nav('/login')}>
      시작하기
    </button>
  )
}

import "./Intro.css"
export default StartButton