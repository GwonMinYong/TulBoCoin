import { memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sellAsync, buyAsync } from "../store/coinSaga";
import { fetchUserAsync, fetchWalletAsync } from "../store/accountSaga";
import styled from "styled-components";
import Swal from "sweetalert2";

const StyledModal = styled.div`
  width: 35vw;
  height: 62%;
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-60%, -50%);
  /* margin-right: 30vw; */
  /* background-color: gray; */
  /* border: 1px solid black; */
  border-radius: 8px;
  background-color: white;
  z-index: 100;
`;
const StyledModalDiv = styled.div`
  position: fixed;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 100;
`;
const StyledModalBlock = styled.div`
  padding: 5vmin;
  display: flex;
  flex-direction: column;
  justify-content: center;
  
`;
const InputBlock = styled.div`
  display: flex;
  align-items: center;
  input {
    height: 4vh;
    font-family: "Jua", sans-serif;
    font-size: 25px;
    margin-left: 2vw;
    border-radius: 5px;
    ::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    ::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }
`;
const BottomButton = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 5vh;
  justify-content: center;
  align-items: center;
  padding-top: 2vh;
  button {
    width: 5vw;
    height: 5vh;
    border-radius: 5px;
    font-family: "Jua", sans-serif;
    font-size: 25px;
    :hover {
      transform: scale(1.1);
    }
  }
  /* border: 2px solid black; */
`;
const CoinDeal = memo(function CoinDeal({ socketData, detailCoinData, modalClose, deal }) {
  useEffect(() => {
    document.body.style.cssText = `
      position: fixed; 
      top: -${window.scrollY}px;
      overflow-y: scroll;
      width: 100%;`;
    return () => {
      const scrollY = document.body.style.top;
      document.body.style.cssText = "";
      window.scrollTo(0, parseInt(scrollY || "0", 10) * -1);
    };
  }, []);
  const user = JSON.parse(useSelector((state) => state.account.user));
  const wallet = JSON.parse(useSelector((state) => state.account.wallet));

  let targetSocketData = [];
  for (let i = 0; i < socketData.length; i += 1) {
    if (socketData[i].code === detailCoinData.code) {
      targetSocketData = socketData[i];
      break;
    }
  }
  const [dealForm, setDealForm] = useState({
    CoinAmount: 0,
    CoinName: detailCoinData.name,
    CoinCode: detailCoinData.code,
    CoinPrice: targetSocketData.trade_price,
  });

  const handleChange = (e) => {
    setDealForm({
      ...dealForm,
      [e.target.name]: Number(e.target.value),
    });
  };

  useEffect(() => {
    setDealForm({
      ...dealForm,
      CoinName: detailCoinData.name,
      CoinCode: detailCoinData.code,
      CoinPrice: targetSocketData.trade_price,
    });
  }, [socketData, detailCoinData]);

  const dispatch = useDispatch();
  const handleDeal = function (e) {
    e.preventDefault();
    const { CoinAmount, CoinName, CoinCode, CoinPrice } = dealForm;
    if (CoinAmount * CoinPrice < 5000) {
      Swal.fire({
        icon: "warning",
        title: "5000??? ????????? ?????? ???????????????",
      });
      return;
    }
    let body = {};
    if (deal === "sell") {
      body = {
        sellCoinAmount: CoinAmount,
        sellCoinName: CoinName,
        sellCoinCode: CoinCode,
        sellCoinPrice: CoinPrice,
      };
      dispatch(sellAsync(body));
    } else {
      body = {
        buyCoinAmount: CoinAmount,
        buyCoinName: CoinName,
        buyCoinCode: CoinCode,
        buyCoinPrice: CoinPrice,
      };
      dispatch(buyAsync(body));
    }
    setTimeout(() => {
      dispatch(fetchWalletAsync());
      dispatch(fetchUserAsync());
    }, 300);
  };

  return (
    <>
      <StyledModalDiv onClick={modalClose}>
        <StyledModal onClick={(e) => e.stopPropagation()}>
          <StyledModalBlock>
            <form onSubmit={handleDeal}>
              {deal === "sell" ? (
                <>
                  <div>
                    <label>?????????????????? </label>
                    <label>
                      {wallet &&
                        wallet.map((coin) =>
                          coin.coinName === detailCoinData.name ? coin.coinAmount.toLocaleString("ko-KR") : null
                        )}
                    </label>
                  </div>
                  <br />
                  <div>
                    <label>????????????(KRW)</label> <br />
                    <label>{targetSocketData.trade_price.toLocaleString("ko-KR")}</label>
                  </div>
                  <br />
                  <InputBlock>
                    <label htmlFor="CoinAmount">????????????</label>
                    <input
                      id="CoinAmount"
                      type="number"
                      name="CoinAmount"
                      min={0}
                      step="0.0001"
                      onChange={handleChange}
                    />
                  </InputBlock>
                  <br />
                  <div>
                    <div htmlFor="sellCoinPrice">????????????</div>
                    <div id="CoinPrice" name="CoinPrice" onChange={handleChange}>
                      {(dealForm.CoinAmount * targetSocketData.trade_price).toLocaleString("ko-KR")}
                    </div>
                  </div>
                  <BottomButton>
                    <button onClick={modalClose}>??????</button>
                    <button>??????</button>
                  </BottomButton>
                </>
              ) : (
                <>
                  <div>
                    <label>???????????? : </label>
                    <label>{user.balance.toLocaleString("ko-KR")}KRW</label>
                  </div>
                  <br />
                  <div>
                    <label>????????????(KRW)</label> <br />
                    <label>{targetSocketData.trade_price.toLocaleString("ko-KR")}</label>
                  </div>
                  <br />
                  <InputBlock>
                    <label htmlFor="buyCoinAmount">????????????</label>
                    <input
                      id="CoinAmount"
                      type="number"
                      name="CoinAmount"
                      min={0}
                      step="0.0001"
                      onChange={handleChange}
                    />
                  </InputBlock>
                  <br />
                  <div>
                    <div htmlFor="CoinPrice">????????????</div>
                    <div id="CoinPrice" name="CoinPrice" onChange={handleChange}>
                      {(dealForm.CoinAmount * targetSocketData.trade_price).toLocaleString("ko-KR")}
                    </div>
                    <BottomButton>
                      <button onClick={modalClose}>??????</button>
                      <button>??????</button>
                    </BottomButton>
                  </div>
                </>
              )}
            </form>
          </StyledModalBlock>
        </StyledModal>
      </StyledModalDiv>
    </>
  );
});

export default CoinDeal;
