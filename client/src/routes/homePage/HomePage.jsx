import { Link } from "react-router-dom"
import { TypeAnimation } from 'react-type-animation';
import "./homePage.css"
import { useState } from "react";

const HomePage = () => {
    const [typingStatus, setTypingStatus] = useState("human1")
    return (
        <div className="homePage">
            <div className="left">
                <img src="/orbital.png" alt="" className="orbital" />
                <h1>TOPV AI</h1>
                <h2>Supercharge your connectivity and productivity</h2>
                <h3>Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                    Please sint dolorem doloribus, architecto dolor</h3>
                <Link to="/dashboard">Get started</Link>

            </div>
            <div className="right">
                <div className="imgContainer">
                    <div className="bgContainer">
                        <div className="bg"></div>
                    </div>
                    <img src="/bot.png" alt="" className="bot" />
                    <div className="chat">
                        <img src={typingStatus === "human1" ? "/human1.jpeg" : typingStatus === "human2" ? "/human2.jpeg" : "/bot.png"} alt="" className="bot" />
                        <TypeAnimation
                            sequence={[
                                // Same substring at the start will only be typed out once, initially
                                'Human: We produce food for Mice',
                                2000, () => {
                                    setTypingStatus("bot")
                                },
                                'Bot: We produce food for Hamsters',
                                2000, () => {
                                    setTypingStatus("human2")
                                },
                                'Human2: We produce food for Guinea Pigs',
                                2000, () => {
                                    setTypingStatus("bot")
                                },
                                'Bot: We produce food for Chinchillas',
                                2000, () => {
                                    setTypingStatus("human1")
                                },
                            ]}
                            wrapper="span"
                            repeat={Infinity}
                            cursor={true}
                            omitDeletionAnimation={true}
                        />
                    </div>
                </div>
            </div>
            <div className="terms">
                <img src="/logo.png" alt="" />
                <div className="links">
                    <Link to="/">Terms of service</Link>
                    <span>|</span>
                    <Link to="/">Privacy Policy</Link>
                </div>
            </div>
        </div>
    )
}

export default HomePage