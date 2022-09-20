import React from "react";
import "./Dashboard.css";

const Dashboard = ({ contractBal, withdrawable, withdraw }) => {  
  return (
    <div className="dsb">
      <table>
        <tr>
          <td>Contract balance</td>
          <td>{contractBal} Celo</td>
        </tr>
        <tr>
          <td>Withdrawable</td>
          <td>{withdrawable} Celo</td>
        </tr>
        <tr>
          <td></td>
          <td>
            <button onClick={async () => withdraw()}>Withdraw</button>
          </td>
        </tr>
      </table>
    </div>
  );
};

export default Dashboard;
