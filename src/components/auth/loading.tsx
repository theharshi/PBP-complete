import React from "react";
const loadingImg = "https://miro.medium.com/max/2000/1*F_5AEXIfr1AXuShXhYT4zg.gif";

export const Loading = () => (
    <div className="spinner">
        <img src={loadingImg} alt="Loading..." />
    </div>
);
