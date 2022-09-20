import React, { useState, useEffect } from "react";
import { Spinner } from "react-bootstrap";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Nav from "./components/Nav/Nav";
import Main from "./components/Main/Main";
import New from "./components/New/New";
import Dashboard from "./components/Dashboard/Dashboard";
import BigNumber from "bignumber.js";
import { newKitFromWeb3 } from "@celo/contractkit";
import adverlandAbi from "./contract/adverland.abi.json";
import Web3 from "web3";
import Footer from "./components/Footer/Footer";

const ERC20_DECIMALS = 18;
const AD_DEPOSIT = new BigNumber(2).shiftedBy(ERC20_DECIMALS).toString();
const advlContractAddr = "0x353D57926b73161475C412cd7DFac216eDf141a1";

const App = () => {
  const [balance, setBalance] = useState();
  const [contractObject, setContractObject] = useState();
  const [administrator, setAdministrator] = useState();
  const [account, setAccount] = useState();
  const [kit, setKit] = useState();
  const [ads, setAds] = useState();
  const [contractBal, setContractBal] = useState();
  const [withdrable, setWithdrable] = useState();

  useEffect(() => {
    connectWallet();
  }, []);

  useEffect(() => {
    if (kit && account) {
      getAccountBalance();
    }
  }, [kit, account]);

  useEffect(() => {
    if (contractObject) {
      getActiveAdverts();
    }
  }, [contractObject]);

  const getAccountBalance = async () => {
    try {
      const balance = await kit.getTotalBalance(account);
      const _balance = balance.CELO.shiftedBy(-ERC20_DECIMALS).toFixed(2);
      const c = new kit.web3.eth.Contract(adverlandAbi, advlContractAddr);
      const adm = await c.methods.viewOwner().call();
      setAdministrator(adm);
      setBalance(_balance);
      setContractObject(c);

      if (account == adm) {
        try {
          const views = await c.methods
            .viewAccumulatedViews()
            .call();
          const wthd = new BigNumber(views).dividedBy(2).toString();
          const cBal = await c.methods
            .viewContractBalance()
            .call();
          setWithdrable(wthd);
          setContractBal(
            new BigNumber(cBal).shiftedBy(-ERC20_DECIMALS).toString()
          );
        } catch (e) {
          console.log(e);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  // connect wallet to app
  const connectWallet = async () => {
    if (window.celo) {
      try {
        await window.celo.enable();
        const web3 = new Web3(window.celo);
        let kit = newKitFromWeb3(web3);

        const accounts = await kit.web3.eth.getAccounts();
        const defaultAccount = accounts[0];
        kit.defaultAccount = defaultAccount;

        setKit(kit);
        setAccount(defaultAccount);
      } catch (error) {
        console.log(error);
      }
    } else {
      alert(
        "You need to install the celo wallet extension in order to use this app"
      );
    }
  };

  async function newAd(name, desc, image) {
    try {
      await contractObject.methods
        .createAdvert(name, desc, image)
        .send({ from: account, value: AD_DEPOSIT });
      alert("New Advert created");
      getActiveAdverts();
    } catch (e) {
      console.log(e);
    }
  }

  async function fundAd(adIndex, val) {
    const value = new BigNumber(val).shiftedBy(ERC20_DECIMALS).toString();
    try {
      await contractObject.methods
        .fundAdvert(adIndex)
        .send({ from: account, value: value });
      getActiveAdverts();
      alert("Your advert has been funded!");
    } catch (e) {
      console.log(e);
    }
  }

  async function getActiveAdverts() {
    try {
      const activeAds = await contractObject.methods.allActiveAdverts().call();
      const ads = [];
      for (let index = 0; index < activeAds.length; index++) {
        let ad = new Promise(async (resolve, reject) => {
          let res = await contractObject.methods.advertDetails(index).call();
          resolve({
            index: index,
            owner: res[0],
            title: res[1],
            description: res[2],
            imageUrl: res[3],
            balance: res[4],
            views: res[5],
          });
        });
        ads.push(ad);
      }
      const _ads = await Promise.all(ads);
      console.log(_ads);
      setAds(_ads);
    } catch (e) {
      console.log(e);
    }
  }

  async function viewAd(adIndex) {
    try {
      await contractObject.methods.viewAdvert(adIndex).send({ from: account });
      alert("Advert view complete!");
      getActiveAdverts();
    } catch (e) {
      console.log(e);
    }
  }

  async function withdraw() {
    try {
      await contractObject.methods.claimFees().send({ from: account });
      alert("Fees claimed successfully");
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <>
      {account && administrator ? (
        <>
          <Router>
            <Nav balance={balance} showDashboard={account == administrator} />
            <Routes>
              <Route
                path="/"
                element={
                  <Main
                    account={account}
                    ads={ads}
                    viewAd={viewAd}
                    fundAd={fundAd}
                  />
                }
              />
              <Route path="/new-advert" element={<New newAd={newAd} />} />
              <Route
                path="/dashboard"
                element={
                  <Dashboard
                    contractBal={contractBal}
                    withdrawable={withdrable}
                    withdraw={withdraw}
                  />
                }
              />
            </Routes>
            <Footer />
          </Router>
        </>
      ) : (
        <div className="spinx">
          <Spinner
            animation="border"
            variant="success"
            style={{ width: "100px", height: "100px" }}
          />
        </div>
      )}
    </>
  );
};

export default App;
