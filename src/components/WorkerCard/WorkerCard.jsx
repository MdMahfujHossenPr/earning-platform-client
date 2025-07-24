import React from "react";

const WorkerCard = (props) => {
  // Render worker info
  return (
    <div className="worker-card">
      <img
        src={props.photo_url}
        alt={props.name}
        style={{ width: 64, borderRadius: "50%" }}
      />
      <h4>{props.name}</h4>
      <p>Coins: {props.coin}</p>
    </div>
  );
};

export default WorkerCard;
