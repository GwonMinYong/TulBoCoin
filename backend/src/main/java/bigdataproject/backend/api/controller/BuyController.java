package bigdataproject.backend.api.controller;

import bigdataproject.backend.api.request.BuyReq;
import bigdataproject.backend.api.response.BuyRecordRes;
import bigdataproject.backend.api.response.BuyRes;
import bigdataproject.backend.api.service.BuyService;
import bigdataproject.backend.api.service.UserService;
import bigdataproject.backend.common.auth.TulUserDetails;
import bigdataproject.backend.common.model.response.BaseResponseBody;
import bigdataproject.backend.db.entity.User;
import bigdataproject.backend.db.repository.UserRepository;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("buy")
@CrossOrigin
@RequiredArgsConstructor
@Slf4j
public class BuyController {

    private final BuyService buyService;

    private final UserService userService;

    @PostMapping()
    @ApiOperation(value = "매수", notes = "매수 기록 저장 및 지갑 정보 수정")
    @ApiResponses({
            @ApiResponse(code = 200, message = "구매한 코인, 가격, 개수가 반환됨"),
            @ApiResponse(code = 400, message = "없는 유저이거나 잔고가 총구매가격 보다 작음"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<?> postBuy(Authentication authentication, @RequestBody BuyReq buyReq){
        log.info("postBuy 호출");
        log.info(buyReq.getBuyCoinName() + "controller에서 buyReq의 코인이름");
        HttpStatus status;

        if (authentication == null){
            status = HttpStatus.UNAUTHORIZED;
            return new ResponseEntity<BaseResponseBody>(BaseResponseBody.of(401, "토큰 없거나 만료되었습니다"), status);
        }

        TulUserDetails userDetails = (TulUserDetails) authentication.getDetails();
        String userId = userDetails.getUsername();
        User user = userService.getUserByUserId(userId);

        if (user == null){
            status = HttpStatus.NOT_FOUND;
            return new ResponseEntity<BaseResponseBody>(BaseResponseBody.of(404, "없는 유저입니다"), status);
        }

        BuyRes buyRes = buyService.postBuyRecord(user, buyReq);

        if (buyRes == null){
            status = HttpStatus.BAD_REQUEST;
            return new ResponseEntity<BaseResponseBody>(BaseResponseBody.of(400, "한도를 초과한 구매입니다"), status);
        }
        status = HttpStatus.OK;
        return new ResponseEntity<BuyRes>(buyRes, status);
    }

    @GetMapping()
    @ApiOperation(value = "매수 기록", notes = "매수 기록 불러오기")
    public ResponseEntity<?> getBuyRecord(Authentication authentication){
        HttpStatus status;
        if (authentication == null){
            status = HttpStatus.UNAUTHORIZED;
            return new ResponseEntity<BaseResponseBody>(BaseResponseBody.of(401, "토큰 없거나 만료되었습니다"), status);
        }

        TulUserDetails userDetails = (TulUserDetails) authentication.getDetails();
        String userId = userDetails.getUsername();
        User user = userService.getUserByUserId(userId);

        if (user == null){
            status = HttpStatus.NOT_FOUND;
            return new ResponseEntity<BaseResponseBody>(BaseResponseBody.of(404, "없는 유저입니다"), status);
        }
        List<BuyRecordRes> buyRecordResList = buyService.getBuyRecord(user);

        status = HttpStatus.OK;

        return new ResponseEntity<List<BuyRecordRes>>(buyRecordResList, status);
    }
}
