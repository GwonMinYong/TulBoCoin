import { memo } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { coinLikeAsync, coinLikeDeleteAsync } from "../store/accountSaga";
import EmptyHeart from "../media/images/icons/Heart.png";
import FullHeart from "../media/images/icons/darkHeart.png";
import ReactTooltip from "react-tooltip";

const WholeCoinChartBlock = styled.div`
  width: 25vw;
  height: 40vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-left: 1vw;
  padding-top: 1vw;
  /* border: solid skyblue 3px; */
  flex-direction: column;
`;
const LogoAndName = styled.div`
  width: 25vw;
  height: 10vh;
  margin-left: 2vw;
  /* border: solid yellow 3px; */
  flex-direction: row;
  display: flex;
  align-items: center;
  /* justify-content: center; */
`;
const CoinLogo = styled.div`
  width: 10vmin;
  height: 8vmin;
  /* max-width: 10vmin;
  max-height: 10vmin; */
  /* border: 3px solid grey; */
`;
const CoinName = styled.div`
  /* width: 50%; */
  width: 30vmin;
  height: 10vmin;
  /* border: 3px solid grey; */
  display: flex;
  /* justify-content: center; */
  align-items: center;
`;

const CoinDetails = styled.div`
  margin-left: 3vw;
  width: 25vw;
  height: 45vh;
  /* border: 3px solid navy; */
  font-size: 2.5vmin;
  font-weight: 130;
  div {
    padding-top: 0.4vw;
  }
`;

// const LikeButton = styled.div`
// width:5vw;
// height:10vmin;
// cursor: pointer;
// /* background:url(${EmptyHeart}) center no-repeat; */
// background-size: 5vw 10vmin;

// `

const EmptyButton = styled.div`
  width: 2.5vw;
  height: 5vmin;
  cursor: pointer;
  background: url(${EmptyHeart}) center no-repeat;
  background-size: 2.5vw 5vmin;
  :hover {
    transform: scale(1.1);
  }
`;

const FullButton = styled.div`
  width: 2.5vw;
  height: 5vmin;
  cursor: pointer;
  background: url(${FullHeart}) center no-repeat;
  background-size: 2.5vw 5vmin;
  :hover {
    transform: scale(1.1);
  }
`;
const HighPriceMsg = styled.div`
  :hover {
    /* background-color: red; */
    .hiddenMsg {
      display: block;
    }
  }
  .hiddenMsg {
    display: none;
    position: absolute;
  }
`;

function CoinSummary({ socketData, detailCoinData }) {
  const dispatch = useDispatch();
  let targetSocketData = [];
  for (let i = 0; i < socketData.length; i += 1) {
    if (socketData[i].code === detailCoinData.code) {
      targetSocketData = socketData[i];
      break;
    }
  }
  const likedCoin = JSON.parse(useSelector((state) => state.account.likedCoin));
  const isLikedCoin = likedCoin.some((coin) => coin.coinName === detailCoinData.name);

  const handleLikeDelete = () => {
    const body = { coinName: detailCoinData.name, coinCode: detailCoinData.code };
    dispatch(coinLikeDeleteAsync(body));
  };
  const handleLike = () => {
    const body = { coinName: detailCoinData.name, coinCode: detailCoinData.code };
    dispatch(coinLikeAsync(body));
  };
  return (
    <WholeCoinChartBlock>
      <LogoAndName>
        <CoinLogo>
          <img
            src={`https://static.upbit.com/logos/${detailCoinData.code.split("-")[1]}.png`}
            alt=""
            width={`50vw`}
            height={`50vh`}
          />
        </CoinLogo>
        <CoinName>{detailCoinData.name}</CoinName>
        {/* <LikeButton> */}
        {isLikedCoin ? (
          <FullButton onClick={handleLikeDelete}></FullButton>
        ) : (
          <EmptyButton onClick={handleLike}></EmptyButton>
        )}
      </LogoAndName>

      <CoinDetails>
        <div data-for="difYesterday" data-tip>
          ???????????? : {targetSocketData.signed_change_rate > 0 ? "+" : null}
          <ReactTooltip
            id="difYesterday"
            getContent={(dataTip) => "????????? ????????? ???????????? ???????????? ??????"}
          />
          {(targetSocketData.signed_change_rate * 100).toFixed(2)}% <br />
          {targetSocketData.signed_change_price > 0 ? "+" : null}
          {targetSocketData.signed_change_price &&
            `${targetSocketData.signed_change_price.toLocaleString("ko-KR")} ???`}
        </div>
        {targetSocketData.trade_price && (
          <>
            <div data-for="tradePrice" data-tip>
              ????????? : {targetSocketData.trade_price.toLocaleString("ko-KR")} ???
              <ReactTooltip id="tradePrice" getContent={(dataTip) => "?????? ?????? ????????? ??????"} />
            </div>
            <div data-for="highPrice" data-tip>
              ?????? : {targetSocketData.high_price.toLocaleString("ko-KR")} ???
              <ReactTooltip
                id="highPrice"
                getContent={(dataTip) => "?????? ??? ?????? ?????? ????????? ????????? ??????"}
              />
            </div>
            <div data-for="lowPrice" data-tip>
              ?????? : {targetSocketData.low_price.toLocaleString("ko-KR")} ???
              <ReactTooltip
                id="lowPrice"
                getContent={(dataTip) => "?????? ??? ?????? ?????? ????????? ????????? ??????"}
              />
            </div>
            <div data-for="tradeAmount" data-tip>
              ???????????? :{" "}
              {Number((targetSocketData.acc_trade_price_24h * 1).toFixed(0)).toLocaleString(
                "ko-KR"
              )}{" "}
              ???
              <ReactTooltip
                id="tradeAmount"
                getContent={(dataTip) => "???????????? ????????? ????????? ???"}
              />
            </div>
            <div data-for="tradeCoinAmount" data-tip>
              ????????? :{" "}
              {Number((targetSocketData.acc_trade_volume_24h * 1).toFixed(0)).toLocaleString(
                "ko-KR"
              )}
              <ReactTooltip
                id="tradeCoinAmount"
                getContent={(dataTip) => "???????????? ????????? ????????? ??????"}
              />
            </div>
          </>
        )}
      </CoinDetails>
    </WholeCoinChartBlock>
  );
}

export default memo(CoinSummary);
