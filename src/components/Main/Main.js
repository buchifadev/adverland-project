import React from "react";
import BigNumber from "bignumber.js";
import Fund from "../Fund";

const Main = ({ account, ads, viewAd, fundAd }) => {
  return (
    <div className="ads">
      {ads?.map((ad) => (
        <div className="rim" key={ad.index}>
          <div className="ad">
            <div className="at">{ad.title}</div>
            <img className="ad-img" src={ad.imageUrl} alt="" />
            <div className="ad-description">{ad.description}</div>
            <div className="ad-views">Views: {ad.views}</div>
            <div className="ad-bal">
              Bal: {new BigNumber(ad.balance).shiftedBy(-18).toString()} Celo
            </div>
            <div className="abt">
              {account != ad.owner && (
                <button onClick={async () => viewAd(ad.index)}>View</button>
              )}
              {account == ad.owner && <Fund fundAd={fundAd} adIndex={ad.index} />}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Main;
